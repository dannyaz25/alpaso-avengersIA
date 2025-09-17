import { logger } from '../utils/logger.js';

let io;

export const setupSocketIO = (socketIO) => {
  io = socketIO;

  io.on('connection', (socket) => {
    logger.info(`🔌 Cliente conectado: ${socket.id}`);

    // Unirse a sala de asistente específico
    socket.on('join_assistant_room', (assistantId) => {
      const room = `assistant_${assistantId}`;
      socket.join(room);
      logger.info(`Cliente ${socket.id} se unió a la sala ${room}`);

      socket.emit('joined_room', {
        room,
        assistantId,
        message: `Conectado con ${getAssistantName(assistantId)}`
      });
    });

    // Manejar mensajes de chat en tiempo real
    socket.on('send_message', (data) => {
      const { assistantId, message, sessionId } = data;
      const room = `assistant_${assistantId}`;

      // Emitir mensaje a todos en la sala
      io.to(room).emit('new_message', {
        sessionId,
        message,
        sender: 'user',
        timestamp: new Date(),
        assistantId
      });

      logger.info(`Mensaje enviado en sala ${room}:`, { sessionId, messageLength: message.length });
    });

    // Indicador de escritura
    socket.on('typing', (data) => {
      const { assistantId, isTyping } = data;
      const room = `assistant_${assistantId}`;

      socket.to(room).emit('user_typing', {
        socketId: socket.id,
        isTyping,
        assistantId
      });
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      logger.info(`🔌 Cliente desconectado: ${socket.id}`);
    });

    // Manejar errores
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  return io;
};

// Función para emitir respuesta del asistente
export const emitAssistantResponse = (assistantId, sessionId, response) => {
  if (!io) return;

  const room = `assistant_${assistantId}`;

  io.to(room).emit('assistant_response', {
    sessionId,
    response,
    assistantId,
    timestamp: new Date()
  });

  logger.info(`Respuesta del asistente enviada a sala ${room}:`, { sessionId });
};

// Función para emitir notificaciones del sistema
export const emitSystemNotification = (assistantId, notification) => {
  if (!io) return;

  const room = `assistant_${assistantId}`;

  io.to(room).emit('system_notification', {
    ...notification,
    assistantId,
    timestamp: new Date()
  });
};

// Función para obtener estadísticas de conexiones activas
export const getConnectionStats = () => {
  if (!io) return { totalConnections: 0, roomStats: {} };

  const sockets = io.sockets.sockets;
  const totalConnections = sockets.size;

  const roomStats = {};
  ['stark', 'cap', 'spidey'].forEach(assistantId => {
    const room = `assistant_${assistantId}`;
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    roomStats[assistantId] = clientsInRoom ? clientsInRoom.size : 0;
  });

  return {
    totalConnections,
    roomStats,
    timestamp: new Date()
  };
};

function getAssistantName(assistantId) {
  const names = {
    stark: 'Tony Stark',
    cap: 'Steve Rogers (Cap)',
    spidey: 'Peter Parker (Spidey)'
  };
  return names[assistantId] || 'Asistente Desconocido';
}
