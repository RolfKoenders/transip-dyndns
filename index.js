#!/usr/bin/env node
const Promise = require('bluebird');
const TransIP = require('transip');
const bunyan  = require('bunyan');
const fs = require('fs');
const config = require('./config.js');
const ms = require('ms');
const interval = require('interval-promise')

const log = bunyan.createLogger({
    name: 'transip-dyndns',
    streams: [
        {
            level: 'info',
            path: config.get('logLocation')
        }
    ]
});

// Check for the environment variables
const TRANSIP_LOGIN = config.get('transip.login');
const PRIVATE_KEY_LOCATION = config.get('transip.privateKeyPath');
const DOMAINS = config.get('domains');
const DNS_CHECK_INTERVAL = config.get('dnsCheckInterval');
const checkDomain = require('./checkDomain.js');

// Load privateKeyFile contents
const TRANSIP_PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_LOCATION, { encoding: 'utf-8' });
if (!TRANSIP_PRIVATE_KEY) {
    /* eslint-disable no-console */
    console.log('PrivateKey cannot be read.');
    process.exit(1);
    /* eslint-enable no-console */
}

const transIpInstance = new TransIP(TRANSIP_LOGIN, TRANSIP_PRIVATE_KEY);

interval(checkDomains, ms(DNS_CHECK_INTERVAL));

async function checkDomains() {
    log.info('Checking for changes');

    const configDomainNames = DOMAINS.map(({ domain }) => domain);
    const knownTransIpDomains = await transIpInstance.domainService.getDomainNames();

    const domainsToCheck = knownTransIpDomains.filter(domain => configDomainNames.includes(domain));

    const promises = domainsToCheck.map((configDomain) => {
        return transIpInstance.domainService.getInfo(configDomain.domain)
            .then((transIpDomain) => checkDomain(configDomain, transIpDomain, updateDnsRecord));
    });

    return Promise.all(promises);
}

/**
 * Will update the dns entries
 * @Note: Please note that this function will replace all DNS entries
 * @param domainName
 * @param dnsEntries
 * @returns {Promise<T | never>}
 */
async function updateDnsRecord(domainName, dnsEntries) {
    return transIpInstance.domainService.setDnsEntries(domainName, { item: dnsEntries })
        .then(() => {
            log.info('DNS Entries has been updated.');
            return Promise.resolve('DNS Record has been updated.');
        });
}