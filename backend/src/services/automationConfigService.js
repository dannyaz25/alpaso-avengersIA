// Backend - Sistema de Configuración de Automatización
// Gestiona emails, landing pages, formularios y captura de leads

import { Schema, model } from 'mongoose';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { logger } from '../utils/logger.js';

// Schema para configuración de automatización
const AutomationConfigSchema = new Schema({
  emails: {
    descubrimiento: {
      subject: { type: String, required: true },
      body: { type: String, required: true },
      enabled: { type: Boolean, default: true }
    },
    interes: {
      subject: { type: String, required: true },
      body: { type: String, required: true },
      enabled: { type: Boolean, default: true }
    },
    consideracion: {
      subject: { type: String, required: true },
      body: { type: String, required: true },
      enabled: { type: Boolean, default: true }
    }
  },
  landingPages: {
    descubrimiento: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      cta: { type: String, required: true },
      backgroundImage: String,
      videoUrl: String,
      enabled: { type: Boolean, default: true }
    }
  },
  forms: {
    contacto: {
      fields: [{ type: String }],
      submitText: { type: String, required: true },
      enabled: { type: Boolean, default: true }
    }
  },
  leads: {
    database: {
      table: { type: String, required: true },
      fields: [{ type: String }],
      enabled: { type: Boolean, default: true }
    },
    external: {
      webhook: String,
      apiKey: String,
      enabled: { type: Boolean, default: false }
    }
  },
  smtp: {
    host: String,
    port: Number,
    user: String,
    password: String,
    from: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Schema para leads capturados
const LeadSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: String,
  ciudad: String,
  experiencia_cafe: String,
  objetivo_streaming: String,
  etapa_viaje: {
    type: String,
    enum: ['descubrimiento', 'interes', 'consideracion', 'registro', 'participacion', 'retencion'],
    required: true
  },
  fuente: { type: String, default: 'alpaso-assistant' },
  metadatos: {
    userAgent: String,
    ip: String,
    referrer: String,
    utm_source: String,
    utm_medium: String,
    utm_campaign: String
  },
  procesado: { type: Boolean, default: false },
  emailEnviado: { type: Boolean, default: false },
  webhookEnviado: { type: Boolean, default: false },
  fechaCaptura: { type: Date, default: Date.now },
  fechaUltimoContacto: Date,
  puntaje: { type: Number, min: 1, max: 10, default: 5 }
});

// Schema para métricas de automatización
const AutomationMetricsSchema = new Schema({
  fecha: { type: Date, default: Date.now },
  emails: {
    enviados: { type: Number, default: 0 },
    abiertos: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    rebotes: { type: Number, default: 0 }
  },
  landingPages: {
    visitas: { type: Number, default: 0 },
    conversiones: { type: Number, default: 0 },
    tiempoPromedio: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 }
  },
  formularios: {
    iniciados: { type: Number, default: 0 },
    completados: { type: Number, default: 0 },
    abandonados: { type: Number, default: 0 }
  },
  leads: {
    capturados: { type: Number, default: 0 },
    calificados: { type: Number, default: 0 },
    convertidos: { type: Number, default: 0 }
  }
});

export const AutomationConfig = model('AutomationConfig', AutomationConfigSchema);
export const Lead = model('Lead', LeadSchema);
export const AutomationMetrics = model('AutomationMetrics', AutomationMetricsSchema);

class AutomationConfigService {
  constructor() {
    this.transporter = null;
    this.currentConfig = null;
    this.initializeConfig();
  }

  async initializeConfig() {
    try {
      // Cargar configuración existente o crear una por defecto
      let config = await AutomationConfig.findOne().sort({ createdAt: -1 });

      if (!config) {
        config = await this.createDefaultConfig();
      }

      this.currentConfig = config;
      await this.setupEmailTransporter();

      console.log('✅ [CONFIG] Sistema de automatización inicializado');
    } catch (error) {
      console.error('❌ [CONFIG] Error inicializando configuración:', error);
    }
  }

