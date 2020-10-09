const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const config = require('../../config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.httpProvider));

async function createAccount() {
    return await web3.eth.accounts.create();
}

async function getBalance(address) {
    let isAddress = await _validateAddress(address);
    if (isAddress) {
        const balance = await web3.eth.getBalance(address);
        return { address, balance, symbol: 'eth', units: 'wei' };
    }
    return { error: 'Invalid address' };
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

async function getTransaction(hash) {
    return await web3.eth.getTransaction(hash);
}

async function _validateAddress(address) {
    return await web3.utils.isAddress(address);
}


module.exports = {
    POST: {
        sendRawTransaction,
    },
    GET: {
        createAccount,
        getBalance,
        getGasPrice,
        getLatestBlock,
        getTransaction,
    },
    methods: {
        GET: [
            {
                method: 'createAccount',
                description: 'Returns ethereum keypairs (pub/priv keys)',
                endpoint: 'api/v1/ethereum/create-account',
            },
            {
                method: 'getBalance',
                description: 'Returns the given address balance',
                endpoint:
                    'api/v1/ethereum/get-balance?address=0x00000000000000000000000000000000000',
            },
            {
                method: 'getTransaction',
                description: 'Returns transaction info',
                endpoint:
                    'api/v1/ethereum/get-transaction?tx=0x000000000000000000000000000000000000000',
            },
            {
                method: 'getLatestBlock',
                description: 'Returns the latest block',
                endpoint: 'api/v1/ethereum/get-latest-block',
            },
        ],
        POST: [],
    },
};
