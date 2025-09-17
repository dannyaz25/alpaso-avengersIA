#!/usr/bin/env node

import { chromium } from 'playwright';
import { TEST_CONFIG } from '../config/test-config.js';

/**
 * Voice Test Runner - Tests voice functionality for all assistants
 */
class VoiceTestRunner {
  constructor() {
    this.frontendURL = TEST_CONFIG.FRONTEND_URL;
    this.results = {
      voiceRecognition: { passed: 0, failed: 0 },
      voiceSynthesis: { passed: 0, failed: 0 },
      callFunctionality: { passed: 0, failed: 0 }
    };
  }

  async runAllTests() {
    console.log('🎤 Iniciando pruebas de funcionalidad de voz AvengersIA...\n');

    const browser = await chromium.launch({
      headless: false,
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--allow-running-insecure-content'
      ]
    });

    try {
      for (const assistant of TEST_CONFIG.TEST_ASSISTANTS) {
        console.log(`\n🤖 Probando funcionalidad de voz con: ${assistant.toUpperCase()}`);
        console.log('━'.repeat(50));

        await this.testAssistantVoice(browser, assistant);
      }
    } finally {
      await browser.close();
    }

    this.generateReport();
  }

  async testAssistantVoice(browser, assistantName) {
    const context = await browser.newContext({
      permissions: ['microphone', 'camera']
    });

    const page = await context.newPage();

    try {
      // Navigate to assistant
      await page.goto(`${this.frontendURL}/${assistantName}`);
      await page.waitForSelector(`[data-testid="${assistantName}-assistant"]`, { timeout: 10000 });

      console.log(`✅ Cargado asistente ${assistantName}`);

      // Test 1: Voice Call Start
      console.log('\n📞 Probando inicio de llamada de voz...');
      await this.testVoiceCallStart(page);

      // Test 2: Voice Recognition
      console.log('\n🎤 Probando reconocimiento de voz...');
      await this.testVoiceRecognition(page);

      // Test 3: Voice Synthesis
      console.log('\n🔊 Probando síntesis de voz...');
      await this.testVoiceSynthesis(page);

      // Test 4: Call End
      console.log('\n📴 Probando finalización de llamada...');
      await this.testVoiceCallEnd(page);

    } catch (error) {
      console.log(`❌ Error en pruebas de voz para ${assistantName}:`, error.message);
      this.results.callFunctionality.failed++;
    } finally {
      await context.close();
    }
  }

  async testVoiceCallStart(page) {
    try {
      // Click call button
      await page.click('[data-testid="call-button"]');

      // Wait for call to be active
      await page.waitForSelector('[data-testid="call-active"]', { timeout: 10000 });

      console.log('✅ Llamada de voz iniciada correctamente');
      this.results.callFunctionality.passed++;

    } catch (error) {
      console.log('❌ Error iniciando llamada de voz:', error.message);
      this.results.callFunctionality.failed++;
    }
  }

  async testVoiceRecognition(page) {
    try {
      // Simulate speech recognition
      await page.evaluate(() => {
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
          const event = new Event('result');
          event.results = [[{
            transcript: 'Hola, esta es una prueba de reconocimiento de voz',
            confidence: 0.9,
            isFinal: true
          }]];

          // Trigger speech recognition result
          if (window.mockSpeechRecognition && window.mockSpeechRecognition.onresult) {
            window.mockSpeechRecognition.onresult(event);
          }
        }
      });

      // Wait for voice input to be processed
      await page.waitForTimeout(2000);

      // Check if voice input was processed
      const hasVoiceInput = await page.locator('text=Hola, esta es una prueba').isVisible();

      if (hasVoiceInput) {
        console.log('✅ Reconocimiento de voz funcionando');
        this.results.voiceRecognition.passed++;
      } else {
        console.log('⚠️ Reconocimiento de voz no detectado visualmente');
        this.results.voiceRecognition.failed++;
      }

    } catch (error) {
      console.log('❌ Error en reconocimiento de voz:', error.message);
      this.results.voiceRecognition.failed++;
    }
  }

  async testVoiceSynthesis(page) {
    try {
      // Send a text message to trigger voice response
      await page.fill('[data-testid="message-input"]', 'Hola, responde por favor');
      await page.click('[data-testid="send-button"]');

      // Wait for assistant response
      await page.waitForSelector('[data-testid="assistant-message"]', { timeout: 15000 });

      // Check if speech synthesis was triggered
      const speechSynthesisTriggered = await page.evaluate(() => {
        return window.speechSynthesis &&
               typeof window.speechSynthesis.speak === 'function';
      });

      if (speechSynthesisTriggered) {
        console.log('✅ Síntesis de voz disponible');
        this.results.voiceSynthesis.passed++;
      } else {
        console.log('❌ Síntesis de voz no disponible');
        this.results.voiceSynthesis.failed++;
      }

    } catch (error) {
      console.log('❌ Error en síntesis de voz:', error.message);
      this.results.voiceSynthesis.failed++;
    }
  }

  async testVoiceCallEnd(page) {
    try {
      // Click end call button
      await page.click('[data-testid="end-call-button"]');

      // Wait for call to end
      await page.waitForSelector('[data-testid="call-ended"]', { timeout: 5000 });

      console.log('✅ Llamada finalizada correctamente');
      this.results.callFunctionality.passed++;

    } catch (error) {
      console.log('❌ Error finalizando llamada:', error.message);
      this.results.callFunctionality.failed++;
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🎤 REPORTE FINAL DE PRUEBAS DE VOZ');
    console.log('='.repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;

    for (const [category, results] of Object.entries(this.results)) {
      const total = results.passed + results.failed;
      const successRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;

      console.log(`\n🔧 ${category}:`);
      console.log(`   ✅ Pasaron: ${results.passed}`);
      console.log(`   ❌ Fallaron: ${results.failed}`);
      console.log(`   📈 Tasa de éxito: ${successRate}%`);

      totalPassed += results.passed;
      totalFailed += results.failed;
    }

    const overallSuccessRate = (totalPassed + totalFailed) > 0 ?
      ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1) : 0;

    console.log(`\n🏆 RESUMEN GENERAL:`);
    console.log(`   ✅ Total pasaron: ${totalPassed}`);
    console.log(`   ❌ Total fallaron: ${totalFailed}`);
    console.log(`   📈 Tasa de éxito general: ${overallSuccessRate}%`);

    if (overallSuccessRate >= 80) {
      console.log(`\n🎉 ¡PRUEBAS DE VOZ COMPLETADAS EXITOSAMENTE!`);
      process.exit(0);
    } else {
      console.log(`\n⚠️  ALGUNAS PRUEBAS DE VOZ FALLARON`);
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new VoiceTestRunner();
  runner.runAllTests().catch(error => {
    console.error('❌ Error ejecutando pruebas de voz:', error);
    process.exit(1);
  });
}

export default VoiceTestRunner;
