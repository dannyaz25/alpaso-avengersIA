#!/usr/bin/env node

import axios from 'axios';
import { performance } from 'perf_hooks';

const API_BASE_URL = 'http://localhost:5004/api';

// Mensajes de prueba específicos para cada asistente
const testMessages = {
  stark: [
    "Hola Stark, necesito ayuda con una estrategia de marketing",
    "¿Cómo puedo mejorar mi ROI en redes sociales?",
    "Dame ideas creativas para una campaña de lanzamiento",
    "¿Cuál es la mejor manera de hacer growth hacking?",
    "Analiza mi competencia en el mercado digital"
  ],
  cap: [
    "Hola Cap, tengo un problema técnico que necesito resolver",
    "Mi aplicación no se está cargando correctamente",
    "¿Cómo puedo reiniciar mi cuenta?",
    "No puedo acceder a mi dashboard de usuario",
    "Hay un error 404 cuando trato de subir archivos"
  ],
  spidey: [
    "¡Hola Spidey! Quiero conocer más sobre Alpaso",
    "¿Cuáles son los planes disponibles?",
    "¿Podrías mostrarme una demo del producto?",
    "¿Hay periodo de prueba gratuito?",
    "¿Cómo se compara Alpaso con la competencia?"
  ]
};

class AssistantTestSuite {
  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.results = {
      stark: { responses: [], errors: 0, totalTime: 0 },
      cap: { responses: [], errors: 0, totalTime: 0 },
      spidey: { responses: [], errors: 0, totalTime: 0 }
    };
  }

  async testAssistant(assistantId, messages) {
    console.log(`\n🧪 Iniciando pruebas para ${this.getAssistantName(assistantId)}`);
    console.log(`📝 Mensajes de prueba: ${messages.length}`);

    let sessionId = null;

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      console.log(`\n💬 Mensaje ${i + 1}/${messages.length}: "${message.substring(0, 50)}..."`);

      try {
        const startTime = performance.now();

        const response = await this.apiClient.post('/chat', {
          assistantId,
          message,
          sessionId,
          context: []
        });

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        if (response.data.success) {
          sessionId = response.data.sessionId;
          this.results[assistantId].responses.push({
            messageIndex: i + 1,
            message: message.substring(0, 50) + '...',
            responseTime: Math.round(responseTime),
            responseText: response.data.response.text.substring(0, 100) + '...',
            suggestions: response.data.response.suggestions || [],
            metadata: response.data.response.metadata || {}
          });
          this.results[assistantId].totalTime += responseTime;

          console.log(`✅ Respuesta en ${Math.round(responseTime)}ms`);
          console.log(`📄 "${response.data.response.text.substring(0, 80)}..."`);

          if (response.data.response.suggestions && response.data.response.suggestions.length > 0) {
            console.log(`💡 Sugerencias: ${response.data.response.suggestions.join(', ')}`);
          }
        } else {
          console.log(`❌ Error en respuesta: ${response.data.message}`);
          this.results[assistantId].errors++;
        }

        // Pequeña pausa entre mensajes para simular conversación real
        await this.sleep(500);

      } catch (error) {
        console.log(`❌ Error de red: ${error.message}`);
        this.results[assistantId].errors++;
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Iniciando suite de pruebas para asistentes Marvel');
    console.log('='.repeat(60));

    // Verificar que el backend esté funcionando
    try {
      console.log('🔍 Verificando conectividad del backend...');
      const healthCheck = await this.apiClient.get('/health');
      console.log('✅ Backend conectado:', healthCheck.data.message);
      console.log('🦸‍♂️ Asistentes disponibles:', healthCheck.data.assistants.join(', '));
    } catch (error) {
      console.log('❌ Error conectando al backend:', error.message);
      console.log('🔍 Verifique que la aplicación esté ejecutándose en puerto 5004');
      return;
    }

    // Ejecutar pruebas para cada asistente
    for (const [assistantId, messages] of Object.entries(testMessages)) {
      await this.testAssistant(assistantId, messages);
      await this.sleep(1000); // Pausa entre asistentes
    }

    // Generar reporte de resultados
    this.generateReport();
  }

  generateReport() {
    console.log('\n\n📊 REPORTE DE RESULTADOS DE PRUEBAS');
    console.log('='.repeat(60));

    const assistantNames = {
      stark: '🟡 Tony Stark (Marketing)',
      cap: '🔵 Steve Rogers (Support)',
      spidey: '🔴 Peter Parker (Pre-sales)'
    };

    let overallStats = {
      totalMessages: 0,
      totalTime: 0,
      totalErrors: 0,
      successfulResponses: 0
    };

    for (const [assistantId, results] of Object.entries(this.results)) {
      const successfulResponses = results.responses.length;
      const avgResponseTime = successfulResponses > 0
        ? Math.round(results.totalTime / successfulResponses)
        : 0;

      console.log(`\n${assistantNames[assistantId]}`);
      console.log('-'.repeat(40));
      console.log(`📨 Mensajes enviados: ${testMessages[assistantId].length}`);
      console.log(`✅ Respuestas exitosas: ${successfulResponses}`);
      console.log(`❌ Errores: ${results.errors}`);
      console.log(`⏱️  Tiempo promedio de respuesta: ${avgResponseTime}ms`);
      console.log(`🕐 Tiempo total: ${Math.round(results.totalTime)}ms`);

      if (successfulResponses > 0) {
        const fastestResponse = Math.min(...results.responses.map(r => r.responseTime));
        const slowestResponse = Math.max(...results.responses.map(r => r.responseTime));
        console.log(`⚡ Respuesta más rápida: ${fastestResponse}ms`);
        console.log(`🐌 Respuesta más lenta: ${slowestResponse}ms`);

        // Mostrar ejemplo de respuesta
        const sampleResponse = results.responses[0];
        if (sampleResponse) {
          console.log(`📄 Ejemplo de respuesta: "${sampleResponse.responseText}"`);
          if (sampleResponse.suggestions.length > 0) {
            console.log(`💡 Sugerencias: ${sampleResponse.suggestions.join(', ')}`);
          }
        }
      }

      // Acumular estadísticas generales
      overallStats.totalMessages += testMessages[assistantId].length;
      overallStats.totalTime += results.totalTime;
      overallStats.totalErrors += results.errors;
      overallStats.successfulResponses += successfulResponses;
    }

    // Reporte general
    console.log(`\n🎯 RESUMEN GENERAL`);
    console.log('-'.repeat(40));
    console.log(`📊 Total de mensajes probados: ${overallStats.totalMessages}`);
    console.log(`✅ Total de respuestas exitosas: ${overallStats.successfulResponses}`);
    console.log(`❌ Total de errores: ${overallStats.totalErrors}`);
    console.log(`📈 Tasa de éxito: ${Math.round((overallStats.successfulResponses / overallStats.totalMessages) * 100)}%`);

    if (overallStats.successfulResponses > 0) {
      console.log(`⏱️  Tiempo promedio general: ${Math.round(overallStats.totalTime / overallStats.successfulResponses)}ms`);
    }
    console.log(`🕐 Tiempo total de pruebas: ${Math.round(overallStats.totalTime)}ms`);

    // Ranking de velocidad
    if (overallStats.successfulResponses > 0) {
      console.log(`\n🏆 RANKING DE VELOCIDAD`);
      console.log('-'.repeat(40));
      const speedRanking = Object.entries(this.results)
        .map(([id, results]) => ({
          assistant: assistantNames[id],
          avgTime: results.responses.length > 0
            ? Math.round(results.totalTime / results.responses.length)
            : Infinity
        }))
        .filter(entry => entry.avgTime !== Infinity)
        .sort((a, b) => a.avgTime - b.avgTime);

      speedRanking.forEach((entry, index) => {
        const medal = ['🥇', '🥈', '🥉'][index] || '🏅';
        console.log(`${medal} ${entry.assistant}: ${entry.avgTime}ms`);
      });
    }

    console.log('\n✨ Pruebas completadas exitosamente!');
  }

  getAssistantName(assistantId) {
    const names = {
      stark: 'Tony Stark (Marketing Assistant)',
      cap: 'Steve Rogers (Support Assistant)',
      spidey: 'Peter Parker (Pre-sales Assistant)'
    };
    return names[assistantId] || assistantId;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Ejecutar las pruebas
console.log('🔄 Iniciando script de pruebas de asistentes Marvel...');
const testSuite = new AssistantTestSuite();
testSuite.runAllTests().catch(error => {
  console.error('💥 Error fatal en las pruebas:', error.message);
  console.error('🔍 Stack trace:', error.stack);
});
