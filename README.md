# DefiStuff API

For API documentation run de project and at /api/v1 you will get the available modules and methods:

```json
{
    "api": "DefiStuff API",
    "version": "1.0.1-alpha",
    "modules": [
        {
            "module": "ethereum",
            "methods": {
                "GET": {
                    "blockchian": {},
                    "address": {
                        "createAddress": {
                            "description": "Returns ethereum keypairs (pub/priv keys)",
                            "endpoint": "api/v1/ethereum/create-account"
                        },
                        "getAddressBalance": {
                            "endpoint": "api/v1/ethereum/get-balance?address=0x00000000000000000000000000000000000"
                        }
                    },
                    "transaction": {
                        "geTransaction": {
                            "description": "Returns transaction info",
                            "endpoint": "api/v1/ethereum/get-transaction?tx=0x000000000000000000000000000000000000000"
                        }
                    }
                },
                "POST": {
                    "transactions": {
                        "sendRawTransaction": {
                            "description": "Transfer ether from one account to another",
                            "endpoint": "api/v1/ethereum/send-raw-transaction",
                            "requestBody": {
                                "addressFrom": "0x37EbeD3178e9C3b9087184F44A937C562e9770d2",
                                "privKey": "0xee0f1ce4e615a834cfb9d531b89171ecdb1f7687e503f0402a271f4d3fdd715e",
                                "addressTo": "0x1d9f33CDFE6dF18de9dBb57DB879a88faF3C1aD9",
                                "amount": "0.5"
                            }
                        }
                    }
                }
            }
        }
    ]
}
```

**Usage**
Install dependencies:

```bash
yarn install
```

For development proposes run (Currently connects to http://localhost:7545 [ganache-cli](https://www.trufflesuite.com/ganache)):

```bash
yarn dev
```

For custom setup run (you can use infura as a provider, or any other provider you wish):

```bash
yarn start --port=<custom-port> --httpProvider=<custom-provider> --chain=<chain-name>
```

**How to contribute**
Create a new branch

```bash
feature/my-feature or fix/my-fix
```

And create a pull request
