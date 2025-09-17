import { Page, expect } from '@playwright/test';
import { TEST_CONFIG } from '../config/test-config';

export class TestHelpers {

  /**
   * Wait for assistant to be ready
   */
  static async waitForAssistantReady(page: Page, assistantName: string) {
    await page.waitForSelector(`[data-testid="${assistantName}-assistant"]`, {
      timeout: TEST_CONFIG.DEFAULT_TIMEOUT
    });
    console.log(`✅ Assistant ${assistantName} is ready`);
  }

  /**
   * Grant microphone permissions
   */
  static async grantMicrophonePermissions(page: Page) {
    await page.context().grantPermissions(['microphone']);
    console.log('✅ Microphone permissions granted');
  }

  /**
   * Simulate voice input
   */
  static async simulateVoiceInput(page: Page, text: string) {
    await page.evaluate((inputText) => {
      const event = new Event('result');
      (event as any).results = [[{
        transcript: inputText,
        confidence: 0.9,
        isFinal: true
      }]];

      if (window.mockSpeechRecognition) {
        window.mockSpeechRecognition.onresult(event);
      }
    }, text);
    console.log(`🎤 Simulated voice input: "${text}"`);
  }

  /**
   * Wait for chat message to appear
   */
  static async waitForChatMessage(page: Page, message: string, timeout = TEST_CONFIG.DEFAULT_TIMEOUT) {
    await page.waitForSelector(`text=${message}`, { timeout });
    console.log(`💬 Chat message found: "${message}"`);
  }

  /**
   * Check API health
   */
  static async checkAPIHealth(baseUrl: string = TEST_CONFIG.BACKEND_URL) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();
      console.log('✅ API Health check passed:', data);
      return true;
    } catch (error) {
      console.error('❌ API Health check failed:', error);
      return false;
    }
  }

  /**
   * Start voice call simulation
   */
  static async startVoiceCall(page: Page) {
    await page.click('[data-testid="call-button"]');
    await page.waitForSelector('[data-testid="call-active"]', {
      timeout: TEST_CONFIG.VOICE_TIMEOUT
    });
    console.log('📞 Voice call started');
  }

  /**
   * End voice call
   */
  static async endVoiceCall(page: Page) {
    await page.click('[data-testid="end-call-button"]');
    await page.waitForSelector('[data-testid="call-ended"]', {
      timeout: TEST_CONFIG.DEFAULT_TIMEOUT
    });
    console.log('📞 Voice call ended');
  }

  /**
   * Send text message to assistant
   */
  static async sendTextMessage(page: Page, message: string) {
    await page.fill('[data-testid="message-input"]', message);
    await page.click('[data-testid="send-button"]');
    console.log(`📝 Text message sent: "${message}"`);
  }

  /**
   * Wait for assistant response
   */
  static async waitForAssistantResponse(page: Page, timeout = TEST_CONFIG.DEFAULT_TIMEOUT) {
    await page.waitForSelector('[data-testid="assistant-message"]', { timeout });
    const response = await page.textContent('[data-testid="assistant-message"]:last-child');
    console.log(`🤖 Assistant response: "${response}"`);
    return response;
  }

  /**
   * Navigate to assistant page
   */
  static async navigateToAssistant(page: Page, assistantName: string) {
    await page.goto(`${TEST_CONFIG.FRONTEND_URL}/${assistantName}`);
    await this.waitForAssistantReady(page, assistantName);
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshot-${name}-${timestamp}.png`;
    await page.screenshot({ path: `test-results/${filename}` });
    console.log(`📸 Screenshot taken: ${filename}`);
  }

  /**
   * Check console errors
   */
  static async checkConsoleErrors(page: Page) {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }
}
