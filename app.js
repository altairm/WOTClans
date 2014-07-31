var
// Packages
    express = require('express')
    , session = require('express-session')
    , path = require('path')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , config = require('./config.js')
    , wotapi = require('wot-api')

// Routes
    // API
    , clan = require('./routes/api/clan')
    , account = require('./routes/api/account')
    , login = require('./routes/api/login')
    , logout = require('./routes/api/logout')

    // Client
    , index = require('./routes/client/index')
    ;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
    secret:            "wotclans",
    saveUninitialized: true,
    resave:            true
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.config = config;
    wotapi.host = config.wot.api.host;
    wotapi.application_id = config.wot.api.application_id;
    req.wotapi = wotapi;
    next();
});

app.use('/account', account);
app.use('/clan', clan);
app.use('/login', login);
app.use('/logout', logout);
app.use('/', index);

/**
 * error handlers
 */

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('pages/error', {
            message: err.message,
            error:   err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
        message: err.message,
        error:   {}
    });
});

module.exports = app;
