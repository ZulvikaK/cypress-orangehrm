import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com/web/index.php',
    supportFile: 'cypress/support/e2e.ts'
  }
});

