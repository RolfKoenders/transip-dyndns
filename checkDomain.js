#!/usr/bin/env node

const config = require('./config.js');
const wanCheckServiceURL = config.get('wanCheckURL');
const logLocation = config.get('logLocation');
const log = require('./helpers/logger.js')(logLocation);
const checkWanIp = require('./helpers/checkWanIp.js');

/**
 *
 * @param configDomain
 * @param transIpDomain
 * @param updateDnsEntries
 * @returns
 */
module.exports = async function checkDomain(configDomain, transIpDomain, updateDnsEntries) {


    if (!configDomain) {
        log.warn('No config domain received. Nothing to change.');
        return null;
    }

    if (!transIpDomain) {
        log.warn('No transIp domain received. Nothing to change.');
        return null;
    }

    const currentIP = await checkWanIp(wanCheckServiceURL);
    log.debug(`Current ip: ${currentIP}`);

    const mappedEntries = transIpDomain.dnsEntries
        .map((dnsEntry) => {

            log.debug(`processing dnsEntry ${dnsEntry} for domain ${transIpDomain.name}`);

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

