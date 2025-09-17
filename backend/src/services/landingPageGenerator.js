// Servicio para generar landing pages dinámicas según la etapa del barista
import { automationConfigService } from './automationConfigService.js';

class LandingPageGenerator {
  constructor() {
    this.templates = {
      descubrimiento: {
        hero: {
          title: "Convierte tu pasión por el café en {highlight}ingresos reales{/highlight}",
          subtitle: "Únete a más de 500 baristas que ya transmiten en vivo y monetizan su talento",
          videoUrl: "https://alpaso.com/videos/barista-success.mp4",
          backgroundImage: "/images/coffee-streaming-bg.jpg"
        },
        benefits: [
          {
            icon: "DollarSign",
            title: "Gana $400-800 mensuales",
            description: "Monetiza tu experiencia con regalos virtuales, propinas y pedidos directos"
          },
          {
            icon: "Users",
            title: "Construye tu comunidad",
            description: "Conecta con amantes del café de todo el mundo y crea seguidores fieles"
          },
          {
            icon: "Play",
            title: "Fácil configuración",
            description: "Comienza a transmitir en 5 minutos, sin experiencia técnica necesaria"
          },
          {
            icon: "TrendingUp",
            title: "Crecimiento garantizado",
            description: "Algoritmos inteligentes que impulsan tu contenido automáticamente"
          }
        ],
        social_proof: {
          stats: [
            { number: "500+", label: "Baristas activos" },
            { number: "$650", label: "Ingreso promedio mensual" },
            { number: "10k+", label: "Espectadores diarios" },
            { number: "98%", label: "Satisfacción de usuarios" }
          ]
        },
        form: {
          title: "🚀 Comienza tu viaje como barista streamer",
          subtitle: "Completa tus datos y recibe tu guía gratuita para empezar",
          cta: "Quiero empezar gratis"
        }
      },
      interes: {
        hero: {
          title: "Descubre las {highlight}historias épicas{/highlight} de nuestros baristas",
          subtitle: "Captain Espresso, Cappu Ninja y más héroes del café comparten sus secretos de éxito",
          videoUrl: "https://alpaso.com/videos/success-stories.mp4"
        },
        success_stories: [
          {
            character: "Captain Espresso",
            real_name: "José García",
            location: "Madrid, España",
            achievement: "De mesero a $1,200 mensuales",
            story: "Comenzó transmitiendo desde la cafetería donde trabajaba. En 3 meses construyó una audiencia de 5k seguidores fieles que aman sus técnicas de espresso.",
            quote: "Alpaso me cambió la vida. Ahora tengo mi propia marca y mis clientes me siguen por mi personalidad.",
            timeline: "3 meses para llegar a $1,200/mes"
          },
          {
            character: "Cappu Ninja",
            real_name: "Ana Martínez",
            location: "Bogotá, Colombia",
            achievement: "10k seguidores en 6 semanas",
            story: "Especialista en latte art, sus transmisiones se volvieron virales cuando creó diseños únicos en vivo.",
            quote: "Lo que más me gusta es que puedo enseñar mi arte y al mismo tiempo ganar dinero.",
            timeline: "6 semanas para 10k seguidores"
          },
          {
            character: "La Barista Dorada",
            real_name: "María López",
            location: "México DF, México",
            achievement: "Comunidad de café más grande de LATAM",
            story: "Creó la comunidad de café más activa de Latinoamérica con transmisiones diarias de cata y preparación.",
            quote: "Mis transmisiones se convirtieron en el evento favorito de mis 15k seguidores.",
            timeline: "8 meses para 15k comunidad activa"
          }
        ],
        form: {
          title: "🎬 Quiero ver las historias completas",
          subtitle: "Accede a videos exclusivos, entrevistas y tutoriales de nuestros top baristas",
          cta: "Ver historias gratis"
        }
      },
      consideracion: {
        hero: {
          title: "{highlight}¿Vale la pena?{/highlight} Calcula tu potencial real de ingresos",
          subtitle: "Descubre exactamente cuánto podrías ganar según tu experiencia y ubicación",
          calculator: true
        },
        roi_calculator: {
          factors: [
            { name: "Experiencia", options: ["Principiante", "Intermedio", "Avanzado", "Profesional"] },
            { name: "Horas semanales", options: ["5-10h", "10-20h", "20-30h", "30h+"] },
            { name: "Ubicación", options: ["Latinoamérica", "España", "Estados Unidos", "Otro"] },
            { name: "Especialidad", options: ["Espresso", "Latte Art", "Cata", "Tostado"] }
          ],
          results: {
            conservador: { min: 200, max: 400 },
            realista: { min: 400, max: 700 },
            optimista: { min: 700, max: 1200 }
          }
        },
        testimonials_roi: [
          {
            name: "María González",
            experience: "3 años",
            hours: "15h/semana",
            earning: "$650/mes",
            quote: "Superé mis expectativas iniciales en solo 2 meses"
          },
          {
            name: "Carlos Mendoza",
            experience: "5 años",
            hours: "20h/semana",
            earning: "$850/mes",
            quote: "Ahora gano más transmitiendo que en mi trabajo anterior"
          }
        ],
        form: {
          title: "💰 Quiero calcular mis ingresos potenciales",
          subtitle: "Recibe tu análisis personalizado y plan de monetización",
          cta: "Calcular mi potencial"
        }
      }
    };

    this.personalizations = {
      location_greetings: {
        "México": "¡Hola paisano!",
        "Colombia": "¡Hola parcero!",
        "España": "¡Hola compañero!",
        "Argentina": "¡Hola che!",
        "default": "¡Hola!"
      },
      currency_formats: {
        "México": "MX$",
        "Colombia": "COL$",
        "España": "€",
        "Argentina": "AR$",
        "default": "USD$"
      }
    };
  }

