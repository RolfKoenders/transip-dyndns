#!/usr/bin/env node
const request = require('request-promise');
const Promise = require('bluebird');
const bunyan  = require('bunyan');
const config = require('./config.js');

const log = bunyan.createLogger({
    name: 'transip-dyndns',
    streams: [
        {
            level: 'info',
            path: config.get('logLocation')
        }
    ]
});

module.exports = checkDomain;

/**
 *
 * @param configDomain
 * @param transIpDomain
 * @param updateDnsEntries
 * @returns
 */
async function checkDomain(configDomain, transIpDomain, updateDnsEntries) {

    const currentIP = await _checkWanIP();

    const mappedEntries = transIpDomain.dnsEntries
        .map((dnsEntry) => {

            const configEntry = configDomain.dnsEntries
                .find(configEntry => configEntry.name === dnsEntry.name);

            if (configEntry) {

                if (configEntry.content === dnsEntry.content) {
                    return {
                        changed: false,
                        dnsEntry
                    };
                }

                log.info('Entry changed: ', currentIP);
                //Merge the current entry with ours
                const updatedEntry = Object.assign({}, dnsEntry, { content: currentIP });

                return {
                    changed: true,
                    dnsEntry: updatedEntry
                };
            }

            log.info(`No entry found with name ${ dnsEntry.name }.`);
            return Promise.reject(new Error(`No entry found with name ${ dnsEntry.name }.`));
        });

    if (mappedEntries.every(({ changed }) => !changed)) {
        log.info('Nothing changed.');
        return Promise.resolve('No action needed');
    }

    const updatedEntries = mappedEntries.map(({ dnsEntry }) => dnsEntry);
    return updateDnsEntries(configDomain.name, updatedEntries);
}

/**
 * A basic function that will retrieve the current WAN address
 * @returns {Promise<T | never>}
 * @private
 */
async function _checkWanIP() {
    return request(config.get('wanCheckURL'))
        .then((ip) => ip.trim())
        .catch((err) => {
            throw new Error('Error while loading url. \n' + err.message);
        });
}
