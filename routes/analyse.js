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

    var text = req.body.textInput;
    if (/\S/.test(text)){
        res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
    } else {
        var words = text.split(' ');
        console.log(text + ' : ' + words.length);
        for (var i = 0; i < words.length; i++) {
            words[i] = '"' + words[i] + '"';
            wait.launchFiber(sendSQL, words[i]);
        }
        res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: results});
        //res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
    }
});

function sendSQL(word) {
    try {
        var result = wait.for(dbStub.makeSQLRequest, dbAction.createInsertCommand('word', ['content', 'isSpecial'], [word, 0], null, null));
        results.push(result);
    } catch (err) {
        results.push(err);
    }
}

module.exports = router;
