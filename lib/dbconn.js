const mysql = require('mysql');

let connection = mysql.createConnection({
    supportBigNumbers: true,
    bigNumberStrings: true,
    host     : 'bicep-mysql.bumperapptive.com',
    user     : 'bac_bicep_user',
    password : 'hRErVf75jv3aMf',
    database : 'bac_bicep'
});

module.exports = connection;
