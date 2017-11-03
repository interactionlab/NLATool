const express = require('express');
const path = require('path');
//var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const analyse = require('./routes/analyse');
const profile = require('./routes/profile');
const signIn = require('./routes/signIn');
const signUp = require('./routes/signUp');
const test = require('./routes/test');
const loadtext = require('./routes/loadtext');
const setup = require('./routes/setup');
const comment = require('./routes/comment');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/analyse', analyse);
app.use('/signIn', signIn);
app.use('/profile', profile);
app.use('/signUp', signUp);
app.use('/test', test);
app.use('/loadtext', loadtext);
app.use('/setup', setup);
app.use('/Comment', comment);

// catch 404 and forward to connectionError handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// connectionError handler
app.use(function (err, req, res, next) {
    // set locals, only providing connectionError in development
    res.locals.message = err.message;
    res.locals.connectionError = req.app.get('env') === 'development' ? err : {};

    // render the connectionError page
    console.log(err);
    res.status(err.status || 500);
    res.render('./error', {
        message: err.message,
        error: err
    });
});

app.set('port', process.env.PORT || 3000);
let server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;
