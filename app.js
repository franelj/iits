var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('client-sessions');
var morgan = require('morgan');
var routes = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');
var rewards = require('./routes/rewards');
var admins = require('./routes/admin');

var app = express();


app.use(function (req, res, next) {
    if (app.get('env') === 'test' || app.get('env') === 'development') {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
    cookieName: 'session',
    secret: '9pwrU8MxY8YS9WRgG5bq1IQvDZc045y6',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    cookie: {
        path: '/admin', // cookie will only be sent to requests under '/api'
        //maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
        ephemeral: false, // when true, cookie expires when the browser closes
        httpOnly: true, // when true, cookie is not accessible from javascript
        secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
}));
app.use(morgan('dev'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/events', events);
app.use('/rewards', rewards);
app.use('/admin', admins);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.httpStatusCode || 500);
        res.json({
            error: {
                message: err.message,
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.httpStatusCode || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});


module.exports = app;
