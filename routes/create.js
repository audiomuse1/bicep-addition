const crypto = require('crypto');
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const connection = require('../lib/dbconn.js');

router.get('/', (request, response) => {
    response.render('create');
});

router.post('/', (request, response) => {
    let email = request.body.email;
    let user = request.body.user;
    let password = request.body.password;
    let encryptedPass = crypto.createHash('sha256').update(password).digest('hex');

    let context = {
        message: 'You will be notified by email when your account is ready for use.'
    };

    let handleMail = async (userId) => {

        let dreamhostSMTP = nodemailer.createTransport({
            host: 'smtp.dreamhost.com',
            port: 465,
            secure: true,
            auth: {
                user: 'admin@bicep.bumperapptive.com',
                pass: 'Fo78PnpAgYcQHg'
            }
        });

        await dreamhostSMTP.sendMail({
            from: '"Bicep Admin" admin@bicep.bumperapptive.com',
            to: 'devteam@bumperactive.com',
            subject: 'New Bicep Account Created',
            html: `
                <p><b>Email:</b> ${email}</p>
                <p><b>User ID:</b> ${userId}</p>
            `
        });
    };

    let insertUser = () => {
        connection.query('INSERT INTO users (user, password, enabled) VALUES (?, ?, 0)', [user, encryptedPass], (err, result) => {
            if (err) throw err;
            handleMail(result.insertId).catch(console.error);
            response.render('create', context);
        });
    };

    insertUser();
});

module.exports = router;
