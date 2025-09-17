import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Iniciando configuración global de pruebas para AvengersIA...');

  // Verificar que los servidores estén ejecutándose
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5004';

  try {
    // Test frontend connection
    const response = await fetch(frontendUrl);
    if (!response.ok) {
      throw new Error(`Frontend no disponible en ${frontendUrl}`);
    }
    console.log('✅ Frontend detectado en', frontendUrl);

    // Test backend connection
    const backendResponse = await fetch(`${backendUrl}/health`);
    if (!backendResponse.ok) {
      throw new Error(`Backend no disponible en ${backendUrl}/health`);
    }
    console.log('✅ Backend detectado en', backendUrl);

    // Configurar browser para tests con permisos de audio/video
    const browser = await chromium.launch();
    const context = await browser.newContext({
      permissions: ['microphone', 'camera']
    });
    await browser.close();

    console.log('✅ Configuración global completada exitosamente');

  } catch (error) {
    console.error('❌ Error en configuración global:', error);
    throw error;
  }
}

export default globalSetup;
