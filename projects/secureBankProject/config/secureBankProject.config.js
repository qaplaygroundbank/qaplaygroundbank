
import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(configDirectory, '../../..');

export default defineConfig({
    testDir: '../tests',

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['list'],
        [
            'html',
            {
                outputFolder: path.join(repositoryRoot, 'playwright-report'),
                open: 'never'
            }
        ],
        [
            'allure-playwright',
            { resultsDir: path.join(repositoryRoot, 'allure-results') }
        ],
        [
            path.join(configDirectory, '../reporters/excelReporter.js'),
            {
                outputFile: path.join(
                    repositoryRoot,
                    'excel-report/securebank-test-execution-report.xlsx'
                )
            }
        ]
    ],

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