  async generateLandingPage(etapa, userProfile = null) {
    console.log(`🎯 [LANDING] Generando landing page para etapa: ${etapa}`);

    try {
      // Obtener configuración actual
      const config = await automationConfigService.getConfig();
      const template = this.templates[etapa];

      if (!template) {
        throw new Error(`Template no encontrado para etapa: ${etapa}`);
      }

      // Personalizar según perfil del usuario
      const personalizedLanding = this.personalizeLanding(template, userProfile, etapa);

      // Combinar con configuración del dashboard
      const finalLanding = {
        ...personalizedLanding,
        config: config?.landingPages?.[etapa] || {},
        form: config?.forms?.contacto || template.form,
        metadata: {
          etapa,
          generatedAt: new Date(),
          userId: userProfile?.id,
          personalized: !!userProfile
        }
      };

      console.log(`✅ [LANDING] Landing page generada para: ${etapa}`);
      return finalLanding;

    } catch (error) {
      console.error(`❌ [LANDING] Error generando landing para ${etapa}:`, error);
      throw error;
    }
  }

  personalizeLanding(template, userProfile, etapa) {
    if (!userProfile) {
      return template;
    }

    console.log(`🎨 [PERSONALIZATION] Personalizando landing para: ${userProfile.name}`);

    // Personalizar saludo según ubicación
    const greeting = this.personalizations.location_greetings[userProfile.location] ||
                    this.personalizations.location_greetings.default;

    // Personalizar moneda según ubicación
    const currency = this.personalizations.currency_formats[userProfile.location] ||
                    this.personalizations.currency_formats.default;

    // Clonar template para modificar
    const personalized = JSON.parse(JSON.stringify(template));

    // Personalizar hero
    if (personalized.hero) {
      personalized.hero.greeting = greeting;
      personalized.hero.title = personalized.hero.title.replace('{nombre}', userProfile.name || '');
    }

    // Personalizar stats con moneda local
    if (personalized.social_proof?.stats) {
      personalized.social_proof.stats = personalized.social_proof.stats.map(stat => {
        if (stat.label.includes('Ingreso') || stat.label.includes('mensual')) {
          return {
            ...stat,
            number: currency + stat.number.replace('$', '')
          };
        }
        return stat;
      });
    }

    // Personalizar calculadora ROI
    if (personalized.roi_calculator) {
      Object.keys(personalized.roi_calculator.results).forEach(scenario => {
        const result = personalized.roi_calculator.results[scenario];
        result.currency = currency;
      });
    }

    // Agregar testimonios relevantes según ubicación
    if (personalized.testimonials_roi) {
      personalized.testimonials_roi = this.filterTestimonialsByLocation(
        personalized.testimonials_roi,
        userProfile.location
      );
    }

    return personalized;
  }

