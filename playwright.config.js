import { defineConfig, devices } from '@playwright/test'

const deploymentProtectionSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

export default defineConfig({
  testDir: './e2e',
  outputDir: 'output/qa/vmls-data-product-redesign/playwright/results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['line'],
    ['html', {
      open: 'never',
      outputFolder: 'output/qa/vmls-data-product-redesign/playwright/report',
    }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5180',
    colorScheme: 'light',
    locale: 'vi-VN',
    extraHTTPHeaders: deploymentProtectionSecret ? {
      'x-vercel-protection-bypass': deploymentProtectionSecret,
    } : undefined,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run dev -- --host 127.0.0.1 --port 5180',
    url: 'http://127.0.0.1:5180',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
