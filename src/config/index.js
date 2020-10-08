const { argv } = require('yargs');

module.exports = {
    httpProvider: argv.httpProvider,
    wsProvider: argv.wsProvider,
    port: argv.port || 50501,
};
