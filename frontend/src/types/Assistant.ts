export interface Assistant {
  id: string;
  name: string;
  character: 'stark' | 'cap' | 'spidey';
  role: string;
  personality: string;
  tone: string;
  greeting: string;
  avatar: string;
  color: string;
  description: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  assistant?: Assistant;
  typing?: boolean;
}

export interface ChatSession {
  id: string;
  assistantId: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'paused' | 'ended';
  lastResponse?: AssistantResponse;
}

export interface AssistantResponse {
  text: string;
  suggestions?: string[];
  actions?: AssistantAction[];
  metadata?: {
    confidence: number;
    intent: string;
    entities?: any[];
    // Nuevas propiedades para el viaje del barista
    needsDerivation?: boolean;
    recommendedAssistant?: string;
    journeyStage?: string;
    derivationReason?: string;
    assistant?: string;
    responseTime?: number;
    model?: string;
    isLocal?: boolean;
    provider?: string;
    isFallback?: boolean;
    timestamp?: string;
  };
}

export interface AssistantAction {
  type: 'redirect' | 'contact' | 'schedule' | 'demo' | 'info' | 'derivation';
  label: string;
  data: any;
}

export interface AssistantContextType {
  activeAssistant: Assistant | null;
  chatSessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  assistants: Assistant[];
  startNewSession: (assistantId: string) => void;
  sendMessage: (message: string) => Promise<AssistantResponse | undefined>;
  endSession: () => void;
  endCall: () => Promise<void>;
  clearError: () => void;
  setActiveAssistant: (assistant: Assistant | null) => void;
  // Nuevas propiedades para el viaje del barista
  journeyStage?: string | null;
  derivationData?: {
    currentAssistant: string;
    recommendedAssistant: string;
    journeyStage: string;
    reason: string;
    confidence: number;
  } | null;
  showJourneyManager?: boolean;
  acceptDerivation?: (targetAssistantId: string) => void;
  declineDerivation?: () => void;
}
