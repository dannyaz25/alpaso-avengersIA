import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
//import { Send, Zap, TrendingUp, Target, BarChart3, Lightbulb, Mic, MicOff, Volume2, VolumeX, Phone, PhoneCall } from 'lucide-react';
import { Send,Zap, Shield, CheckCircle, AlertTriangle, HelpCircle, Settings, Mic, MicOff, Volume2, VolumeX, Phone, PhoneCall } from 'lucide-react';
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

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.3);
    transform: translateY(-2px);
  }
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
    ? 'linear-gradient(135deg, #ffd700, #ffed4a)'
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$isUser ? '#1a1a1a' : 'white'};
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
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
  }
`;

const SendButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin-bottom: 1rem;
`;

const Suggestions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const SuggestionChip = styled(motion.button)`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
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

const VoiceControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const VoiceButton = styled(motion.button)<{ $isActive?: boolean }>`
  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, #ffd700, #ffed4a)'
    : 'rgba(255, 215, 0, 0.1)'};
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: ${props => props.$isActive ? '#1a1a1a' : '#ffd700'};
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
      ? 'linear-gradient(135deg, #ffed4a, #ffd700)'
      : 'rgba(255, 215, 0, 0.2)'};
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
  color: #ffd700;
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
  background: #ffd700;
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
  background: #ffd700;
  border-radius: 50%;
`;

const StarkAssistant: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentSession,
    activeAssistant,
    sendMessage,
    startNewSession,
    endSession,
    isLoading,
    error
  } = useAssistant();

  // Inicializar síntesis de voz
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'es-ES';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setTimeout(() => {
            handleSendMessage(transcript);
          }, 500);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  // Iniciar sesión automáticamente
  useEffect(() => {
    // Iniciar sesión automáticamente
    startNewSession('stark');
    setIsInCall(true);
    playNotificationSound('connect');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const playNotificationSound = (type: 'start' | 'end' | 'connect' | 'message') => {
    const audioContext = new AudioContext();
    const frequencies = {
      start: [800, 1000],
      end: [1000, 800],
      connect: [700, 900, 1100],
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
    utterance.rate = 1.1; // Stark habla más rápido y dinámico
    utterance.pitch = 0.9; // Tono más alto y tecnológico
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
    "Metricas",
    "Landing",
    "Clips Virales",
    "Contactar soporte humano",
    "Estado del sistema"
  ];

  return (
    <ChatContainer>
      <Header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderContent>
          <Avatar>
            <Zap size={32} />
          </Avatar>
          <HeaderInfo>
            <Name>Stark</Name>
            <Role>Marketing Assistant</Role>
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
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </VoiceButton>
                <VoiceButton
                  $isActive={isVoiceEnabled}
                  onClick={toggleVoice}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </VoiceButton>
              </>
            )}
          </VoiceControls>
        </HeaderContent>
      </Header>

      <ChatArea>
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
            <Lightbulb size={16} />
            Stark está analizando...
            {[...Array(3)].map((_, i) => (
              <BrainWave
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </ThinkingIndicator>
        )}

        <MessagesContainer>
          <AnimatePresence>
            {currentSession?.messages?.map((message, index) => (
              <Message
                key={index}
                $isUser={message.sender === 'user'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble $isUser={message.sender === 'user'}>
                  {message.text}
                </MessageBubble>
              </Message>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </MessagesContainer>

        {isLoading && (
          <TypingIndicator
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Zap size={16} />
            Stark está escribiendo...
          </TypingIndicator>
        )}

        {isInCall && (
          <InputArea>
            <InputContainer>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje o usa el micrófono..."
                disabled={isLoading}
              />
              <SendButton
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              color: '#fca5a5',
              margin: '1rem 0',
              textAlign: 'center'
            }}
          >
            Error: {error}
          </motion.div>
        )}
      </ChatArea>
    </ChatContainer>
  );
};

export default StarkAssistant;
