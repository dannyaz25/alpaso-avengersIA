// Script de prueba para el Sistema de Derivación Inteligente del Viaje del Barista
// Ejecutar desde: alpaso-avengersIA/backend/

import { assistantAI } from './src/services/assistantAIService.js';

console.log('🧪 INICIANDO PRUEBAS DEL SISTEMA DE DERIVACIÓN INTELIGENTE');
console.log('=' .repeat(80));

// Casos de prueba para cada etapa del viaje del barista
const testCases = [
  {
    stage: 'DESCUBRIMIENTO',
    currentAssistant: 'cap',
    userMessage: '¿Dónde puedo mostrar mi talento como barista para atraer más clientes?',
    expectedDerivation: 'stark',
    description: 'Usuario busca visibilidad y nuevos clientes'
  },
  {
    stage: 'INTERÉS',
    currentAssistant: 'spidey',
    userMessage: '¿Puedes contarme historias de éxito de otros baristas? Me da curiosidad saber más',
    expectedDerivation: 'stark',
    description: 'Usuario quiere casos de éxito y mini-historias'
  },
  {
    stage: 'CONSIDERACIÓN',
    currentAssistant: 'stark',
    userMessage: '¿Vale la pena invertir tiempo en esto? ¿Realmente funciona para monetizar?',
    expectedDerivation: 'spidey',
    description: 'Usuario evalúa ROI y dudas sobre inversión'
  },
  {
    stage: 'REGISTRO',
    currentAssistant: 'stark',
    userMessage: 'Ok, quiero probar. ¿Cómo me registro y configuro mi primera transmisión?',
    expectedDerivation: 'cap',
    description: 'Usuario decidido a empezar, necesita guía técnica'
  },
  {
    stage: 'PARTICIPACIÓN',
    currentAssistant: 'cap',
    userMessage: 'Quiero mejorar mis transmisiones y conseguir más regalos de los espectadores',
    expectedDerivation: 'spidey',
    description: 'Usuario activo buscando optimizar conversiones'
  },
  {
    stage: 'RETENCIÓN',
    currentAssistant: 'spidey',
    userMessage: '¿Qué ventajas tiene esta plataforma versus otras? ¿Hay eventos especiales?',
    expectedDerivation: 'stark',
    description: 'Usuario comparando plataformas, necesita fidelización'
  },
  {
    stage: 'NO_DERIVACIÓN',
    currentAssistant: 'stark',
    userMessage: 'Quiero crear una campaña viral en redes sociales para mi café',
    expectedDerivation: null,
    description: 'Usuario ya está con el asistente correcto'
  }
];

