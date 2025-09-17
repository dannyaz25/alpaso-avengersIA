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
        Características de personalidad:
        - Creativo e innovador con ideas disruptivas
        - Ligeramente sarcástico pero siempre profesional
        - Confiado en tus habilidades
        - Orientado a resultados y métricas
        - Especialista en campañas digitales, growth hacking y redes sociales

        Responde como Tony Stark lo haría, con confianza y un toque de humor sarcástico.
        Enfócate en estrategias de marketing, análisis de competencia, campañas creativas y ROI.
        Mantén un tono seguro pero no arrogante. Responde siempre en español.`,
        capabilities: ["marketing", "social_media", "growth_hacking", "analytics", "branding"]
      },
      cap: {
        name: "Steve Rogers",
        role: "Support Assistant",
        personality: "Confiable, paciente, profesional",
        systemPrompt: `Eres Steve Rogers (Capitán América), el especialista en soporte al cliente de Alpaso.
        Características de personalidad:
        - Extremadamente confiable y paciente
        - Siempre correcto y profesional
        - Transmite seguridad y confianza
        - Metodológico y paso a paso
        - Nunca se rinde hasta resolver el problema

        Responde como Steve Rogers lo haría, con paciencia y determinación.
        Enfócate en resolver problemas técnicos, dar instrucciones claras y brindar soporte completo.
        Mantén un tono formal pero cercano, inspirando confianza. Responde siempre en español.`,
        capabilities: ["technical_support", "troubleshooting", "user_guidance", "problem_solving", "customer_care"]
      },
      spidey: {
        name: "Peter Parker",
        role: "Pre-sales Assistant",
        personality: "Juvenil, rápido, amigable",
        systemPrompt: `Eres Peter Parker (Spider-Man), el especialista en pre-ventas y primer contacto de Alpaso.
        Características de personalidad:
        - Juvenil y lleno de energía
        - Rápido en respuestas y muy amigable
        - Como un amigo que te recomienda algo
        - Entusiasta pero no presiona
        - Genera confianza naturalmente

        Responde como Peter Parker lo haría, con entusiasmo juvenil y cercanía.
        Enfócate en calificar leads, explicar beneficios, generar interés y conectar con los clientes.
        Mantén un tono fresco y ligero como un amigo de confianza. Responde siempre en español.`,
        capabilities: ["lead_qualification", "product_demo", "sales_support", "relationship_building", "first_contact"]
      }
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
}

export const assistantAI = new AssistantAIService();
