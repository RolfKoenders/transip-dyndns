#!/usr/bin/env node
var TransIP = require('transip'),
    request = require('request-promise'),
    Promise = require('bluebird'),
    bunyan  = require('bunyan'),
    fs      = require('fs'),
    _       = require('lodash'),
    config  = require('./config.js');

// Check for the environment variables
var TRANSIP_LOGIN = config.get('transip.login');
var PRIVATE_KEY_LOCATION = config.get('transip.privateKeyPath');
var DOMAIN = config.get('domain');
var DNS_RECORD = config.get('dnsRecord');
var LOG_LOCATION = config.get('logLocation');

// Load privateKeyFile contents
var TRANSIP_PRIVATE_KEY;
try {
  TRANSIP_PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_LOCATION, {encoding:'utf-8'});
}
catch(err) {}
if(!TRANSIP_PRIVATE_KEY) {
  console.log('PrivateKey cannot be read:', PRIVATE_KEY_LOCATION);
  process.exit(1);
}

// Setup file logger
var log = bunyan.createLogger({
  name: 'transip-dyndns',
  streams: [
    {
      level: 'info',
      path: LOG_LOCATION
    }
  ]
});

// Create TRANSIP Instance
var transipInstance = new TransIP(TRANSIP_LOGIN, TRANSIP_PRIVATE_KEY);

Promise.all([checkCurrentDns(), checkCurrentWanIP()])
  .spread(function(currentDNSEntries, currentIP) {
    _.forEach(currentDNSEntries, function(dnsEntry) {
        if(dnsEntry.name === DNS_RECORD) {
          if(dnsEntry.content === currentIP) {
            log.info('Nothing changed.');
          } else {
            log.info('WAN Has changed to: ', currentIP);
            dnsEntry.content = currentIP;
            return updateDnsRecords(currentDNSEntries)
              .then(function() {
                log.info('DNS Record has been updated.');
              });
          }
        }
    });
  })
  .catch(function(err) {
    // Log error and inform that the check failed.
    log.error('Something went wrong: ', err.message);
  });


// Get current value of the DNS record on Domain
function checkCurrentDns() {
  return new Promise(function(resolve, reject) {
    return transipInstance.domainService.getDomainNames()
      .then(function(domains) {
        _.forEach(domains, function(domain) {
          if(domain === DOMAIN) {
            return transipInstance.domainService.getInfo(domain)
            .then(function(domain) {
              var dnsEntries = domain.dnsEntries;
              resolve(dnsEntries);
            });
          }
        });
      });
  });
}

// Update DNS records
function updateDnsRecords(currentDNSEntries) {
  return transipInstance.domainService.setDnsEntries(DOMAIN, {
    'item': currentDNSEntries
  });
}

// Retrieve current WAN ip
function checkCurrentWanIP() {
  return request('http://icanhazip.com/')
    .then(function(body) {
      var ip = body.trim();
      return ip;
    })
    .catch(function(err) {
      throw new Error('Error while loading icanhazip. \n' + err.message);
    });
}
