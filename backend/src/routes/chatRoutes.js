import express from 'express';
import { sendMessage, getConversation, endConversation, saveFeedback } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Enviar mensaje a un asistente
router.post('/', sendMessage);

// GET /api/chat/:sessionId - Obtener historial de conversación
router.get('/:sessionId', getConversation);

// PUT /api/chat/:sessionId/end - Finalizar conversación
router.put('/:sessionId/end', endConversation);

// POST /api/chat/feedback - Guardar feedback
router.post('/feedback', saveFeedback);

export default router;
