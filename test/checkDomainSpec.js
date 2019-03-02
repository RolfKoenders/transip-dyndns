const proxyquire =  require('proxyquire');

const testIp = '222.222.222.222';
const testExpire = 10800;
const testConfig = {
    logLocation: './data/output.log',
    wanCheckURL: 'http://icanhazip.com'
};

const checkDomain = proxyquire
    .noCallThru()
    .load('../checkDomain.js', {
        './config.js': () => {
            return {
                get: (key) => {
                    return testConfig[key];
                }
            };
        },
        './helpers/checkWanIp.js': () => testIp
    });



describe('When we have a domain check function', function() {

    const testSet = [
        {
            name: 'When we have a basic setup',
            configDomain: {
                name: 'example.com',
                dnsEntries: [
                    {
                        name: '@',
                        type: 'A'
                    }
                ]
            },
            transIpDomain: {
                name: 'example.com',
                dnsEntries: [
                    {
                        name: '@',
                        type: 'A',
                        expire: testExpire,
                        content: '1.1.1.1'
                    }
                ]
            },
            expectedOutput: {
                name: 'example.com',
                dnsEntries: [
                    {
                        name: '@',
                        type: 'A',
                        expire: testExpire,
                        content: testIp
                    }
                ]
            }
        },
        {
            name: 'When we have type provider, we don\'t have an update',
            configDomain: {
                name: 'example.com',
                dnsEntries: [
                    {
                        name: '@',
                    }
                ]
            },
            transIpDomain: {
                name: 'example.com',
                dnsEntries: [
                    {
                        name: '@',
                        type: 'A',
                        expire: testExpire,
                        content: '1.1.1.1'
                    }
                ]
            },
            expectedOutput: null
        },
        {
            name: 'When we have no configDomain',
            transIpDomain: {
                name: 'example.com',
                dnsEntries: [
                    {
                        name: '@',
                        type: 'A',
                        expire: testExpire,
                        content: '1.1.1.1'
                    }
                ]
            },
            expectedOutput: null
        },
    ];

    testSet.forEach(function(test) {
        describe(test.name, function() {

            function updateDnsEntries(name, dnsEntries) {
                return { name, dnsEntries };
            }

            beforeEach(function() {
                this.result = checkDomain(test.configDomain, test.transIpDomain, updateDnsEntries);
            });

            it('Should pass', function() {
                return expect(this.result).to.eventually.deep.equals(test.expectedOutput);
            });
        });
    });
});