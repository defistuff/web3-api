# DefiStuff API

For API documentation run de project and at /api/v1 you will get the available modules and methods eg:

```json
{
    "api": "DefiStuff API",
    "modules": [
        {
            "module": "ethereum",
            "methods": {
                "GET": [
                    {
                        "method": "createAccount",
                        "description": "Returns ethereum keypairs (pub/priv keys)",
                        "endpoint": "api/v1/ethereum/create-account"
                    }
                ],
                "POST": [...]
            }
        }
    ]
}
```

For development proposes run (Currently connects to http://localhost:7545 [ganache-cli](https://www.trufflesuite.com/ganache)):

```bash
yarn dev
```

Run:

```bash
yarn start --port=<curtom-port> --httpProvider=<custom-provider>
```
