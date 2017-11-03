const express = require('express');
const router = express.Router();
//--------------------------------------------------------
/**
 * Tags for console Errors::
 * @type {string}
 */
let desktop = 'desktop Version: ';
let mobile = 'Mobile Version: ';
let bigDesktop = 'Big Desktop Version: ';
let notMedia = 'Not Media-Related Part: ';
let Tag = 'analyse.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
const dbStub = require('../modules/DB-Stub');
const dbAction = require('../modules/DB-Actions');
const wait = require('wait.for-es6');

let results = [];

router.get('/', function (req, res, next) {
    dbStub.fiberEstablishConnection();
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});

router.post('/showText', function (req, res, next) {
    wait.launchFiber(postShowText,req,res, next);
});

function postShowText(req, res, next) {
    let queryOperators = dbAction.getQueryOperators();

    wait.for(sendSQL, dbAction.createInnerJoinSelectCommand('word', 'text'));
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
}

function sendSQL(command) {
    try {
        let result = wait.for(dbStub.makeSQLRequest, command);
        results.push(result);
    } catch (err) {
        results.push(err);
    }
}

module.exports = router;
