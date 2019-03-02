const request = require('request-promise');

/**
 * A basic function that will retrieve the current WAN address
 * @returns {Promise<T | never>}
 * @private
 */
module.exports = async function checkWanIP(url) {
    return request(url)
        .then((ip) => ip.trim())
        .catch((err) => {
            throw new Error('Error while loading url. \n' + err.message);
        });
};