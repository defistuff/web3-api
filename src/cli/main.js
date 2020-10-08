const { argv } = require('yargs');

const Ethereum = require('../modules/ethereum');

(async function () {
    const method = argv.method;
    const f = Ethereum[method];
    console.log(await f());
})();