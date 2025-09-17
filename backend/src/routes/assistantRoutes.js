import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();

// GET /api/assistants - Obtener información de todos los asistentes
router.get('/', (req, res) => {
  const assistants = [
    {
      id: 'stark',
      name: 'Tony Stark',
      role: 'Marketing Assistant',
      personality: 'Creativo, innovador, sarcástico',
      specialties: ['Marketing Digital', 'Growth Hacking', 'Redes Sociales', 'Analytics'],
      avatar: '/avatars/stark.png',
      color: '#ffd700',
      status: 'online',
      greeting: 'Hola, soy Stark. No te voy a aburrir con discursos largos… vine a mostrarte cómo hacer que tu negocio brille como un reactor arc.'
    },
    {
      id: 'cap',
      name: 'Steve Rogers',
      role: 'Support Assistant',
      personality: 'Confiable, paciente, profesional',
      specialties: ['Soporte Técnico', 'Resolución de Problemas', 'Guías Paso a Paso', 'Atención al Cliente'],
      avatar: '/avatars/cap.png',
      color: '#1e40af',
      status: 'online',
      greeting: 'Hola, soy Cap. Estoy aquí para ayudarte en lo que necesites, paso a paso y sin complicaciones.'
    },
    {
      id: 'spidey',
      name: 'Peter Parker',
      role: 'Pre-sales Assistant',
      personality: 'Juvenil, rápido, amigable',
      specialties: ['Calificación de Leads', 'Demos de Producto', 'Información de Precios', 'Primer Contacto'],
      avatar: '/avatars/spidey.png',
      color: '#dc2626',
      status: 'online',
      greeting: '¡Ey! Soy Spidey, tu guía rápido para conocer Alpaso 🕷️. Prometo no colgarme de los techos mientras hablamos.'
    }
  ];

  res.json({
    success: true,
    assistants,
    totalAssistants: assistants.length
  });
});

// GET /api/assistants/:id - Obtener información específica de un asistente
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const assistantProfiles = {
    stark: {
      id: 'stark',
      name: 'Tony Stark',
      role: 'Marketing Assistant',
      description: 'Genio, multimillonario, filántropo... y experto en marketing digital',
      personality: {
        traits: ['Creativo', 'Innovador', 'Sarcástico', 'Confiado'],
        tone: 'Seguro con chispa',
        approach: 'Orientado a resultados y métricas'
      },
      capabilities: [
        'Estrategias de marketing digital',
        'Campañas en redes sociales',
        'Growth hacking',
        'Análisis de competencia',
        'Optimización de conversiones',
        'Métricas y ROI'
      ],
      quickActions: [
        'Crear campaña de marketing',
        'Analizar competencia',
        'Ideas para redes sociales',
        'Estrategia de growth',
        'Métricas de ROI'
      ],
      avatar: '/avatars/stark.png',
      color: '#ffd700',
      status: 'online'
    },
    cap: {
      id: 'cap',
      name: 'Steve Rogers',
      role: 'Support Assistant',
      description: 'El soldado perfecto especializado en soporte al cliente',
      personality: {
        traits: ['Confiable', 'Paciente', 'Profesional', 'Determinado'],
        tone: 'Formal pero cercano',
        approach: 'Metódico y paso a paso'
      },
      capabilities: [
        'Soporte técnico especializado',
        'Resolución de problemas',
        'Guías paso a paso',
        'Configuración de sistemas',
        'Troubleshooting avanzado',
        'Escalación a soporte humano'
      ],
      quickActions: [
        'Reportar un problema',
        'Ayuda con mi cuenta',
        'Guía paso a paso',
        'Contactar soporte humano',
        'Estado del sistema'
      ],
      avatar: '/avatars/cap.png',
      color: '#1e40af',
      status: 'online'
    },
    spidey: {
      id: 'spidey',
      name: 'Peter Parker',
      role: 'Pre-sales Assistant',
      description: 'Tu vecino amigable especializado en ventas',
      personality: {
        traits: ['Juvenil', 'Rápido', 'Amigable', 'Entusiasta'],
        tone: 'Fresco y ligero',
        approach: 'Como un amigo que recomienda'
      },
      capabilities: [
        'Calificación de leads',
        'Demostraciones de producto',
        'Información de planes y precios',
        'Casos de éxito',
        'Comparativas de productos',
        'Conexión con especialistas'
      ],
      quickActions: [
        'Ver planes disponibles',
        'Solicitar demo gratuito',
        'Comparar precios',
        'Hablar con un experto',
        'Casos de éxito'
      ],
      avatar: '/avatars/spidey.png',
      color: '#dc2626',
      status: 'online'
    }
  };

  const assistant = assistantProfiles[id];

  if (!assistant) {
    return res.status(404).json({
      success: false,
      message: 'Asistente no encontrado'
    });
  }

  res.json({
    success: true,
    assistant
  });
});

// POST /api/assistants/:id/status - Actualizar estado del asistente (para uso interno)
router.post('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['online', 'offline', 'busy'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Estado no válido'
    });
  }

  logger.info(`Estado del asistente ${id} actualizado a ${status}`);

  res.json({
    success: true,
    message: `Estado del asistente ${id} actualizado`,
    assistantId: id,
    newStatus: status,
    timestamp: new Date()
  });
});

export default router;
