const express = require('express');
const bodyParser = require('body-parser');

const config = require('../config');
const utils = require('../utils');

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/api/v1', async (req, res) => {
    res.status(200).send({ api: 'DefiStuff API', modules: utils.getModules() });
});

/**
 * @dev This endpoint handles get requests of the API
 * @module Param: [ethereum]
 * @method Param: MUST be a middle-dash method name eg: create-account
 */
app.get('/api/v1/:module/:method', async (req, res) => {
    try {
        const module = require(`../modules/${req.params.module}`);
        const f = module.GET[utils.camelCase(req.params.method)];

        // @notice Check if method exists, if not returns a 404 response
        if (!f) {
            return res.status(404).send({ error: 'module not found' });
        }
        const resp = await f();
        res.status(200).send(resp);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}/api/v1`);
});