  filterTestimonialsByLocation(testimonials, location) {
    // Priorizar testimonios de la misma región
    const regionMap = {
      "México": ["México", "CDMX", "Guadalajara"],
      "Colombia": ["Bogotá", "Medellín", "Colombia"],
      "España": ["Madrid", "Barcelona", "España"],
      "Argentina": ["Buenos Aires", "Córdoba", "Argentina"]
    };

    const userRegion = Object.keys(regionMap).find(region =>
      regionMap[region].includes(location)
    );

    if (userRegion) {
      // Filtrar testimonios de la misma región primero
      const regionalTestimonials = testimonials.filter(t =>
        regionMap[userRegion].some(city => t.location?.includes(city))
      );

      if (regionalTestimonials.length > 0) {
        return regionalTestimonials;
      }
    }

    return testimonials;
  }

  async generateROICalculation(userInputs) {
    console.log('💰 [ROI] Calculando potencial de ingresos...', userInputs);

    const multipliers = {
      experiencia: {
        "Principiante": 0.7,
        "Intermedio": 1.0,
        "Avanzado": 1.3,
        "Profesional": 1.6
      },
      horas: {
        "5-10h": 0.5,
        "10-20h": 1.0,
        "20-30h": 1.5,
        "30h+": 2.0
      },
      ubicacion: {
        "Estados Unidos": 1.5,
        "España": 1.2,
        "México": 1.0,
        "Colombia": 0.8,
        "Argentina": 0.9,
        "Otro": 1.0
      },
      especialidad: {
        "Latte Art": 1.3,
        "Cata": 1.2,
        "Espresso": 1.1,
        "Tostado": 1.4
      }
    };

    const baseIncome = 400; // Ingreso base mensual

    const experienceMultiplier = multipliers.experiencia[userInputs.experiencia] || 1;
    const hoursMultiplier = multipliers.horas[userInputs.horas] || 1;
    const locationMultiplier = multipliers.ubicacion[userInputs.ubicacion] || 1;
    const specialtyMultiplier = multipliers.especialidad[userInputs.especialidad] || 1;

    const totalMultiplier = experienceMultiplier * hoursMultiplier * locationMultiplier * specialtyMultiplier;

    const estimatedIncome = Math.round(baseIncome * totalMultiplier);
    const range = {
      min: Math.round(estimatedIncome * 0.7),
      max: Math.round(estimatedIncome * 1.4)
    };

    return {
      estimated: estimatedIncome,
      range,
      breakdown: {
        base: baseIncome,
        multipliers: {
          experiencia: experienceMultiplier,
          horas: hoursMultiplier,
          ubicacion: locationMultiplier,
          especialidad: specialtyMultiplier
        },
        total_multiplier: totalMultiplier
      },
      comparison: {
        vs_traditional_job: estimatedIncome > 500 ? "Superior" : "Competitivo",
        vs_other_platforms: "25% más que plataformas tradicionales"
      },
      next_steps: [
        "Registrarte gratis en Alpaso",
        "Configurar tu perfil de barista",
        "Hacer tu primera transmisión de prueba",
        "Comenzar a recibir regalos y pedidos"
      ]
    };
  }

