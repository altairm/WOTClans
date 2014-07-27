var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.js');
var wotapi = require('wot-api');
var handlebars = require("express3-handlebars");

var clan = require('./routes/clan');
var account = require('./routes/account');
var test = require('./routes/test');
var app = express();

// templating setup
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// view engine setup
app.set('views', path.join(__dirname, 'views/layouts'));


app.use(session({
    secret: "wotclans",
    saveUninitialized: true,
    resave: true
}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    req.config = config;
    wotapi.host = config.wot.api.host;
    wotapi.application_id = config.wot.api.application_id;
    req.wotapi = wotapi;
    next();
});

/*app.all('*', function(req, res, next){
 if (req.originalUrl != '/' && req.session.huj == undefined) {
 var err = new Error('Not Authorized');
 err.status = 401;
 next(err);
 } else {
 next();
 }
 });*/

app.use('/account', account);
app.use('/clan', clan);
app.use('/test', test);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
