import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered: ', registration);
       // Handle updates
       registration.addEventListener('updatefound', () => {
         const newWorker = registration.installing;
         // Add null check before using newWorker
         if (newWorker) {
           newWorker.addEventListener('statechange', () => {
             if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
               // New content is available; notify user to refresh
               console.log('New version available! Refresh to update.');
               // You could show a notification to the user here
             }
           });
         }
       });
      })
      .catch(registrationError => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
}
