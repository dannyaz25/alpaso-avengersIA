// Sistema de Automatización Interna del Viaje del Barista
// Basado en el mapa de automatización proporcionado

import { logger } from '../utils/logger.js';

class BaristaJourneyAutomation {
  constructor() {
    this.automationTriggers = {
      descubrimiento: {
        internal: true,
        needsN8n: false,
        actions: [
          'captura_leads',
          'envio_emails_automaticos',
          'landing_page_personalizada',
          'formulario_contacto'
        ]
      },
      interes: {
        internal: true,
        needsN8n: false,
        actions: [
          'programar_mini_historias',
          'clips_virales',
          'notificaciones_push',
          'contenido_personalizado'
        ]
      },
      consideracion: {
        internal: true,
        needsN8n: 'optional', // Solo si quiere CRM externo
        actions: [
          'mostrar_testimonios',
          'notificaciones_monetizacion',
          'casos_exito_reales',
          'calculadora_roi'
        ]
      },
      registro: {
        internal: true,
        needsN8n: false,
        actions: [
          'onboarding_automatico',
          'tutorial_inicial',
          'recordatorios_configuracion',
          'guia_primera_transmision'
        ]
      },
      participacion: {
        internal: true,
        needsN8n: 'optional', // Solo para alertas externas
        actions: [
          'notificaciones_internas',
          'mini_retos',
          'gamificacion',
          'recomendaciones_clips',
          'alertas_pedidos'
        ]
      },
      retencion: {
        internal: true,
        needsN8n: false,
        actions: [
          'invitaciones_eventos',
          'incentivos_fidelidad',
          'tips_personalizados',
          'comunidad_activa'
        ]
      }
    };

    this.emailTemplates = this.initializeEmailTemplates();
    this.notificationTemplates = this.initializeNotificationTemplates();
    this.contentLibrary = this.initializeContentLibrary();
  }

  // Función principal que se ejecuta cuando se detecta una etapa
  async triggerAutomation(journeyStage, userProfile, assistantId) {
    console.log(`🤖 [AUTOMATION] Iniciando automatización para etapa: ${journeyStage}`);

    const automation = this.automationTriggers[journeyStage];
    if (!automation) {
      console.log(`⚠️ [AUTOMATION] No hay automatización definida para: ${journeyStage}`);
      return;
    }

    console.log(`✅ [AUTOMATION] Ejecutando automatización interna para: ${journeyStage}`);
    console.log(`📋 [AUTOMATION] Acciones programadas:`, automation.actions);

    // Ejecutar todas las acciones automáticas para esta etapa
    const results = await Promise.allSettled(
      automation.actions.map(action => this.executeAction(action, userProfile, assistantId))
    );

    // Log de resultados
    results.forEach((result, index) => {
      const action = automation.actions[index];
      if (result.status === 'fulfilled') {
        console.log(`✅ [AUTOMATION] ${action} ejecutado exitosamente`);
      } else {
        console.error(`❌ [AUTOMATION] Error en ${action}:`, result.reason);
      }
    });

    return {
      stage: journeyStage,
      actionsExecuted: automation.actions,
      needsN8n: automation.needsN8n,
      results: results.map((r, i) => ({
        action: automation.actions[i],
        success: r.status === 'fulfilled',
        result: r.status === 'fulfilled' ? r.value : r.reason
      }))
    };
  }

