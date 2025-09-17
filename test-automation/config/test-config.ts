// Test configuration for AvengersIA testing suite
export const TEST_CONFIG = {
  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5174',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5004',

  // Timeouts
  DEFAULT_TIMEOUT: 30000,
  VOICE_TIMEOUT: 60000,
  API_TIMEOUT: 10000,

  // Test data
  TEST_ASSISTANTS: ['stark', 'cap', 'spidey'],

  // Voice testing configuration
  VOICE_CONFIG: {
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16,
    duration: 3000, // 3 seconds
  },

  // API endpoints
  API_ENDPOINTS: {
    HEALTH: '/health',
    CHAT: '/api/chat',
    ASSISTANTS: '/api/assistants'
  },

  // Test users
  TEST_USERS: {
    BARISTA: {
      email: 'barista@test.com',
      name: 'Test Barista'
    },
    CUSTOMER: {
      email: 'customer@test.com',
      name: 'Test Customer'
    }
  }
};

