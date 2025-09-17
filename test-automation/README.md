# AvengersIA Test Automation Suite

## 📋 Descripción

Suite completa de pruebas automatizadas para el proyecto Alpaso AvengersIA, que incluye testing para:

- 🤖 **Asistentes de IA** (Stark, Cap, Spidey)
- 🎤 **Funcionalidad de voz** (Speech-to-Text, Text-to-Speech)
- 🔄 **Automatización del viaje del barista**
- 🌐 **APIs del backend**
- ⚛️ **Componentes React del frontend**

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Instalar Playwright browsers
npm run playwright:install
```

## 🔧 Configuración

1. Copiar el archivo de configuración:
```bash
cp .env.example .env
```

2. Configurar las variables de entorno:
```env
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:5004
NODE_ENV=test
```

## 🏃‍♂️ Ejecución de Pruebas

### Pruebas Completas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar todas las pruebas incluyendo E2E
npm run test:all
```

### Pruebas Específicas

#### Pruebas de Asistentes
```bash
# Probar todos los asistentes IA
npm run test:assistants

# Resultado esperado:
# ✅ Stark: Marketing y growth hacking
# ✅ Cap: Soporte al cliente
# ✅ Spidey: Ventas y conversiones
```

#### Pruebas de Voz
```bash
# Probar funcionalidad de voz
npm run test:voice

# Incluye:
# 🎤 Reconocimiento de voz (Speech-to-Text)
# 🔊 Síntesis de voz (Text-to-Speech)
# 📞 Llamadas de voz completas
```

#### Pruebas de Automatización
```bash
# Probar flujos de automatización
npm run test:automation

# Prueba el viaje completo del barista:
# 📍 Descubrimiento → Interés → Consideración → 
# 📝 Registro → 🎯 Participación → 🔄 Retención
```

#### Pruebas E2E (End-to-End)
```bash
# Pruebas E2E con Playwright
npm run test:e2e

# Con interfaz visual
npm run test:e2e:ui

# En modo debug
npm run test:e2e:debug
```

#### Pruebas de API
```bash
# Pruebas del backend API
npm run test:api
```

#### Pruebas Unitarias
```bash
# Pruebas unitarias con Vitest
npm run test:unit

# Con coverage
npm run test:coverage
```

## 📊 Tipos de Pruebas

### 1. Pruebas de Asistentes IA
- **Stark (Marketing)**: Pruebas de campañas, ROI, estrategias
- **Cap (Soporte)**: Pruebas de resolución de problemas, guías
- **Spidey (Ventas)**: Pruebas de conversión, productos, ventas

### 2. Pruebas de Voz
- **Speech Recognition**: Conversión de voz a texto
- **Speech Synthesis**: Conversión de texto a voz
- **Call Management**: Inicio, gestión y finalización de llamadas

### 3. Pruebas E2E
- **Flujos completos** de usuario
- **Interacciones** entre componentes
- **Navegación** entre páginas
- **Funcionalidad** en diferentes browsers

### 4. Pruebas de API
- **Endpoints** de chat
- **Autenticación** y autorización
- **Manejo de errores**
- **Performance** y timeouts

### 5. Pruebas Unitarias
- **Componentes React** individuales
- **Hooks** personalizados
- **Servicios** y utilidades
- **Mocks** de APIs externas

## 🔍 Estructura del Proyecto

```
test-automation/
├── package.json                 # Configuración del proyecto
├── playwright.config.ts         # Configuración de Playwright
├── vitest.config.ts             # Configuración de Vitest
├── tsconfig.json               # Configuración de TypeScript
├── global-setup.ts             # Setup global de pruebas
├── global-teardown.ts          # Cleanup global de pruebas
├── .env.example               # Variables de entorno ejemplo
│
├── config/
│   └── test-config.ts          # Configuración centralizada
│
├── utils/
│   └── test-helpers.ts         # Utilidades para pruebas
│
├── tests/
│   ├── e2e/
│   │   └── assistants.spec.ts  # Pruebas E2E de asistentes
│   ├── api/
│   │   └── chat.test.js        # Pruebas de API
│   └── unit/
│       ├── setup.ts            # Setup para pruebas unitarias
│       └── StarkAssistant.test.tsx # Pruebas unitarias
│
└── scripts/
    ├── assistant-test-runner.js    # Runner de pruebas de asistentes
    ├── voice-test-runner.js        # Runner de pruebas de voz
    └── automation-test-runner.js   # Runner de automatización
```

