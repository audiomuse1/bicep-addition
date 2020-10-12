const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const fs = require('fs');
const helmet = require('helmet');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const sessionMemoryStore = require('session-memory-store')(session);

// Configure session storage
const sessionMemoryStorage = new sessionMemoryStore({
    expires: 60 * 60 * 1000,
    debug: true
});

// Import route files
const createRouter = require('./routes/create');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const publicRouter = require('./routes/public');
const skuRouter = require('./routes/sku');
const storeRouter = require('./routes/store');

const app = express();

// Configure view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
    name: 'BICEP_WORKOUT',
    secret: 'STAYFLEXED',
    store: sessionMemoryStorage,
    resave: true,
    saveUninitialized: true
}));

// Configure Passport + middleware
app.use(flash());
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

// Configure Morgan middleware
// PRODUCTION logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'activity.log'), { flags: 'a' });

logger.token('user', request => {
    if (request.user) {
        return request.user.user;
    } else {
        return 'guest';
    }
});

logger.token('userIP', request => {
    let ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    return ip;
});

app.use(logger(':date[clf] [:user]: :method(:status) @:url <:userIP> :response-time[3]ms', {
    skip: function(request) {
        return request.method == 'GET';
    },
    stream: accessLogStream
}));

//  DEVELOPMENT logging
//  app.use(logger('combined'));

// Configure miscellaneous middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'public', '/images/favicon.ico')));
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    force: true,
    indentedSyntax: true,
    outputStyle: 'compressed',
    sourceMap: true
}));

// Use imported routes
app.use('/', indexRouter);
app.use('/create', createRouter);
app.use('/login', loginRouter);
app.use('/public', publicRouter);
app.use('/sku', skuRouter);
app.use('/store', storeRouter);

// Catch 404 and forward to error handler
app.use((request, response, next) => {
    next(createError(404));
});

// Error handler
app.use((error, request, response, next) => {
    // Set locals, only providing error in development
    response.locals.message = error.message;
    response.locals.error = request.app.get('env') === 'development' ? error : {};

    // Render the error page
    response.status(error.status || 500);
    response.render('error');
});

app.listen(8080, () => {
    console.log('bicep flexing...');
});

module.exports = app;