  async createDefaultConfig() {
    const defaultConfig = new AutomationConfig({
      emails: {
        descubrimiento: {
          subject: '¡Bienvenido! Descubre cómo monetizar tu pasión por el café',
          body: `Hola {{nombre}},

¡Qué emocionante verte interesado en convertir tu talento como barista en una fuente de ingresos!

🎯 Te hemos preparado una guía especial:
• Cómo configurar tu primera transmisión en 5 minutos
• 3 estrategias para atraer tu primera audiencia
• Casos de éxito de baristas que ya ganan $500+ al mes

¿Listo para comenzar?

[COMENZAR AHORA - {{landing_url}}]

¡Saludos!
Equipo Alpaso`,
          enabled: true
        },
        interes: {
          subject: '🎬 Las historias de Captain Espresso que te van a inspirar',
          body: `Hola {{nombre}},

Te prometí historias increíbles de baristas exitosos...

📚 Aquí tienes 3 mini-historias que cambiarán tu perspectiva:

1. **Captain Espresso**: De mesero a influencer del café (ganó $1,200 en su primer mes)
2. **Cappu Ninja**: Cómo conquistó 10k seguidores en 3 semanas
3. **La Barista Dorada**: Su secreto para fidelizar clientes

[VER HISTORIAS COMPLETAS - {{stories_url}}]

¿Cuál te inspira más?`,
          enabled: true
        },
        consideracion: {
          subject: '💰 Calculadora: Tu potencial de ingresos como barista streaming',
          body: `{{nombre}}, basado en tu perfil, podrías ganar:

💵 **Estimación mensual: $400-800**

📊 Desglose:
• Transmisiones: $200-400/mes
• Regalos virtuales: $100-200/mes
• Pedidos directos: $100-200/mes

✅ Testimonios verificados:
• María (Bogotá): $650/mes
• Carlos (CDMX): $480/mes
• Ana (Madrid): $820/mes

[CALCULAR MIS INGRESOS - {{calculator_url}}]

¿Listo para empezar?`,
          enabled: true
        }
      },
      landingPages: {
        descubrimiento: {
          title: 'Convierte tu pasión por el café en ingresos reales',
          subtitle: 'Únete a cientos de baristas que ya transmiten y monetizan su talento',
          cta: 'Comenzar gratis ahora',
          enabled: true
        }
      },
      forms: {
        contacto: {
          fields: ['nombre', 'email', 'telefono', 'ciudad', 'experiencia_cafe', 'objetivo_streaming'],
          submitText: 'Quiero empezar ahora',
          enabled: true
        }
      },
      leads: {
        database: {
          table: 'barista_leads',
          fields: ['nombre', 'email', 'telefono', 'ciudad', 'experiencia', 'objetivo', 'etapa_viaje', 'fecha_captura'],
          enabled: true
        },
        external: {
          webhook: '',
          apiKey: '',
          enabled: false
        }
      }
    });

    return await defaultConfig.save();
  }

