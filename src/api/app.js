const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { requestLogger, errorHandler } = require('./middlewares');
const { validateRequest } = require('./schemaValidator');

const config = require('../config');
const utils = require('../utils');

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestLogger);

app.get('/api/v1', async (req, res) => {
    const pjson = require('../../package.json');

    res.status(200).send({
        api: 'DefiStuff API',
        version: pjson.version,
        modules: utils.getModules(),
    });
});

/**
 * @dev This endpoint handles get requests of the API
 * @module Param: [ethereum]
 * @method Param: MUST be a middle-dash method name eg: create-account
 */
app.get('/api/v1/:module/:method', async (req, res) => {
    try {
        const { address, tx, token } = req.query;
        const module = require(`../modules/${req.params.module}`);
        const f = module.GET[utils.camelCase(req.params.method)];

        // @notice Check if method exists, if not returns a 404 response
        if (!f) {
            return res.status(404).send({ error: 'module not found' });
        }

        let resp;
        // Check if query exists
        if (!address && !tx) {
            resp = await f();
            return res.status(200).send(resp);
        }

        if (address && address !== '') {
            resp = token ? await f(address, token) : await f(address);
            return res.status(200).send(resp);
        }

        if (tx && tx !== '') {
            resp = await f(tx);
            return res.status(200).send(resp);
        }

        return res.status(400).send({ error: 'Malformed request' });
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

app.post('/api/v1/:module/:method', async (req, res) => {
    const schema = utils.camelToSnakeCase(req.params.method);
    const validation = validateRequest(req.body, schema);

    if (!validation.isValid) {
        return res.status(400).send({ error: 'malformed request' });
    }

    const module = require(`../modules/${req.params.module}`);
    const f = module.POST[utils.camelCase(req.params.method)];

    // @notice Check if method exists, if not returns a 404 response
    if (!f) {
        return res.status(404).send({ error: 'module not found' });
    }
    try {
        f(req.body, (r) => {
            console.log(r)
            res.status(200).send(r)
        });
    } catch (e) {
        res.status(500).send({ error: e });
    }
});

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}/api/v1`);
});
