
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

import logger from '../../commonlib/logger.js';
import {
    initializeReporting,
    generateAllureReport
} from '../../commonlib/reportManager.js';
import { generateExcelReport } from '../../commonlib/excelReporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

function convertPlaywrightResults(jsonReport, environment) {
    const testResults = [];

    function processSuites(suites, parentTitles = []) {
        for (const suite of suites || []) {
            const suiteTitles = suite.title
                ? [...parentTitles, suite.title]
                : parentTitles;

            for (const spec of suite.specs || []) {
                for (const test of spec.tests || []) {
                    const results = test.results || [];
                    const finalResult = results[results.length - 1];

                    let status = 'Skipped';
                    let error = '';

                    if (finalResult) {
                        if (finalResult.status === 'passed') {
                            status = 'Passed';
                        } else if (
                            ['failed', 'timedOut', 'interrupted']
                                .includes(finalResult.status)
                        ) {
                            status = 'Failed';
                        }

                        error = (finalResult.errors || [])
                            .map((item) => item.message || '')
                            .filter(Boolean)
                            .join('\n');
                    } else if (test.status === 'unexpected') {
                        status = 'Failed';
                    }

                    testResults.push({
                        testCase: spec.title,
                        suite: suiteTitles.join(' > '),
                        status,
                        duration: results.reduce(
                            (total, result) => total + (result.duration || 0),
                            0
                        ),
                        environment,
                        error
                    });
                }
            }

            processSuites(suite.suites, suiteTitles);
        }
    }

    processSuites(jsonReport.suites);

    return testResults;
}

async function secureBankProject(options) {
    const browser = options.browser || 'chromium';
    const headed = options.headed || false;
    const suite = options.suite || 'smoke';

    // Initialize and validate the shared reporting configuration.
    const reportConfig = await initializeReporting({
        project: 'securebank',
        env: options.env || 'qa',
        suite,
        reporters: options.reporters || 'html'
    });

    logger.info('=================================');
    logger.info('      UI PROJECT EXECUTION       ');
    logger.info('=================================');
    logger.info(`Environment : ${reportConfig.environment}`);
    logger.info(`Suite       : ${suite}`);
    logger.info(`Browser     : ${browser}`);
    logger.info(`Headed      : ${headed}`);

    const configFile = path.resolve(
        __dirname,
        'config/secureBankProject.config.js'
    );

    const args = [
        require.resolve('@playwright/test/cli'),
        'test'
    ];

    if (options.testFile) {
        // Playwright treats positional file arguments as regular expressions
        // matched against the absolute test path. An absolute Windows path
        // contains backslashes, which are regex escape characters, so it never
        // matches and the run fails with "No tests found". Use a path relative
        // to the project folder with forward slashes instead.
        const absoluteTestFile = path.resolve(__dirname, options.testFile);
        const relativeTestFile = path
            .relative(__dirname, absoluteTestFile)
            .split(path.sep)
            .join('/');

        const testFile = relativeTestFile.startsWith('..')
            ? absoluteTestFile.split(path.sep).join('/')
            : relativeTestFile;
        args.push(testFile);
        logger.info(`Test File   : ${testFile}`);
    } else {
        logger.info('Test File   : All configured UI tests');
    }

    args.push('--config', configFile, '--project', browser);

    if (headed) {
        args.push('--headed');
    }

    const suiteNames = suite
        .split(',')
        .map((name) => name.trim().toLowerCase())
        .filter(Boolean);

    if (suiteNames.length === 0) {
        throw new Error('Please provide at least one suite name.');
    }

    // Regression means all tests; otherwise filter by the requested tags.
    if (!suiteNames.includes('regression')) {
        const escapedSuites = suiteNames.map((name) =>
            name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );

        args.push('--grep', `@(?:${escapedSuites.join('|')})`);
    }

    logger.info(`Config File : ${configFile}`);
    logger.info(`Report Dir  : ${reportConfig.outputDirectory}`);
    logger.info('Starting Playwright...');

    let testExitCode = 1;
    let executionError = null;

    try {
        testExitCode = await new Promise((resolve, reject) => {
            const playwrightProcess = spawn(
                process.execPath,
                args,
                {
                    stdio: 'inherit',
                    env: {
                        ...process.env,
                        QA_PLAYGROUND_ENV: reportConfig.environment,
                        QA_PLAYGROUND_SUITE: suite,
                        QA_PLAYGROUND_REPORTERS:
                            reportConfig.reporters.join(','),
                        QA_PLAYGROUND_REPORT_DIR:
                            reportConfig.outputDirectory
                    }
                }
            );

            playwrightProcess.on('error', reject);

            playwrightProcess.on('close', (exitCode) => {
                resolve(exitCode ?? 1);
            });
        });
    } catch (error) {
        executionError = error;
        logger.error(`Failed to start Playwright: ${error.message}`);
    }

    // Generate the requested reports even when tests fail.
    try {
        if (reportConfig.reporters.includes('allure')) {
            await generateAllureReport(reportConfig);
        }

        if (reportConfig.reporters.includes('excel')) {
            const jsonPath = reportConfig.getOutputPath(
                'playwright-results.json'
            );

            const jsonContent = await fs.readFile(jsonPath, 'utf8');
            const jsonReport = JSON.parse(jsonContent);

            const testResults = convertPlaywrightResults(
                jsonReport,
                reportConfig.environment
            );

            const excelPath = await generateExcelReport(
                testResults,
                reportConfig
            );

            logger.info(`Excel report generated: ${excelPath}`);
        }
    } catch (error) {
        logger.error(`Report generation failed: ${error.message}`);
        executionError = executionError || error;
    }

    if (executionError) {
        throw executionError;
    }

    if (testExitCode !== 0) {
        logger.error(`Playwright execution failed. Exit code: ${testExitCode}`);
        process.exitCode = testExitCode;
        return testExitCode;
    }

    logger.info('Playwright execution completed successfully.');
    return 0;
}

export { secureBankProject };
