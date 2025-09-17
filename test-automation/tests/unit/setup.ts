import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Speech API for voice testing
Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    abort: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    continuous: true,
    interimResults: true,
    lang: 'es-ES'
  }))
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: window.SpeechRecognition
});

// Mock Web Audio API
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    createMediaStreamSource: vi.fn(),
    createAnalyser: vi.fn(),
    close: vi.fn(),
    resume: vi.fn()
  }))
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: window.AudioContext
});

// Mock getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [
        {
          stop: vi.fn(),
          getSettings: () => ({ deviceId: 'mock-device' })
        }
      ]
    })
  }
});

// Mock Speech Synthesis API
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => [
      {
        name: 'Test Voice',
        lang: 'es-ES',
        default: true,
        localService: true,
        voiceURI: 'test-voice'
      }
    ])
  }
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  writable: true,
  value: vi.fn().mockImplementation((text) => ({
    text,
    voice: null,
    volume: 1,
    rate: 1,
    pitch: 1,
    onstart: null,
    onend: null,
    onerror: null
  }))
});

// Mock fetch for API calls
global.fetch = vi.fn();

// Setup test environment
beforeEach(() => {
  vi.clearAllMocks();
});
