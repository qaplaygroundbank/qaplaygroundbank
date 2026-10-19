
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const reporters = (
    process.env.QA_PLAYGROUND_REPORTERS || 'html'
)
    .split(',')
    .map((reporter) => reporter.trim().toLowerCase())
    .filter(Boolean);

const outputDirectory = path.resolve(
    process.env.QA_PLAYGROUND_REPORT_DIR ||
    path.join(
        'reports',
        'securebank',
        process.env.QA_PLAYGROUND_ENV || 'qa',
        process.env.QA_PLAYGROUND_SUITE || 'smoke'
    )
);

const configuredReporters = [];

if (reporters.includes('html')) {
    configuredReporters.push([
        'html',
        {
            outputFolder: outputDirectory,
            open: 'never'
        }
    ]);
}

if (reporters.includes('allure')) {
    configuredReporters.push([
        'allure-playwright',
        {
            resultsDir: path.join(outputDirectory, 'allure-results')
        }
    ]);
}

if (reporters.includes('excel')) {
    configuredReporters.push([
        'json',
        {
            outputFile: path.join(
                outputDirectory,
                'playwright-results.json'
            )
        }
    ]);
}

export default defineConfig({
    testDir: '../tests',

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 1 : undefined,

    reporter: configuredReporters,

    use: {
        trace: 'on-first-retry'
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome']
            }
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox']
            }
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari']
            }
        }
    ]
});
