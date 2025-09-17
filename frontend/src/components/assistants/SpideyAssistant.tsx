import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
//import { Send, Zap, Heart, Smile, Code, Bug, Mic, MicOff, Volume2, VolumeX, Phone, PhoneCall } from 'lucide-react';
import { Send, Shield, CheckCircle, AlertTriangle, HelpCircle, Settings, Mic, MicOff, Volume2, VolumeX, Phone, PhoneCall } from 'lucide-react';
import { useAssistant } from '../../contexts/AssistantContext';



const ChatContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(135deg, #1a0a0a 0%, #7f1d1d 50%, #dc2626 100%);
  display: flex;
  flex-direction: column;
`;

const Header = styled(motion.div)`
  background: rgba(220, 38, 38, 0.1);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-bottom: 1px solid rgba(220, 38, 38, 0.2);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 2rem;
  color: #ef4444;
  margin-bottom: 0.5rem;
  font-weight: 800;
`;

const Role = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-size: 0.9rem;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 2rem 0;
  overflow-y: auto;
  max-height: 60vh;
`;

const Message = styled(motion.div)<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  background: ${props => props.$isUser
    ? 'linear-gradient(135deg, #dc2626, #ef4444)'
    : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isUser
    ? 'transparent'
    : 'rgba(255, 255, 255, 0.1)'};
`;

const InputArea = styled.div`
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const Input = styled.textarea`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 1rem 1.5rem;
  color: white;
  font-size: 1rem;
  resize: none;
  min-height: 50px;
  max-height: 120px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
  }
`;

const SendButton = styled(motion.button)`
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Suggestions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const SuggestionChip = styled(motion.button)`
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(220, 38, 38, 0.2);
  }
`;

const VoiceControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const VoiceButton = styled(motion.button)<{ $isActive?: boolean }>`
  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, #ef4444, #f87171)'
    : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: ${props => props.$isActive ? 'white' : '#ef4444'};
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isActive
      ? 'linear-gradient(135deg, #f87171, #ef4444)'
      : 'rgba(239, 68, 68, 0.2)'};
    transform: scale(1.05);
  }
`;

const CallStatus = styled(motion.div)<{ $isInCall: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => props.$isInCall
    ? 'rgba(16, 185, 129, 0.2)'
    : 'rgba(239, 68, 68, 0.2)'};
  border: 1px solid ${props => props.$isInCall
    ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.$isInCall ? '#10b981' : '#ef4444'};
  font-size: 0.9rem;
`;

const ListeningIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const WaveForm = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 20px;
`;

const Wave = styled(motion.div)`
  width: 3px;
  background: #ef4444;
  border-radius: 2px;
`;

const ThinkingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin-bottom: 1rem;
`;

const BrainWave = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(220, 38, 38, 0.3);
    transform: translateY(-2px);
  }
`;

const SupportBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 1rem;
`;


