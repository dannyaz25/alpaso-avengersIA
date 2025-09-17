// Prueba Mejorada del Sistema de Derivación Inteligente
// Con keywords corregidas para mejor detección

console.log('🧪 SISTEMA DE DERIVACIÓN INTELIGENTE - VERSIÓN MEJORADA');
console.log('=' .repeat(70));

// Keywords actualizadas (incluyendo las correcciones)
const journeyKeywords = {
  descubrimiento: ["donde mostrar", "talento", "visibilidad", "clientes nuevos", "promocionar", "marketing"],
  interes: ["curiosidad", "saber más", "como funciona", "historias", "casos de exito", "testimonios"],
  consideracion: ["vale la pena", "tiempo", "inversion", "dudas", "funciona", "monetizar", "roi"],
  registro: ["registrarme", "como empiezo", "crear cuenta", "primera transmision", "tutorial",
            "me convenciste", "registro", "configurar", "empezar ya"], // ✅ MEJORADO
  participacion: ["mejorar", "mas clientes", "competir", "herramientas", "regalos", "leads"],
  retencion: ["fidelidad", "comunidad", "eventos", "ventajas", "otros plataformas"]
};

const stageToAssistant = {
  descubrimiento: 'stark',
  interes: 'stark',
  consideracion: 'spidey',
  registro: 'cap',
  participacion: 'spidey',
  retencion: 'stark'
};

const assistants = {
  stark: { name: 'Tony Stark', role: 'Marketing Expert', emoji: '🎯' },
  cap: { name: 'Steve Rogers', role: 'Support Specialist', emoji: '🛡️' },
  spidey: { name: 'Peter Parker', role: 'Sales Assistant', emoji: '🕷️' }
};

function detectJourneyStage(message) {
  const lowerMessage = message.toLowerCase();
  const scores = {};

  Object.keys(journeyKeywords).forEach(stage => {
    scores[stage] = 0;
    journeyKeywords[stage].forEach(keyword => {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        scores[stage] += 1;
      }
    });
  });

  const maxScore = Math.max(...Object.values(scores));
  const detectedStage = Object.keys(scores).find(stage => scores[stage] === maxScore);

  return {
    stage: detectedStage || 'descubrimiento',
    confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3,
    allScores: scores,
    detectedKeywords: journeyKeywords[detectedStage || 'descubrimiento'].filter(keyword =>
      lowerMessage.includes(keyword.toLowerCase())
    )
  };
}

function recommendAssistant(journeyStage, currentAssistant) {
  const recommendedAssistant = stageToAssistant[journeyStage] || 'stark';

  if (currentAssistant === recommendedAssistant) {
    return {
      shouldDerive: false,
      recommendedAssistant,
      reason: `Ya estás con ${assistants[recommendedAssistant].name}, el especialista ideal para esta etapa.`
    };
  }

  const derivationMessages = {
    stark: `${assistants.stark.emoji} Para marketing y estrategias virales necesitas mi experiencia. Te conecto con mi genialidad...`,
    spidey: `${assistants.spidey.emoji} Para ventas y conversiones mi amigo Spidey es increíble. Te lo presento...`,
    cap: `${assistants.cap.emoji} Para soporte técnico Cap es el más confiable. Te derivo con él...`
  };

  return {
    shouldDerive: true,
    recommendedAssistant,
    derivationMessage: derivationMessages[recommendedAssistant],
    reason: `Necesitas ${assistants[recommendedAssistant].role.toLowerCase()}`
  };
}

// CASOS DE PRUEBA ACTUALIZADOS
const improvedExamples = [
  {
    title: "✅ CASO 1: DESCUBRIMIENTO",
    scenario: "Barista busca visibilidad",
    input: {
      currentAssistant: "cap",
      userMessage: "¿Dónde puedo mostrar mi talento como barista para conseguir más clientes?"
    },
    expected: { stage: "descubrimiento", assistant: "stark" }
  },
  {
    title: "✅ CASO 2: CONSIDERACIÓN",
    scenario: "Barista evalúa ROI",
    input: {
      currentAssistant: "stark",
      userMessage: "¿Vale la pena invertir tiempo en esto? ¿Realmente funciona para monetizar?"
    },
    expected: { stage: "consideracion", assistant: "spidey" }
  },
  {
    title: "🔧 CASO 3: REGISTRO (CORREGIDO)",
    scenario: "Barista decidido a empezar",
    input: {
      currentAssistant: "spidey",
      userMessage: "Ok, me convenciste. ¿Cómo me registro y configuro mi primera transmisión?"
    },
    expected: { stage: "registro", assistant: "cap" }
  },
  {
    title: "✅ CASO 4: PARTICIPACIÓN",
    scenario: "Barista activo optimizando",
    input: {
      currentAssistant: "cap",
      userMessage: "Quiero optimizar para conseguir más regalos y leads de clientes"
    },
    expected: { stage: "participacion", assistant: "spidey" }
  },
  {
    title: "✅ CASO 5: RETENCIÓN",
    scenario: "Barista comparando plataformas",
    input: {
      currentAssistant: "spidey",
      userMessage: "¿Qué ventajas tiene esta plataforma versus otras de streaming?"
    },
    expected: { stage: "retencion", assistant: "stark" }
  }
];

