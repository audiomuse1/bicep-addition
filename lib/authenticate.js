let authenticate = (request, response, next) => {
    if (request.isAuthenticated()) {
        module.exports.activeUser = request.user.user;
        return next();
    } else {
        response.cookie('redirectUrl', request.originalUrl);
        response.redirect('/login');
    }
};

module.exports = authenticate;
