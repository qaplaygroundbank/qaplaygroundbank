
import logger from '../../commonlib/logger.js';

async function runApiProject(options) {
    logger.info('=================================');
    logger.info('      API PROJECT EXECUTION      ');
    logger.info('=================================');

    logger.info(`Environment : ${options.env}`);
    logger.info(`Suite       : ${options.suite}`);

    logger.info('Starting API project...');

    // API test execution will be implemented here.

    logger.info('API project execution completed.');
}

export { runApiProject };