  async setupEmailTransporter() {
    if (!this.currentConfig?.smtp) return;

    try {
      this.transporter = nodemailer.createTransporter({
        host: this.currentConfig.smtp.host || process.env.SMTP_HOST,
        port: this.currentConfig.smtp.port || process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: this.currentConfig.smtp.user || process.env.SMTP_USER,
          pass: this.currentConfig.smtp.password || process.env.SMTP_PASSWORD
        }
      });

      console.log('📧 [EMAIL] Transporter configurado correctamente');
    } catch (error) {
      console.error('❌ [EMAIL] Error configurando transporter:', error);
    }
  }

  // =====================================================
  // GESTIÓN DE CONFIGURACIÓN
  // =====================================================

  async getConfig() {
    if (!this.currentConfig) {
      await this.initializeConfig();
    }
    return this.currentConfig;
  }

  async updateConfig(newConfig) {
    try {
      const config = await AutomationConfig.findOneAndUpdate(
        {},
        { ...newConfig, updatedAt: new Date() },
        { new: true, upsert: true }
      );

      this.currentConfig = config;
      await this.setupEmailTransporter();

      console.log('✅ [CONFIG] Configuración actualizada');
      return config;
    } catch (error) {
      console.error('❌ [CONFIG] Error actualizando configuración:', error);
      throw error;
    }
  }

  // =====================================================
  // CAPTURA DE LEADS
  // =====================================================

  async captureLead(leadData, etapaViaje = 'descubrimiento') {
    try {
      console.log(`📧 [LEAD] Capturando lead para etapa: ${etapaViaje}`);

      // Crear lead en base de datos
      const lead = new Lead({
        ...leadData,
        etapa_viaje: etapaViaje,
        fechaCaptura: new Date()
      });

      const savedLead = await lead.save();
      console.log(`💾 [LEAD] Lead guardado en BD: ${savedLead._id}`);

      // Enviar email automático
      if (this.currentConfig?.emails?.[etapaViaje]?.enabled) {
        await this.sendAutomatedEmail(savedLead, etapaViaje);
      }

      // Enviar a webhook externo si está configurado
      if (this.currentConfig?.leads?.external?.enabled) {
        await this.sendToExternalWebhook(savedLead);
      }

      // Actualizar métricas
      await this.updateMetrics('leads', 'capturados', 1);

      return {
        success: true,
        leadId: savedLead._id,
        emailEnviado: savedLead.emailEnviado,
        webhookEnviado: savedLead.webhookEnviado
      };

    } catch (error) {
      console.error('❌ [LEAD] Error capturando lead:', error);
      throw error;
    }
  }

  // =====================================================
  // ENVÍO DE EMAILS
  // =====================================================

  async sendAutomatedEmail(lead, etapaViaje) {
    if (!this.transporter) {
      console.log('⚠️ [EMAIL] Transporter no configurado, saltando envío');
      return false;
    }

    try {
      const emailConfig = this.currentConfig.emails[etapaViaje];
      if (!emailConfig || !emailConfig.enabled) {
        console.log(`⚠️ [EMAIL] Email para ${etapaViaje} no habilitado`);
        return false;
      }

      // Personalizar email
      const personalizedSubject = this.personalizeText(emailConfig.subject, lead);
      const personalizedBody = this.personalizeText(emailConfig.body, lead);

      const mailOptions = {
        from: this.currentConfig.smtp?.from || process.env.SMTP_FROM,
        to: lead.email,
        subject: personalizedSubject,
        html: this.convertToHTML(personalizedBody),
        text: personalizedBody
      };

      await this.transporter.sendMail(mailOptions);

      // Marcar lead como email enviado
      await Lead.findByIdAndUpdate(lead._id, {
        emailEnviado: true,
        fechaUltimoContacto: new Date()
      });

      console.log(`📧 [EMAIL] Email de ${etapaViaje} enviado a: ${lead.email}`);

      // Actualizar métricas
      await this.updateMetrics('emails', 'enviados', 1);

      return true;

    } catch (error) {
      console.error('❌ [EMAIL] Error enviando email:', error);
      return false;
    }
  }

  personalizeText(text, lead) {
    return text
      .replace(/{{nombre}}/g, lead.nombre || 'Barista')
      .replace(/{{email}}/g, lead.email)
      .replace(/{{ciudad}}/g, lead.ciudad || 'tu ciudad')
      .replace(/{{landing_url}}/g, `${process.env.FRONTEND_URL}/landing`)
      .replace(/{{stories_url}}/g, `${process.env.FRONTEND_URL}/stories`)
      .replace(/{{calculator_url}}/g, `${process.env.FRONTEND_URL}/calculator`);
  }

  convertToHTML(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/• (.*?)(<br>|$)/g, '<li>$1</li>')
      .replace(/(\[.*?\])/g, '<a href="#" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">$1</a>');
  }

  // =====================================================
  // WEBHOOKS EXTERNOS
  // =====================================================

  async sendToExternalWebhook(lead) {
    if (!this.currentConfig?.leads?.external?.webhook) {
      return false;
    }

    try {
      const webhookData = {
        nombre: lead.nombre,
        email: lead.email,
        telefono: lead.telefono,
        ciudad: lead.ciudad,
        experiencia_cafe: lead.experiencia_cafe,
        objetivo_streaming: lead.objetivo_streaming,
        etapa_viaje: lead.etapa_viaje,
        fecha_captura: lead.fechaCaptura,
        fuente: 'alpaso-assistant'
      };

      const headers = {
        'Content-Type': 'application/json'
      };

      if (this.currentConfig.leads.external.apiKey) {
        headers['Authorization'] = `Bearer ${this.currentConfig.leads.external.apiKey}`;
      }

      await axios.post(
        this.currentConfig.leads.external.webhook,
        webhookData,
        { headers }
      );

      // Marcar lead como webhook enviado
      await Lead.findByIdAndUpdate(lead._id, { webhookEnviado: true });

      console.log(`🔗 [WEBHOOK] Lead enviado a webhook externo: ${lead.email}`);
      return true;

    } catch (error) {
      console.error('❌ [WEBHOOK] Error enviando a webhook:', error);
      return false;
    }
  }

  // =====================================================
  // MÉTRICAS Y ANALÍTICAS
  // =====================================================

  async updateMetrics(category, metric, value) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await AutomationMetrics.findOneAndUpdate(
        { fecha: today },
        {
          $inc: { [`${category}.${metric}`]: value },
          fecha: today
        },
        { upsert: true }
      );

    } catch (error) {
      console.error('❌ [METRICS] Error actualizando métricas:', error);
    }
  }

  async getMetrics(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const metrics = await AutomationMetrics.find({
        fecha: { $gte: startDate }
      }).sort({ fecha: -1 });

      // Calcular totales
      const totals = metrics.reduce((acc, day) => {
        acc.emails.enviados += day.emails.enviados;
        acc.emails.abiertos += day.emails.abiertos;
        acc.emails.clicks += day.emails.clicks;
        acc.landingPages.visitas += day.landingPages.visitas;
        acc.landingPages.conversiones += day.landingPages.conversiones;
        acc.formularios.completados += day.formularios.completados;
        acc.leads.capturados += day.leads.capturados;
        return acc;
      }, {
        emails: { enviados: 0, abiertos: 0, clicks: 0 },
        landingPages: { visitas: 0, conversiones: 0 },
        formularios: { completados: 0 },
        leads: { capturados: 0 }
      });

      return {
        daily: metrics,
        totals,
        calculated: {
          emailOpenRate: totals.emails.enviados > 0 ?
            (totals.emails.abiertos / totals.emails.enviados * 100).toFixed(1) : 0,
          emailClickRate: totals.emails.enviados > 0 ?
            (totals.emails.clicks / totals.emails.enviados * 100).toFixed(1) : 0,
          landingConversionRate: totals.landingPages.visitas > 0 ?
            (totals.landingPages.conversiones / totals.landingPages.visitas * 100).toFixed(1) : 0
        }
      };

    } catch (error) {
      console.error('❌ [METRICS] Error obteniendo métricas:', error);
      return null;
    }
  }

  // =====================================================
  // TESTS Y VALIDACIONES
  // =====================================================

  async testEmail(etapaViaje, testEmailAddress) {
    const testLead = {
      _id: 'test-lead',
      nombre: 'Usuario de Prueba',
      email: testEmailAddress,
      ciudad: 'Ciudad de Prueba',
      etapa_viaje: etapaViaje
    };

    return await this.sendAutomatedEmail(testLead, etapaViaje);
  }

  async testWebhook() {
    const testLead = {
      nombre: 'Test Lead',
      email: 'test@example.com',
      telefono: '555-0123',
      ciudad: 'Test City',
      experiencia_cafe: '2 años',
      objetivo_streaming: 'Generar ingresos adicionales',
      etapa_viaje: 'descubrimiento',
      fechaCaptura: new Date()
    };

    return await this.sendToExternalWebhook(testLead);
  }
}

export const automationConfigService = new AutomationConfigService();
