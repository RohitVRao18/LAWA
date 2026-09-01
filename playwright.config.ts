import { defineConfig } from '@playwright/test';
import { ENV } from './config/env';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  
  reporter: [
    ['html', { open: 'never' }]
  ],

  timeout: 30000,

  use: {
    baseURL: ENV.baseURL,
    headless: false,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    },
    screenshot: 'on',
    video: 'retain-on-failure'
  }
});