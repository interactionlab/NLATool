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
const dbAction = require('./db_actions');
const dbStub = require('./db_stub');
const jsonAction = require('./json_actions');
const changeDB = require('./changedb');
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

exports.requiresignin = function (req, res, next) {
    if (!req.user) {
        res.redirect('/signin');
    } else {
        next();
    }
};



function verifySessionUserDB(email) {
    //TODO: Select Request to DB & checking if Results match session variables
    return false;
}