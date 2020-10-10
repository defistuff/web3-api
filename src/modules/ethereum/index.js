const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const config = require('../../config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.httpProvider));

web3.eth.net.getNetworkType().then(console.log);

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

async function sendRawTransaction(
    { addressFrom, privKey, addressTo, amount },
    callback
) {
    const privateKey = Buffer.from(privKey.substr(2, privKey.length), 'hex');
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
            { chain: config.chain }
        );

        try {
            transaction.sign(privateKey);
            const serializedTx = transaction.serialize().toString('hex');
            const resp = await web3.eth.sendSignedTransaction(
                '0x' + serializedTx
            );
            callback(resp);
        } catch (e) {
            callback({ error: e.toString() });
        }
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

function _validateAddress(address) {
    return web3.utils.isAddress(address);
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
    misc: {
        _validateAddress,
    },
    methods: {
        GET: {
            blockchian: {},
            address: {
                createAddress: {
                    description: 'Returns ethereum keypairs (pub/priv keys)',
                    endpoint: 'api/v1/ethereum/create-account',
                },
                getAddressBalance: {
                    endpoint:
                        'api/v1/ethereum/get-balance?address=0x00000000000000000000000000000000000',
                },
            },
            transaction: {
                geTransaction: {
                    description: 'Returns transaction info',
                    endpoint:
                        'api/v1/ethereum/get-transaction?tx=0x000000000000000000000000000000000000000',
                },
            },
        },
        POST: {
            transactions: {
                sendRawTransaction: {
                    description: 'Transfer ether from one account to another',
                    endpoint: 'api/v1/ethereum/send-raw-transaction',
                    requestBody: {
                        addressFrom:
                            '0x37EbeD3178e9C3b9087184F44A937C562e9770d2',
                        privKey:
                            '0xee0f1ce4e615a834cfb9d531b89171ecdb1f7687e503f0402a271f4d3fdd715e',
                        addressTo: '0x1d9f33CDFE6dF18de9dBb57DB879a88faF3C1aD9',
                        amount: '0.5',
                    },
                },
            },
        },
    },
};
