const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');

router.get('/', authenticate, async (request, response) => {
    response.render('sku', {activeUser: authenticate.activeUser});
});

router.get('/:sku', authenticate, async (request, response) => {
    let sku = request.params.sku;
    let skuPrefix = sku.split('-')[0];
    let result = [];
    let apiUrl;
    let hash;

    let context = {
        activeUser: authenticate.activeUser,
        message: ''
    };

    let configKeys = Object.keys(config.data);

    configKeys.forEach(store => {
        if (config.data[store].prefix === skuPrefix) {
            hash = store;
            apiUrl = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products?limit=250&include=variants`;
        }
    });

    if (!hash) {
        context.message = `SKU prefix ${skuPrefix} is unrecognizable.`;
        response.render('sku', context);
    } else {
        let options = {
            headers: {
                'x-auth-client': config.data[hash]['x-auth-client'],
                'x-auth-token': config.data[hash]['x-auth-token']
            }
        };

        let products = await axios.get(apiUrl, options);

        await products.data.data.forEach(product => {
            if (product.sku.includes(sku) && !product.sku.includes('TMPLT')) {
                result.push(product.id);
            } else {
                product.variants.forEach(variant => {
                    if (variant.sku.includes(sku) && !variant.sku.includes('TMPLT')) {
                        result.push(product.id);
                    }
                });
            }
        });

        if (result.length > 0) {
            response.redirect(`/store/${hash}/edit/${result[0]}/`);
        } else {
            context.message = `No matches found for ${sku}.`;
            response.render('sku', context);
        }
    }
});

module.exports = router;
