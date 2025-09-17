// Controlador para el Dashboard de Configuración de Automatización
import { automationConfigService, Lead, AutomationMetrics } from '../services/automationConfigService.js';
import { logger } from '../utils/logger.js';

// Obtener configuración actual
export const getAutomationConfig = async (req, res) => {
  try {
    const config = await automationConfigService.getConfig();

    res.json({
      success: true,
      config: config
    });

  } catch (error) {
    logger.error('Error obteniendo configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo configuración'
    });
  }
};

// Actualizar configuración
export const updateAutomationConfig = async (req, res) => {
  try {
    const newConfig = req.body;

    const updatedConfig = await automationConfigService.updateConfig(newConfig);

    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      config: updatedConfig
    });

  } catch (error) {
    logger.error('Error actualizando configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando configuración'
    });
  }
};

// Capturar nuevo lead desde formulario
export const captureLead = async (req, res) => {
  try {
    const { nombre, email, telefono, ciudad, experiencia_cafe, objetivo_streaming, etapa_viaje } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y email son requeridos'
      });
    }

    const leadData = {
      nombre,
      email,
      telefono,
      ciudad,
      experiencia_cafe,
      objetivo_streaming,
      metadatos: {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        referrer: req.get('Referer'),
        utm_source: req.query.utm_source,
        utm_medium: req.query.utm_medium,
        utm_campaign: req.query.utm_campaign
      }
    };

    const result = await automationConfigService.captureLead(leadData, etapa_viaje);

    res.json({
      success: true,
      message: 'Lead capturado exitosamente',
      leadId: result.leadId,
      emailEnviado: result.emailEnviado,
      webhookEnviado: result.webhookEnviado
    });

  } catch (error) {
    logger.error('Error capturando lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error capturando lead'
    });
  }
};

// Obtener lista de leads
export const getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20, etapa, desde, hasta } = req.query;

    const query = {};
    if (etapa) query.etapa_viaje = etapa;
    if (desde || hasta) {
      query.fechaCaptura = {};
      if (desde) query.fechaCaptura.$gte = new Date(desde);
      if (hasta) query.fechaCaptura.$lte = new Date(hasta);
    }

    const leads = await Lead.find(query)
      .sort({ fechaCaptura: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    logger.error('Error obteniendo leads:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo leads'
    });
  }
};

// Obtener métricas de automatización
export const getAutomationMetrics = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const metrics = await automationConfigService.getMetrics(parseInt(days));

    res.json({
      success: true,
      metrics
    });

  } catch (error) {
    logger.error('Error obteniendo métricas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo métricas'
    });
  }
};

// Enviar email de prueba
export const testEmail = async (req, res) => {
  try {
    const { etapa, email } = req.body;

    if (!etapa || !email) {
      return res.status(400).json({
        success: false,
        message: 'Etapa y email son requeridos'
      });
    }

    const result = await automationConfigService.testEmail(etapa, email);

    res.json({
      success: result,
      message: result ? 'Email de prueba enviado exitosamente' : 'Error enviando email de prueba'
    });

  } catch (error) {
    logger.error('Error enviando email de prueba:', error);
    res.status(500).json({
      success: false,
      message: 'Error enviando email de prueba'
    });
  }
};

// Probar webhook externo
export const testWebhook = async (req, res) => {
  try {
    const result = await automationConfigService.testWebhook();

    res.json({
      success: result,
      message: result ? 'Webhook probado exitosamente' : 'Error probando webhook'
    });

  } catch (error) {
    logger.error('Error probando webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error probando webhook'
    });
  }
};

