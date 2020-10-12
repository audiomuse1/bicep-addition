const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { genericErrorResponse } = require('../lib/errorResponse');

const editProductRouter = require('./edit');
const newProductRouter = require('./new');

router.get('/:hash', authenticate, async (request, response) => {
    try {
        let hash = request.params.hash;
        let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products`;

        let options = {
            headers: {
                'x-auth-client': config.data[hash]['x-auth-client'],
                'x-auth-token': config.data[hash]['x-auth-token']
            }
        };

        let getStore = await axios.get(`https://api.bigcommerce.com/stores/${hash}/v2/store`, options);
        let products = await axios.get(`${apiStub}/?limit=300&sort=sku&include=primary_image`, options);
        let count = products.data.meta.pagination.count;
        let nextBatch = products.data.meta.pagination.links.next;

        if (count >= 250) {
            let moreProducts = await axios.get(`${apiStub}/${nextBatch}`, options)
            .catch(error => {
                errorResponse(error.response.data.title, request, response);
            });

            nextBatch = moreProducts.data.meta.pagination.links.next;
            products.data.data = products.data.data.concat(moreProducts.data.data);
            count = products.data.data.length;
        }

        if (count >= 500) {
            let evenMoreProducts = await axios.get(`${apiStub}/${nextBatch}`, options)
            .catch(error => {
                errorResponse(error.response.data.title, request, response);
            });

            nextBatch = evenMoreProducts.data.meta.pagination.links.next;
            products.data.data = products.data.data.concat(evenMoreProducts.data.data);
            count = products.data.data.length;
        }

        if (count >= 750) {
            let tooManyProducts = await axios.get(`${apiStub}/${nextBatch}`, options)
            .catch(error => {
                errorResponse(error.response.data.title, request, response);
            });

            products.data.data = products.data.data.concat(tooManyProducts.data.data);
            count = products.data.data.length;
        }

        let essentialProducts = await products.data.data.filter(product =>
            product.sku.indexOf('DON') == -1 &&
            product.sku.indexOf('TMPLT') == -1 &&
            product.sku.indexOf('SAMPLE') == -1
        );

        let templates = await products.data.data.filter(product =>
            product.sku.indexOf('TMPLT') > -1
        );

        let samples = await products.data.data.filter(product =>
            product.sku.indexOf('SAMPLE') > -1
        );

        let context = {
            activeUser: authenticate.activeUser,
            apiUrl: apiStub,
            count: essentialProducts.length,
            next: products.data.meta.pagination.links.next,
            products: essentialProducts,
            samples: samples,
            selected: config.data[hash],
            store: getStore.data,
            templates: templates
        };

        response.render('store', context);
    }
    catch(error) {
        genericErrorResponse(error, request, response);
    }
});

router.get('/:hash/sort/sold', authenticate, async (request, response) => {
    let hash = request.params.hash;
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products`;
    // let sortParameter;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let getStore = await axios.get(`https://api.bigcommerce.com/stores/${hash}/v2/store`, options);
    let products = await axios.get(`${apiStub}/?limit=300&sort=total_sold&direction=desc&include=primary_image`, options);
    let count = products.data.meta.pagination.count;
    let nextBatch = products.data.meta.pagination.links.next;

    if (count >= 250) {
        let moreProducts = await axios.get(`${apiStub}/${nextBatch}`, options)
        .catch(error => {
            errorResponse(error.response.data.title, request, response);
        });

        nextBatch = moreProducts.data.meta.pagination.links.next;
        products.data.data = products.data.data.concat(moreProducts.data.data);
        count = products.data.data.length;
    }

    if (count >= 500) {
        let evenMoreProducts = await axios.get(`${apiStub}/${nextBatch}`, options)
        .catch(error => {
            errorResponse(error.response.data.title, request, response);
        });

        nextBatch = evenMoreProducts.data.meta.pagination.links.next;
        products.data.data = products.data.data.concat(evenMoreProducts.data.data);
        count = products.data.data.length;
    }

    if (count >= 750) {
        let tooManyProducts = await axios.get(`${apiStub}/${nextBatch}`, options)
        .catch(error => {
            errorResponse(error.response.data.title, request, response);
        });

        products.data.data = products.data.data.concat(tooManyProducts.data.data);
        count = products.data.data.length;
    }

    let essentialProducts = await products.data.data.filter(product =>
        product.sku.indexOf('DON') == -1 &&
        product.sku.indexOf('TMPLT') == -1 &&
        product.sku.indexOf('SAMPLE') == -1
    );

    let templates = await products.data.data.filter(product =>
        product.sku.indexOf('TMPLT') > -1
    );

    let samples = await products.data.data.filter(product =>
        product.sku.indexOf('SAMPLE') > -1
    );

    let context = {
        activeUser: authenticate.activeUser,
        apiUrl: apiStub,
        count: essentialProducts.length,
        products: essentialProducts,
        samples: samples,
        selected: config.data[hash],
        sort: true,
        store: getStore.data,
        templates: templates
    };

    response.render('store', context);
});

router.use('/:hash/edit', editProductRouter);
router.use('/:hash/new', newProductRouter);

module.exports = router;
