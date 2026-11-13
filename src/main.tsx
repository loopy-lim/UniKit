import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { UnikitThemeProvider } from '@unikit-bridge/ui';

import App from './App';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root not found — check index.html');

createRoot(root).render(
  <StrictMode>
    <UnikitThemeProvider storageKey="unikit-theme">
      <App />
    </UnikitThemeProvider>
  </StrictMode>,
);
