// Rutas para el Dashboard de Configuración de Automatización
import express from 'express';
import {
  getAutomationConfig,
  updateAutomationConfig,
  captureLead,
  getLeads,
  getAutomationMetrics,
  testEmail,
  testWebhook,
  generateLandingPage,
  getDashboardStats,
  calculateROI
} from '../controllers/automationController.js';

const router = express.Router();

// =====================================================
// RUTAS DE CONFIGURACIÓN
// =====================================================

// Obtener configuración actual del sistema
router.get('/config', getAutomationConfig);

// Actualizar configuración
router.put('/config', updateAutomationConfig);

// Obtener estadísticas del dashboard
router.get('/stats', getDashboardStats);

// =====================================================
// RUTAS DE LEADS
// =====================================================

// Capturar nuevo lead desde formulario
router.post('/leads', captureLead);

// Obtener lista de leads con filtros
router.get('/leads', getLeads);

// =====================================================
// RUTAS DE LANDING PAGES
// =====================================================

// Generar landing page personalizada
router.get('/landing/:etapa/:userId?', generateLandingPage);

// =====================================================
// RUTAS DE TESTING
// =====================================================

// Enviar email de prueba
router.post('/test/email', testEmail);

// Probar webhook externo
router.post('/test/webhook', testWebhook);

// =====================================================
// RUTAS DE CÁLCULO
// =====================================================

// Calcular ROI personalizado para barista
router.post('/calculate-roi', calculateROI);

// =====================================================
// RUTAS DE MÉTRICAS
// =====================================================

// Obtener métricas de automatización
router.get('/metrics', getAutomationMetrics);

export default router;
