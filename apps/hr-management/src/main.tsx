import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Import App
import App from './app.tsx';
import { AppStateProvider } from './context/AppStateContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>,
);

