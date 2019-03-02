#!/usr/bin/env node

const Promise = require('bluebird');
const bunyan  = require('bunyan');
const config = require('./config.js');
const checkWanIp = require('./helpers/checkWanIp.js');

const logLocation = config().get('logLocation');
const wanCheckServiceURL = config().get('wanCheckURL');

const log = bunyan.createLogger({
    name: 'transip-dyndns',
    streams: [
        {
            level: 'info',
            path: logLocation
        },
        {
            level: 'info',
            stream: process.stdout
        }
    ]
});


/**
 *
 * @param configDomain
 * @param transIpDomain
 * @param updateDnsEntries
 * @returns
 */
module.exports = async function checkDomain(configDomain, transIpDomain, updateDnsEntries) {


    if (!configDomain || !transIpDomain) {
        return null;
    }

    const currentIP = await checkWanIp(wanCheckServiceURL);
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
        return null;
    }

    const updatedEntries = mappedEntries.map(({ dnsEntry }) => dnsEntry);
    return updateDnsEntries(transIpDomain.name, updatedEntries);
};

