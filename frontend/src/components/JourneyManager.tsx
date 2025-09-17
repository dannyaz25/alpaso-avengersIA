import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Target, CheckCircle, Zap, User, TrendingUp } from 'lucide-react';

const JourneyContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const JourneyHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const JourneyTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const JourneySubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const StageInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StageIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 0 20px ${props => props.color}40;
`;

const StageName = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const StageDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const AssistantRecommendation = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const RecommendationTitle = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const RecommendationText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const AssistantCard = styled.div<{ color: string }>`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.color}40;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AssistantAvatar = styled.div<{ bgColor: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const AssistantInfo = styled.div`
  flex: 1;
`;

const AssistantName = styled.h5`
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const AssistantRole = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ActionButton = styled(motion.button)<{ primary?: boolean }>`
  background: ${props => props.primary ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.primary ? '#10b981' : 'rgba(255, 255, 255, 0.2)'};
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ConfidenceIndicator = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 0.5rem 0;
`;

const ConfidenceFill = styled.div<{ confidence: number }>`
  width: ${props => props.confidence * 100}%;
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
  transition: width 0.3s ease;
`;

const ConfidenceText = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

interface JourneyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptDerivation: (targetAssistant: string) => void;
  derivationData: {
    currentAssistant: string;
    recommendedAssistant: string;
    journeyStage: string;
    reason: string;
    confidence: number;
  } | null;
}

const JOURNEY_STAGES = {
  descubrimiento: {
    name: 'Descubrimiento',
    description: 'Buscando donde mostrar el talento y atraer clientes',
    icon: Target,
    color: '#ffd700'
  },
  interes: {
    name: 'Interés',
    description: 'Curiosidad por historias y casos de éxito',
    icon: TrendingUp,
    color: '#ff6b6b'
  },
  consideracion: {
    name: 'Consideración',
    description: 'Evaluando si vale la pena invertir tiempo',
    icon: CheckCircle,
    color: '#4ecdc4'
  },
  registro: {
    name: 'Registro/Acción',
    description: 'Decidido a probar y configurar la plataforma',
    icon: User,
    color: '#45b7d1'
  },
  participacion: {
    name: 'Participación',
    description: 'Mejorando y creciendo en la plataforma',
    icon: Users,
    color: '#96ceb4'
  },
  retencion: {
    name: 'Retención',
    description: 'Fidelizado y participando en la comunidad',
    icon: Zap,
    color: '#ffeaa7'
  }
};

const ASSISTANTS = {
  stark: {
    name: 'Tony Stark',
    role: 'Marketing Expert',
    avatar: 'TS',
    color: '#ffd700'
  },
  cap: {
    name: 'Steve Rogers',
    role: 'Support Specialist',
    avatar: 'SR',
    color: '#1e40af'
  },
  spidey: {
    name: 'Peter Parker',
    role: 'Sales Assistant',
    avatar: 'PP',
    color: '#dc2626'
  }
};

const JourneyManager: React.FC<JourneyManagerProps> = ({
  isOpen,
  onClose,
  onAcceptDerivation,
  derivationData
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen && derivationData) {
      setShowAnimation(true);
    }
  }, [isOpen, derivationData]);

  if (!isOpen || !derivationData) return null;

  const currentStage = JOURNEY_STAGES[derivationData.journeyStage as keyof typeof JOURNEY_STAGES];
  const currentAssistant = ASSISTANTS[derivationData.currentAssistant as keyof typeof ASSISTANTS];
  const recommendedAssistant = ASSISTANTS[derivationData.recommendedAssistant as keyof typeof ASSISTANTS];
  const StageIcon = currentStage?.icon || Target;

  return (
    <AnimatePresence>
      <JourneyContainer
        as={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <JourneyHeader>
          <JourneyTitle>🎯 Viaje del Barista Detectado</JourneyTitle>
          <JourneySubtitle>
            Hemos identificado tu etapa actual y el especialista ideal para ayudarte
          </JourneySubtitle>
        </JourneyHeader>

        {currentStage && (
          <StageInfo>
            <StageIcon
              size={24}
              color="white"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: currentStage.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: `0 0 20px ${currentStage.color}40`
              }}
            />
            <StageName>{currentStage.name}</StageName>
            <StageDescription>{currentStage.description}</StageDescription>
          </StageInfo>
        )}

        <AssistantRecommendation>
          <RecommendationTitle>🤝 Especialista Recomendado</RecommendationTitle>
          <RecommendationText>{derivationData.reason}</RecommendationText>

          <AssistantCard color={recommendedAssistant?.color || '#3b82f6'}>
            <AssistantAvatar bgColor={recommendedAssistant?.color || '#3b82f6'}>
              {recommendedAssistant?.avatar}
            </AssistantAvatar>
            <AssistantInfo>
              <AssistantName>{recommendedAssistant?.name}</AssistantName>
              <AssistantRole>{recommendedAssistant?.role}</AssistantRole>
            </AssistantInfo>
            <ArrowRight size={20} color="white" />
          </AssistantCard>
        </AssistantRecommendation>

        <ConfidenceIndicator>
          <ConfidenceText>
            Precisión de detección: {Math.round(derivationData.confidence * 100)}%
          </ConfidenceText>
          <ConfidenceBar>
            <ConfidenceFill confidence={derivationData.confidence} />
          </ConfidenceBar>
        </ConfidenceIndicator>

        <ActionButtons>
          <ActionButton
            primary
            onClick={() => onAcceptDerivation(derivationData.recommendedAssistant)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Conectar con {recommendedAssistant?.name}
          </ActionButton>
          <ActionButton
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuar aquí
          </ActionButton>
        </ActionButtons>
      </JourneyContainer>
    </AnimatePresence>
  );
};

export default JourneyManager;