// Función para mostrar resultados en formato Input → Process → Output
function demonstrateSystemFlow(example, index) {
  console.log(`\n${example.title}`);
  console.log(`📋 Escenario: ${example.scenario}`);
  console.log('─'.repeat(60));

  // 📥 INPUT
  console.log('📥 INPUT:');
  console.log(`   👤 Usuario actual: ${assistants[example.input.currentAssistant].name} (${example.input.currentAssistant})`);
  console.log(`   💬 Mensaje: "${example.input.userMessage}"`);

  // ⚙️ PROCESS
  console.log('\n⚙️ PROCESS:');
  const journeyAnalysis = detectJourneyStage(example.input.userMessage);
  console.log(`   🔍 1. Analizando keywords en mensaje...`);
  console.log(`   🎯 2. Keywords detectadas: [${journeyAnalysis.detectedKeywords.join(', ')}]`);
  console.log(`   📊 3. Scores calculados:`, journeyAnalysis.allScores);
  console.log(`   🎪 4. Etapa identificada: ${journeyAnalysis.stage}`);
  console.log(`   📈 5. Nivel de confianza: ${Math.round(journeyAnalysis.confidence * 100)}%`);

  const recommendation = recommendAssistant(journeyAnalysis.stage, example.input.currentAssistant);
  console.log(`   🤔 6. Evaluando necesidad de derivación...`);
  console.log(`   🔄 7. ¿Derivar?: ${recommendation.shouldDerive ? 'SÍ' : 'NO'}`);

  // 📤 OUTPUT
  console.log('\n📤 OUTPUT:');
  console.log(`   🎯 Etapa del viaje: ${journeyAnalysis.stage.toUpperCase()}`);
  console.log(`   📊 Confianza: ${Math.round(journeyAnalysis.confidence * 100)}%`);
  console.log(`   🔀 Acción: ${recommendation.shouldDerive ? 'DERIVAR' : 'MANTENER'}`);

  if (recommendation.shouldDerive) {
    console.log(`   👨‍💼 Asistente recomendado: ${assistants[recommendation.recommendedAssistant].name}`);
    console.log(`   💡 Justificación: ${recommendation.reason}`);
    console.log(`   💬 Mensaje al usuario: "${recommendation.derivationMessage}"`);
  } else {
    console.log(`   ✅ Mantener con: ${assistants[example.input.currentAssistant].name}`);
    console.log(`   💡 Justificación: ${recommendation.reason}`);
  }

  // ✅ VERIFICACIÓN
  const stageCorrect = journeyAnalysis.stage === example.expected.stage;
  const assistantCorrect = recommendation.recommendedAssistant === example.expected.assistant;
  const overallCorrect = stageCorrect && assistantCorrect;

  console.log(`\n🧪 VERIFICACIÓN:`);
  console.log(`   Etapa esperada: ${example.expected.stage} → Detectada: ${journeyAnalysis.stage} ${stageCorrect ? '✅' : '❌'}`);
  console.log(`   Asistente esperado: ${example.expected.assistant} → Recomendado: ${recommendation.recommendedAssistant} ${assistantCorrect ? '✅' : '❌'}`);
  console.log(`   🎯 RESULTADO FINAL: ${overallCorrect ? '✅ CORRECTO' : '❌ INCORRECTO'}`);

  return overallCorrect;
}

// Ejecutar todas las pruebas
console.log('🚀 EJECUTANDO PRUEBAS DEL SISTEMA MEJORADO\n');

let correctTests = 0;
const totalTests = improvedExamples.length;

improvedExamples.forEach((example, index) => {
  const isCorrect = demonstrateSystemFlow(example, index + 1);
  if (isCorrect) correctTests++;
  console.log('\n' + '='.repeat(70));
});

// Resumen final
console.log('\n📊 RESUMEN DE RESULTADOS:');
console.log(`✅ Pruebas correctas: ${correctTests}/${totalTests}`);
console.log(`📈 Porcentaje de acierto: ${Math.round((correctTests / totalTests) * 100)}%`);

if (correctTests === totalTests) {
  console.log('\n🎉 ¡SISTEMA FUNCIONANDO PERFECTAMENTE!');
  console.log('🚀 El viaje del barista está siendo detectado y derivado correctamente');
} else {
  console.log('\n⚠️ Sistema necesita ajustes adicionales');
  console.log('🔧 Revisar keywords o lógica de derivación');
}

console.log('\n🎯 FLUJO COMPLETO DEMOSTRADO:');
console.log('   Input: Mensaje del usuario + Asistente actual');
console.log('   Process: Análisis de keywords → Detección de etapa → Evaluación de derivación');
console.log('   Output: Recomendación de asistente + Mensaje personalizado');
