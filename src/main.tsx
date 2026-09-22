import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;

async function prepareWebRuntime() {
  if (Capacitor.isNativePlatform()) {
    // Capacitor Android apps ship their web assets inside the APK. A PWA
    // service worker is unnecessary on native and can keep serving an older
    // app bundle after an in-place APK update.
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      } catch {
        // Continue loading the native app even if cleanup is unavailable.
      }
    }

    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      } catch {
        // Cache cleanup must never block app startup.
      }
    }

    createRoot(root).render(<StrictMode><App /></StrictMode>);
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      void navigator.serviceWorker
        .register('./sw.js', { updateViaCache: 'none' })
        .catch(() => undefined);
    });
  }

  createRoot(root).render(<StrictMode><App /></StrictMode>);
}

void prepareWebRuntime();
