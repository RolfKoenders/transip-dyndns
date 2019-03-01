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
    domains: {
        doc: 'The domains to update the DNS record of',
        format: Array,
        default: [
            {
                domain: null,
                records: [],
            }
        ],
        env: 'TRANSIP_DOMAINS'
    },
});

config.loadFile('data/config.json');
config.validate({ allowed: 'strict' });

module.exports = config;
