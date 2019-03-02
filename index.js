#!/usr/bin/env node
const TransIP = require('transip');
const fs = require('fs');
const config = require('./config.js');
const logLocation = config.get('logLocation');
const logLevel = config.get('logLevel');
const log = require('./helpers/logger.js')(logLocation, logLevel);
const ms = require('ms');
const interval = require('interval-promise');


const TRANSIP_LOGIN = config.get('transip.login');
const PRIVATE_KEY_LOCATION = config.get('transip.privateKeyPath');
const DOMAINS_TO_CHECK = config.get('domains');
const DNS_CHECK_INTERVAL = config.get('dnsCheckInterval');

const checkDomain = require('./checkDomain.js');

// Load privateKeyFile contents
const TRANSIP_PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_LOCATION, { encoding: 'utf-8' });

if (!TRANSIP_PRIVATE_KEY) {
    log.error(`PrivateKey cannot be read. Please check the location (${PRIVATE_KEY_LOCATION})`);
    process.exit(1);
}

const transIpInstance = new TransIP(TRANSIP_LOGIN, TRANSIP_PRIVATE_KEY);

return checkDomains()
    .then(interval(checkDomains, ms(DNS_CHECK_INTERVAL)));

async function checkDomains() {
    log.info('Checking for changes');
    const startTime = new Date().getTime();

    const configDomainNames = DOMAINS_TO_CHECK.map(({ domain }) => domain);
    const knownTransIpDomains = await transIpInstance.domainService.getDomainNames();

    const domainsToCheck = knownTransIpDomains.filter(domain => configDomainNames.includes(domain));

    const promises = domainsToCheck.map((domainName) => {
        return transIpInstance.domainService.getInfo(domainName)
            .then((transIpDomain) => {
                const configDomain = DOMAINS_TO_CHECK.find(({ domain }) => domain === domainName);
                return checkDomain(configDomain, transIpDomain, updateDnsRecord);
            })
            .then(() => {
                const currentTime = new Date().getTime();
                const processingTime = currentTime - startTime;
                const nextCheck = new Date(currentTime + ms(DNS_CHECK_INTERVAL) - processingTime);
                log.debug(`Processing time ${processingTime}`);
                log.info(`Next check will be around ${nextCheck.toISOString()}`);
            });
    });

    return Promise.all(promises);
}

/**
 * Will update the dns entries
 * @Note: Please note that this function will replace all DNS entries
 * @param {string} domainName - domain name
 * @param {array} dnsEntries - updated entries
 * @returns {Promise<T | never>} - true
 */
async function updateDnsRecord(domainName, dnsEntries) {
    return transIpInstance.domainService.setDnsEntries(domainName, { item: dnsEntries })
        .catch((error) => {
            log.error(`Unable to set dns entries for ${domainName}`);
            log.error(error);
            return Promise.reject(error);
        });
}