function SpideyAssistant() {
  const { startNewSession, sendMessage, currentSession, isLoading } = useAssistant();
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  useEffect(() => {
    // Inicializar reconocimiento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        playNotificationSound('start');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          handleSendMessage(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Iniciar sesión automáticamente
    startNewSession('spidey');
    setIsInCall(true);
    playNotificationSound('connect');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const playNotificationSound = (type: 'start' | 'end' | 'connect' | 'message') => {
    const audioContext = new AudioContext();
    const frequencies = {
      start: [700, 900],
      end: [900, 700],
      connect: [400, 600, 800],
      message: [500, 700]
    };

    frequencies[type].forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime + index * 0.1);
      oscillator.stop(audioContext.currentTime + 0.2 + index * 0.1);
    });
  };

  const speakResponse = (text: string) => {
    if (!isVoiceEnabled || !synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.3; // Spidey habla más rápido y animado
    utterance.pitch = 1.4; // Voz más aguda y juvenil
    utterance.volume = 0.8;

    utterance.onstart = () => {
      playNotificationSound('message');
    };

    utterance.onend = () => {
      setIsThinking(false);
    };

    synthRef.current.speak(utterance);
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    setIsThinking(true);
    const response = await sendMessage(messageToSend);
    setInputMessage('');

    setTimeout(() => {
      if (response?.text) {
        speakResponse(response.text);
      }
    }, 500);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      playNotificationSound('end');
    } else {
      recognitionRef.current.start();
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isVoiceEnabled) {
      synthRef.current?.cancel();
    }
  };

  const toggleCall = () => {
    setIsInCall(!isInCall);
    playNotificationSound(isInCall ? 'end' : 'connect');
    if (!isInCall) {
      synthRef.current?.cancel();
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "💰 Demo Monetización",
    "📊 Casos de Éxito",
    "🎯 Testimonios Baristas",
    "🚀 Optimizar Ventas",
    "📈 Conversión"
  ];

  const salesJourneyStages = {
    consideracion: {
      title: "🤔 Consideración",
      actions: ["Testimonios de baristas", "Demo de monetización", "Casos de éxito"],
      kpis: ["Time on Site", "Demo Requests", "Content Downloads", "Conversion Rate"]
    },
    participacion: {
      title: "🎯 Participación/Ventas",
      actions: ["Herramientas clips integradas", "Notificaciones leads", "Optimización conversión"],
      kpis: ["Sales Conversion", "Revenue per User", "Lead Quality", "Purchase Rate"]
    },
    optimizacion: {
      title: "🚀 Optimización",
      actions: ["A/B testing", "Funnel analysis", "User behavior tracking"],
      kpis: ["Conversion Rate", "Cart Abandonment", "Customer LTV", "ROI"]
    }
  };

  const handleSalesStage = (stage: string) => {
    const stageData = salesJourneyStages[stage as keyof typeof salesJourneyStages];
    if (stageData) {
      const message = `¡Hola! Te ayudo con ${stageData.title}. Como especialista en ventas y desarrollo, puedo optimizar: ${stageData.actions.join(', ')}. KPIs de ventas: ${stageData.kpis.join(', ')}`;
      handleSendMessage(message);
    }
  };

  return (
    <ChatContainer>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderContent>
          <Avatar>
            <motion.div
              animate={isInCall ? {
                boxShadow: [
                  '0 0 30px rgba(239, 68, 68, 0.4)',
                  '0 0 50px rgba(239, 68, 68, 0.8)',
                  '0 0 30px rgba(239, 68, 68, 0.4)'
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🕷️
            </motion.div>
          </Avatar>
          <HeaderInfo>
            <Name>Peter Parker</Name>
            <Role>Tech Support & Development Assistant</Role>
             <CallStatus $isInCall={isInCall}>
                          {isInCall ? <PhoneCall size={16} /> : <Phone size={16} />}
                          {isInCall ? 'En llamada' : 'Desconectado'}
                        </CallStatus>
          </HeaderInfo>
            <QuickActions>
                       {quickActions.map((action, index) => (
                       <ActionButton
                           key={index}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => handleSendMessage(action)}
                       >
                           {action}
                       </ActionButton>
                       ))}
                       <SupportBadge>
                       <CheckCircle size={16} />
                       Soporte 24/7
                       </SupportBadge>
       </QuickActions>
          <VoiceControls>
            <VoiceButton
              $isActive={isInCall}
              onClick={toggleCall}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isInCall ? <PhoneCall size={20} /> : <Phone size={20} />}
            </VoiceButton>
            {isInCall && (
              <>
                <VoiceButton
                  $isActive={isListening}
                  onClick={toggleListening}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isInCall}
                >
                  {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                </VoiceButton>
                <VoiceButton
                  $isActive={isVoiceEnabled}
                  onClick={toggleVoice}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isInCall}
                >
                  {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </VoiceButton>
              </>
            )}
          </VoiceControls>
        </HeaderContent>
      </Header>

      <ChatArea>
        <MessagesContainer>
          <AnimatePresence>
            {currentSession?.messages?.map((message, index) => (
              <Message
                key={index}
                $isUser={message.sender === 'user'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble $isUser={message.sender === 'user'}>
                  {message.text}
                </MessageBubble>
              </Message>
            ))}
          </AnimatePresence>

          {isListening && (
            <ListeningIndicator
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Mic size={16} />
              Escuchando...
              <WaveForm>
                {[...Array(5)].map((_, i) => (
                  <Wave
                    key={i}
                    animate={{
                      height: [4, 16, 4],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </WaveForm>
            </ListeningIndicator>
          )}

          {isThinking && (
            <ThinkingIndicator
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Zap size={16} />
              Spidey está procesando...
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(3)].map((_, i) => (
                  <BrainWave
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </ThinkingIndicator>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>

        {isInCall && (
          <InputArea>
            <InputContainer>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Hablando..." : "¡Habla o escribe, estoy aquí para ayudar!"}
                disabled={isListening || !isInCall}
              />
              <SendButton
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim() || !isInCall}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
              </SendButton>
            </InputContainer>

            {currentSession?.lastResponse?.suggestions && (
              <Suggestions>
                {currentSession.lastResponse.suggestions.map((suggestion, index) => (
                  <SuggestionChip
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion}
                  </SuggestionChip>
                ))}
              </Suggestions>
            )}
          </InputArea>
        )}
      </ChatArea>
    </ChatContainer>
  );
}

export default SpideyAssistant;
