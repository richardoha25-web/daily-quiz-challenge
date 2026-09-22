import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.richard.dailyquizchallenge',
  appName: 'Daily Quiz & Challenge',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    hostname: 'dailyquiz.local',
    androidScheme: 'https',
  },
  android: {
    resolveServiceWorkerRequests: false,
  },
};

export default config;
