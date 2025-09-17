import { Conversation } from '../models/Conversation.js';
import { assistantAI } from '../services/assistantAIService.js';
import { emitAssistantResponse } from '../services/socketService.js';
import { logger } from '../utils/logger.js';

// Enviar mensaje a un asistente
export const sendMessage = async (req, res) => {
  try {
    const { assistantId, message, context = [], sessionId } = req.body;

    if (!assistantId || !message) {
      return res.status(400).json({
        success: false,
        message: 'AssistantId y message son requeridos'
      });
    }

    // Validar que el asistente existe
    const validAssistants = ['stark', 'cap', 'spidey'];
    if (!validAssistants.includes(assistantId)) {
      return res.status(400).json({
        success: false,
        message: 'Asistente no válido'
      });
    }

    logger.info(`Nueva consulta para ${assistantId}:`, {
      messageLength: message.length,
      sessionId
    });

    // Buscar o crear conversación
    let conversation;
    if (sessionId) {
      conversation = await Conversation.findOne({ sessionId });
    }

    if (!conversation) {
      conversation = new Conversation({
        sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        assistantId,
        userId: req.user?.id || null,
        metadata: {
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          language: req.get('Accept-Language'),
        }
      });
      await conversation.save();
    }

    // Agregar mensaje del usuario
    await conversation.addMessage({
      text: message,
      sender: 'user',
      timestamp: new Date()
    });

    // Generar respuesta del asistente con contexto del viaje del barista
    const aiResponse = await assistantAI.generateJourneyAwareResponse(
      assistantId,
      message,
      context
    );

    // Agregar respuesta del asistente
    await conversation.addMessage({
      text: aiResponse.text,
      sender: 'assistant',
      timestamp: new Date(),
      metadata: aiResponse.metadata
    });

    // Si hay una derivación recomendada, incluir información adicional
    if (aiResponse.metadata?.needsDerivation) {
      logger.info(`🔄 Derivación recomendada de ${assistantId} a ${aiResponse.metadata.recommendedAssistant}`, {
        journeyStage: aiResponse.metadata.journeyStage,
        reason: aiResponse.metadata.derivationReason
      });
    }

    // Emitir respuesta via Socket.IO
    emitAssistantResponse(assistantId, conversation.sessionId, aiResponse);

    res.json({
      success: true,
      sessionId: conversation.sessionId,
      response: aiResponse,
      conversation: {
        id: conversation._id,
        messageCount: conversation.messages.length,
        status: conversation.status
      }
    });

  } catch (error) {
    logger.error('Error en sendMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener historial de conversación
export const getConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada'
      });
    }

    res.json({
      success: true,
      conversation: {
        sessionId: conversation.sessionId,
        assistantId: conversation.assistantId,
        messages: conversation.messages,
        status: conversation.status,
        startTime: conversation.startTime,
        endTime: conversation.endTime,
        duration: conversation.duration
      }
    });

  } catch (error) {
    logger.error('Error en getConversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Finalizar conversación
export const endConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { satisfaction } = req.body;

    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada'
      });
    }

    await conversation.endConversation(satisfaction);

    res.json({
      success: true,
      message: 'Conversación finalizada exitosamente',
      conversation: {
        sessionId: conversation.sessionId,
        duration: conversation.duration,
        messageCount: conversation.messages.length,
        satisfaction: conversation.satisfaction
      }
    });

  } catch (error) {
    logger.error('Error en endConversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Guardar feedback de la conversación
export const saveFeedback = async (req, res) => {
  try {
    const { sessionId, rating, feedback, resolved } = req.body;

    if (!sessionId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'SessionId y rating son requeridos'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating debe estar entre 1 y 5'
      });
    }

    const conversation = await Conversation.findOne({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada'
      });
    }

    // Actualizar satisfacción y estado de resolución
    conversation.satisfaction = {
      rating,
      feedback: feedback || '',
      timestamp: new Date()
    };

    if (typeof resolved === 'boolean') {
      conversation.resolved = resolved;
    }

    await conversation.save();

    logger.info(`Feedback guardado para sesión ${sessionId}:`, {
      rating,
      resolved,
      assistantId: conversation.assistantId
    });

    res.json({
      success: true,
      message: 'Feedback guardado exitosamente',
      satisfaction: conversation.satisfaction
    });

  } catch (error) {
    logger.error('Error en saveFeedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
