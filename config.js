
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
});

// Ugly part about loading config.
// Check if there is a local config
try {
  conf.loadFile('./config/config.json');
} catch(err) {}

// If we run with docker we want to link a config folder.
try {
  conf.loadFile('/config/config.json');
} catch(err) {}

module.exports = conf;
