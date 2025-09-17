import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Assistant, AssistantContextType, ChatSession, Message, AssistantResponse } from '../types/Assistant';
import { assistantService } from '../services/assistantService';

// Definición de los asistentes Marvel
export const ASSISTANTS: Assistant[] = [
  {
    id: 'stark',
    name: 'Stark',
    character: 'stark',
    role: 'Marketing Assistant',
    personality: 'Creativo, innovador, un poco sarcástico',
    tone: 'Seguro, con chispa',
    greeting: 'Hola, soy Stark. No te voy a aburrir con discursos largos… vine a mostrarte cómo hacer que tu negocio brille como un reactor arc.',
    avatar: '/avatars/stark.png',
    color: '#ffd700',
    description: 'Especialista en campañas de marketing, redes sociales y growth hacking'
  },
  {
    id: 'cap',
    name: 'Cap',
    character: 'cap',
    role: 'Support Assistant',
    personality: 'Confiable, paciente, siempre correcto',
    tone: 'Formal pero cercano, transmite seguridad',
    greeting: 'Hola, soy Cap. Estoy aquí para ayudarte en lo que necesites, paso a paso y sin complicaciones.',
    avatar: '/avatars/cap.png',
    color: '#1e40af',
    description: 'Experto en soporte al cliente, resolución de problemas y atención personalizada'
  },
  {
    id: 'spidey',
    name: 'Spidey',
    character: 'spidey',
    role: 'Pre-sales Assistant',
    personality: 'Juvenil, rápido, amigable',
    tone: 'Fresco, ligero, como un amigo que te recomienda algo',
    greeting: '¡Ey! Soy Spidey, tu guía rápido para conocer Alpaso 🕷️. Prometo no colgarme de los techos mientras hablamos.',
    avatar: '/avatars/spidey.png',
    color: '#dc2626',
    description: 'Especialista en primer contacto, calificación de leads y generación de confianza'
  }
];

interface AssistantState {
  activeAssistant: Assistant | null;
  chatSessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  // Nuevas propiedades para el viaje del barista
  journeyStage: string | null;
  derivationData: {
    currentAssistant: string;
    recommendedAssistant: string;
    journeyStage: string;
    reason: string;
    confidence: number;
  } | null;
  showJourneyManager: boolean;
}

type AssistantAction =
  | { type: 'SET_ACTIVE_ASSISTANT'; payload: Assistant | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'START_SESSION'; payload: { session: ChatSession; assistant: Assistant } }
  | { type: 'END_SESSION' }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: Message } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_SESSION'; payload: ChatSession }
  | { type: 'SET_JOURNEY_STAGE'; payload: string | null }
  | { type: 'SET_DERIVATION_DATA'; payload: AssistantState['derivationData'] }
  | { type: 'TOGGLE_JOURNEY_MANAGER'; payload: boolean };

const initialState: AssistantState = {
  activeAssistant: null,
  chatSessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
  journeyStage: null,
  derivationData: null,
  showJourneyManager: false
};

