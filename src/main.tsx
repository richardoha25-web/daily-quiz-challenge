import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;

async function prepareWebRuntime() {
  if (Capacitor.isNativePlatform()) {
    // The native APK contains the authoritative web bundle. Do not let a
    // previously installed PWA service worker keep serving an older bundle
    // after an in-place Android update.
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      } catch {
        // Continue loading even if browser cleanup is unavailable.
      }
    }

    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      } catch {
        // Cache cleanup must never block native app startup.
      }
    }
  } else if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      void navigator.serviceWorker
        .register('./sw.js', { updateViaCache: 'none' })
        .catch(() => undefined);
    });
  }

  createRoot(root).render(<StrictMode><App /></StrictMode>);
}

void prepareWebRuntime();
