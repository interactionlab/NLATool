var express = require('express');
var router = express.Router();
var dbStub = require('../modules/DB-Stub');
var dbAction = require('../modules/DB-Actions');

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
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result:''});
});

router.post('/inputText', function (req, res) {
    var text = req.body.textInput;
    dbStub.makeSQLRequest('INSERT INTO nlatool . text');
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result:text});
});
module.exports = router;
