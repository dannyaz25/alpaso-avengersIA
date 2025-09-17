import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Coffee,
  Users,
  DollarSign,
  Play,
  Star,
  ArrowRight,
  Check,
  Zap,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: #ffffff;
  margin-bottom: 1.5rem;
  font-weight: 800;
  line-height: 1.2;

  .highlight {
    background: linear-gradient(135deg, #ffd700, #ffed4a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem auto;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
  }
`;

const StatsSection = styled.section`
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.02);
`;

const StatsGrid = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatNumber = styled.h3`
  font-size: 2.5rem;
  color: #10b981;
  margin-bottom: 0.5rem;
  font-weight: 800;
`;

const StatLabel = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const TestimonialsSection = styled.section`
  padding: 4rem 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
`;

const TestimonialsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const TestimonialAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const TestimonialName = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const TestimonialEarning = styled.div`
  color: #10b981;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TestimonialQuote = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  line-height: 1.5;
`;

const FormSection = styled.section`
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.02);
`;

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
`;

const FormSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }

  option {
    background: #1a1a3e;
    color: #ffffff;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  border: none;
  color: #1a1a1a;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(255, 215, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 1rem;
`;

const BenefitsSection = styled.section`
  padding: 4rem 2rem;
`;

const BenefitsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const BenefitCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const BenefitTitle = styled.h4`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const BenefitDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`;

interface LandingPageProps {
  etapa?: string;
  userId?: string;
}

const BaristaLandingPage: React.FC<LandingPageProps> = ({ etapa = 'descubrimiento', userId }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    experiencia_cafe: '',
    objetivo_streaming: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Cargar configuración de la landing page
    loadLandingConfig();
  }, [etapa]);

  const loadLandingConfig = async () => {
    try {
      const response = await fetch(`http://localhost:5004/api/automation/landing/${etapa}/${userId || ''}`);
      const data = await response.json();
      if (data.success) {
        setConfig(data.landingPage);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
      // Usar configuración por defecto
      setConfig(getDefaultConfig(etapa));
    }
  };

  const getDefaultConfig = (etapa: string) => {
    const configs = {
      descubrimiento: {
        title: 'Convierte tu pasión por el café en ingresos reales',
        subtitle: 'Únete a cientos de baristas que ya transmiten y monetizan su talento',
        cta: 'Comenzar gratis ahora',
        testimonials: [
          {
            name: "María González",
            earning: "$650/mes",
            quote: "En 3 meses pasé de 0 a tener una comunidad fiel que ama mi café"
          },
          {
            name: "Carlos Mendoza",
            earning: "$400/mes",
            quote: "Lo mejor es que puedo trabajar desde mi propia cafetería"
          }
        ]
      },
      interes: {
        title: 'Descubre las historias de éxito que te van a inspirar',
        subtitle: 'Captain Espresso, Cappu Ninja y más baristas comparten sus secretos',
        cta: 'Ver historias completas',
        testimonials: [
          {
            name: "Captain Espresso",
            earning: "$1,200/mes",
            quote: "De mesero a influencer del café en solo 3 meses"
          }
        ]
      },
      consideracion: {
        title: 'Calcula tu potencial de ingresos como barista streamer',
        subtitle: 'Descubre cuánto podrías ganar transmitiendo tu experiencia',
        cta: 'Calcular mis ingresos',
        testimonials: [
          {
            name: "Ana Rodríguez",
            earning: "$800/mes",
            quote: "Mis transmisiones se volvieron el evento semanal de mis clientes"
          }
        ]
      }
    };

    return configs[etapa] || configs.descubrimiento;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5004/api/automation/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          etapa_viaje: etapa
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        // Aquí podrías redirigir al dashboard de barista o mostrar siguiente paso
        setTimeout(() => {
          window.location.href = '/stark'; // Redirigir al asistente Stark
        }, 3000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      alert('Error enviando formulario. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!config) {
    return <div>Cargando...</div>;
  }

  return (
    <LandingContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {config.title.split(' ').map((word, index) =>
            word === 'café' || word === 'ingresos' || word === 'reales' ? (
              <span key={index} className="highlight">{word} </span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </HeroTitle>

        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {config.subtitle}
        </HeroSubtitle>

        <CTAButton
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Coffee size={20} />
          {config.cta}
          <ArrowRight size={20} />
        </CTAButton>
      </HeroSection>

      {/* Stats Section */}
      <StatsSection>
        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StatNumber>500+</StatNumber>
            <StatLabel>Baristas activos transmitiendo</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatNumber>$650</StatNumber>
            <StatLabel>Ingreso promedio mensual</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatNumber>10k+</StatNumber>
            <StatLabel>Espectadores conectados diariamente</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <StatNumber>98%</StatNumber>
            <StatLabel>Satisfacción de baristas</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Benefits Section */}
      <BenefitsSection>
        <SectionTitle>¿Por qué elegir Alpaso?</SectionTitle>

        <BenefitsGrid>
          <BenefitCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <BenefitIcon>
              <DollarSign size={24} color="white" />
            </BenefitIcon>
            <BenefitTitle>Monetización Directa</BenefitTitle>
            <BenefitDescription>
              Recibe regalos virtuales, pedidos directos y propinas durante tus transmisiones en vivo
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BenefitIcon>
              <Users size={24} color="white" />
            </BenefitIcon>
            <BenefitTitle>Comunidad Activa</BenefitTitle>
            <BenefitDescription>
              Conecta con amantes del café de todo el mundo y construye tu audiencia fiel
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <BenefitIcon>
              <Play size={24} color="white" />
            </BenefitIcon>
            <BenefitTitle>Fácil de Usar</BenefitTitle>
            <BenefitDescription>
              Configura tu transmisión en 5 minutos. No necesitas experiencia técnica
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <BenefitIcon>
              <TrendingUp size={24} color="white" />
            </BenefitIcon>
            <BenefitTitle>Crecimiento Asegurado</BenefitTitle>
            <BenefitDescription>
              Algoritmos inteligentes que impulsan tu contenido y aumentan tu alcance
            </BenefitDescription>
          </BenefitCard>
        </BenefitsGrid>
      </BenefitsSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <SectionTitle>Historias de éxito reales</SectionTitle>

        <TestimonialsGrid>
          {config.testimonials?.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <TestimonialAvatar>
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </TestimonialAvatar>
              <TestimonialName>{testimonial.name}</TestimonialName>
              <TestimonialEarning>{testimonial.earning}</TestimonialEarning>
              <TestimonialQuote>"{testimonial.quote}"</TestimonialQuote>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </TestimonialsSection>

      {/* Form Section */}
      <FormSection id="form-section">
        <FormContainer>
          {!isSubmitted ? (
            <>
              <FormTitle>🚀 Comienza tu viaje como barista streamer</FormTitle>

              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>Nombre completo *</FormLabel>
                    <FormInput
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Tu nombre completo"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Email *</FormLabel>
                    <FormInput
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu@email.com"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Teléfono</FormLabel>
                    <FormInput
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Ciudad *</FormLabel>
                    <FormInput
                      type="text"
                      required
                      value={formData.ciudad}
                      onChange={(e) => handleInputChange('ciudad', e.target.value)}
                      placeholder="Tu ciudad"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Experiencia con café *</FormLabel>
                    <FormSelect
                      required
                      value={formData.experiencia_cafe}
                      onChange={(e) => handleInputChange('experiencia_cafe', e.target.value)}
                    >
                      <option value="">Selecciona tu experiencia</option>
                      <option value="menos_1_ano">Menos de 1 año</option>
                      <option value="1_3_anos">1-3 años</option>
                      <option value="3_5_anos">3-5 años</option>
                      <option value="5_anos_mas">Más de 5 años</option>
                      <option value="profesional">Barista profesional certificado</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Objetivo principal *</FormLabel>
                    <FormSelect
                      required
                      value={formData.objetivo_streaming}
                      onChange={(e) => handleInputChange('objetivo_streaming', e.target.value)}
                    >
                      <option value="">¿Qué buscas lograr?</option>
                      <option value="ingresos_extra">Generar ingresos adicionales</option>
                      <option value="mostrar_talento">Mostrar mi talento al mundo</option>
                      <option value="construir_marca">Construir mi marca personal</option>
                      <option value="conectar_comunidad">Conectar con comunidad cafetera</option>
                      <option value="vender_productos">Vender mis productos de café</option>
                    </FormSelect>
                  </FormGroup>
                </FormGrid>

                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Procesando...' : config.form?.submitText || 'Quiero empezar ahora'}
                </SubmitButton>
              </form>
            </>
          ) : (
            <SuccessMessage
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 style={{ marginBottom: '1rem' }}>🎉 ¡Bienvenido a Alpaso!</h3>
              <p style={{ marginBottom: '1rem' }}>
                Hemos recibido tu información y te hemos enviado un email con los siguientes pasos.
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Te redirigiremos a tu asistente personal en unos segundos...
              </p>
            </SuccessMessage>
          )}
        </FormContainer>
      </FormSection>
    </LandingContainer>
  );
};

export default BaristaLandingPage;
