import express from 'express';
import axios from 'axios';
import { logger } from '../utils/logger.js';

const router = express.Router();

// POST /api/integrations/alpaso - Integración con el sistema Alpaso principal
router.post('/alpaso', async (req, res) => {
  try {
    const { action, data } = req.body;

    if (!action || !data) {
      return res.status(400).json({
        success: false,
        message: 'Action y data son requeridos'
      });
    }

    const alpasoBaseUrl = process.env.ALPASO_API_URL || 'http://localhost:5003/api';

    logger.info(`Integrando con Alpaso - Acción: ${action}`, { data });

    let result;

    switch (action) {
      case 'create_lead':
        result = await createLeadInAlpaso(alpasoBaseUrl, data);
        break;

      case 'schedule_demo':
        result = await scheduleDemoInAlpaso(alpasoBaseUrl, data);
        break;

      case 'get_user_info':
        result = await getUserInfoFromAlpaso(alpasoBaseUrl, data);
        break;

      case 'create_support_ticket':
        result = await createSupportTicket(alpasoBaseUrl, data);
        break;

      case 'get_stream_info':
        result = await getStreamInfo(alpasoBaseUrl, data);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Acción no soportada'
        });
    }

    res.json({
      success: true,
      action,
      result,
      timestamp: new Date()
    });

  } catch (error) {
    logger.error('Error en integración con Alpaso:', error);
    res.status(500).json({
      success: false,
      message: 'Error en integración con Alpaso',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/integrations/webhook - Webhook para recibir eventos de Alpaso
router.post('/webhook', (req, res) => {
  try {
    const { event, data } = req.body;

    logger.info(`Webhook recibido de Alpaso - Evento: ${event}`, { data });

    // Procesar diferentes tipos de eventos
    switch (event) {
      case 'user_registered':
        handleUserRegistered(data);
        break;

      case 'stream_started':
        handleStreamStarted(data);
        break;

      case 'purchase_completed':
        handlePurchaseCompleted(data);
        break;

      default:
        logger.warn(`Evento no reconocido: ${event}`);
    }

    res.json({
      success: true,
      message: 'Webhook procesado exitosamente',
      event,
      timestamp: new Date()
    });

  } catch (error) {
    logger.error('Error procesando webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando webhook'
    });
  }
});

// GET /api/integrations/status - Estado de las integraciones
router.get('/status', async (req, res) => {
  try {
    const alpasoBaseUrl = process.env.ALPASO_API_URL || 'http://localhost:5003/api';

    // Verificar conectividad con Alpaso
    let alpasoStatus = 'disconnected';
    try {
      const response = await axios.get(`${alpasoBaseUrl}/health`, { timeout: 5000 });
      alpasoStatus = response.status === 200 ? 'connected' : 'error';
    } catch (error) {
      alpasoStatus = 'error';
    }

    // Verificar otras integraciones
    const integrationStatus = {
      alpaso: {
        status: alpasoStatus,
        url: alpasoBaseUrl,
        lastChecked: new Date()
      },
      openai: {
        status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
        lastChecked: new Date()
      },
      database: {
        status: 'connected', // Mongoose se encarga de esto
        lastChecked: new Date()
      }
    };

    res.json({
      success: true,
      integrations: integrationStatus,
      overall: Object.values(integrationStatus).every(i =>
        ['connected', 'configured'].includes(i.status)
      ) ? 'healthy' : 'degraded'
    });

  } catch (error) {
    logger.error('Error verificando estado de integraciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando integraciones'
    });
  }
});

// Funciones auxiliares para integración con Alpaso
async function createLeadInAlpaso(baseUrl, leadData) {
  const response = await axios.post(`${baseUrl}/leads`, {
    name: leadData.name || 'Lead desde AvengersIA',
    email: leadData.email,
    phone: leadData.phone,
    source: 'avengersia_chat',
    assistantId: leadData.assistantId,
    interest: leadData.interest,
    notes: leadData.notes || `Lead generado por ${leadData.assistantId} assistant`
  });

  return response.data;
}

async function scheduleDemoInAlpaso(baseUrl, demoData) {
  const response = await axios.post(`${baseUrl}/demos`, {
    customerEmail: demoData.email,
    customerName: demoData.name,
    preferredDate: demoData.date,
    preferredTime: demoData.time,
    productInterest: demoData.product,
    source: 'avengersia_chat',
    assistantId: demoData.assistantId
  });

  return response.data;
}

async function getUserInfoFromAlpaso(baseUrl, userData) {
  const response = await axios.get(`${baseUrl}/users/${userData.userId}`, {
    headers: {
      'Authorization': `Bearer ${userData.token}`
    }
  });

  return response.data;
}

async function createSupportTicket(baseUrl, ticketData) {
  const response = await axios.post(`${baseUrl}/support/tickets`, {
    subject: ticketData.subject || 'Consulta desde AvengersIA',
    description: ticketData.description,
    priority: ticketData.priority || 'medium',
    category: ticketData.category || 'general',
    userEmail: ticketData.email,
    source: 'avengersia_chat',
    assistantId: ticketData.assistantId
  });

  return response.data;
}

async function getStreamInfo(baseUrl, streamData) {
  const response = await axios.get(`${baseUrl}/streams/${streamData.streamId}`);
  return response.data;
}

// Manejadores de eventos webhook
function handleUserRegistered(data) {
  logger.info('Nuevo usuario registrado en Alpaso:', data);
  // Aquí se podría enviar un mensaje de bienvenida personalizado
}

function handleStreamStarted(data) {
  logger.info('Stream iniciado en Alpaso:', data);
  // Aquí se podría notificar a los asistentes sobre nuevos streams
}

function handlePurchaseCompleted(data) {
  logger.info('Compra completada en Alpaso:', data);
  // Aquí se podría actualizar el contexto del usuario para los asistentes
}

export default router;