  // Ejecutar una acción específica
  async executeAction(action, userProfile, assistantId) {
    switch (action) {
      // DESCUBRIMIENTO
      case 'captura_leads':
        return await this.captureLeads(userProfile);
      case 'envio_emails_automaticos':
        return await this.sendAutomatedEmails(userProfile, 'descubrimiento');
      case 'landing_page_personalizada':
        return await this.generatePersonalizedLanding(userProfile);
      case 'formulario_contacto':
        return await this.presentContactForm(userProfile);

      // INTERÉS
      case 'programar_mini_historias':
        return await this.scheduleMiniStories(userProfile);
      case 'clips_virales':
        return await this.suggestViralClips(userProfile);
      case 'notificaciones_push':
        return await this.sendPushNotifications(userProfile, 'interes');
      case 'contenido_personalizado':
        return await this.generatePersonalizedContent(userProfile);

      // CONSIDERACIÓN
      case 'mostrar_testimonios':
        return await this.showTestimonials(userProfile);
      case 'notificaciones_monetizacion':
        return await this.sendMonetizationNotifications(userProfile);
      case 'casos_exito_reales':
        return await this.presentSuccessCases(userProfile);
      case 'calculadora_roi':
        return await this.presentROICalculator(userProfile);

      // REGISTRO
      case 'onboarding_automatico':
        return await this.startOnboarding(userProfile);
      case 'tutorial_inicial':
        return await this.presentInitialTutorial(userProfile);
      case 'recordatorios_configuracion':
        return await this.scheduleConfigurationReminders(userProfile);
      case 'guia_primera_transmision':
        return await this.presentFirstStreamGuide(userProfile);

      // PARTICIPACIÓN
      case 'notificaciones_internas':
        return await this.sendInternalNotifications(userProfile);
      case 'mini_retos':
        return await this.createMiniChallenges(userProfile);
      case 'gamificacion':
        return await this.activateGamification(userProfile);
      case 'recomendaciones_clips':
        return await this.recommendClips(userProfile);
      case 'alertas_pedidos':
        return await this.setupOrderAlerts(userProfile);

      // RETENCIÓN
      case 'invitaciones_eventos':
        return await this.sendEventInvitations(userProfile);
      case 'incentivos_fidelidad':
        return await this.activateLoyaltyIncentives(userProfile);
      case 'tips_personalizados':
        return await this.sendPersonalizedTips(userProfile);
      case 'comunidad_activa':
        return await this.activateCommunityFeatures(userProfile);

      default:
        throw new Error(`Acción no implementada: ${action}`);
    }
  }

  // =====================================================
  // AUTOMATIZACIONES DESCUBRIMIENTO
  // =====================================================

  async captureLeads(userProfile) {
    console.log(`📧 [LEADS] Capturando lead para usuario: ${userProfile.email || userProfile.id}`);

    // Simular captura de lead con datos del usuario
    const leadData = {
      id: `lead_${Date.now()}`,
      email: userProfile.email,
      stage: 'descubrimiento',
      source: 'alpaso-assistant',
      interests: ['marketing_coffee', 'live_streaming'],
      capturedAt: new Date(),
      nextFollowUp: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    };

    // En un sistema real, aquí guardarías en BD
    console.log(`✅ [LEADS] Lead capturado:`, leadData);
    return leadData;
  }

  async sendAutomatedEmails(userProfile, stage) {
    console.log(`📧 [EMAIL] Enviando email automatizado para etapa: ${stage}`);

    const template = this.emailTemplates[stage];
    const personalizedEmail = {
      to: userProfile.email,
      subject: template.subject,
      body: template.body.replace('{{nombre}}', userProfile.name || 'Barista'),
      scheduledFor: new Date(),
      type: 'automated_sequence'
    };

    // Simular envío de email
    console.log(`📧 [EMAIL] Email programado:`, personalizedEmail.subject);
    return personalizedEmail;
  }

  async generatePersonalizedLanding(userProfile) {
    console.log(`🎯 [LANDING] Generando landing personalizada`);

    const landingConfig = {
      userId: userProfile.id,
      template: 'barista_discovery',
      personalizations: {
        name: userProfile.name,
        location: userProfile.location,
        interests: userProfile.interests || ['coffee', 'streaming']
      },
      cta: 'Comenzar mi transmisión ahora',
      testimonials: this.contentLibrary.testimonials.slice(0, 3)
    };

    console.log(`🎯 [LANDING] Landing configurada para: ${userProfile.name}`);
    return landingConfig;
  }

  async presentContactForm(userProfile) {
    console.log(`📋 [FORM] Presentando formulario de contacto`);

    const formConfig = {
      type: 'contact_discovery',
      fields: ['name', 'email', 'phone', 'coffee_experience', 'streaming_goal'],
      prefilled: {
        email: userProfile.email,
        name: userProfile.name
      },
      submitAction: 'schedule_consultation'
    };

    return formConfig;
  }

  // =====================================================
  // AUTOMATIZACIONES INTERÉS
  // =====================================================

  async scheduleMiniStories(userProfile) {
    console.log(`📚 [STORIES] Programando mini-historias`);

    const stories = [
      {
        title: "Captain Espresso y la Taza Perdida",
        content: "Descubre cómo Captain Espresso salvó su cafetería con una transmisión épica...",
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
        type: 'mini_story'
      },
      {
        title: "Cappu Ninja: De 0 a 1000 seguidores",
        content: "La increíble historia de cómo Cappu Ninja conquistó las redes...",
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        type: 'success_story'
      }
    ];

    console.log(`📚 [STORIES] ${stories.length} historias programadas`);
    return stories;
  }