function assistantReducer(state: AssistantState, action: AssistantAction): AssistantState {
  let newState: AssistantState;

  console.log('🔄 [REDUCER] Action received:', action.type);

  switch (action.type) {
    case 'SET_ACTIVE_ASSISTANT':
      newState = { ...state, activeAssistant: action.payload };
      break;

    case 'SET_LOADING':
      newState = { ...state, isLoading: action.payload };
      break;

    case 'SET_ERROR':
      newState = { ...state, error: action.payload, isLoading: false };
      break;

    case 'START_SESSION':
      console.log('🔄 [REDUCER] Processing START_SESSION...');
      console.log('🔄 [REDUCER] Raw action.payload:', action.payload);

      // Nueva lógica: START_SESSION ahora incluye el asistente activo
      const sessionPayload = action.payload;
      console.log('🔄 [REDUCER] sessionPayload type:', typeof sessionPayload);
      console.log('🔄 [REDUCER] sessionPayload.session exists:', !!sessionPayload.session);
      console.log('🔄 [REDUCER] sessionPayload.assistant exists:', !!sessionPayload.assistant);

      if (!sessionPayload.session || !sessionPayload.assistant) {
        console.error('❌ [REDUCER] Invalid payload structure:', {
          hasSession: !!sessionPayload.session,
          hasAssistant: !!sessionPayload.assistant,
          payload: sessionPayload
        });
        newState = state; // No cambiar el estado si el payload es inválido
        break;
      }

      console.log('✅ [REDUCER] Creating new state with session and assistant...');
      newState = {
        ...state,
        currentSession: sessionPayload.session,
        activeAssistant: sessionPayload.assistant,
        chatSessions: [...state.chatSessions, sessionPayload.session]
      };

      console.log('✅ [REDUCER] New state created:', {
        hasCurrentSession: !!newState.currentSession,
        hasActiveAssistant: !!newState.activeAssistant,
        sessionId: newState.currentSession?.id,
        assistantName: newState.activeAssistant?.name
      });
      break;

    case 'END_SESSION':
      newState = { ...state, currentSession: null, activeAssistant: null };
      break;

    case 'ADD_MESSAGE':
      const updatedSessions = state.chatSessions.map(session =>
        session.id === action.payload.sessionId
          ? { ...session, messages: [...session.messages, action.payload.message] }
          : session
      );
      const updatedCurrentSession = state.currentSession?.id === action.payload.sessionId
        ? { ...state.currentSession, messages: [...state.currentSession.messages, action.payload.message] }
        : state.currentSession;

      newState = {
        ...state,
        chatSessions: updatedSessions,
        currentSession: updatedCurrentSession
      };
      break;

    case 'CLEAR_ERROR':
      newState = { ...state, error: null };
      break;

    case 'UPDATE_SESSION':
      const updatedSessionsList = state.chatSessions.map(session =>
        session.id === action.payload.id ? action.payload : session
      );
      const updatedCurrentSessionFromPayload = state.currentSession?.id === action.payload.id
        ? action.payload
        : state.currentSession;

      newState = {
        ...state,
        chatSessions: updatedSessionsList,
        currentSession: updatedCurrentSessionFromPayload
      };
      break;

    case 'SET_JOURNEY_STAGE':
      newState = { ...state, journeyStage: action.payload };
      break;

    case 'SET_DERIVATION_DATA':
      newState = { ...state, derivationData: action.payload };
      break;

    case 'TOGGLE_JOURNEY_MANAGER':
      newState = { ...state, showJourneyManager: action.payload };
      break;

    default:
      newState = state;
  }

  // ...existing logging code...
  console.log('📊 [REDUCER] State after action:', {
    currentSession: !!newState.currentSession,
    activeAssistant: !!newState.activeAssistant,
    sessionsCount: newState.chatSessions.length,
    sessionId: newState.currentSession?.id
  });

  return newState;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assistantReducer, initialState);

  const setActiveAssistant = (assistant: Assistant | null) => {
    dispatch({ type: 'SET_ACTIVE_ASSISTANT', payload: assistant });
  };

  const startNewSession = (assistantId: string) => {
    console.log('🚀 [CONTEXT] startNewSession llamado para:', assistantId);

    // NUEVA LÓGICA: Evitar crear múltiples sesiones
    if (state.currentSession && state.activeAssistant) {
      console.log('⚠️ [CONTEXT] Ya existe una sesión activa, no creando nueva:', {
        existingSessionId: state.currentSession.id,
        existingAssistant: state.activeAssistant.name,
        requestedAssistant: assistantId
      });
      return;
    }

    const assistant = ASSISTANTS.find(a => a.id === assistantId);
    if (!assistant) {
      console.error('❌ [CONTEXT] No se encontró el asistente:', assistantId);
      return;
    }

    console.log('✅ [CONTEXT] Asistente encontrado:', assistant.name);

    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      assistantId,
      messages: [{
        id: `msg_${Date.now()}`,
        text: assistant.greeting,
        sender: 'assistant',
        timestamp: new Date(),
        assistant
      }],
      startTime: new Date(),
      status: 'active'
    };

    console.log('📝 [CONTEXT] Creando nueva sesión:', newSession.id);
    console.log('📝 [CONTEXT] Estado actual antes del dispatch:', {
      hasCurrentSession: !!state.currentSession,
      hasActiveAssistant: !!state.activeAssistant
    });

    // Usar el nuevo payload atómico que establece tanto la sesión como el asistente activo
    dispatch({
      type: 'START_SESSION',
      payload: { session: newSession, assistant }
    });

    console.log('✅ [CONTEXT] Dispatch START_SESSION (atómico) completado');
  };

  const sendMessage = async (message: string): Promise<AssistantResponse | undefined> => {
    console.log('🚀 [CONTEXT] sendMessage llamado con:', { message, hasSession: !!state.currentSession, hasAssistant: !!state.activeAssistant });

    // NUEVA LÓGICA: Esperar hasta 500ms para que React procese las actualizaciones de estado
    // Si no hay sesión, intentar esperar más tiempo y hacer múltiples intentos
    if (!state.currentSession || !state.activeAssistant) {
      console.log('⏳ [CONTEXT] Estado no disponible inmediatamente, esperando actualización...');

      // Intentar hasta 5 veces con intervalos de 100ms
      for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`⏳ [CONTEXT] Intento ${attempt}/5 - esperando estado...`);
        await new Promise(resolve => setTimeout(resolve, 100));

        if (state.currentSession && state.activeAssistant) {
          console.log(`✅ [CONTEXT] Estado disponible en intento ${attempt}`);
          break;
        }

        if (attempt === 5) {
          console.error('❌ [CONTEXT] No hay sesión o asistente activo después de múltiples intentos:', {
            currentSession: !!state.currentSession,
            activeAssistant: !!state.activeAssistant,
            finalAttempt: attempt
          });
          return;
        }
      }
    }

    // Verificar nuevamente después del bucle
    if (!state.currentSession || !state.activeAssistant) {
      console.error('❌ [CONTEXT] No hay sesión o asistente activo');
      return;
    }

    console.log('✅ [CONTEXT] Sesión y asistente válidos, procediendo...');
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Agregar mensaje del usuario
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        text: message,
        sender: 'user',
        timestamp: new Date()
      };

      console.log('📝 [CONTEXT] Agregando mensaje de usuario:', userMessage);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: state.currentSession.id, message: userMessage }
      });

      // Obtener respuesta del asistente
      console.log('🔄 [CONTEXT] Llamando assistantService.sendMessage...');
      const response = await assistantService.sendMessage(
        state.activeAssistant.id,
        message,
        state.currentSession.messages
      );

      console.log('✅ [CONTEXT] Respuesta recibida del assistantService:', response);

      if (!response) {
        console.error('❌ [CONTEXT] assistantService devolvió undefined');
        throw new Error('No se recibió respuesta del servicio de asistentes');
      }

      // Agregar respuesta del asistente
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        text: response.text,
        sender: 'assistant',
        timestamp: new Date(),
        assistant: state.activeAssistant
      };

      console.log('📝 [CONTEXT] Agregando respuesta del asistente:', assistantMessage);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: state.currentSession.id, message: assistantMessage }
      });

      // Actualizar la sesión con la última respuesta
      const updatedSession: ChatSession = {
        ...state.currentSession,
        messages: [...state.currentSession.messages, userMessage, assistantMessage],
        lastResponse: response
      };

      console.log('🔄 [CONTEXT] Actualizando sesión...');
      dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
      dispatch({ type: 'SET_LOADING', payload: false });

      console.log('✅ [CONTEXT] sendMessage completado exitosamente, retornando respuesta');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('❌ [CONTEXT] Error en sendMessage:', error);
      console.error('❌ [CONTEXT] Error message:', errorMessage);
      dispatch({ type: 'SET_ERROR', payload: `Error al enviar mensaje: ${errorMessage}` });
      dispatch({ type: 'SET_LOADING', payload: false });
      return undefined;
    }
  };

  const endSession = () => {
    dispatch({ type: 'END_SESSION' });
    dispatch({ type: 'SET_ACTIVE_ASSISTANT', payload: null });
  };

  const endCall = async () => {
    try {
      // Detener cualquier audio que esté reproduciéndose
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });

      // Limpiar contexto de audio web - usando una referencia global si existe
      const globalAudioContext = (window as any).globalAudioContext;
      if (globalAudioContext && globalAudioContext.state === 'running') {
        await globalAudioContext.suspend();
      }

      // Finalizar sesión actual si existe
      if (state.currentSession) {
        const finalizedSession: ChatSession = {
          ...state.currentSession,
          status: 'ended',
          endTime: new Date()
        };
        dispatch({ type: 'UPDATE_SESSION', payload: finalizedSession });
      }

      // Limpiar estado
      dispatch({ type: 'END_SESSION' });
      dispatch({ type: 'SET_ACTIVE_ASSISTANT', payload: null });
      dispatch({ type: 'CLEAR_ERROR' });

      console.log('📞 Llamada terminada exitosamente');
    } catch (error) {
      console.error('❌ Error al terminar llamada:', error);
      // Forzar limpieza aunque haya error
      dispatch({ type: 'END_SESSION' });
      dispatch({ type: 'SET_ACTIVE_ASSISTANT', payload: null });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Nuevas funciones para el sistema de derivación inteligente
  const handleDerivationResponse = (response: AssistantResponse) => {
    console.log('🎯 [DERIVATION] Analizando respuesta para detectar derivación...');

    // Verificar si la respuesta incluye información de derivación
    if (response.metadata?.needsDerivation) {
      console.log('🔄 [DERIVATION] Derivación detectada:', {
        from: state.activeAssistant?.id,
        to: response.metadata.recommendedAssistant,
        stage: response.metadata.journeyStage,
        reason: response.metadata.derivationReason
      });

      // Establecer datos de derivación
      const derivationData = {
        currentAssistant: state.activeAssistant?.id || '',
        recommendedAssistant: response.metadata.recommendedAssistant,
        journeyStage: response.metadata.journeyStage,
        reason: response.metadata.derivationReason,
        confidence: response.metadata.confidence || 0.8
      };

      dispatch({ type: 'SET_DERIVATION_DATA', payload: derivationData });
      dispatch({ type: 'SET_JOURNEY_STAGE', payload: response.metadata.journeyStage });
      dispatch({ type: 'TOGGLE_JOURNEY_MANAGER', payload: true });
    } else {
      // Actualizar etapa del viaje si está disponible
      if (response.metadata?.journeyStage) {
        dispatch({ type: 'SET_JOURNEY_STAGE', payload: response.metadata.journeyStage });
      }
    }
  };

  const acceptDerivation = (targetAssistantId: string) => {
    console.log('✅ [DERIVATION] Usuario acepta derivación a:', targetAssistantId);

    // Cerrar el Journey Manager
    dispatch({ type: 'TOGGLE_JOURNEY_MANAGER', payload: false });
    dispatch({ type: 'SET_DERIVATION_DATA', payload: null });

    // Finalizar sesión actual
    endSession();

    // Iniciar nueva sesión con el asistente recomendado
    setTimeout(() => {
      startNewSession(targetAssistantId);
    }, 500); // Pequeña pausa para la transición visual
  };

  const declineDerivation = () => {
    console.log('❌ [DERIVATION] Usuario declina derivación');

    // Cerrar el Journey Manager
    dispatch({ type: 'TOGGLE_JOURNEY_MANAGER', payload: false });
    dispatch({ type: 'SET_DERIVATION_DATA', payload: null });
  };

  // Función mejorada de sendMessage que incluye manejo de derivación
  const sendMessageWithJourney = async (message: string): Promise<AssistantResponse | undefined> => {
    const response = await sendMessage(message);

    if (response) {
      // Procesar respuesta para detectar derivaciones
      handleDerivationResponse(response);
    }

    return response;
  };

  const value: AssistantContextType = {
    activeAssistant: state.activeAssistant,
    chatSessions: state.chatSessions,
    currentSession: state.currentSession,
    isLoading: state.isLoading,
    error: state.error,
    assistants: ASSISTANTS,
    startNewSession,
    sendMessage: sendMessageWithJourney,
    endSession,
    endCall,
    clearError,
    setActiveAssistant
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}
