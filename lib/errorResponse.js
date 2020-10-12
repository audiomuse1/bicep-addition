const axios = require('axios');
const fs = require('fs');
const cancelTokenSource = axios.CancelToken.source();

let cancelToken = (message) => {
    cancelTokenSource.cancel(message);
};

let errorLog = (error, request) => {
    let date = new Date().toLocaleString('en-US-u-hc-h24').replace(/[AM|PM|,]/g, '');
    let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    let method = request.method;
    let url = request.originalUrl;
    let user = request.user.user;

    let logString = `${date}[${user}]: ${method} @${url} <${ip}> ${error}`;

    fs.appendFile('error.log', `${logString}\r\n`, () => {
        console.log('Error logged.');
    });
};

let genericErrorResponse = (error, request, response) => {
    errorLog(error, request);
    cancelToken('Bad Request: Canceled');
    response.end();
};

module.exports.errorLog = errorLog;
module.exports.genericErrorResponse = genericErrorResponse;
module.exports.cancelToken = cancelToken;
