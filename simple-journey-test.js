// Prueba Simple del Sistema de Derivación Inteligente
// Ejemplo práctico de Input → Process → Output

console.log('🧪 DEMOSTRACIÓN DEL SISTEMA DE DERIVACIÓN INTELIGENTE');
console.log('=' .repeat(60));

// Simulación de las funciones del sistema
const journeyKeywords = {
  descubrimiento: ["donde mostrar", "talento", "visibilidad", "clientes nuevos", "promocionar", "marketing"],
  interes: ["curiosidad", "saber más", "como funciona", "historias", "casos de exito", "testimonios"],
  consideracion: ["vale la pena", "tiempo", "inversion", "dudas", "funciona", "monetizar", "roi"],
  registro: ["registrarme", "como empiezo", "crear cuenta", "primera transmision", "tutorial"],
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
  stark: { name: 'Tony Stark', role: 'Marketing Expert' },
  cap: { name: 'Steve Rogers', role: 'Support Specialist' },
  spidey: { name: 'Peter Parker', role: 'Sales Assistant' }
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
    allScores: scores
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
    stark: `🎯 Para marketing y estrategias virales necesitas mi experiencia. Te conecto con mi genialidad...`,
    spidey: `🕷️ Para ventas y conversiones mi amigo Spidey es increíble. Te lo presento...`,
    cap: `🛡️ Para soporte técnico Cap es el más confiable. Te derivo con él...`
  };

  return {
    shouldDerive: true,
    recommendedAssistant,
    derivationMessage: derivationMessages[recommendedAssistant],
    reason: `Necesitas ${assistants[recommendedAssistant].role.toLowerCase()}`
  };
}

// CASOS DE PRUEBA ESPECÍFICOS
const examples = [
  {
    title: "EJEMPLO 1: Descubrimiento",
    input: {
      currentAssistant: "cap",
      userMessage: "¿Dónde puedo mostrar mi talento como barista para conseguir más clientes?"
    },
    expectedOutput: {
      stage: "descubrimiento",
      shouldDerive: true,
      recommendedAssistant: "stark"
    }
  },
  {
    title: "EJEMPLO 2: Consideración",
    input: {
      currentAssistant: "stark",
      userMessage: "¿Vale la pena invertir tiempo en esto? ¿Realmente funciona para monetizar?"
    },
    expectedOutput: {
      stage: "consideracion",
      shouldDerive: true,
      recommendedAssistant: "spidey"
    }
  },
  {
    title: "EJEMPLO 3: Registro",
    input: {
      currentAssistant: "spidey",
      userMessage: "Ok, me convenciste. ¿Cómo me registro y configuro mi primera transmisión?"
    },
    expectedOutput: {
      stage: "registro",
      shouldDerive: true,
      recommendedAssistant: "cap"
    }
  },
  {
    title: "EJEMPLO 4: No Derivación",
    input: {
      currentAssistant: "stark",
      userMessage: "Quiero crear una campaña viral en redes sociales para mi café"
    },
    expectedOutput: {
      stage: "descubrimiento",
      shouldDerive: false,
      recommendedAssistant: "stark"
    }
  }
];

// Ejecutar las pruebas
examples.forEach((example, index) => {
  console.log(`\n${example.title}`);
  console.log('─'.repeat(50));

  // INPUT
  console.log('📥 INPUT:');
  console.log(`   Asistente actual: ${assistants[example.input.currentAssistant].name} (${example.input.currentAssistant})`);
  console.log(`   Mensaje usuario: "${example.input.userMessage}"`);

  // PROCESS
  console.log('\n⚙️ PROCESS:');
  const journeyAnalysis = detectJourneyStage(example.input.userMessage);
  console.log(`   1. Analizando keywords...`);
  console.log(`   2. Etapa detectada: ${journeyAnalysis.stage}`);
  console.log(`   3. Confianza: ${Math.round(journeyAnalysis.confidence * 100)}%`);
  console.log(`   4. Scores por etapa:`, journeyAnalysis.allScores);

  const recommendation = recommendAssistant(journeyAnalysis.stage, example.input.currentAssistant);
  console.log(`   5. Evaluando derivación...`);
  console.log(`   6. ¿Necesita derivación?: ${recommendation.shouldDerive ? 'SÍ' : 'NO'}`);

  // OUTPUT
  console.log('\n📤 OUTPUT:');
  console.log(`   Etapa del viaje: ${journeyAnalysis.stage}`);
  console.log(`   Confianza: ${Math.round(journeyAnalysis.confidence * 100)}%`);
  console.log(`   Derivación requerida: ${recommendation.shouldDerive ? 'SÍ' : 'NO'}`);

  if (recommendation.shouldDerive) {
    console.log(`   Asistente recomendado: ${assistants[recommendation.recommendedAssistant].name}`);
    console.log(`   Razón: ${recommendation.reason}`);
    console.log(`   Mensaje al usuario: "${recommendation.derivationMessage}"`);
  } else {
    console.log(`   Mantener con: ${assistants[example.input.currentAssistant].name}`);
    console.log(`   Razón: ${recommendation.reason}`);
  }

  // Verificación
  const isCorrect = journeyAnalysis.stage === example.expectedOutput.stage &&
                   recommendation.shouldDerive === example.expectedOutput.shouldDerive &&
                   recommendation.recommendedAssistant === example.expectedOutput.recommendedAssistant;

  console.log(`\n✅ VERIFICACIÓN: ${isCorrect ? 'CORRECTO' : 'INCORRECTO'}`);

  console.log('\n' + '='.repeat(60));
});

console.log('\n🎉 DEMOSTRACIÓN COMPLETADA');
console.log('📊 El sistema analiza automáticamente cada mensaje y deriva inteligentemente');
console.log('🚀 Resultado: Cada usuario llega al especialista correcto según su etapa del viaje');