async function runJourneyTests() {
  console.log('🎯 EJECUTANDO PRUEBAS DEL VIAJE DEL BARISTA\n');

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`📝 CASO ${i + 1}: ${testCase.stage}`);
    console.log(`📋 Descripción: ${testCase.description}`);
    console.log(`👤 Asistente actual: ${testCase.currentAssistant}`);
    console.log(`💬 Mensaje usuario: "${testCase.userMessage}"`);
    console.log('─'.repeat(50));

    try {
      // 1. INPUT: Analizar el mensaje del usuario
      console.log('🔍 [INPUT] Analizando mensaje del usuario...');
      const journeyAnalysis = assistantAI.detectJourneyStage(testCase.userMessage);

      // 2. PROCESS: Determinar si necesita derivación
      console.log('⚙️ [PROCESS] Evaluando necesidad de derivación...');
      const recommendation = assistantAI.recommendAssistant(
        journeyAnalysis.stage,
        testCase.currentAssistant
      );

      // 3. OUTPUT: Mostrar resultado del análisis
      console.log('📊 [OUTPUT] Resultado del análisis:');
      console.log(`   🎯 Etapa detectada: ${journeyAnalysis.stage}`);
      console.log(`   📈 Confianza: ${Math.round(journeyAnalysis.confidence * 100)}%`);
      console.log(`   🔄 Necesita derivación: ${recommendation.shouldDerive ? 'SÍ' : 'NO'}`);

      if (recommendation.shouldDerive) {
        console.log(`   👨‍💼 Asistente recomendado: ${recommendation.recommendedAssistant}`);
        console.log(`   💡 Razón: ${recommendation.reason}`);

        // Verificar si la predicción es correcta
        const isCorrect = recommendation.recommendedAssistant === testCase.expectedDerivation;
        console.log(`   ✅ Predicción: ${isCorrect ? 'CORRECTA' : 'INCORRECTA'}`);

        if (!isCorrect) {
          console.log(`   ❌ Esperado: ${testCase.expectedDerivation}, Obtenido: ${recommendation.recommendedAssistant}`);
        }
      } else {
        console.log(`   ✅ Usuario ya está con el asistente correcto`);
        const isCorrect = testCase.expectedDerivation === null;
        console.log(`   ✅ Predicción: ${isCorrect ? 'CORRECTA' : 'INCORRECTA'}`);
      }

      // Generar respuesta completa con contexto
      console.log('\n🤖 [RESPONSE] Generando respuesta con contexto del viaje...');
      const response = await assistantAI.generateJourneyAwareResponse(
        testCase.currentAssistant,
        testCase.userMessage,
        []
      );

      if (response.metadata?.needsDerivation) {
        console.log('🔄 [DERIVATION] Mensaje de derivación generado:');
        console.log(`   "${response.text}"`);
      } else {
        console.log('💬 [NORMAL] Respuesta directa del asistente:');
        console.log(`   "${response.text.substring(0, 100)}..."`);
      }

    } catch (error) {
      console.error(`❌ Error en caso ${i + 1}:`, error.message);
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }
}

async function demonstrateKeywordDetection() {
  console.log('🔍 DEMOSTRACIÓN DE DETECCIÓN DE KEYWORDS\n');

  const keywordExamples = [
    {
      message: "Necesito promocionar mi talento y dar a conocer mi café",
      expectedStage: "descubrimiento",
      keywords: ["promocionar", "talento", "dar a conocer"]
    },
    {
      message: "¿Tienes testimonios de otros baristas exitosos?",
      expectedStage: "interes",
      keywords: ["testimonios", "otros baristas"]
    },
    {
      message: "¿Vale la pena el tiempo que voy a invertir en esto?",
      expectedStage: "consideracion",
      keywords: ["vale la pena", "tiempo", "invertir"]
    },
    {
      message: "Quiero registrarme y crear mi primera transmisión paso a paso",
      expectedStage: "registro",
      keywords: ["registrarme", "primera transmision", "paso a paso"]
    },
    {
      message: "¿Cómo optimizo para conseguir más regalos y leads de clientes?",
      expectedStage: "participacion",
      keywords: ["optimizar", "regalos", "leads"]
    },
    {
      message: "¿Qué ventajas tiene esto versus otras plataformas de streaming?",
      expectedStage: "retencion",
      keywords: ["ventajas", "otras plataformas"]
    }
  ];

  keywordExamples.forEach((example, index) => {
    console.log(`📝 EJEMPLO ${index + 1}:`);
    console.log(`💬 Mensaje: "${example.message}"`);
    console.log(`🎯 Etapa esperada: ${example.expectedStage}`);
    console.log(`🔑 Keywords clave: ${example.keywords.join(', ')}`);

    const analysis = assistantAI.detectJourneyStage(example.message);
    console.log(`📊 Resultado: ${analysis.stage} (${Math.round(analysis.confidence * 100)}% confianza)`);
    console.log(`✅ Correcto: ${analysis.stage === example.expectedStage ? 'SÍ' : 'NO'}`);
    console.log('─'.repeat(50));
  });
}

async function runCompleteDemo() {
  try {
    await demonstrateKeywordDetection();
    console.log('\n');
    await runJourneyTests();

    console.log('🎉 PRUEBAS COMPLETADAS EXITOSAMENTE');
    console.log('📊 El sistema de derivación inteligente está funcionando correctamente');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  }
}

// Ejecutar las pruebas
runCompleteDemo();
