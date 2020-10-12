const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { genericErrorResponse } = require('../lib/errorResponse');

// GET VARIANT OPTIONS
router.get('/', authenticate, async (request, response) => {
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let getStore = await axios.get(`https://api.bigcommerce.com/stores/${hash}/v2/store`, options);
    let product = await axios.get(`${apiStub}/products/${id}`, options);
    let images = await axios.get(`${apiStub}/products/${id}/images`, options);
    let variant_options = await axios.get(`${apiStub}/products/${id}/options`, options);
    let dateArray = product.data.data.date_created.split('T')[0].split('-');
    dateArray[2] = dateArray.shift();
    let created = dateArray.join('-');
    let extraImages = [];

    if (images.data.data.length > 2) {
        extraImages = images.data.data.splice(2);
    }

    let context = {
        activeUser: authenticate.activeUser,
        apiUrl: apiStub,
        created: created,
        extraImages: extraImages,
        images: images.data.data,
        options: variant_options.data.data,
        product: product.data.data,
        selected: config.data[hash],
        store: getStore.data
    };

    response.render('variant', context);
});

// EDIT VARIANT OPTIONS
router.put('/:optId/:valId', authenticate, async (request, response) => {
    let body = request.body;
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let optId = request.params.optId;
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products/${id}`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.put(`${apiStub}/options/${optId}`, body, options)
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
