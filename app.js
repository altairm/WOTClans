var
// Packages
    express = require('express')
    , session = require('express-session')
    , http = require('http')
    , https = require('https')
    , debug = require('debug')('server')
    , path = require('path')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , config = require('./config.js')
    , wotapi = require('wot-api')
    , MongoClient = require('mongodb').MongoClient

// Routes
// API
    , clan = require('./routes/api/clan')
    , account = require('./routes/api/account')
    , login = require('./routes/api/login')
    , logout = require('./routes/api/logout')

// Client
    , index = require('./routes/client/index')
    ;

var app = express(),
    db,
    server;

// Start the DB connection and the server
MongoClient.connect("mongodb://" + config.db.host + ":" + config.db.port + "/" + config.db.database, function (err, database) {
    if (err) throw err;

    db = database;

// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(session({
        secret: "wotclans",
        saveUninitialized: true,
        resave: true
    }));

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function (req, res, next) {
        req.db = db;
        req.config = config;
        wotapi.config = config.wot;
        req.wotapi = wotapi;
        next();
    });


// Check session and invalidate user if token has passed its due.
// Note: UTC unit of time is one second.
    app.use(function (req, res, next) {
        if ((!req.session.user || !req.session.user.authorized || !req.session.user.expires_at) ||
            (parseInt(req.session.user.expires_at) <= parseInt(new Date().getTime() / 1000))) {
            req.session.user = {
                authorized: false
            }
        }
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
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('pages/error', {
            message: err.message,
            error: {}
        });
    });

    // Start the application after the database connection is ready
    http.createServer(app).listen(config.app.port || process.env.PORT || 3000);
    https.createServer(config.app.ssl, app).listen(config.app.port_ssl || process.env.PORT_SSL || 3001);
});




