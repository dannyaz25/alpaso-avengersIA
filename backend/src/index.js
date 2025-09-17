import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Cargar variables de entorno
dotenv.config();

// También intentar cargar desde el backend principal si existe
try {
  dotenv.config({ path: '../../alpaso-backend/.env' });
  console.log('📋 Variables de entorno del backend principal cargadas');
} catch (error) {
  console.log('⚠️ No se pudo cargar .env del backend principal, usando configuración local');
}

// Verificar que la API key de OpenAI esté disponible
if (process.env.OPENAI_API_KEY) {
  console.log('✅ OpenAI API Key detectada - Modo IA Real activado');
  process.env.MOCK_AI_RESPONSES = 'false';
} else {
  console.log('⚠️ OpenAI API Key no encontrada - Modo Mock activado');
  process.env.MOCK_AI_RESPONSES = 'true';
}

import chatRoutes from './routes/chatRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { setupSocketIO } from './services/socketService.js';

// Configuración de la aplicación
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175", // Agregado para el frontend actual
      process.env.FRONTEND_URL || "http://localhost:5175"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5004;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alpaso-avengersia';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175", // Agregado para el frontend actual
    process.env.FRONTEND_URL || "http://localhost:5174"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Alpaso AvengersIA Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    assistants: ['stark', 'cap', 'spidey']
  });
});

// Rutas API
app.use('/api/chat', chatRoutes);
app.use('/api/assistants', assistantRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integrations', integrationRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Configurar Socket.IO
setupSocketIO(io);

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
.then(() => {
  logger.info('🍃 Conectado a MongoDB exitosamente');
})
.catch((error) => {
  logger.error('❌ Error conectando a MongoDB:', error);
  process.exit(1);
});

// Iniciar servidor
server.listen(PORT, () => {
  logger.info(`🚀 Servidor iniciado en puerto ${PORT}`);
  logger.info(`🦸‍♂️ Asistentes Marvel listos: Stark, Cap, Spidey`);
  logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5175'}`);
});

// Manejo graceful de cierre
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

export default app;
