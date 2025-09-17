import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, Wifi, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
`;

const HeroSection = styled(motion.section)`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #00d4ff, #ffd700, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const AssistantsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AssistantCard = styled(motion.div)<{ $color: string }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.$color};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color};
  }
`;

const AssistantIcon = styled.div<{ $color: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: ${props => props.$color};
`;

const AssistantName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const AssistantRole = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AssistantDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ChatButton = styled(motion.button)<{ $color: string }>`
  width: 100%;
  background: ${props => props.$color};
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$color}dd;
    transform: scale(1.02);
  }
`;

const StatsSection = styled(motion.section)`
  padding: 4rem 2rem;
  background: rgba(0, 0, 0, 0.2);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 1.5rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #00d4ff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const assistants = [
  {
    id: 'stark',
    name: 'Stark',
    role: 'Marketing Assistant',
    description: 'Especialista en campañas creativas, redes sociales y growth hacking. Con personalidad innovadora y un toque sarcástico.',
    icon: Zap,
    color: '#ffd700',
    path: '/stark',
    personality: 'Creativo, innovador, sarcástico'
  },
  {
    id: 'cap',
    name: 'Cap',
    role: 'Support Assistant',
    description: 'Experto confiable en soporte al cliente y resolución de problemas. Siempre paciente y profesional.',
    icon: Shield,
    color: '#1e40af',
    path: '/cap',
    personality: 'Confiable, paciente, profesional'
  },
  {
    id: 'spidey',
    name: 'Spidey',
    role: 'Pre-sales Assistant',
    description: 'Tu amigo juvenil para primeros contactos y calificación de leads. Rápido, amigable y lleno de energía.',
    icon: Wifi,
    color: '#dc2626',
    path: '/spidey',
    personality: 'Juvenil, rápido, amigable'
  }
];

const stats = [
  { number: '10K+', label: 'Conversaciones', icon: Users },
  { number: '95%', label: 'Satisfacción', icon: Star },
  { number: '24/7', label: 'Disponibilidad', icon: TrendingUp }
];

function HomePage() {
  return (
    <PageContainer>
      <HeroSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Equipo de Asistentes Virtuales Marvel
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Conoce a Stark, Cap y Spidey - tu equipo especializado para marketing, soporte y ventas,
          cada uno con personalidad única y superpoderes digitales.
        </HeroSubtitle>
      </HeroSection>

      <AssistantsGrid
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {assistants.map((assistant, index) => {
          const Icon = assistant.icon;
          return (
            <AssistantCard
              key={assistant.id}
              $color={assistant.color}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <AssistantIcon $color={assistant.color}>
                <Icon size={32} />
              </AssistantIcon>
              <AssistantName>{assistant.name}</AssistantName>
              <AssistantRole>{assistant.role}</AssistantRole>
              <AssistantDescription>{assistant.description}</AssistantDescription>
              <ChatButton
                as={Link}
                to={assistant.path}
                $color={assistant.color}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Hablar con {assistant.name}
                <ArrowRight size={18} />
              </ChatButton>
            </AssistantCard>
          );
        })}
      </AssistantsGrid>

      <StatsSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <StatsGrid>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StatCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 + index * 0.2 }}
              >
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            );
          })}
        </StatsGrid>
      </StatsSection>
    </PageContainer>
  );
}

export default HomePage;
