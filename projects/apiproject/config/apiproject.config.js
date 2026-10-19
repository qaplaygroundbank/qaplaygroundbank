
const environments = {
    qa: {
        baseUrl: 'https://jsonplaceholder.typicode.com'
    },
    dev: {
        baseUrl: 'https://jsonplaceholder.typicode.com'
    }
};

const environment = process.env.QA_PLAYGROUND_ENV || 'qa';

const config = environments[environment];

if (!config) {
    throw new Error(
        `Unknown API environment: "${environment}". Available environments: ${Object.keys(environments).join(', ')}`
    );
}

export default config;
