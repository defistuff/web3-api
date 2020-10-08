const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const config = require('../../config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.httpProvider));

async function createAccount() {
    return await web3.eth.accounts.create();
}

async function sendRawTransaction({
    addressFrom,
    privKey,
    addressTo,
    amount,
    callback,
}) {
    const privateKey = Buffer.from(privKey, 'hex');
    const { gasLimit, gasUsed } = await getLatestBlock();
    const txData = {
        gasLimit: web3.utils.toHex(gasLimit),
        gasPrice: web3.utils.toHex(gasUsed),
        to: addressTo,
        from: addressFrom,
        value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
    };
    web3.eth.getTransactionCount(addressFrom).then(async (txCount) => {
        const newNonce = web3.utils.toHex(txCount);
        const transaction = new Tx(
            { ...txData, nonce: newNonce },
            { chain: 'kovan' }
        );

        transaction.sign(privateKey);
        const serializedTx = transaction.serialize().toString('hex');
        callback(await web3.eth.sendSignedTransaction('0x' + serializedTx));
    });
}

async function getGasPrice() {
    return web3.utils.fromWei(await web3.eth.getGasPrice(), 'wei');
}

async function getLatestBlock() {
    const blockNumber = await web3.eth.getBlockNumber();
    return await web3.eth.getBlock(blockNumber);
}

(async function () {
    // console.log(await getLatestBlock());
    // const body = {
    //     addressFrom: '0xb40155Feb32c4d4bd1966A6c2A3C77D7CADB2e5b',
    //     privKey:
    //         '0aa39ab29271e424d3ed705142fca215e07fb6e9b1afe8bdb9d9085c08a77b68',
    //     addrressTo: '0xE1961fe0C58bE06BCaB5C58A9066751Ca30344f5',
    //     amount: '0.5',
    //     callback: (resp) => console.log(resp),
    // };
    // await sendRawTransaction(body);
})();

//console.log('0aa39ab29271e424d3ed705142fca215e07fb6e9b1afe8bdb9d9085c08a77b68'.length);

module.exports = {
    POST: {
        sendRawTransaction,
    },
    GET: {
        createAccount,
        getGasPrice,
        getLatestBlock,
    },
};
