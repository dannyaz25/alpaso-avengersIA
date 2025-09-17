// Sistema de Configuración de Automatización - Dashboard Admin
// Para gestionar emails, landing pages, formularios, y captura de leads

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Mail,
  Layout,
  FileText,
  Database,
  Save,
  Eye,
  Edit,
  Plus,
  Trash2,
  Send,
  Users,
  BarChart3,
  Globe,
  Smartphone
} from 'lucide-react';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 800;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Tab = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active ?
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
    'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.2)'};
  color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ?
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
      'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-2px);
  }
`;

const ContentContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ConfigCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ConfigLabel = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
`;

const ConfigInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const ConfigTextarea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;
  min-height: 120px;
  resize: vertical;
  margin-bottom: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const ActionButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => {
    if (props.variant === 'danger') return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
    if (props.variant === 'secondary') return 'rgba(255, 255, 255, 0.1)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }};
  border: 1px solid ${props => {
    if (props.variant === 'danger') return '#ff6b6b';
    if (props.variant === 'secondary') return 'rgba(255, 255, 255, 0.2)';
    return '#667eea';
  }};
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const PreviewContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px dashed rgba(255, 255, 255, 0.2);
`;

const PreviewTitle = styled.h4`
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
`;

const PreviewContent = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  line-height: 1.4;
`;

interface AutomationConfig {
  emails: {
    descubrimiento: {
      subject: string;
      body: string;
      enabled: boolean;
    };
    interes: {
      subject: string;
      body: string;
      enabled: boolean;
    };
    consideracion: {
      subject: string;
      body: string;
      enabled: boolean;
    };
  };
  landingPages: {
    descubrimiento: {
      title: string;
      subtitle: string;
      cta: string;
      enabled: boolean;
    };
  };
  forms: {
    contacto: {
      fields: string[];
      submitText: string;
      enabled: boolean;
    };
  };
  leads: {
    database: {
      table: string;
      fields: string[];
      enabled: boolean;
    };
    external: {
      webhook: string;
      apiKey: string;
      enabled: boolean;
    };
  };
}

const AutomationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('emails');
  const [config, setConfig] = useState<AutomationConfig>({
    emails: {
      descubrimiento: {
        subject: '¡Bienvenido! Descubre cómo monetizar tu pasión por el café',
        body: `Hola {{nombre}},

¡Qué emocionante verte interesado en convertir tu talento como barista en una fuente de ingresos!

🎯 Te hemos preparado una guía especial:
• Cómo configurar tu primera transmisión en 5 minutos
• 3 estrategias para atraer tu primera audiencia
• Casos de éxito de baristas que ya ganan $500+ al mes

¿Listo para comenzar?

[COMENZAR AHORA]

¡Saludos!
Equipo Alpaso`,
        enabled: true
      },
      interes: {
        subject: '🎬 Las historias de Captain Espresso que te van a inspirar',
        body: `Hola {{nombre}},

Te prometí historias increíbles de baristas exitosos...

📚 Aquí tienes 3 mini-historias que cambiarán tu perspectiva:

1. **Captain Espresso**: De mesero a influencer del café (ganó $1,200 en su primer mes)
2. **Cappu Ninja**: Cómo conquistó 10k seguidores en 3 semanas
3. **La Barista Dorada**: Su secreto para fidelizar clientes

[VER HISTORIAS COMPLETAS]

¿Cuál te inspira más?`,
        enabled: true
      },
      consideracion: {
        subject: '💰 Calculadora: Tu potencial de ingresos como barista streaming',
        body: `{{nombre}}, basado en tu perfil, podrías ganar:

💵 **Estimación mensual: $400-800**

📊 Desglose:
• Transmisiones: $200-400/mes
• Regalos virtuales: $100-200/mes
• Pedidos directos: $100-200/mes

✅ Testimonios verificados:
• María (Bogotá): $650/mes
• Carlos (CDMX): $480/mes
• Ana (Madrid): $820/mes

[CALCULAR MIS INGRESOS]

¿Listo para empezar?`,
        enabled: true
      }
    },
    landingPages: {
      descubrimiento: {
        title: 'Convierte tu pasión por el café en ingresos reales',
        subtitle: 'Únete a cientos de baristas que ya transmiten y monetizan su talento',
        cta: 'Comenzar gratis ahora',
        enabled: true
      }
    },
    forms: {
      contacto: {
        fields: ['nombre', 'email', 'telefono', 'ciudad', 'experiencia_cafe', 'objetivo_streaming'],
        submitText: 'Quiero empezar ahora',
        enabled: true
      }
    },
    leads: {
      database: {
        table: 'barista_leads',
        fields: ['nombre', 'email', 'telefono', 'ciudad', 'experiencia', 'objetivo', 'etapa_viaje', 'fecha_captura'],
        enabled: true
      },
      external: {
        webhook: 'https://hooks.zapier.com/hooks/catch/your-webhook/',
        apiKey: '',
        enabled: false
      }
    }
  });

  const tabs = [
    { id: 'emails', label: 'Emails Automáticos', icon: Mail },
    { id: 'landing', label: 'Landing Pages', icon: Layout },
    { id: 'forms', label: 'Formularios', icon: FileText },
    { id: 'leads', label: 'Captura de Leads', icon: Database },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
  ];

  const updateConfig = (section: keyof AutomationConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const saveConfiguration = async () => {
    console.log('💾 Guardando configuración...', config);
    // Aquí enviarías la configuración al backend
    // await automationConfigService.save(config);
    alert('✅ Configuración guardada exitosamente');
  };

  const testEmail = async (emailType: string) => {
    console.log(`📧 Enviando email de prueba: ${emailType}`);
    // Aquí enviarías un email de prueba
    alert(`📧 Email de ${emailType} enviado a tu correo de prueba`);
  };

  const renderEmailsTab = () => (
    <div>
      <SectionTitle>
        <Mail size={24} />
        Configuración de Emails Automáticos
      </SectionTitle>

      {Object.entries(config.emails).map(([stage, emailConfig]) => (
        <ConfigCard key={stage}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#ffffff', textTransform: 'capitalize' }}>Email - {stage}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ActionButton
                variant="secondary"
                onClick={() => testEmail(stage)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={16} />
                Probar
              </ActionButton>
            </div>
          </div>

          <ConfigLabel>Asunto del Email</ConfigLabel>
          <ConfigInput
            value={emailConfig.subject}
            onChange={(e) => updateConfig('emails', stage, { ...emailConfig, subject: e.target.value })}
            placeholder="Asunto del email..."
          />

          <ConfigLabel>Cuerpo del Email</ConfigLabel>
          <ConfigTextarea
            value={emailConfig.body}
            onChange={(e) => updateConfig('emails', stage, { ...emailConfig, body: e.target.value })}
            placeholder="Contenido del email... Usa {{nombre}} para personalización"
          />

          <PreviewContainer>
            <PreviewTitle>Vista Previa:</PreviewTitle>
            <PreviewContent>
              <strong>Asunto:</strong> {emailConfig.subject}<br />
              <strong>Contenido:</strong> {emailConfig.body.substring(0, 100)}...
            </PreviewContent>
          </PreviewContainer>
        </ConfigCard>
      ))}
    </div>
  );

  const renderLandingTab = () => (
    <div>
      <SectionTitle>
        <Layout size={24} />
        Configuración de Landing Pages
      </SectionTitle>

      <ConfigGrid>
        <ConfigCard>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Landing Page - Descubrimiento</h3>

          <ConfigLabel>Título Principal</ConfigLabel>
          <ConfigInput
            value={config.landingPages.descubrimiento.title}
            onChange={(e) => updateConfig('landingPages', 'descubrimiento', {
              ...config.landingPages.descubrimiento,
              title: e.target.value
            })}
            placeholder="Título que capte la atención..."
          />

          <ConfigLabel>Subtítulo</ConfigLabel>
          <ConfigInput
            value={config.landingPages.descubrimiento.subtitle}
            onChange={(e) => updateConfig('landingPages', 'descubrimiento', {
              ...config.landingPages.descubrimiento,
              subtitle: e.target.value
            })}
            placeholder="Descripción convincente..."
          />

          <ConfigLabel>Texto del CTA</ConfigLabel>
          <ConfigInput
            value={config.landingPages.descubrimiento.cta}
            onChange={(e) => updateConfig('landingPages', 'descubrimiento', {
              ...config.landingPages.descubrimiento,
              cta: e.target.value
            })}
            placeholder="Texto del botón de acción..."
          />

          <ActionButton style={{ marginTop: '1rem' }}>
            <Eye size={16} />
            Vista Previa
          </ActionButton>
        </ConfigCard>

        <ConfigCard>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Configuración Avanzada</h3>

          <ConfigLabel>Imagen de Fondo URL</ConfigLabel>
          <ConfigInput
            placeholder="https://ejemplo.com/imagen.jpg"
          />

          <ConfigLabel>Video de Demostración URL</ConfigLabel>
          <ConfigInput
            placeholder="https://youtube.com/watch?v=..."
          />

          <ConfigLabel>Testimonios Destacados</ConfigLabel>
          <ConfigTextarea
            placeholder="JSON con testimonios a mostrar..."
          />
        </ConfigCard>
      </ConfigGrid>
    </div>
  );

  const renderFormsTab = () => (
    <div>
      <SectionTitle>
        <FileText size={24} />
        Configuración de Formularios
      </SectionTitle>

      <ConfigCard>
        <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Formulario de Contacto</h3>

        <ConfigLabel>Campos del Formulario</ConfigLabel>
        <div style={{ marginBottom: '1rem' }}>
          {config.forms.contacto.fields.map((field, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ConfigInput
                value={field}
                onChange={(e) => {
                  const newFields = [...config.forms.contacto.fields];
                  newFields[index] = e.target.value;
                  updateConfig('forms', 'contacto', {
                    ...config.forms.contacto,
                    fields: newFields
                  });
                }}
                placeholder="Nombre del campo..."
              />
              <ActionButton
                variant="danger"
                onClick={() => {
                  const newFields = config.forms.contacto.fields.filter((_, i) => i !== index);
                  updateConfig('forms', 'contacto', {
                    ...config.forms.contacto,
                    fields: newFields
                  });
                }}
              >
                <Trash2 size={16} />
              </ActionButton>
            </div>
          ))}
          <ActionButton
            variant="secondary"
            onClick={() => {
              updateConfig('forms', 'contacto', {
                ...config.forms.contacto,
                fields: [...config.forms.contacto.fields, 'nuevo_campo']
              });
            }}
          >
            <Plus size={16} />
            Agregar Campo
          </ActionButton>
        </div>

        <ConfigLabel>Texto del Botón de Envío</ConfigLabel>
        <ConfigInput
          value={config.forms.contacto.submitText}
          onChange={(e) => updateConfig('forms', 'contacto', {
            ...config.forms.contacto,
            submitText: e.target.value
          })}
          placeholder="Texto del botón..."
        />

        <PreviewContainer>
          <PreviewTitle>Vista Previa del Formulario:</PreviewTitle>
          <PreviewContent>
            {config.forms.contacto.fields.map((field, index) => (
              <div key={index} style={{ marginBottom: '0.5rem' }}>
                <strong>{field}:</strong> [Campo de entrada]
              </div>
            ))}
            <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(102, 126, 234, 0.2)', borderRadius: '4px' }}>
              {config.forms.contacto.submitText}
            </div>
          </PreviewContent>
        </PreviewContainer>
      </ConfigCard>
    </div>
  );

  const renderLeadsTab = () => (
    <div>
      <SectionTitle>
        <Database size={24} />
        Configuración de Captura de Leads
      </SectionTitle>

      <ConfigGrid>
        <ConfigCard>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Base de Datos Interna</h3>

          <ConfigLabel>Tabla de Destino</ConfigLabel>
          <ConfigInput
            value={config.leads.database.table}
            onChange={(e) => updateConfig('leads', 'database', {
              ...config.leads.database,
              table: e.target.value
            })}
            placeholder="Nombre de la tabla..."
          />

          <ConfigLabel>Campos a Guardar</ConfigLabel>
          <ConfigTextarea
            value={config.leads.database.fields.join(', ')}
            onChange={(e) => updateConfig('leads', 'database', {
              ...config.leads.database,
              fields: e.target.value.split(', ').filter(f => f.trim())
            })}
            placeholder="campo1, campo2, campo3..."
          />

          <div style={{ marginTop: '1rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
            ✅ Los leads se guardan automáticamente en tu base de datos MongoDB
          </div>
        </ConfigCard>

        <ConfigCard>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Integraciones Externas</h3>

          <ConfigLabel>Webhook URL (Zapier, n8n, etc.)</ConfigLabel>
          <ConfigInput
            value={config.leads.external.webhook}
            onChange={(e) => updateConfig('leads', 'external', {
              ...config.leads.external,
              webhook: e.target.value
            })}
            placeholder="https://hooks.zapier.com/..."
          />

          <ConfigLabel>API Key (si es necesario)</ConfigLabel>
          <ConfigInput
            type="password"
            value={config.leads.external.apiKey}
            onChange={(e) => updateConfig('leads', 'external', {
              ...config.leads.external,
              apiKey: e.target.value
            })}
            placeholder="Tu API key..."
          />

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <ActionButton variant="secondary">
              <Globe size={16} />
              Probar Webhook
            </ActionButton>
            <ActionButton variant="secondary">
              <Settings size={16} />
              Configurar n8n
            </ActionButton>
          </div>

          <div style={{ marginTop: '1rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
            💡 Opcional: Usar solo si necesitas enviar leads a CRM externo, Google Sheets, etc.
          </div>
        </ConfigCard>
      </ConfigGrid>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div>
      <SectionTitle>
        <BarChart3 size={24} />
        Analíticas de Automatización
      </SectionTitle>

      <ConfigGrid>
        <ConfigCard>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>📧 Emails Enviados</h3>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <div>Hoy: <strong>24 emails</strong></div>
            <div>Esta semana: <strong>156 emails</strong></div>
            <div>Tasa de apertura: <strong>68%</strong></div>
            <div>Tasa de click: <strong>23%</strong></div>
          </div>
        </ConfigCard>

        <ConfigCard>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>🎯 Landing Pages</h3>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <div>Visitas hoy: <strong>89 visitas</strong></div>
            <div>Conversión: <strong>15.7%</strong></div>
            <div>Tiempo promedio: <strong>2:34 min</strong></div>
            <div>Bounce rate: <strong>32%</strong></div>
          </div>
        </ConfigCard>

        <ConfigCard>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>📝 Formularios</h3>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <div>Formularios completados: <strong>14</strong></div>
            <div>Tasa de abandono: <strong>28%</strong></div>
            <div>Campo más problemático: <strong>teléfono</strong></div>
          </div>
        </ConfigCard>

        <ConfigCard>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>💾 Leads Capturados</h3>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <div>Leads hoy: <strong>14 nuevos</strong></div>
            <div>Total leads: <strong>287 leads</strong></div>
            <div>Calidad promedio: <strong>8.2/10</strong></div>
            <div>Conversión a cliente: <strong>23%</strong></div>
          </div>
        </ConfigCard>
      </ConfigGrid>
    </div>
  );

  return (
    <DashboardContainer>
      <Header>
        <Title>🤖 Dashboard de Automatización</Title>
        <Subtitle>
          Configura emails, landing pages, formularios y captura de leads para el viaje del barista
        </Subtitle>
      </Header>

      <TabsContainer>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent size={20} />
              {tab.label}
            </Tab>
          );
        })}
      </TabsContainer>

      <ContentContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'emails' && renderEmailsTab()}
            {activeTab === 'landing' && renderLandingTab()}
            {activeTab === 'forms' && renderFormsTab()}
            {activeTab === 'leads' && renderLeadsTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <ActionButton
            onClick={saveConfiguration}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save size={20} />
            Guardar Configuración
          </ActionButton>

          <ActionButton variant="secondary">
            <Eye size={20} />
            Vista Previa General
          </ActionButton>
        </div>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default AutomationDashboard;
