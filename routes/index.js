const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { genericErrorResponse } = require('../lib/errorResponse');

router.get('/', authenticate, async (request, response) => {

    let storesByHash = Object.keys(config.data);

    storesByHash.forEach(async hash => {
        let options = {
            headers: {
                'x-auth-client': config.data[hash]['x-auth-client'],
                'x-auth-token': config.data[hash]['x-auth-token']
            }
        };

        let getStore = await axios.get(`https://api.bigcommerce.com/stores/${hash}/v2/store`, options)
        .catch(async error => {
            if (error.response) {
                let errorMessage = `${config.data[hash].name} - ${error.response.statusText}`;
                genericErrorResponse(errorMessage, request, response);
            }
        });

        let setLogoAndStatus = async () => {
            if (getStore && !config.data[hash].logo) {
                config.data[hash].logo = await getStore.data.logo.url;
                config.data[hash].status = await getStore.data.status;
            }
        };

        await setLogoAndStatus();
    });

    let context = {
        activeUser: authenticate.activeUser,
        count: storesByHash.length,
        stores: config.data
    };

    response.render('index', context);
});

module.exports = router;
