import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.ciapet.app',
  appName: 'Saúde Animal',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
