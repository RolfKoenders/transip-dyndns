#!/usr/bin/env node

// ================================
// Require

var TransIP = require('transip'),
    Promise = require('bluebird'),
    request = require('request-promise'),
    fs      = require('fs'),
    _       = require('lodash'),
    config  = require('./config.js');

// ================================
// Globals

// Check for the environment variables
var TRANSIP_LOGIN = config.get('transip.login');
var PRIVATE_KEY_LOCATION = config.get('transip.privateKeyPath');
var DOMAIN = config.get('domain');
var DNS_RECORD = config.get('dnsRecord');

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

// Create TRANSIP Instance
var transipInstance = new TransIP(TRANSIP_LOGIN, TRANSIP_PRIVATE_KEY);

// ================================
// Main

/**
 * Main function.
 * @return {Promise}
 */
function main() {

  // Get current dns entries, WAN IP
  return Promise.all([checkCurrentDns(), checkCurrentWanIP()])
  .spread(function(currentDNSEntries, currentIP) {

    // Keep track of some data
    var foundDNS = false;

    // Find DNS_RECORD in currentDNSEntries
    _.forEach(currentDNSEntries, function(dnsEntry) {
      if(dnsEntry.name === DNS_RECORD) {

        // Update some data
        foundDNS = true;

        // Update if changed
        if(dnsEntry.content === currentIP) {
          console.info('Nothing changed.');
        }
        else {

          console.info('WAN has changed to:', currentIP);
          dnsEntry.content = currentIP;

          return updateDnsRecords(currentDNSEntries)
          .then(function() {
            console.info('DNS record has been updated.');
          });

        }

      }
    });

    // Check some things
    if (!foundDNS) {
      console.warn('No DNS_RECORD found for "'+ DNS_RECORD +'"');
    }

  })
  .catch(function(err) {
    // Log error and inform that the check failed.
    console.error('Something went wrong:', err.message);
  });

}

// ================================
// Helpers

/**
 * Get DNS records of Domain
 * @return {[type]} [description]
 */
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

/**
 * Update DNS records
 * @param  {[type]} currentDNSEntries [description]
 */
function updateDnsRecords(currentDNSEntries) {
  return transipInstance.domainService.setDnsEntries(DOMAIN, {
    'item': currentDNSEntries
  });
}

/**
 * Retrieve current WAN ip
 * @return {string} The IP address as reported by icanhazip.com
 */
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

// ================================
// Run

main();
