var express = require('express');
var router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
var desktop = 'desktop Version: ';
var mobile = 'Mobile Version: ';
var bigDesktop = 'Big Desktop Version: ';
var notMedia = 'Not Media-Related Part: ';
var Tag = 'test.js: ';

//--------------------------------------------------------
/**
 * Special required modules/files:
 */
var dbAction = require('../modules/DB-Actions');
router.get('/', function (req, res, next) {
    res.render('./testview', {title: 'NLA - Natural Language Analyse Tool' ,result: '' });
});




router.post('/theFunction', function(req, res){
    var testingFunction= req.testfunction;
    var nutzer = ['eins', 'zwei','drei','vier'];
    var resultOfSQL = dbAction.createInsertCommand(nutzer, 'nla-beta');
    res.render('./testview',{title: 'NLA - Natural Language Analyse Tool',result: resultOfSQL});
});


module.exports = router;
