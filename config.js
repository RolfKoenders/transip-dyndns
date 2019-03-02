const convict = require('convict');

const config = convict({
    transip: {
        login: {
            doc: 'The username to login',
            format: String,
            default: null,
            env: 'TRANSIP_LOGIN'
        },
        privateKeyPath: {
            doc: 'Path to where the private key is stored used for api request',
            format: String,
            default: null,
            env: 'TRANSIP_PRIVATE_KEY'
        }
    },
    logLocation: {
        doc: 'Path to create the log file',
        format: String,
        default: './output.log',
        env: 'TRANSIP_LOG_LOCATION'
    },
    dnsCheckInterval: {
        doc: 'Interval that will be use to check the dns records',
        format: String,
        default: '5m',
        env: 'DNS_CHECK_INTERVAL'
    },
    wanCheckURL: {
        doc: 'WAN check service',
        format: String,
        default: 'http://icanhazip.com',
        env: 'WAN_CHECK_SERVICE_URL'
    },
    domains: {
        doc: 'The domains to update with desired entries',
        format: Array,
        default: [
            {
                domain: null,
                dnsEntries: [
                    {
                        name: null
                    }
                ],
            }
        ],
        env: 'TRANSIP_DOMAINS'
    },
});

try {
    config.loadFile('./data/config.json');
} catch (err) {
    /* eslint-disable no-console */
    console.error(`No config file found at '/data/config.json'. Please provider one`);
    /* eslint-enable no-console */
    process.exit(1);
}

config.validate({ allowed: 'strict' });

module.exports = config;