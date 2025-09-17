#!/usr/bin/env node

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5004';

async function testAssistant(assistantId, message) {
  console.log(`\n🧪 Probando ${assistantId.toUpperCase()}...`);
  console.log(`💬 Mensaje: "${message}"`);

  const start = Date.now();

  try {
    const response = await axios.post(`${API_BASE_URL}/api/chat`, {
      assistantId,
      message,
      context: []
    });

    const end = Date.now();
    const responseTime = end - start;

    if (response.data.success) {
      console.log(`✅ Respuesta en ${responseTime}ms`);
      console.log(`📄 "${response.data.response.text.substring(0, 100)}..."`);
      console.log(`💡 Sugerencias: ${response.data.response.suggestions.join(', ')}`);
      return responseTime;
    } else {
      console.log(`❌ Error: ${response.data.message}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 PRUEBAS DE VELOCIDAD - ASISTENTES MARVEL');
  console.log('='.repeat(50));

  // Verificar backend
  try {
    const health = await axios.get(`${API_BASE_URL}/health`);
    console.log(`✅ Backend: ${health.data.message}`);
  } catch (error) {
    console.log(`❌ Backend no disponible: ${error.message}`);
    return;
  }

  const tests = [
    { id: 'stark', message: 'Necesito una estrategia de marketing digital', name: '🟡 Tony Stark (Marketing)' },
    { id: 'cap', message: 'Tengo un problema técnico que resolver', name: '🔵 Steve Rogers (Support)' },
    { id: 'spidey', message: 'Quiero conocer los planes de Alpaso', name: '🔴 Peter Parker (Pre-sales)' }
  ];

  const results = [];

  for (const test of tests) {
    console.log(`\n${test.name}`);
    console.log('-'.repeat(40));

    const times = [];

    // Hacer 3 pruebas por asistente
    for (let i = 1; i <= 3; i++) {
      console.log(`\nPrueba ${i}/3:`);
      const time = await testAssistant(test.id, test.message);
      if (time) times.push(time);

      // Pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (times.length > 0) {
      const avgTime = Math.round(times.reduce((a, b) => a + b) / times.length);
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);

      results.push({
        name: test.name,
        assistant: test.id,
        avgTime,
        minTime,
        maxTime,
        tests: times.length
      });

      console.log(`\n📊 Estadísticas de ${test.name}:`);
      console.log(`⏱️  Tiempo promedio: ${avgTime}ms`);
      console.log(`⚡ Más rápido: ${minTime}ms`);
      console.log(`🐌 Más lento: ${maxTime}ms`);
    }
  }

  // Reporte final
  console.log('\n\n🏆 RANKING FINAL DE VELOCIDAD');
  console.log('='.repeat(50));

  results.sort((a, b) => a.avgTime - b.avgTime);

  results.forEach((result, index) => {
    const medal = ['🥇', '🥈', '🥉'][index] || '🏅';
    console.log(`${medal} ${result.name}: ${result.avgTime}ms promedio`);
    console.log(`   📈 Rango: ${result.minTime}ms - ${result.maxTime}ms`);
  });

  const overallAvg = Math.round(
    results.reduce((sum, r) => sum + r.avgTime, 0) / results.length
  );

  console.log(`\n🎯 PROMEDIO GENERAL: ${overallAvg}ms`);
  console.log('✨ Pruebas completadas exitosamente!');
}

runTests().catch(console.error);
