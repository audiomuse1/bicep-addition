const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { cancelToken, errorLog, genericErrorResponse } = require('../lib/errorResponse');

router.put('/:varId', authenticate, async (request, response) => {
    let body = request.body;
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let varId = request.params.varId;
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products/${id}`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.put(`${apiStub}/variants/${varId}`, body, options)
    .catch(error => {
        if (error.response) {
            errorLog(error, request);
            cancelToken('Bad Request: Canceled.');
            response.status(error.response.data.status).json(error.response.data.title);
        }
    });

    if (update) {
        response.sendStatus(update.status);
    }
});

module.exports = router;
