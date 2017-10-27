var express = require('express');
var router = express.Router();
var dbStub = require('../modules/DB-Stub');
var dbAction = require('../modules/DB-Actions');
var wait = require('wait.for');

//--------------------------------------------------------
/**
 * Tags for console Errors::
 * @type {string}
 */
var desktop = 'desktop Version: ';
var mobile = 'Mobile Version: ';
var bigDesktop = 'Big Desktop Version: ';
var notMedia = 'Not Media-Related Part: ';
var Tag = 'analyse.js: ';

var results = [];

router.get('/', function (req, res, next) {
    dbStub.fiberEstablishConnection();
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});

router.post('/inputText', function (req, res, next) {


    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});

function sendSQL(command) {
    try {
        var result = wait.for(dbStub.makeSQLRequest,command);
        results.push(result);
    } catch (err) {
        results.push(err);
    }
}

module.exports = router;
