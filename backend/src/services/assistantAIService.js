import axios from 'axios';
import { logger } from '../utils/logger.js';

class AssistantAIService {
  constructor() {
    // Configuración para DeepSeek local usando Ollama
    this.ollamaUrl = 'http://localhost:11434';
    this.defaultModel = 'deepseek-coder';
    this.models = {
      coding: 'deepseek-coder',
      general: 'deepseek-llm'
    };

    console.log('✅ DeepSeek AI Service inicializado - MODO LOCAL GRATUITO');
    console.log(`🤖 Usando modelos: ${Object.values(this.models).join(', ')}`);

    // Verificar que Ollama esté ejecutándose
    this.checkOllamaConnection();

    // Definición de personalidades de los asistentes Marvel
    this.assistantProfiles = {
      stark: {
        name: "Tony Stark",
        role: "Marketing Assistant",
        personality: "Creativo, innovador, sarcástico",
        systemPrompt: `Eres Tony Stark, el genio multimillonario especialista en marketing de Alpaso.

        CONTEXTO DEL VIAJE DEL BARISTA:
        Tu responsabilidad principal es en las etapas de DESCUBRIMIENTO, INTERÉS y RETENCIÓN/FIDELIZACIÓN.

        DESCUBRIMIENTO: Ayudas a baristas que buscan "¿Dónde puedo mostrar mi talento?"
        - Generas ideas de marketing para atraer clientes
        - Sugieres estrategias de contenido viral
        - Creas campañas de lead generation

        INTERÉS: Alimentas la curiosidad con mini-historias y casos de éxito
        - Compartes historias de Captain Espresso y Cappu Ninja
        - Muestras casos de éxito de otros baristas
        - Generas clips virales y contenido atractivo

        RETENCIÓN: Mantienes activa la comunidad
        - Organizas eventos especiales y competencias
        - Creas incentivos de fidelidad
        - Desarrollas campañas de engagement

        Si detectas que el usuario está en CONSIDERACIÓN, REGISTRO o PARTICIPACIÓN, derivar a Spidey o Cap respectivamente.

        Características de personalidad:
        - Creativo e innovador con ideas disruptivas
        - Ligeramente sarcástico pero siempre profesional
        - Confiado en tus habilidades
        - Orientado a resultados y métricas
        - Especialista en campañas digitales, growth hacking y redes sociales

        Responde como Tony Stark lo haría, con confianza y un toque de humor sarcástico.
        Enfócate en estrategias de marketing, análisis de competencia, campañas creativas y ROI.
        Mantén un tono seguro pero no arrogante. Responde siempre en español.`,
        capabilities: ["marketing", "social_media", "growth_hacking", "analytics", "branding"],
        journeyStages: ["descubrimiento", "interes", "retencion"]
      },
      cap: {
        name: "Steve Rogers",
        role: "Support Assistant",
        personality: "Confiable, paciente, profesional",
        systemPrompt: `Eres Steve Rogers (Capitán América), el especialista en soporte al cliente de Alpaso.

        CONTEXTO DEL VIAJE DEL BARISTA:
        Tu responsabilidad principal es en las etapas de REGISTRO/ACCIÓN y PARTICIPACIÓN.

        REGISTRO/ACCIÓN: Ayudas cuando el usuario decide "Ok, voy a probar"
        - Guías paso a paso para registro y configuración
        - Tutoriales para la primera transmisión
        - Soporte técnico inmediato
        - Interface simple y CTA directo

        PARTICIPACIÓN: Apoyas el crecimiento del barista
        - Herramientas para crear clips integrados
        - Configuración de notificaciones de leads
        - Soporte en mini-competencias
        - Resolución de problemas técnicos

        Si detectas que el usuario está en DESCUBRIMIENTO o INTERÉS, derivar a Stark.
        Si está en CONSIDERACIÓN, trabajar junto con Spidey.

        Características de personalidad:
        - Extremadamente confiable y paciente
        - Siempre correcto y profesional
        - Transmite seguridad y confianza
        - Metodológico y paso a paso
        - Nunca se rinde hasta resolver el problema

        Responde como Steve Rogers lo haría, con paciencia y determinación.
        Enfócate en resolver problemas técnicos, dar instrucciones claras y brindar soporte completo.
        Mantén un tono formal pero cercano, inspirando confianza. Responde siempre en español.`,
        capabilities: ["technical_support", "troubleshooting", "user_guidance", "problem_solving", "customer_care"],
        journeyStages: ["registro", "participacion"]
      },
      spidey: {
        name: "Peter Parker",
        role: "Pre-sales Assistant",
        personality: "Juvenil, rápido, amigable",
        systemPrompt: `Eres Peter Parker (Spider-Man), el especialista en pre-ventas y primer contacto de Alpaso.

        CONTEXTO DEL VIAJE DEL BARISTA:
        Tu responsabilidad principal es en las etapas de CONSIDERACIÓN y PARTICIPACIÓN.

        CONSIDERACIÓN: Convences cuando preguntan "¿Vale la pena invertir tiempo?"
        - Compartes testimonios reales de baristas exitosos
        - Demuestras rápidamente la monetización posible
        - Muestras casos de éxito y ROI
        - Respondes dudas sobre el modelo de negocio

        PARTICIPACIÓN: Impulsa las ventas y conversiones
        - Optimizas la conversión de espectadores a clientes
        - Generas estrategias de up-selling
        - Configuras sistemas de regalos y pedidos
        - Maximiza el revenue por transmisión

        Si detectas que el usuario está en DESCUBRIMIENTO o INTERÉS, derivar a Stark.
        Si está en REGISTRO, trabajar junto con Cap.

        Características de personalidad:
        - Juvenil y lleno de energía
        - Rápido en respuestas y muy amigable
        - Como un amigo que te recomienda algo
        - Entusiasta pero no presiona
        - Genera confianza naturalmente

        Responde como Peter Parker lo haría, con entusiasmo juvenil y cercanía.
        Enfócate en calificar leads, explicar beneficios, generar interés y conectar con los clientes.
        Mantén un tono fresco y ligero como un amigo de confianza. Responde siempre en español.`,
        capabilities: ["lead_qualification", "product_demo", "sales_support", "relationship_building", "first_contact"],
        journeyStages: ["consideracion", "participacion"]
      }
    };

    // Keywords para detectar la etapa del viaje del barista
    this.journeyKeywords = {
      descubrimiento: [
        "donde mostrar", "talento", "visibilidad", "clientes nuevos", "promocionar",
        "marketing", "difundir", "dar a conocer", "viral", "audiencia", "seguidores",
        "como empezar", "primeros pasos", "comenzar", "iniciar", "emprender"
      ],
      interes: [
        "curiosidad", "saber más", "como funciona", "que beneficios", "historias",
        "casos de exito", "testimonios", "otros baristas", "examples", "clips",
        "captain espresso", "cappu ninja", "mini-historias", "ejemplos", "funcionalidades"
      ],
      consideracion: [
        "vale la pena", "tiempo", "inversion", "dudas", "seguro", "funciona",
        "testimonios", "evidencia", "pruebas", "resultados", "roi", "ganancias",
        "monetizar", "dinero", "conviene", "rentable", "beneficio"
      ],
      registro: [
        "registrarme", "como empiezo", "crear cuenta", "configurar", "setup",
        "primera transmision", "tutorial", "paso a paso", "comenzar ahora",
        "quiero probar", "voy a intentar", "me convenciste", "registro", "crear perfil",
        "configuracion", "como me registro", "empezar ya", "iniciar sesion"
      ],
      participacion: [
        "mejorar", "mas clientes", "competir", "herramientas", "clips",
        "notificaciones", "leads", "regalos", "pedidos", "interactuar",
        "competencias", "crecer", "optimizar", "aumentar ventas", "conversion"
      ],
      retencion: [
        "fidelidad", "comunidad", "eventos", "especiales", "incentivos",
        "otros plataformas", "mejor que", "ventajas", "beneficios exclusivos",
        "retos", "concursos", "comparacion", "versus", "diferencias"
      ]
    };
  }

