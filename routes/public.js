const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.redirect('/');
});

router.get('/create', (request, response) => {
    response.redirect('/create');
});

module.exports = router;
