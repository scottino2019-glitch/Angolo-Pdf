import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for offline capability
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service Worker registration skipped or unsupported:', err);
    });
  });
} else if ('serviceWorker' in navigator) {
  // In development, also register so offline features and cache testing works
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    console.warn('Dev Service Worker:', err);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

