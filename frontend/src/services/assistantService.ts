import axios from 'axios';
import { AssistantResponse, Message } from '../types/Assistant';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

class AssistantService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.apiClient.interceptors.request.use(
      (config) => {
        // Agregar token de autenticación si existe
        const token = localStorage.getItem('alpaso_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async sendMessage(
    assistantId: string,
    message: string,
    context: Message[] = []
  ): Promise<AssistantResponse> {
    try {
      console.log('🚀 Enviando mensaje a OpenAI backend:', { assistantId, message });

      const response = await this.apiClient.post('/chat', {
        assistantId,
        message,
        context: context.slice(-10), // Solo los últimos 10 mensajes para contexto
        timestamp: new Date().toISOString()
      });

      console.log('✅ Respuesta recibida del backend:', response.data);

      // El backend responde con { success: true, response: {...} }
      // Necesitamos extraer solo la parte 'response'
      if (response.data.success && response.data.response) {
        // Verificar que sea una respuesta real de OpenAI
        if (response.data.response.metadata?.isReal !== false) {
          return response.data.response;
        } else {
          throw new Error('Solo se permiten respuestas reales de OpenAI - modo mock deshabilitado');
        }
      } else {
        throw new Error(response.data.message || 'Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw new Error(`Error de comunicación con OpenAI: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async getAssistantInfo(assistantId: string) {
    try {
      const response = await this.apiClient.get(`/assistants/${assistantId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting assistant info:', error);
      throw error;
    }
  }

  async getAnalytics(assistantId?: string) {
    try {
      const endpoint = assistantId ? `/analytics/${assistantId}` : '/analytics';
      const response = await this.apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

  async saveFeedback(sessionId: string, rating: number, comment?: string) {
    try {
      const response = await this.apiClient.post('/feedback', {
        sessionId,
        rating,
        comment,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error saving feedback:', error);
      throw error;
    }
  }

  // Integración con el sistema Alpaso existente
  async integrateWithAlpaso(action: string, data: any) {
    try {
      const response = await this.apiClient.post('/integrations/alpaso', {
        action,
        data,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error integrating with Alpaso:', error);
      throw error;
    }
  }
}

export const assistantService = new AssistantService();
