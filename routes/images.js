const axios = require('axios');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { genericErrorResponse } = require('../lib/errorResponse');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

let upload = multer({storage: storage});

router.post('/', authenticate, upload.single('image'), async (request, response) => {
    let body = {};
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products`;

    let imagePath = request.file.path.split('/').splice(1).join('/');

    body.image_url = `https://bicep.bumperapptive.com/${imagePath}`;

    if (request.body.default === 'true') {
        body.is_thumbnail = true;
    }

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.post(`${apiStub}/${id}/images`, body, options)
    .catch(error => {
        genericErrorResponse(error.response.data.title, request, response);
    });

    if (update) {
        response.redirect('./');
    }
});

router.post('/variants', authenticate, upload.single('variant-image'), async (request, response) => {
    let body = {};
    let hash = request.originalUrl.split('/')[2];
    let id = request.originalUrl.split('/')[4];
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products`;
    let selectedVariants = request.body.selectedVariants.split(',');

    let imagePath = request.file.path.split('/').splice(1).join('/');

    body.image_url = `https://bicep.bumperapptive.com/${imagePath}`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let updateImages = async () => {
        await selectedVariants.forEach(async variant => {
            await axios.post(`${apiStub}/${id}/variants/${variant}/image`, body, options)
            .catch(error => {
                genericErrorResponse(error.response.data.title, request, response);
            });
        });
    };

    await updateImages().then(response.redirect('../'));
});

module.exports = router;
