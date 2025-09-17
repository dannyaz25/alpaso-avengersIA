import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import StarkAssistant from './components/assistants/StarkAssistant';
import CapAssistant from './components/assistants/CapAssistant';
import SpideyAssistant from './components/assistants/SpideyAssistant';
import Navigation from './components/Navigation';
import { AssistantProvider } from './contexts/AssistantContext';
import './App.css';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
    color: white;
    min-height: 100vh;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }
`;

const theme = {
  colors: {
    primary: '#00d4ff',
    secondary: '#ff6b6b',
    stark: '#ffd700',
    cap: '#1e40af',
    spidey: '#dc2626',
    dark: '#0f0f23',
    light: '#ffffff',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  }
};

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding: 0;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AssistantProvider>
        <Router>
          <AppContainer>
            <Navigation />
            <MainContent
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stark" element={<StarkAssistant />} />
                <Route path="/cap" element={<CapAssistant />} />
                <Route path="/spidey" element={<SpideyAssistant />} />
              </Routes>
            </MainContent>
          </AppContainer>
        </Router>
      </AssistantProvider>
    </ThemeProvider>
  );
}

export default App;
