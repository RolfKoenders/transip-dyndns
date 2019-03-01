#!/usr/bin/env node
const request = require('request-promise');
const Promise = require('bluebird');
const bunyan  = require('bunyan');

// Setup file logger
const log = bunyan.createLogger({
    name: 'transip-dyndns',
    streams: [
        {
            level: 'info',
            path: LOG_LOCATION
        }
    ]
});


/**
 *
 * @param transIp
 * @param domain
 */
function checkDomain(transIp, domain) {

}


// return Promise.all([checkCurrentDns(), checkCurrentWanIP()])

// Promise.all()
//   .spread(function(currentDNSEntries, currentIP) {
//     _.forEach(currentDNSEntries, function(dnsEntry) {
//         if(dnsEntry.name === DNS_RECORD) {
//           if(dnsEntry.content === currentIP) {
//             log.info('Nothing changed.')
//           } else {
//             log.info('WAN Has changed to: ', currentIP);
//             dnsEntry.content = currentIP;
//             return updateDnsRecords(currentDNSEntries)
//               .then(function() {
//                 log.info('DNS Record has been updated.');
//               });
//           }
//         }
//     });
//   })
//   .catch(function(err) {
//     // Log error and inform that the check failed.
//     log.error('Something went wrong: ', err.message);
//   // })


// Get current value of the DNS record on Domain
function checkCurrentDns() {
    return new Promise(function(resolve, reject) {
        return transipInstance.domainService.getDomainNames()
            .then(function(domains) {
                _.forEach(domains, function(domain) {
                    if (domain === DOMAIN) {
                        return transipInstance.domainService.getInfo(domain)
                            .then(function(domain) {
                                const dnsEntries = domain.dnsEntries;
                                resolve(dnsEntries);
                            });
                    }
                });
            });
    });
}

// Update DNS records
function updateDnsRecord(currentDNSEntries) {
    return transipInstance.domainService.setDnsEntries(DOMAIN, {
        item: currentDNSEntries
    });
}

// Retrieve current WAN ip
function checkCurrentWanIP() {
    return request('http://icanhazip.com/')
        .then((ip) => ip.trim())
        .catch((err) => {
            throw new Error('Error while loading icanhazip. \n' + err.message);
        });
}
