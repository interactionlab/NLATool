const express = require('express');
const path = require('path');
//var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('client-sessions');

const index = require('./routes/index');
const analysis = require('./routes/analysis');
const profile = require('./routes/profile');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const test = require('./routes/test');
const loadtext = require('./routes/loadtext');
const setup = require('./routes/setup');
const comment = require('./routes/comment');
const expressVue = require('express-vue');
const ip = require('ip');
const app = express();

const ipAdress = ip.address();

const dbStub = require('./modules/db_stub');
dbStub.fiberEstablishConnection();

if (process.env.NODE_ENV === 'production') {
    //its production so use the minimised production build of vuejs
    vueScript = 'https://unpkg.com/vue';
}

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
            title: 'NLA - Natural Language Analyse Tool',
            meta: [
                {script: '/javascripts/vue.js'},
                {script: 'https://code.getmdl.io/1.3.0/material.min.js'},
                {script: 'https://cdnjs.cloudflare.com/ajax/libs/autosize.js/3.0.16/autosize.min.js'},
                {style: 'https://storage.googleapis.com/code.getmdl.io/1.3.0/material.indigo-blue.min.css'},
                {style: 'https://fonts.googleapis.com/icon?family=Material+Icons'},
                {style: 'https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css'},
                {style: '/css/style.css'},
                {style: '/css/debugstyle.css'},
                {charset: 'UTF-8'}
            ]
        }
    },
    data: {
        title:'NLA - Natural Language Analyse Tool',
        title_small: 'NLA - Tool',
        serverip: ipAdress

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
app.use('/analysis', analysis);
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
    const data = {
        message: err.message,
        error: err,
        status: err.status,
        stack: err.stack
    };
    res.renderVue('error', data);
});

app.set('port', process.env.PORT || 3000);
let server = app.listen(app.get('port'), function () {
    var ipVerson = "ipV4";
    if (server.address().address == "::")
        ipVerson = "ipV6";
    console.log('Express server listening on ' + ipVerson + ' http://' + server.address().address + ":" + server.address().port);
});


module.exports = app;
