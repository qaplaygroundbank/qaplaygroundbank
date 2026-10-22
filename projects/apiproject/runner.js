
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Mocha from 'mocha';
import logger from '../../commonlib/logger.js';
import {
    initializeReporting,
    generateAllureReport
} from '../../commonlib/reportManager.js';
import { generateExcelReport } from '../../commonlib/excelReporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const suiteTags = {
    smoke: /@smoke/,
    regression: /@regression/,
    negative: /@negative/
};

async function runApiProject(options) {
    const environment = options.env || 'qa';
    const suite = (options.suite || 'smoke').toLowerCase();

    logger.info('=================================');
    logger.info('      API PROJECT EXECUTION      ');
    logger.info('=================================');
    logger.info(`Environment : ${environment}`);
    logger.info(`Suite       : ${suite}`);

    const selectedTag = suiteTags[suite];

    if (!selectedTag) {
        logger.error(
            `Unknown API suite: "${suite}". Available suites: ${Object.keys(suiteTags).join(', ')}`
        );
        return 1;
    }

    let reportConfig;

    try {
        reportConfig = await initializeReporting({
            project: 'api',
            env: environment,
            suite,
            reporters: options.reporters || 'html'
        });
    } catch (error) {
        logger.error(`Reporting configuration failed: ${error.message}`);
        return 1;
    }

    process.env.QA_PLAYGROUND_ENV = environment;

    try {
        const testDirectory = path.join(__dirname, 'tests');
        const files = await readdir(testDirectory);

        const testFiles = files
            .filter((file) => file.endsWith('.test.js'))
            .sort();

        if (testFiles.length === 0) {
            throw new Error(`No .test.js files found in ${testDirectory}`);
        }

        const wantsHtml = reportConfig.reporters.includes('html');
        const wantsAllure = reportConfig.reporters.includes('allure');
        const wantsExcel = reportConfig.reporters.includes('excel');

        let reporter = 'spec';
        let reporterOptions = {};

        if (wantsAllure) {
            reporter = 'allure-mocha';

            reporterOptions = {
                resultsDir: reportConfig.getOutputPath('allure-results'),

                extraReporters: wantsHtml
                    ? [
                        'mochawesome',
                        {
                            reportDir: reportConfig.outputDirectory,
                            reportFilename: 'api-report',
                            html: true,
                            json: false,
                            overwrite: true,
                            quiet: true
                        }
                    ]
                    : 'spec'
            };
        } else if (wantsHtml) {
            reporter = 'mochawesome';

            reporterOptions = {
                reportDir: reportConfig.outputDirectory,
                reportFilename: 'api-report',
                html: true,
                json: false,
                overwrite: true,
                quiet: true
            };
        }

        const mocha = new Mocha({
            reporter,
            reporterOptions,
            timeout: 10000
        });

        mocha.grep(selectedTag);

        for (const testFile of testFiles) {
            mocha.addFile(path.join(testDirectory, testFile));
        }

        logger.info(`Discovered ${testFiles.length} API test files.`);
        logger.info(`Applying tag filter: ${selectedTag}`);
        logger.info(`Report formats: ${reportConfig.reporters.join(', ')}`);

        await mocha.loadFilesAsync();

        const testResults = [];

        const exitCode = await new Promise((resolve) => {
            const runner = mocha.run((failures) => {
                resolve(
                    failures > 0 || runner.stats.tests === 0 ? 1 : 0
                );
            });

            runner.on('pass', (test) => {
                testResults.push({
                    testCase: test.fullTitle(),
                    suite: test.parent?.title || '',
                    status: 'Passed',
                    duration: test.duration ?? 0,
                    error: ''
                });
            });

            runner.on('fail', (test, error) => {
                testResults.push({
                    testCase: test.fullTitle(),
                    suite: test.parent?.title || '',
                    status: 'Failed',
                    duration: test.duration ?? 0,
                    error: error?.stack || error?.message || String(error)
                });
            });

            runner.on('pending', (test) => {
                testResults.push({
                    testCase: test.fullTitle(),
                    suite: test.parent?.title || '',
                    status: 'Skipped',
                    duration: 0,
                    error: ''
                });
            });
        });

        if (exitCode !== 0) {
            logger.error('API test execution failed or no tests matched.');
        } else {
            logger.info('API test execution completed.');
        }

        // Generate the Excel workbook from the same Mocha execution.
        if (wantsExcel) {
            try {
                const excelPath = await generateExcelReport(
                    testResults,
                    reportConfig
                );

                logger.info(`Excel report generated: ${excelPath}`);
            } catch (error) {
                logger.error(`Excel report generation failed: ${error.message}`);
                return 1;
            }
        }

        // Generate the browsable Allure report when requested.
        if (wantsAllure) {
            try {
                await generateAllureReport(reportConfig);
            } catch (error) {
                logger.error(`Allure report generation failed: ${error.message}`);
                return 1;
            }
        }

        return exitCode;
    } catch (error) {
        logger.error(`API project execution failed: ${error.message}`);
        return 1;
    }
}

export { runApiProject };
