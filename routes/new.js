const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { cancelToken, errorLog, genericErrorResponse } = require('../lib/errorResponse');

router.get('/:templateId', authenticate, async (request, response) =>{
    try {
        let hash = request.originalUrl.split('/')[2];
        let templateId = request.params.templateId;
        let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products`;

        let options = {
            headers: {
                'x-auth-client': config.data[hash]['x-auth-client'],
                'x-auth-token': config.data[hash]['x-auth-token']
            }
        };

        let getStore = await axios.get(`https://api.bigcommerce.com/stores/${hash}/v2/store`, options);
        let template = await axios.get(`${apiStub}/${templateId}/?include=variants,modifiers`, options);

        let variants = await axios.get(`${apiStub}/${templateId}/variants`, options);
        let modifiers = await axios.get(`${apiStub}/${templateId}/modifiers`, options);

        let context = {
            activeUser: authenticate.activeUser,
            modifiers: modifiers.data.data,
            selected: config.data[hash],
            store: getStore.data,
            template: template.data.data,
            tmpObject: JSON.stringify(template.data.data),
            variants: variants.data.data
        };

        response.render('new', context);
    }
    catch(error) {
        genericErrorResponse(error, request, response);
    }
});

router.post('/:templateId', authenticate, async (request, response) => {
    let body = request.body;
    let hash = request.originalUrl.split('/')[2];
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let create = await axios.post(`${apiStub}`, body, options)
    .then(async create => {
        if (create.status === 200) {
            let productId = create.data.data.id;
            let productOptions = await axios.get(`${apiStub}/${productId}/options`, options)
            .catch(error => {
                if (error.response) {
                    genericErrorResponse(error.response.data.title, request, response);
                }
            });

            if (productOptions.data.data.length) {
                productOptions.data.data.forEach(async option => {
                    let value = option.option_values[2] || option.option_values[0];
                    let valueBody = {
                        'is_default': true,
                    };

                    if (option.display_name === 'Product Type') {
                        let optionBody = {
                            'type': 'dropdown',
                        };

                        await axios.put(`${apiStub}/${productId}/options/${option.id}`, optionBody, options)
                        .catch(error => {
                            if (error.response) {
                                genericErrorResponse(error.response.data.title, request, response);
                            }
                        });
                    }

                    await axios.put(`${apiStub}/${productId}/options/${option.id}/values/${value.id}`, valueBody, options)
                    .catch(error => {
                        if (error.response) {
                            genericErrorResponse(error.response.data.title, request, response);
                        }
                    });
                });
            }

            if (body.modifiers) {
                let modifiers = body.modifiers;

                let createModifiers = await axios.post(`${apiStub}/${productId}/modifiers`, modifiers[0], options)
                .catch(error => {
                    if (error.response) {
                        genericErrorResponse(error.response.data.title, request, response);
                    }
                });
            }

            response.redirect(302, `/store/${hash}/edit/${productId}/`);
        }
    }).catch(error => {
        if (error) {
            errorLog(error, request);
            cancelToken('Bad request: canceled');
            response.status(error.response.data.status).json(error.response.data.title);
        }
    });
});

module.exports = router;
