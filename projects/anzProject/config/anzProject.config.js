import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const categorySummaryReporter = fileURLToPath(
    new URL('./categorySummaryReporter.js', import.meta.url)
);

export default defineConfig({
    testDir: '../tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['list'], [categorySummaryReporter]],
    use: {
        launchOptions: {
            slowMo: Number(process.env.ANZ_SLOW_MO_MS || 0)
        },
        trace: 'on-first-retry'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        }
    ]
});
