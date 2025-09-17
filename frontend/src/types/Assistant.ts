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
  };
}

export interface AssistantAction {
  type: 'redirect' | 'contact' | 'schedule' | 'demo' | 'info';
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
  setActiveAssistant: (assistant: Assistant | null) => void;
  sendMessage: (message: string) => Promise<AssistantResponse | undefined>;
  startNewSession: (assistantId: string) => void;
  endSession: () => void;
  endCall: () => Promise<void>;
  clearError: () => void;
}
