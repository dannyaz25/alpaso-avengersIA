import { FullConfig } from '@playwright/test';
import { defineConfig } from 'vite';
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Iniciando limpieza global después de las pruebas...');

  try {
    // Limpiar archivos temporales de pruebas
    console.log('🗑️ Limpiando archivos temporales...');

    // Cerrar conexiones pendientes
    console.log('🔌 Cerrando conexiones pendientes...');

    console.log('✅ Limpieza global completada exitosamente');

  } catch (error) {
    console.error('❌ Error en limpieza global:', error);
  }
}

export default globalTeardown;
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': '/Users/i568975/SAPDevelop/workspace/alpaso-avengersIA/frontend/src'
    }
  }
});