  generateDynamicContent(etapa, userProfile) {
    const contentVariations = {
      descubrimiento: {
        headlines: [
          "Convierte tu pasión por el café en ingresos reales",
          "Tu talento como barista vale oro - descubre cómo monetizarlo",
          "Miles de personas quieren aprender de ti - empieza hoy",
          "El streaming de café es el futuro - únete ahora"
        ],
        pain_points: [
          "¿Sientes que tu talento como barista no está siendo valorado?",
          "¿Quieres compartir tu pasión por el café con más personas?",
          "¿Te gustaría generar ingresos extra con tu conocimiento?",
          "¿Buscas una forma creativa de mostrar tus habilidades?"
        ],
        solutions: [
          "Transmite en vivo y muestra tus técnicas únicas",
          "Construye una audiencia fiel que valora tu experiencia",
          "Monetiza cada transmisión con regalos y pedidos",
          "Crea tu marca personal en el mundo del café"
        ]
      },
      interes: {
        success_hooks: [
          "Conoce a José: de barista a influencer en 90 días",
          "La historia de Ana: 10k seguidores con solo latte art",
          "Cómo María creó la comunidad de café más grande de LATAM",
          "El secreto de Carlos: $800 mensuales trabajando desde casa"
        ],
        engagement_triggers: [
          "🎬 Videos exclusivos de técnicas avanzadas",
          "📈 Gráficas reales de crecimiento de ingresos",
          "🏆 Ranking de baristas más exitosos",
          "💡 Tips secretos que solo conocen los profesionales"
        ]
      },
      consideracion: {
        objection_handlers: [
          {
            objection: "No tengo tiempo suficiente",
            response: "Nuestros baristas exitosos transmiten solo 2-3 horas por semana"
          },
          {
            objection: "No sé si funcionará en mi país",
            response: "Tenemos baristas exitosos en 15+ países de habla hispana"
          },
          {
            objection: "No tengo experiencia en streaming",
            response: "El 85% de nuestros usuarios nunca había hecho streaming antes"
          },
          {
            objection: "No sé si la gente pagará por ver café",
            response: "El mercado de contenido de café genera $50M+ anuales globalmente"
          }
        ],
        urgency_creators: [
          "Solo quedan 50 spots para el programa beta gratuito",
          "Oferta especial: Sin comisiones los primeros 3 meses",
          "Los primeros 100 baristas reciben mentoría 1:1 gratuita",
          "Acceso anticipado a herramientas premium por tiempo limitado"
        ]
      }
    };

    return contentVariations[etapa] || contentVariations.descubrimiento;
  }

  async generateSEOOptimizedContent(etapa, location = null) {
    const seoContent = {
      descubrimiento: {
        title: `Barista Streaming ${location ? `en ${location}` : ''} | Alpaso - Monetiza tu Café`,
        description: `Únete a 500+ baristas que ganan $400-800 mensuales transmitiendo su pasión por el café. Comienza gratis hoy.`,
        keywords: ["barista streaming", "monetizar café", "transmisión en vivo café", "ingresos barista", "streaming coffee"],
        canonical: `/landing/descubrimiento${location ? `?location=${location}` : ''}`
      },
      interes: {
        title: `Historias de Éxito | Baristas que Cambiaron su Vida | Alpaso`,
        description: `Conoce las historias reales de Captain Espresso, Cappu Ninja y más baristas que ahora ganan $1000+ mensuales.`,
        keywords: ["casos éxito baristas", "historias coffee streaming", "baristas exitosos", "captain espresso"],
        canonical: `/landing/interes`
      },
      consideracion: {
        title: `Calculadora de Ingresos para Baristas | ¿Cuánto Puedes Ganar? | Alpaso`,
        description: `Calcula tu potencial real de ingresos como barista streamer. Análisis personalizado basado en tu experiencia.`,
        keywords: ["calculadora ingresos barista", "cuanto gana barista streaming", "roi barista", "potencial ingresos café"],
        canonical: `/landing/consideracion`
      }
    };

    return seoContent[etapa] || seoContent.descubrimiento;
  }
}

export const landingPageGenerator = new LandingPageGenerator();
