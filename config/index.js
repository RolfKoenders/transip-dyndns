
var convict = require('convict');

var conf = convict({
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
  domain: {
    doc: 'The domain to update the DNS record of',
    format: String,
    default: null,
    env: 'TRANSIP_DOMAIN'
  },
  dnsRecord: {
    doc: 'The name of the DNS record to update',
    format: String,
    default: null,
    env: 'TRANSIP_DNS_RECORD'
  },
  logLocation: {
    doc: 'Path to create the log file',
    format: String,
    default: './output.log',
    env: 'TRANSIP_LOG_LOCATION'
  }
});

// Load config from file:
try {
  conf.loadFile('./config/config.json');
} catch(err) {}

module.exports = conf;
