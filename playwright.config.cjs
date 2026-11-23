const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'node server.mjs',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: false,
    timeout: 15000
  }
});
