import express from 'express';
import { Conversation } from '../models/Conversation.js';
import { getConnectionStats } from '../services/socketService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// GET /api/analytics - Obtener analytics generales
router.get('/', async (req, res) => {
  try {
    const { timeRange = 7, assistantId } = req.query;
    const days = parseInt(timeRange);

    // Obtener analytics de conversaciones
    const conversationAnalytics = await Conversation.getAnalytics(assistantId, days);

    // Obtener estadísticas de conexiones activas
    const connectionStats = getConnectionStats();

    // Calcular métricas adicionales
    const totalConversations = await Conversation.countDocuments({
      createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    });

    const averageResponseTime = await Conversation.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
          ...(assistantId && { assistantId })
        }
      },
      {
        $unwind: '$messages'
      },
      {
        $match: {
          'messages.sender': 'assistant',
          'messages.metadata.responseTime': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$messages.metadata.responseTime' }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        timeRange: days,
        assistantId: assistantId || 'all',
        conversationStats: conversationAnalytics,
        totalConversations,
        averageResponseTime: averageResponseTime[0]?.avgResponseTime || 0,
        connectionStats,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    logger.error('Error en analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo analytics'
    });
  }
});

// GET /api/analytics/:assistantId - Analytics específicos por asistente
router.get('/:assistantId', async (req, res) => {
  try {
    const { assistantId } = req.params;
    const { timeRange = 7 } = req.query;
    const days = parseInt(timeRange);

    const validAssistants = ['stark', 'cap', 'spidey'];
    if (!validAssistants.includes(assistantId)) {
      return res.status(400).json({
        success: false,
        message: 'Asistente no válido'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Analytics detallados por asistente
    const detailedAnalytics = await Conversation.aggregate([
      {
        $match: {
          assistantId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $facet: {
          dailyStats: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                conversations: { $sum: 1 },
                avgRating: { $avg: '$satisfaction.rating' },
                resolved: { $sum: { $cond: ['$resolved', 1, 0] } }
              }
            },
            { $sort: { _id: 1 } }
          ],
          topIntents: [
            { $unwind: '$messages' },
            {
              $match: {
                'messages.metadata.intent': { $exists: true }
              }
            },
            {
              $group: {
                _id: '$messages.metadata.intent',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          satisfactionDistribution: [
            {
              $match: {
                'satisfaction.rating': { $exists: true }
              }
            },
            {
              $group: {
                _id: '$satisfaction.rating',
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    const assistantNames = {
      stark: 'Tony Stark',
      cap: 'Steve Rogers',
      spidey: 'Peter Parker'
    };

    res.json({
      success: true,
      analytics: {
        assistantId,
        assistantName: assistantNames[assistantId],
        timeRange: days,
        detailed: detailedAnalytics[0],
        generatedAt: new Date()
      }
    });

  } catch (error) {
    logger.error(`Error en analytics para ${assistantId}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo analytics del asistente'
    });
  }
});

// GET /api/analytics/live/dashboard - Dashboard en tiempo real
router.get('/live/dashboard', async (req, res) => {
  try {
    const connectionStats = getConnectionStats();

    // Conversaciones activas en las últimas 24 horas
    const activeConversations = await Conversation.countDocuments({
      status: 'active',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Promedio de satisfacción del día
    const todaySatisfaction = await Conversation.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          'satisfaction.rating': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$satisfaction.rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    // Distribución por asistente hoy
    const assistantDistribution = await Conversation.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }
      },
      {
        $group: {
          _id: '$assistantId',
          conversations: { $sum: 1 },
          avgRating: { $avg: '$satisfaction.rating' }
        }
      }
    ]);

    res.json({
      success: true,
      liveDashboard: {
        connectionStats,
        activeConversations,
        todaySatisfaction: todaySatisfaction[0] || { avgRating: 0, totalRatings: 0 },
        assistantDistribution,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    logger.error('Error en live dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo dashboard en tiempo real'
    });
  }
});

export default router;
