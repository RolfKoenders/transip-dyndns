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
        },
        {
            level: 'info',
            stream: process.stdout
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
    log.debug(`current ip is ${currentIP}`);

    const mappedEntries = transIpDomain.dnsEntries
        .map((dnsEntry) => {

            const configEntry = configDomain.dnsEntries
                .find(configEntry => configEntry.name === dnsEntry.name && configEntry.type === dnsEntry.type);

            if (configEntry) {
                const configContent = configEntry.content || currentIP;

                if (configContent !== dnsEntry.content) {
                    log.info('Entry changed: ', currentIP);
                    //Merge the current entry with ours
                    const updatedEntry = Object.assign({}, dnsEntry, { content: currentIP });

                    return {
                        changed: true,
                        dnsEntry: updatedEntry
                    };
                }
            }

            return {
                changed: false,
                dnsEntry
            };
        });

    if (mappedEntries.every(({ changed }) => !changed)) {
        log.info('Nothing changed.');
        return Promise.resolve();
    }

    const updatedEntries = mappedEntries.map(({ dnsEntry }) => dnsEntry);
    return updateDnsEntries(transIpDomain.name, updatedEntries);
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
