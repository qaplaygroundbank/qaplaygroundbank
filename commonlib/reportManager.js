
import fs from 'node:fs/promises';
import path from 'node:path';
import allure from 'allure-commandline';
import logger from './logger.js';
import { getReportConfig } from './reportConfig.js';

async function initializeReporting(options = {}) {
    const config = getReportConfig(options);

    await fs.mkdir(config.outputDirectory, {
        recursive: true
    });

    logger.info('=================================');
    logger.info('       REPORT CONFIGURATION      ');
    logger.info('=================================');
    logger.info(`Project     : ${config.project}`);
    logger.info(`Environment : ${config.environment}`);
    logger.info(`Suite       : ${config.suite}`);
    logger.info(`Reporters   : ${config.reporters.join(', ')}`);
    logger.info(`Output      : ${config.outputDirectory}`);

    return {
        ...config,

        getOutputPath(fileName) {
            return path.join(config.outputDirectory, fileName);
        }
    };
}

async function generateAllureReport(reportConfig) {
    if (!reportConfig.reporters.includes('allure')) {
        return;
    }

    const resultsDirectory = reportConfig.getOutputPath('allure-results');
    const reportDirectory = reportConfig.getOutputPath('allure-report');

    logger.info('Generating Allure HTML report...');

    await fs.access(resultsDirectory);

    await new Promise((resolve, reject) => {
        const generation = allure([
            'generate',
            resultsDirectory,
            '-o',
            reportDirectory,
            '--clean'
        ]);

        generation.on('exit', (exitCode) => {
            if (exitCode === 0) {
                logger.info(`Allure report generated: ${reportDirectory}`);
                resolve();
            } else {
                reject(
                    new Error(`Allure report generation failed with exit code ${exitCode}`)
                );
            }
        });

        generation.on('error', reject);
    });
}

export {
    initializeReporting,
    generateAllureReport
};
