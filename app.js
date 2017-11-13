const express = require('express');
const path = require('path');
//var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('client-sessions');

const index = require('./routes/index');
const analyse = require('./routes/analyse');
const profile = require('./routes/profile');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const test = require('./routes/test');
const loadtext = require('./routes/loadtext');
const setup = require('./routes/setup');
const comment = require('./routes/comment');
const expressVue = require('express-vue');

const app = express();
const vueOptions = {
    rootPath: path.join(__dirname, '/views'),
    layout: {
        html: {
            start: '<!DOCTYPE html><html>',
            end: '</html>'
        },
        body: {
            start: '<body>',
            end: '</body>'
        },
        template: {
            start: '<div id="app">',
            end: '</div>'
        }
    },
    vue: {
        head: {
            title: 'Hello this is a global title',
            meta: [
                { script: 'https://unpkg.com/vue' },
                { style: '/css/style.css' }
            ]
        }
    },
    data: {
        foo: true,
        bar: 'yes',
        qux: {
            id: 123,
            baz: 'anything you wish, you can have any kind of object in the data object, it will be global and on every route'
        }
    }
};
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

app.use(session({
    cookieName: 'session',
    secret: 'jierjfijeifjiedffakopkerrtjfswf0j',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

// view engine setup
//app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'vue');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/analyse', analyse);
app.use('/signin', signin);
app.use('/profile', profile);
app.use('/signup', signup);
app.use('/test', test);
app.use('/loadtext', loadtext);
app.use('/setup', setup);
app.use('/comment', comment);


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
    res.renderVue('../error', {
        message: err.message,
        error: err
    });
});

app.set('port', process.env.PORT || 3000);
let server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;