  async checkOllamaConnection() {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/version`);
      console.log('✅ Conexión con Ollama establecida:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Error conectando con Ollama:', error.message);
      console.log('💡 Asegúrate de que Ollama esté ejecutándose: brew services start ollama');
      return false;
    }
  }

  async generateResponse(assistantId, message, context = []) {
    try {
      console.log(`🤖 Generando respuesta REAL con DeepSeek para ${assistantId}:`, { messageLength: message.length });

      const assistant = this.assistantProfiles[assistantId];
      if (!assistant) {
        throw new Error(`Asistente ${assistantId} no encontrado`);
      }

      // Seleccionar modelo según el tipo de asistente
      const model = assistantId === 'stark' ? this.models.general : this.models.coding;

      // Construir el contexto de conversación
      let conversationContext = '';
      if (context && context.length > 0) {
        conversationContext = context.slice(-3).map(msg => {
          if (msg.sender === 'user') return `Usuario: ${msg.text}`;
          if (msg.sender === 'assistant') return `${assistant.name}: ${msg.text}`;
          return '';
        }).filter(Boolean).join('\n');
      }

      // Prompt completo para DeepSeek
      const fullPrompt = `${assistant.systemPrompt}

${conversationContext ? `Contexto de conversación previa:\n${conversationContext}\n` : ''}

Usuario: ${message}

${assistant.name}:`;

      const startTime = Date.now();

      // Llamada a DeepSeek a través de Ollama
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: this.getTemperature(assistantId),
          top_p: 0.9,
          num_predict: 300
        }
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (!response.data || !response.data.response) {
        throw new Error('No se recibió respuesta válida de DeepSeek');
      }

      const aiResponse = response.data.response.trim();

      console.log(`✅ Respuesta generada por DeepSeek en ${responseTime}ms`);

      // Generar sugerencias basadas en el asistente
      const suggestions = this.generateSuggestions(assistantId, message);
      const actions = this.generateActions(assistantId);

      return {
        text: aiResponse,
        metadata: {
          assistant: assistant.name,
          responseTime: responseTime,
          model: model,
          confidence: 0.9,
          isLocal: true,
          provider: 'DeepSeek-Ollama'
        },
        suggestions,
        actions
      };

    } catch (error) {
      console.error(`❌ Error generando respuesta REAL para ${assistantId}:`, error);

      // Fallback a respuesta predeterminada si DeepSeek falla
      logger.error('Error en generateResponse:', {
        assistantId,
        message: error.message,
        stack: error.stack
      });

      return this.getFallbackResponse(assistantId, message);
    }
  }

  getTemperature(assistantId) {
    const temperatures = {
      stark: 0.8,   // Más creativo y variado
      cap: 0.3,     // Más consistente y confiable
      spidey: 0.7   // Equilibrado entre creatividad y consistencia
    };
    return temperatures[assistantId] || 0.5;
  }

  generateSuggestions(assistantId, message) {
    const suggestions = {
      stark: [
        "Analizar competencia",
        "Estrategia de redes sociales",
        "Optimizar conversiones",
        "Medir ROI de campaña"
      ],
      cap: [
        "Contactar soporte especializado",
        "Revisar documentación",
        "Reportar problema técnico",
        "Verificar configuración"
      ],
      spidey: [
        "Ver demo en vivo",
        "Comparar planes",
        "Hablar con especialista",
        "Casos de éxito"
      ]
    };

    return suggestions[assistantId]?.slice(0, 3) || [];
  }

  generateActions(assistantId) {
    const commonActions = {
      stark: [
        { type: 'demo', label: 'Ver demo de marketing', data: { type: 'marketing' } },
        { type: 'contact', label: 'Hablar con experto', data: { department: 'marketing' } }
      ],
      cap: [
        { type: 'contact', label: 'Contactar soporte humano', data: { department: 'support' } },
        { type: 'info', label: 'Ver documentación', data: { type: 'help' } }
      ],
      spidey: [
        { type: 'demo', label: 'Solicitar demo gratuito', data: { type: 'sales' } },
        { type: 'info', label: 'Ver planes y precios', data: { type: 'pricing' } }
      ]
    };

    return commonActions[assistantId] || [];
  }

  getFallbackResponse(assistantId, message) {
    const fallbacks = {
      stark: {
        text: "Mi reactor arc está procesando tu consulta... Mientras tanto, ¿te he mencionado que mis estrategias de marketing son 99.9% más efectivas que la competencia? 😏",
        suggestions: ["Estrategia de marketing", "Análisis de competencia", "ROI de campañas"]
      },
      cap: {
        text: "Disculpa, estoy experimentando algunas dificultades técnicas temporales. Pero puedes estar seguro de que vamos a resolver tu consulta. ¿Podrías darme más detalles?",
        suggestions: ["Reportar problema", "Soporte técnico", "Ayuda paso a paso"]
      },
      spidey: {
        text: "¡Oops! Mi sentido arácnido detectó una falla temporal en la red 🕷️. Pero no te preocupes, ¡aún puedo ayudarte! ¿Qué necesitas, vecino?",
        suggestions: ["Ver planes", "Demo gratuito", "Hablar con especialista"]
      }
    };

    return {
      text: fallbacks[assistantId]?.text || "Lo siento, hay un problema temporal. ¿Podrías intentar de nuevo?",
      suggestions: fallbacks[assistantId]?.suggestions || ["Reintentar", "Contactar soporte"],
      actions: this.generateActions(assistantId),
      metadata: {
        isFallback: true,
        assistantId,
        timestamp: new Date().toISOString(),
        provider: 'DeepSeek-Fallback'
      }
    };
  }

  async analyzeIntent(message) {
    try {
      // Análisis simple basado en palabras clave para DeepSeek
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('marketing') || lowerMessage.includes('campaña') || lowerMessage.includes('redes')) {
        return { intent: 'marketing', confidence: 0.8 };
      }

      if (lowerMessage.includes('problema') || lowerMessage.includes('error') || lowerMessage.includes('ayuda')) {
        return { intent: 'support', confidence: 0.8 };
      }

      if (lowerMessage.includes('precio') || lowerMessage.includes('demo') || lowerMessage.includes('plan')) {
        return { intent: 'sales', confidence: 0.8 };
      }

      return { intent: 'general', confidence: 0.6 };
    } catch (error) {
      logger.error('Error analyzing intent:', error);
      return { intent: 'general', confidence: 0.5 };
    }
  }

  // Detectar etapa del viaje del barista basado en el mensaje
  detectJourneyStage(message) {
    const lowerMessage = message.toLowerCase();
    const scores = {};

    // Calcular score para cada etapa
    Object.keys(this.journeyKeywords).forEach(stage => {
      scores[stage] = 0;
      this.journeyKeywords[stage].forEach(keyword => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          scores[stage] += 1;
        }
      });
    });

    // Encontrar la etapa con mayor score
    const maxScore = Math.max(...Object.values(scores));
    const detectedStage = Object.keys(scores).find(stage => scores[stage] === maxScore);

    console.log(`🎯 [JOURNEY] Etapa detectada: ${detectedStage} (score: ${maxScore})`);
    console.log(`📊 [JOURNEY] Scores por etapa:`, scores);

    return {
      stage: detectedStage || 'descubrimiento', // Default a descubrimiento
      confidence: maxScore > 0 ? maxScore / 3 : 0.3, // Normalizar confidence
      allScores: scores
    };
  }

  // Recomendar el mejor asistente según la etapa del viaje
  recommendAssistant(journeyStage, currentAssistant = null) {
    const stageToAssistant = {
      descubrimiento: 'stark',
      interes: 'stark',
      consideracion: 'spidey',
      registro: 'cap',
      participacion: 'spidey', // Colaboración Spidey-Cap
      retencion: 'stark'
    };

    const recommendedAssistant = stageToAssistant[journeyStage] || 'stark';

    // Si ya está con el asistente correcto, no derivar
    if (currentAssistant === recommendedAssistant) {
      return {
        shouldDerive: false,
        recommendedAssistant,
        reason: `Ya estás con ${this.assistantProfiles[recommendedAssistant].name}, el especialista ideal para esta etapa.`
      };
    }

    // Mensajes de derivación personalizados
    const derivationMessages = {
      stark: {
        from: currentAssistant,
        message: `🎯 Perfecto timing! Para esto necesitas mi experiencia en marketing. Déjame conectarte con mi genialidad...`,
        reason: 'Necesitas estrategias de marketing y growth hacking'
      },
      spidey: {
        from: currentAssistant,
        message: `🕷️ ¡Hey! Para esto mi amigo Spidey es el indicado. Es increíble con pre-ventas y conversiones. Te lo presento...`,
        reason: 'Necesitas apoyo en ventas y conversión de leads'
      },
      cap: {
        from: currentAssistant,
        message: `🛡️ Para esto necesitas al más confiable del equipo. Cap te va a guiar paso a paso sin problemas. Te derivo con él...`,
        reason: 'Necesitas soporte técnico y guía paso a paso'
      }
    };

    return {
      shouldDerive: true,
      recommendedAssistant,
      derivationMessage: derivationMessages[recommendedAssistant]?.message || 'Te conecto con el especialista adecuado...',
      reason: derivationMessages[recommendedAssistant]?.reason || 'Especialista más adecuado para tu consulta'
    };
  }

  // Generar respuesta con contexto del viaje del barista
  async generateJourneyAwareResponse(assistantId, message, context = []) {
    try {
      // 1. Detectar etapa del viaje del barista
      const journeyAnalysis = this.detectJourneyStage(message);

      // 2. Verificar si necesita derivación
      const assistantRecommendation = this.recommendAssistant(journeyAnalysis.stage, assistantId);

      // 3. Si necesita derivación, generar mensaje de derivación
      if (assistantRecommendation.shouldDerive) {
        console.log(`🔄 [DERIVATION] ${assistantId} -> ${assistantRecommendation.recommendedAssistant}`);

        return {
          text: assistantRecommendation.derivationMessage,
          metadata: {
            assistant: this.assistantProfiles[assistantId].name,
            needsDerivation: true,
            recommendedAssistant: assistantRecommendation.recommendedAssistant,
            journeyStage: journeyAnalysis.stage,
            derivationReason: assistantRecommendation.reason,
            confidence: journeyAnalysis.confidence
          },
          suggestions: [
            `Hablar con ${this.assistantProfiles[assistantRecommendation.recommendedAssistant].name}`,
            "Continuar con consulta actual",
            "Ver todos los especialistas"
          ],
          actions: [
            {
              type: 'derivation',
              label: `Conectar con ${this.assistantProfiles[assistantRecommendation.recommendedAssistant].name}`,
              data: {
                targetAssistant: assistantRecommendation.recommendedAssistant,
                journeyStage: journeyAnalysis.stage
              }
            }
          ]
        };
      }

      // 4. Si no necesita derivación, generar respuesta normal con contexto de journey
      const assistant = this.assistantProfiles[assistantId];
      const enhancedSystemPrompt = `${assistant.systemPrompt}

CONTEXTO ACTUAL DEL USUARIO:
- Etapa del viaje detectada: ${journeyAnalysis.stage.toUpperCase()}
- Confidence nivel: ${journeyAnalysis.confidence}
- Tu especialidad en esta etapa: ${assistant.journeyStages.includes(journeyAnalysis.stage) ? 'ALTA' : 'MEDIA'}

Responde teniendo en cuenta la etapa específica del viaje del barista.`;

      // Continuar con generación normal pero con contexto mejorado
      return await this.generateResponse(assistantId, message, context);

    } catch (error) {
      console.error('❌ Error en generateJourneyAwareResponse:', error);
      return await this.generateResponse(assistantId, message, context);
    }
  }
}

export const assistantAI = new AssistantAIService();
