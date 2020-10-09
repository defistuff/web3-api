# DefiStuff API

For API documentation run de project and at /api/v1 you will get the available modules and methods:

```json
{
    "api": "DefiStuff API",
    "version": "1.0.0",
    "modules": [
        {
            "module": "ethereum",
            "methods": {
                "GET": [
                    {
                        "method": "createAccount",
                        "description": "Returns ethereum keypairs (pub/priv keys)",
                        "endpoint": "api/v1/ethereum/create-account"
                    },
                    {
                        "method": "getBalance",
                        "description": "Returns the given address balance",
                        "endpoint": "api/v1/ethereum/get-balance?address=0x00000000000000000000000000000000000"
                    },
                    {
                        "method": "getTransaction",
                        "description": "Returns transaction info",
                        "endpoint": "api/v1/ethereum/get-transaction?tx=0x000000000000000000000000000000000000000"
                    },
                    {
                        "method": "getLatestBlock",
                        "description": "Returns the latest block",
                        "endpoint": "api/v1/ethereum/get-latest-block"
                    }
                ],
                "POST": []
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
yarn start --port=<custom-port> --httpProvider=<custom-provider>
```