  async suggestViralClips(userProfile) {
    console.log(`🎬 [CLIPS] Sugiriendo clips virales`);

    const clipSuggestions = [
      {
        title: "5 trucos de latte art que nadie te enseñó",
        duration: "60 segundos",
        trending: true,
        engagement_potential: "alto"
      },
      {
        title: "Reacción en vivo: Cliente prueba café especial",
        duration: "45 segundos",
        trending: true,
        engagement_potential: "muy alto"
      }
    ];

    return clipSuggestions;
  }

  async sendPushNotifications(userProfile, stage) {
    console.log(`🔔 [PUSH] Enviando notificación para etapa: ${stage}`);

    const notification = this.notificationTemplates[stage];
    const pushMessage = {
      title: notification.title,
      body: notification.body,
      icon: '/icons/coffee-notification.png',
      scheduledFor: new Date(),
      targetUser: userProfile.id
    };

    console.log(`🔔 [PUSH] Notificación enviada: ${pushMessage.title}`);
    return pushMessage;
  }

  // =====================================================
  // AUTOMATIZACIONES CONSIDERACIÓN
  // =====================================================

  async showTestimonials(userProfile) {
    console.log(`⭐ [TESTIMONIALS] Mostrando testimonios relevantes`);

    const relevantTestimonials = this.contentLibrary.testimonials.filter(t =>
      t.category === 'roi' || t.category === 'success'
    );

    return {
      testimonials: relevantTestimonials,
      displayType: 'carousel',
      autoAdvance: true,
      duration: 5000
    };
  }

  async sendMonetizationNotifications(userProfile) {
    console.log(`💰 [MONETIZATION] Enviando notificaciones de monetización`);

    const notifications = [
      {
        type: 'earning_potential',
        message: "Baristas como tú ganan $500+ mensuales en promedio",
        cta: "Ver calculadora de ingresos",
        scheduledFor: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
      },
      {
        type: 'success_alert',
        message: "🎉 María acaba de recibir $50 en regalos durante su transmisión",
        cta: "Ver cómo lo hizo",
        scheduledFor: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 horas
      }
    ];

    return notifications;
  }

  // =====================================================
  // AUTOMATIZACIONES REGISTRO
  // =====================================================

  async startOnboarding(userProfile) {
    console.log(`🚀 [ONBOARDING] Iniciando onboarding automático`);

    const onboardingSteps = [
      {
        step: 1,
        title: "Configura tu perfil de barista",
        description: "Añade tu foto, experiencia y especialidades",
        estimated_time: "3 minutos"
      },
      {
        step: 2,
        title: "Configura tu espacio de transmisión",
        description: "Prueba tu cámara, micrófono y iluminación",
        estimated_time: "5 minutos"
      },
      {
        step: 3,
        title: "Tu primera transmisión de prueba",
        description: "Haz una transmisión de práctica de 2 minutos",
        estimated_time: "10 minutos"
      }
    ];

    return {
      totalSteps: onboardingSteps.length,
      currentStep: 1,
      steps: onboardingSteps,
      completionReward: "Insignia de Barista Nuevo"
    };
  }

  async presentInitialTutorial(userProfile) {
    console.log(`🎓 [TUTORIAL] Presentando tutorial inicial`);

    const tutorial = {
      type: 'interactive',
      modules: [
        "Configuración básica",
        "Tu primera transmisión",
        "Interacción con audiencia",
        "Recibir regalos y pedidos"
      ],
      duration: "15 minutos",
      format: "video_interactivo"
    };

    return tutorial;
  }

  // =====================================================
  // AUTOMATIZACIONES PARTICIPACIÓN
  // =====================================================

  async createMiniChallenges(userProfile) {
    console.log(`🏆 [CHALLENGES] Creando mini-retos`);

    const challenges = [
      {
        title: "Reto del Latte Art",
        description: "Crea 3 diseños diferentes en una transmisión",
        reward: "100 puntos + insignia de artista",
        duration: "3 días"
      },
      {
        title: "Conexión con la audiencia",
        description: "Responde a 10 comentarios durante una transmisión",
        reward: "50 puntos + boost de visibilidad",
        duration: "1 día"
      }
    ];

    return challenges;
  }

