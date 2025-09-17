import { test, expect, Page } from '@playwright/test';
import { TestHelpers } from '../../utils/test-helpers';
import { TEST_CONFIG } from '../../config/test-config';

test.describe('AvengersIA Assistants E2E Tests', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage, context }) => {
    page = testPage;

    // Grant necessary permissions
    await context.grantPermissions(['microphone', 'camera']);

    // Check API health before each test
    const apiHealthy = await TestHelpers.checkAPIHealth();
    if (!apiHealthy) {
      throw new Error('Backend API is not healthy');
    }
  });

  test.describe('Stark Assistant Tests', () => {
    test('should load Stark assistant successfully', async () => {
      await TestHelpers.navigateToAssistant(page, 'stark');

      // Verify Stark specific elements
      await expect(page.locator('[data-testid="stark-assistant"]')).toBeVisible();
      await expect(page.locator('text=Stark')).toBeVisible();
      await expect(page.locator('[data-testid="call-button"]')).toBeVisible();

      console.log('✅ Stark assistant loaded successfully');
    });

    test('should handle text chat with Stark', async () => {
      await TestHelpers.navigateToAssistant(page, 'stark');

      const testMessage = 'Hola Stark, ayúdame con marketing';
      await TestHelpers.sendTextMessage(page, testMessage);

      // Wait for assistant response
      const response = await TestHelpers.waitForAssistantResponse(page);
      expect(response).toBeTruthy();
      expect(response?.length).toBeGreaterThan(0);

      console.log('✅ Text chat with Stark working');
    });

    test('should start and end voice call with Stark', async () => {
      await TestHelpers.navigateToAssistant(page, 'stark');
      await TestHelpers.grantMicrophonePermissions(page);

      // Start voice call
      await TestHelpers.startVoiceCall(page);

      // Verify call is active
      await expect(page.locator('[data-testid="call-active"]')).toBeVisible();

      // End call
      await TestHelpers.endVoiceCall(page);

      // Verify call ended
      await expect(page.locator('[data-testid="call-ended"]')).toBeVisible();

      console.log('✅ Voice call functionality working with Stark');
    });
  });

  test.describe('Cap Assistant Tests', () => {
    test('should load Cap assistant successfully', async () => {
      await TestHelpers.navigateToAssistant(page, 'cap');

      // Verify Cap specific elements
      await expect(page.locator('[data-testid="cap-assistant"]')).toBeVisible();
      await expect(page.locator('text=Cap')).toBeVisible();
      await expect(page.locator('[data-testid="call-button"]')).toBeVisible();

      console.log('✅ Cap assistant loaded successfully');
    });

    test('should handle customer support scenarios with Cap', async () => {
      await TestHelpers.navigateToAssistant(page, 'cap');

      const supportMessage = 'Necesito ayuda con mi cuenta';
      await TestHelpers.sendTextMessage(page, supportMessage);

      const response = await TestHelpers.waitForAssistantResponse(page);
      expect(response).toBeTruthy();
      expect(response?.toLowerCase()).toContain('ayuda');

      console.log('✅ Customer support functionality working with Cap');
    });
  });

  test.describe('Spidey Assistant Tests', () => {
    test('should load Spidey assistant successfully', async () => {
      await TestHelpers.navigateToAssistant(page, 'spidey');

      // Verify Spidey specific elements
      await expect(page.locator('[data-testid="spidey-assistant"]')).toBeVisible();
      await expect(page.locator('text=Spidey')).toBeVisible();
      await expect(page.locator('[data-testid="call-button"]')).toBeVisible();

      console.log('✅ Spidey assistant loaded successfully');
    });

    test('should handle sales scenarios with Spidey', async () => {
      await TestHelpers.navigateToAssistant(page, 'spidey');

      const salesMessage = 'Quiero información sobre productos de café';
      await TestHelpers.sendTextMessage(page, salesMessage);

      const response = await TestHelpers.waitForAssistantResponse(page);
      expect(response).toBeTruthy();
      expect(response?.toLowerCase()).toContain('café');

      console.log('✅ Sales functionality working with Spidey');
    });
  });

  test.describe('Voice Recognition Tests', () => {
    TEST_CONFIG.TEST_ASSISTANTS.forEach((assistant) => {
      test(`should handle voice input with ${assistant}`, async () => {
        await TestHelpers.navigateToAssistant(page, assistant);
        await TestHelpers.grantMicrophonePermissions(page);

        // Start voice call
        await TestHelpers.startVoiceCall(page);

        // Simulate voice input
        const voiceText = `Hola ${assistant}, ¿puedes ayudarme?`;
        await TestHelpers.simulateVoiceInput(page, voiceText);

        // Wait for voice to be processed and response
        await page.waitForTimeout(2000);
        const response = await TestHelpers.waitForAssistantResponse(page);
        expect(response).toBeTruthy();

        // End call
        await TestHelpers.endVoiceCall(page);

        console.log(`✅ Voice input working with ${assistant}`);
      });
    });
  });

  test.describe('Error Handling Tests', () => {
    test('should handle network errors gracefully', async () => {
      // Simulate network failure
      await page.route('**/api/chat', route => route.abort());

      await TestHelpers.navigateToAssistant(page, 'stark');
      await TestHelpers.sendTextMessage(page, 'Test message');

      // Should show error message
      await expect(page.locator('text=Error')).toBeVisible({ timeout: 10000 });

      console.log('✅ Network error handling working');
    });

    test('should handle microphone permission denied', async () => {
      await TestHelpers.navigateToAssistant(page, 'stark');

      // Deny microphone permissions
      await page.context().clearPermissions();

      await page.click('[data-testid="call-button"]');

      // Should show permission error
      await expect(page.locator('text=micrófono')).toBeVisible({ timeout: 10000 });

      console.log('✅ Microphone permission error handling working');
    });
  });
});
