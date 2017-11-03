//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let notMedia = 'Not Media-Related Part: ';
let Tag = 'sessionLogic.js: ';

//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
//const jsonConfigurator = require('jsonfile');
const wait = require('wait.for');
const dbConfig = './modules/config.json';
const dbAction = require('./DB-Actions');
const dbStub = require('./DB-Stub');
const jsonAction = require('./jsonActions');
const changeDB = require('./changeDB');
//var json = test.json;

let json = null;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = jsonAction.getJsonConfiguration();
    json = JSON.parse(json);
}

exports.verifySessionUser = function (req, res, next) {
    if (req.session && req.session.user) {
        if (verifySessionUserDB(req.session.email)) {
            req.user = user;
            delete req.user.password;
            req.session.user = user;
        }
        next();
    } else {
        next();
    }
};

exports.requireSignIn = function (req, res, next) {
    if (!req.user) {
        res.redirect('/signIn');
    } else {
        next();
    }
};



function verifySessionUserDB(email) {
    //TODO: Select Request to DB & checking if Results match session variables
    return false;
}