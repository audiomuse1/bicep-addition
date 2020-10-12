const axios = require('axios');
const express = require('express');
const router = express.Router();

const authenticate = require('../lib/authenticate');
const config = require('../lib/config');
const { cancelToken, errorLog } = require('../lib/errorResponse');

const categoryRouter = require('./category');
const imageRouter = require('./images');
const modifierRouter = require('./modifiers');
const optionRouter = require('./options');
const variantRouter = require('./variants');

router.get('/:id', authenticate, async (request, response) => {
    let hash = request.originalUrl.split('/')[2];
    let id = request.params.id;
    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let getStore = await axios.get(`https://api.bigcommerce.com/stores/${hash}/v2/store`, options);
    let product = await axios.get(`${apiStub}/products/${id}`, options);

    // CATEGORIES
    let categoryTree = await axios.get(`${apiStub}/categories/tree`, options);
    let productCategories = product.data.data.categories;
    let treeCategories = await categoryTree.data.data.filter(category => {
        let name = category.name;

        return !name.includes('Template') && !name.includes('Sample') && !name.includes('Donation');
    });

    treeCategories.forEach(category => {
        let categoryCheck = (element) => {
            if (productCategories.includes(element.id)) {
                element.is_checked = true;
            }
        };

        categoryCheck(category);

        if (category.children) {
            category.children.forEach(child => {
                categoryCheck(child);

                if (child.children) {
                    child.children.forEach(grandchild => {
                        categoryCheck(grandchild);
                    });
                }
            });
        }
    });

    // IMAGES
    let images = await axios.get(`${apiStub}/products/${id}/images`, options);
    let extraImages = [];
    let defaultImage;
    let setDefaultImage = await images.data.data.forEach(image => {
        if (image.is_thumbnail === true) {
            defaultImage = image.url_thumbnail;
        }
    });

    if (images.data.data.length > 2) {
        extraImages = images.data.data.splice(2);
    }

    // VARIANTS
    let variants = await axios.get(`${apiStub}/products/${id}/variants/?limit=200`, options);
    let variantArray = [];
    let variantSortById = (a, b) => {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
    };

    variants = variants.data.data.sort(variantSortById);

    await variants.forEach(async variant => {
        if (variant.option_values.length > 0) {
            variantArray.push(variant);
        }
    });

    let modifiers = await axios.get(`${apiStub}/products/${id}/modifiers`, options);
    let dateArray = product.data.data.date_created.split('T')[0].split('-');
    dateArray[2] = dateArray.shift();
    let created = dateArray.join('-');

    let context = {
        activeUser: authenticate.activeUser,
        apiUrl: apiStub,
        created: created,
        defaultImage: defaultImage,
        extraImages: extraImages,
        images: images.data.data,
        modifiers: modifiers.data.data,
        product: product.data.data,
        selected: config.data[hash],
        store: getStore.data,
        treeCategories: treeCategories,
        variants: variantArray
    };

    response.render('product', context);
});

router.put('/:id', authenticate, async (request, response) => {
    let body = request.body;
    let hash = request.originalUrl.split('/')[2];
    let id = request.params.id;

    let apiStub = `https://api.bigcommerce.com/stores/${hash}/v3/catalog/products`;

    let options = {
        headers: {
            'x-auth-client': config.data[hash]['x-auth-client'],
            'x-auth-token': config.data[hash]['x-auth-token']
        }
    };

    let update = await axios.put(`${apiStub}/${id}`, body, options)
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

router.use('/:id/category', categoryRouter);
router.use('/:id/image', imageRouter);
router.use('/:id/modifiers', modifierRouter);
router.use('/:id/options', optionRouter);
router.use('/:id/variants', variantRouter);

module.exports = router;
