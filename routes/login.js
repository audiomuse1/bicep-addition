const crypto = require('crypto');
const express = require('express');
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const router = express.Router();

const connection = require('../lib/dbconn.js');

passport.use('local', new localStrategy({
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
}, (request, user, pass, done) => {
    if (!user|| !pass) {
        return done(null, false, request.flash('message','All fields required.'));
    }

    let encryptedPass = crypto.createHash('sha256').update(pass).digest('hex');

    connection.query('SELECT * FROM users WHERE user = ?', [user], (error, rows) => {
        if (error) {
            return done(request.flash('message', error));
        }
        if (!rows.length) {
            return done(null, false, request.flash('message','Invalid user or password.'));
        }
        if (!(rows[0].password == encryptedPass)) {
            return done(null, false, request.flash('message','Invalid user or password.'));
        }
        if (!(rows[0].enabled == 1)) {
            return done(null, false, request.flash('message','This account is currently disabled.'));
        }

        return done(null, rows[0]);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    connection.query('SELECT * FROM users WHERE id = '+ id, function (error, rows){
        done(error, rows[0]);
    });
});

router.get('/', (request, response) => {
    response.render('login', {
        'message': request.flash('message')
    });
});

router.post('/', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (request, response) => {
    response.redirect(request.cookies.redirectUrl || '/');
});

module.exports = router;
