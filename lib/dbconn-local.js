const mysql = require('mysql');

let connection = mysql.createConnection({
    supportBigNumbers: true,
    bigNumberStrings: true,
    host     : 'localhost',
    user     : 'bac_bicep',
    password : 'ni64jDwdAqpRPS',
    database : 'bicep_users'
});

module.exports = connection;