// Generar landing page personalizada
export const generateLandingPage = async (req, res) => {
  try {
    const { etapa = 'descubrimiento', userId } = req.params;
    const { location, utm_source, utm_medium, utm_campaign } = req.query;

    // Construir perfil del usuario si está disponible
    const userProfile = userId ? {
      id: userId,
      location: location || 'default',
      utm: {
        source: utm_source,
        medium: utm_medium,
        campaign: utm_campaign
      }
    } : null;

    // Generar landing page usando el generador dinámico
    const { landingPageGenerator } = await import('../services/landingPageGenerator.js');
    const landingPage = await landingPageGenerator.generateLandingPage(etapa, userProfile);

    // Obtener configuración del dashboard si existe
    const config = await automationConfigService.getConfig();
    const dashboardConfig = config?.landingPages?.[etapa];

    // Combinar configuración del dashboard con el template generado
    const finalLandingPage = {
      ...landingPage,
      // Override con configuración del dashboard si existe
      title: dashboardConfig?.title || landingPage.hero.title,
      subtitle: dashboardConfig?.subtitle || landingPage.hero.subtitle,
      cta: dashboardConfig?.cta || landingPage.form.cta,
      backgroundImage: dashboardConfig?.backgroundImage || landingPage.hero.backgroundImage,
      videoUrl: dashboardConfig?.videoUrl || landingPage.hero.videoUrl,
      // Mantener form configuration del dashboard
      form: config?.forms?.contacto || landingPage.form,
      // SEO automático
      seo: await landingPageGenerator.generateSEOOptimizedContent(etapa, location),
      // Analíticas
      analytics: {
        etapa,
        userId,
        timestamp: new Date(),
        utm: userProfile?.utm
      }
    };

    // Incrementar métrica de visita a landing page
    await automationConfigService.updateMetrics('landingPages', 'visitas', 1);

    console.log(`🎯 [LANDING] Landing page generada para etapa: ${etapa}`);

    res.json({
      success: true,
      landingPage: finalLandingPage
    });

  } catch (error) {
    logger.error('Error generando landing page:', error);
    res.status(500).json({
      success: false,
      message: 'Error generando landing page'
    });
  }
};

// Obtener estadísticas del dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      leadsHoy,
      leadsTotal,
      metricsHoy
    ] = await Promise.all([
      Lead.countDocuments({ fechaCaptura: { $gte: today } }),
      Lead.countDocuments(),
      AutomationMetrics.findOne({ fecha: today })
    ]);

    // Distribución por etapa
    const leadsPorEtapa = await Lead.aggregate([
      {
        $group: {
          _id: '$etapa_viaje',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      leads: {
        hoy: leadsHoy,
        total: leadsTotal,
        porEtapa: leadsPorEtapa.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      emails: {
        enviados: metricsHoy?.emails?.enviados || 0,
        abiertos: metricsHoy?.emails?.abiertos || 0,
        clicks: metricsHoy?.emails?.clicks || 0,
        tasaApertura: metricsHoy?.emails?.enviados > 0 ?
          ((metricsHoy.emails.abiertos / metricsHoy.emails.enviados) * 100).toFixed(1) : 0
      },
      landingPages: {
        visitas: metricsHoy?.landingPages?.visitas || 0,
        conversiones: metricsHoy?.landingPages?.conversiones || 0,
        tasaConversion: metricsHoy?.landingPages?.visitas > 0 ?
          ((metricsHoy.landingPages.conversiones / metricsHoy.landingPages.visitas) * 100).toFixed(1) : 0
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas'
    });
  }
};

// Calcular ROI personalizado para barista
export const calculateROI = async (req, res) => {
  try {
    const { experiencia, horas, ubicacion, especialidad } = req.body;

    if (!experiencia || !horas || !ubicacion || !especialidad) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos para el cálculo'
      });
    }

    // Usar el generador para calcular ROI
    const { landingPageGenerator } = await import('../services/landingPageGenerator.js');
    const roiResults = await landingPageGenerator.generateROICalculation({
      experiencia,
      horas,
      ubicacion,
      especialidad
    });

    // Actualizar métricas
    await automationConfigService.updateMetrics('landingPages', 'conversiones', 1);

    logger.info('ROI calculado:', {
      inputs: { experiencia, horas, ubicacion, especialidad },
      estimated: roiResults.estimated
    });

    res.json({
      success: true,
      results: roiResults
    });

  } catch (error) {
    logger.error('Error calculando ROI:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculando ROI'
    });
  }
};