## 📈 Métricas y Reportes

### Cobertura de Código
```bash
npm run test:coverage
```
- **Objetivo**: >80% cobertura
- **Reporte**: `coverage/index.html`

### Reportes de E2E
```bash
npm run test:e2e
```
- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: En caso de fallos
- **Videos**: Para debugging (opcional)

### Reportes de Performance
- **Tiempo de respuesta**: <5s para chat
- **Tiempo de carga**: <3s para componentes
- **Memory usage**: Monitoreado durante pruebas

## 🔧 Configuraciones Avanzadas

### Browser Configuration (Playwright)
```typescript
// playwright.config.ts
export default defineConfig({
  // Permisos para pruebas de voz
  use: {
    permissions: ['microphone', 'camera']
  }
});
```

### Mock Configuration (Vitest)
```typescript
// tests/unit/setup.ts
// Mocks automáticos para Web APIs
Object.defineProperty(window, 'SpeechRecognition', {
  value: mockSpeechRecognition
});
```

## 🚦 CI/CD Integration

### GitHub Actions (ejemplo)
```yaml
- name: Run Tests
  run: |
    npm run test:ci
    npm run test:e2e
```

### Comandos para CI
```bash
# Pruebas para CI (sin interfaz)
npm run test:ci

# Matar servidores después de pruebas
npm run kill:servers
```

## 🐛 Debugging

### Debug Playwright Tests
```bash
# Modo debug paso a paso
npm run test:e2e:debug

# Con browser visible
npm run test:e2e:headed
```

### Debug Unit Tests
```bash
# Modo watch para desarrollo
npm run test:watch
```

### Logs y Screenshots
- **Console logs**: Capturados automáticamente
- **Screenshots**: En fallos de E2E
- **Network requests**: Monitoreados en E2E

## 📋 Checklist de Pruebas

### ✅ Antes de Deploy
- [ ] Todas las pruebas unitarias pasan
- [ ] Todas las pruebas de API pasan
- [ ] Pruebas E2E críticas pasan
- [ ] Cobertura de código >80%
- [ ] No hay errores de console críticos

### ✅ Testing de Voz
- [ ] Reconocimiento de voz funciona
- [ ] Síntesis de voz funciona
- [ ] Llamadas se inician correctamente
- [ ] Llamadas se terminan correctamente
- [ ] Permisos de micrófono se manejan

### ✅ Testing de Asistentes
- [ ] Stark responde a consultas de marketing
- [ ] Cap responde a consultas de soporte
- [ ] Spidey responde a consultas de ventas
- [ ] Contexto de conversación se mantiene
- [ ] Errores se manejan graciosamente

## 🆘 Troubleshooting

### Problemas Comunes

1. **Fallo en permisos de micrófono**
   ```bash
   # Verificar configuración de browser
   # Usar flags específicos para testing
   ```

2. **Timeouts en pruebas E2E**
   ```bash
   # Aumentar timeouts en playwright.config.ts
   timeout: 90000
   ```

3. **Fallo en conexión API**
   ```bash
   # Verificar que backend esté corriendo
   curl http://localhost:5004/health
   ```

## 🤝 Contribución

1. **Agregar nuevas pruebas**: Seguir estructura existente
2. **Actualizar mocks**: Mantener sincronizados con APIs reales
3. **Documentar cambios**: Actualizar este README

## 📞 Soporte

Para problemas con las pruebas:
1. Verificar logs en `test-results/`
2. Revisar screenshots de fallos
3. Consultar configuración en `config/test-config.ts`
