const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { cancelToken, errorLog } = require('../lib/errorResponse');

router.post('/', authenticate, async (request, response) => {
    let body = request.body;
    let hash = request.originalUrl.split('/')[2];

    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/categories`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.post(`${apiStub}`, body, options)
    .catch(error => {
        if (error.response) {
            errorLog(error, request);
            cancelToken('Bad Request: Canceled');
            response.status(error.response.data.status).json(error.response.data.title);
        }
    });

    if (update) {
        response.redirect('./');
    }
});

module.exports = router;
