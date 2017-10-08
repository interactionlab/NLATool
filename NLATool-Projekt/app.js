var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var analyse = require('./routes/analyse');
var profile = require('./routes/profile');
var signIn = require('./routes/signIn');
var signUp = require('./routes/signUp');
var test = require('./routes/test');
var loadtext = require('./routes/loadtext');
var uitest = require('./routes/uitest');
var setupDB = require('./routes/setupDB');


var app = express();

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
app.use(express.static(path.join(__dirname,'css')));

app.use('/', index);
app.use('/analyse', analyse);
app.use('/signIn', signIn);
app.use('/profile', profile);
app.use('/signUp', signUp);
app.use('/test', test);
app.use('/loadtext', loadtext);
app.use('/uitest', uitest);
app.use('/setupDB', setupDB);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
