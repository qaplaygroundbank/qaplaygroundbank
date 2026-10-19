
import path from 'node:path';

const SUPPORTED_REPORTERS = ['html', 'allure', 'excel'];

function getReportConfig(options = {}) {
    const requestedReporters = options.reporters ?? 'html';

    const reporters = (
        Array.isArray(requestedReporters)
            ? requestedReporters
            : String(requestedReporters).split(',')
    )
        .map((reporter) => reporter.trim().toLowerCase())
        .filter(Boolean);

    if (reporters.length === 0) {
        throw new Error(
            'Select at least one reporter: html, allure, or excel.'
        );
    }

    const unsupported = reporters.filter(
        (reporter) => !SUPPORTED_REPORTERS.includes(reporter)
    );

    if (unsupported.length > 0) {
        throw new Error(
            `Unsupported reporter(s): ${unsupported.join(', ')}. ` +
            `Supported reporters: ${SUPPORTED_REPORTERS.join(', ')}`
        );
    }

    const uniqueReporters = [...new Set(reporters)];

    const project = options.project || 'api';
    const environment = options.env || 'qa';
    const suite = options.suite || 'smoke';

    const outputDirectory = path.resolve(
        options.outputDirectory ||
        path.join('reports', project, environment, suite)
    );

    return {
        project,
        environment,
        suite,
        reporters: uniqueReporters,
        outputDirectory
    };
}

export {
    getReportConfig,
    SUPPORTED_REPORTERS
};
