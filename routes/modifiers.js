const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { cancelToken, errorLog, genericErrorResponse } = require('../lib/errorResponse');

// CREATE MODIFIER OPTIONS
router.post('/', authenticate, async (request, response) => {
    let body = request.body;
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products/${id}`;

    let options = {
        headers: {
            'accept': 'application/json',
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.post(`${apiStub}/modifiers`, body, options)
    .catch(error => {
        if (error.response) {
            errorLog(error, request);
            cancelToken('Bad Request, Canceled.')
            response.status(error.response.data.status).json(error.response.data.title);
            // errorResponse(error.response.data.title, request, response);
        }
    });

    if (update) {
        response.sendStatus(update.status);
    }
});

// EDIT MODIFIER OPTIONS
router.put('/:modId', authenticate, async (request, response) => {
    let body = request.body;
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let modId = request.params.modId;
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products/${id}`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.put(`${apiStub}/modifiers/${modId}/?sort=sku`, body, options)
    .catch(error => {
        if (error.response) {
            errorLog(error, request);
            cancelToken('Bad Request, Canceled.')
            response.status(error.response.data.status).json(error.response.data.title);
        }
    });

    if (update) {
        response.sendStatus(update.status);
    }
});

// DELETE MODIFIER
router.delete('/:modId', authenticate, async (request, response) => {
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let modId = request.params.modId;
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products/${id}`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.delete(`${apiStub}/modifiers/${modId}`, options)
    .catch(error => {
        if (error.response) {
            genericErrorResponse(error.response.data.title, request, response);
        }
    });

    if (update) {
        response.sendStatus(update.status);
    }
});

// EDIT A VALUE WITHIN A GIVEN MODIFIER
router.put('/:modId/:valId', authenticate, async (request, response) => {
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let modId = request.params.modId;
    let valId = request.params.valId;
    let body = request.body;
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.put(`${apiStub}/${id}/modifiers/${modId}/values/${valId}`, body, options)
    .catch(error => {
        if (error.response) {
            genericErrorResponse(error.response.data.title, request, response);
        }
    });

    if (update) {
        response.sendStatus(update.status);
    }
});

module.exports = router;