  async activateGamification(userProfile) {
    console.log(`🎮 [GAMIFICATION] Activando sistema de gamificación`);

    const gamificationElements = {
      points: 0,
      level: 1,
      badges: [],
      achievements: [
        "Primera transmisión",
        "Primer regalo recibido",
        "10 seguidores",
        "Transmisión de 1 hora"
      ],
      leaderboard_position: null,
      next_reward: "Insignia de Barista Dedicado (nivel 5)"
    };

    return gamificationElements;
  }

  // =====================================================
  // AUTOMATIZACIONES RETENCIÓN
  // =====================================================

  async sendEventInvitations(userProfile) {
    console.log(`🎪 [EVENTS] Enviando invitaciones a eventos`);

    const upcomingEvents = [
      {
        title: "Competencia Semanal de Latte Art",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días
        prize: "$200 al ganador",
        participants: 45
      },
      {
        title: "Mesa Redonda: Monetización Avanzada",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        expert: "María González - Top Barista",
        type: "educational"
      }
    ];

    return upcomingEvents;
  }

  async activateLoyaltyIncentives(userProfile) {
    console.log(`💎 [LOYALTY] Activando incentivos de fidelidad`);

    const loyaltyProgram = {
      tier: "Barista Bronze",
      points: 150,
      benefits: [
        "5% descuento en productos",
        "Acceso a eventos exclusivos",
        "Soporte prioritario"
      ],
      nextTier: "Barista Silver (300 puntos)",
      specialOffers: [
        {
          title: "Doble puntos este fin de semana",
          valid_until: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        }
      ]
    };

    return loyaltyProgram;
  }

  // =====================================================
  // INICIALIZACIÓN DE TEMPLATES Y CONTENIDO
  // =====================================================

  initializeEmailTemplates() {
    return {
      descubrimiento: {
        subject: "{{nombre}}, descubre cómo convertir tu pasión por el café en ingresos",
        body: `Hola {{nombre}},\n\nVi que estás interesado en mostrar tu talento como barista...\n\n¿Sabías que puedes ganar dinero transmitiendo en vivo mientras preparas café?\n\nMañana te envío 3 estrategias simples para empezar.\n\n¡Saludos!\nEquipo Alpaso`
      },
      interes: {
        subject: "Las 3 historias de éxito que te van a inspirar",
        body: `Hola {{nombre}},\n\nTe prometí 3 historias increíbles:\n\n1. Captain Espresso: De mesero a influencer del café\n2. Cappu Ninja: $800 en su primera semana\n3. La Barista Dorada: Comunidad de 10k seguidores\n\n¿Cuál te inspira más?`
      },
      consideracion: {
        subject: "Calculadora: ¿Cuánto podrías ganar transmitiendo?",
        body: `{{nombre}}, basado en tu perfil, podrías ganar entre $300-700 mensuales.\n\nVe la calculadora personalizada y testimonios reales de baristas como tú.`
      }
    };
  }

  initializeNotificationTemplates() {
    return {
      interes: {
        title: "🎬 Nueva historia disponible",
        body: "Captain Espresso acaba de subir un nuevo episodio. ¡No te lo pierdas!"
      },
      consideracion: {
        title: "💰 Oportunidad de ingresos",
        body: "Ana ganó $85 ayer en su transmisión de 2 horas. ¿Quieres saber cómo?"
      },
      participacion: {
        title: "🏆 ¡Nuevo reto disponible!",
        body: "Participa en el reto de Latte Art y gana 100 puntos"
      }
    };
  }

  initializeContentLibrary() {
    return {
      testimonials: [
        {
          name: "María González",
          earning: "$650/mes",
          quote: "En 3 meses pasé de 0 a tener una comunidad fiel que ama mi café",
          category: "success",
          video_url: "/testimonials/maria.mp4"
        },
        {
          name: "Carlos Mendoza",
          earning: "$400/mes",
          quote: "Lo mejor es que puedo trabajar desde mi propia cafetería",
          category: "roi",
          video_url: "/testimonials/carlos.mp4"
        },
        {
          name: "Ana Rodríguez",
          earning: "$800/mes",
          quote: "Mis transmisiones se volvieron el evento semanal de mis clientes",
          category: "community",
          video_url: "/testimonials/ana.mp4"
        }
      ],
      miniStories: [
        {
          character: "Captain Espresso",
          episode: 1,
          title: "El Origen del Héroe del Café",
          content: "Todo comenzó cuando Captain Espresso descubrió que podía conectar con amantes del café de todo el mundo..."
        }
      ]
    };
  }
}

export const baristaAutomation = new BaristaJourneyAutomation();
