const bunyan = require('bunyan');

module.exports = function(path, level = 'info') {
    return bunyan.createLogger({
        name: '[ TransIp Dynamic DNS ]',
        streams: [
            {
                level,
                path
            },
            {
                level,
                stream: process.stdout
            }
        ]
    });
};