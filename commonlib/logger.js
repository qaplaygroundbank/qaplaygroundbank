
const LOG_LEVELS = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40
};

const configuredLevel = (
    process.env.LOG_LEVEL || 'info'
).toLowerCase();

const minimumLevel = LOG_LEVELS[configuredLevel] ??
    LOG_LEVELS.info;

function writeLog(level, message, ...details) {
    if (LOG_LEVELS[level] < minimumLevel) {
        return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    const output = console[level] || console.log;
    output(prefix, message, ...details);
}

const logger = {
    debug(message, ...details) {
        writeLog('debug', message, ...details);
    },

    info(message, ...details) {
        writeLog('info', message, ...details);
    },

    warn(message, ...details) {
        writeLog('warn', message, ...details);
    },

    error(message, ...details) {
        writeLog('error', message, ...details);
    }
};

export { logger };
export default logger;
