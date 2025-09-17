import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, TrendingUp, Target, BarChart3, Lightbulb, Mic, MicOff, Volume2, VolumeX, Phone, PhoneCall } from 'lucide-react';
import { useAssistant } from '../../contexts/AssistantContext';

const ChatContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #3d2317 100%);
  display: flex;
  flex-direction: column;
`;

const Header = styled(motion.div)`
  background: rgba(255, 215, 0, 0.1);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
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
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 0.5rem;
`;

const Role = styled.p`
  color: #ccc;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const CallControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const CallButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: ${props => props.$isActive ? '#ef4444' : '#10b981'};
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isActive ? '#dc2626' : '#059669'};
    transform: scale(1.05);
  }
`;

const ChatArea = styled.div`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const WelcomeMessage = styled(motion.div)`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  margin-bottom: 2rem;
`;

const WelcomeText = styled.h2`
  color: #ffd700;
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 215, 0, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #ffd700;
    box-shadow: 0 10px 25px rgba(255, 215, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  color: #ffd700;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  color: #ffd700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  max-height: 60vh;
`;

const MessageBubble = styled(motion.div)<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
`;

const MessageContent = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  background: ${props => props.$isUser
    ? 'linear-gradient(135deg, #ffd700, #ffed4a)'
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$isUser ? '#1a1a1a' : 'white'};
  border: ${props => props.$isUser ? 'none' : '1px solid rgba(255, 215, 0, 0.3)'};
  backdrop-filter: blur(10px);
`;

const MessageText = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  display: block;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 1rem;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffd700;
    animation: typing 1.4s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
`;

const InputArea = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
`;

const VoiceControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const VoiceButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid ${props => props.$isActive ? '#ef4444' : '#ffd700'};
  background: ${props => props.$isActive ? '#ef4444' : 'transparent'};
  color: ${props => props.$isActive ? 'white' : '#ffd700'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isActive ? '#dc2626' : 'rgba(255, 215, 0, 0.1)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SpeakerButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid ${props => props.$isActive ? '#10b981' : '#666'};
  background: ${props => props.$isActive ? '#10b981' : 'transparent'};
  color: ${props => props.$isActive ? 'white' : '#666'};
  cursor: default;
  transition: all 0.3s ease;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  resize: none;
  min-height: 50px;
  max-height: 120px;
  font-family: inherit;
  font-size: 1rem;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 8px;
  color: #fca5a5;
  margin: 1rem 0;
  text-align: center;
`;

const StarkAssistant: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const {
    currentSession,
    activeAssistant,
    sendMessage,
    startNewSession,
    endSession,
    isLoading,
    error
  } = useAssistant();

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'es-ES';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          if (interimTranscript) {
            setInputMessage(interimTranscript);
          }

          if (finalTranscript) {
            setInputMessage(finalTranscript);
            setTimeout(() => {
              handleSendMessage(finalTranscript);
            }, 500);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('❌ [VOICE] Error en reconocimiento:', event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  // Función para convertir texto a voz
  const speakText = async (text: string) => {
    if (!text || isSpeaking) return;

    try {
      setIsSpeaking(true);
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      const voices = speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice =>
        voice.lang.includes('es') &&
        (voice.lang.includes('MX') || voice.lang.includes('AR') || voice.lang.includes('CO'))
      ) || voices.find(voice => voice.lang.includes('es'));

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.rate = 1.1;
      utterance.pitch = 0.9;
      utterance.volume = 0.8;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('❌ [TTS] Error al hablar:', error);
      setIsSpeaking(false);
    }
  };

  // Inicializar AudioContext
  const initializeAudioContext = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      return audioContextRef.current;
    } catch (error) {
      console.error('❌ Error inicializando AudioContext:', error);
      return null;
    }
  }, []);

  // Reproducir sonido
  const playSound = useCallback((frequency: number, duration: number) => {
    const audioContext = initializeAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error('❌ Error reproduciendo sonido:', error);
    }
  }, [initializeAudioContext]);

  // Iniciar llamada
  const startCall = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasAudioPermission(true);
      setIsInCall(true);
      playSound(800, 0.2);

      // Iniciar sesión del asistente
      startNewSession('stark');
    } catch (error) {
      console.error('❌ Error al iniciar llamada:', error);
      alert('No se pudo acceder al micrófono. Por favor, concede los permisos necesarios.');
    }
  }, [playSound, startNewSession]);

  // Terminar llamada
  const endCall = useCallback(() => {
    setIsInCall(false);
    setIsListening(false);
    setIsSpeaking(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    speechSynthesis.cancel();
    endSession();
    playSound(400, 0.3);
  }, [endSession, playSound]);

  // Toggle del micrófono
  const toggleListening = useCallback(() => {
    if (!isInCall || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        })
        .catch(console.error);
    }
  }, [isListening, isInCall]);

  // Manejar envío de mensajes
  const handleSendMessage = useCallback(async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    setInputMessage('');

    try {
      if (!currentSession) {
        startNewSession('stark');
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const response = await sendMessage(messageToSend);

      if (response?.text && isInCall) {
        await speakText(response.text);
      }
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
    }
  }, [inputMessage, isLoading, sendMessage, startNewSession, currentSession, speakText, isInCall]);

  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Sugerencias de conversación
  const handleFeatureClick = (message: string) => {
    setInputMessage(message);
    handleSendMessage(message);
  };

  return (
    <ChatContainer>
      <Header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderContent>
          <Avatar>
            <Zap />
          </Avatar>
          <HeaderInfo>
            <Name>Stark</Name>
            <Role>Asistente de Marketing - Especialista en innovación y crecimiento</Role>
          </HeaderInfo>
          <CallControls>
            {!isInCall ? (
              <CallButton onClick={startCall}>
                <Phone size={20} />
                Iniciar Llamada
              </CallButton>
            ) : (
              <CallButton $isActive onClick={endCall}>
                <PhoneCall size={20} />
                Terminar Llamada
              </CallButton>
            )}
          </CallControls>
        </HeaderContent>
      </Header>

      <ChatArea>
        {!currentSession ? (
          <WelcomeMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WelcomeText>
              Hola, soy Stark. No te voy a aburrir con discursos largos… vine a mostrarte cómo hacer que tu negocio brille como un reactor arc.
            </WelcomeText>

            <Features>
              <FeatureCard
                whileHover={{ scale: 1.05 }}
                onClick={() => handleFeatureClick('¿Cómo puedo mejorar mi estrategia de marketing?')}
              >
                <FeatureIcon><Target size={24} /></FeatureIcon>
                <FeatureTitle>Estrategia</FeatureTitle>
                <FeatureDescription>Optimiza tu enfoque de marketing</FeatureDescription>
              </FeatureCard>

              <FeatureCard
                whileHover={{ scale: 1.05 }}
                onClick={() => handleFeatureClick('¿Qué tendencias de marketing debo seguir?')}
              >
                <FeatureIcon><TrendingUp size={24} /></FeatureIcon>
                <FeatureTitle>Tendencias</FeatureTitle>
                <FeatureDescription>Mantente al día con lo último</FeatureDescription>
              </FeatureCard>

              <FeatureCard
                whileHover={{ scale: 1.05 }}
                onClick={() => handleFeatureClick('¿Cómo medir el ROI de mis campañas?')}
              >
                <FeatureIcon><BarChart3 size={24} /></FeatureIcon>
                <FeatureTitle>Analytics</FeatureTitle>
                <FeatureDescription>Mide y optimiza resultados</FeatureDescription>
              </FeatureCard>

              <FeatureCard
                whileHover={{ scale: 1.05 }}
                onClick={() => handleFeatureClick('Dame ideas creativas para mi próxima campaña')}
              >
                <FeatureIcon><Lightbulb size={24} /></FeatureIcon>
                <FeatureTitle>Creatividad</FeatureTitle>
                <FeatureDescription>Ideas innovadoras</FeatureDescription>
              </FeatureCard>
            </Features>
          </WelcomeMessage>
        ) : (
          <MessagesContainer>
            <AnimatePresence>
              {currentSession.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  $isUser={message.sender === 'user'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageContent $isUser={message.sender === 'user'}>
                    <MessageText>{message.text}</MessageText>
                    <MessageTime>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </MessageTime>
                  </MessageContent>
                </MessageBubble>
              ))}
              {isLoading && (
                <MessageBubble $isUser={false}>
                  <MessageContent $isUser={false}>
                    <TypingIndicator>
                      <span></span>
                      <span></span>
                      <span></span>
                    </TypingIndicator>
                  </MessageContent>
                </MessageBubble>
              )}
            </AnimatePresence>
          </MessagesContainer>
        )}

        {isInCall && (
          <InputArea>
            <VoiceControls>
              <VoiceButton
                $isActive={isListening}
                onClick={toggleListening}
                disabled={!isInCall}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </VoiceButton>

              <SpeakerButton $isActive={isSpeaking}>
                {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </SpeakerButton>
            </VoiceControls>

            <MessageInput
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje o usa el micrófono..."
              disabled={isLoading}
            />

            <SendButton
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send size={20} />
            </SendButton>
          </InputArea>
        )}

        {error && (
          <ErrorMessage>
            Error: {error}
          </ErrorMessage>
        )}
      </ChatArea>
    </ChatContainer>
  );
};

export default StarkAssistant;
