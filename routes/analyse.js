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

router.get('/', function (req, res, next) {
    dbStub.fiberEstablishConnection();
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});

router.post('/inputText', function (req, res, next) {

    var text = req.body.textInput;
    var words = text.split(' ');
    var results = [];
    for (var i = 0; i < words.length; i++) {
        words[i] = '"' + words[i] + '"';
        try {
            results.push(wait.for(dbStub.makeSQLRequest(dbAction.createInsertCommand('word', ['content', 'isSpecial'], [words[i], 0], null, null))));
        } catch (err) {
            results.push(err);
        }
    }
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: results});
    //res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});
module.exports = router;
