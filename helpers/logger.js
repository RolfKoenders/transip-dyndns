const bunyan  = require('bunyan');

module.exports = function (path) {
    return bunyan.createLogger({
        name: 'transip-dyndns',
        streams: [
            {
                level: 'info',
                path
            },
            {
                level: 'info',
                stream: process.stdout
            }
        ]
    });
};