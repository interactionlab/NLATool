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

router.get('/test', function (req, res, next) {
    res.render('./Testview', {title: 'NLA - Natural Language Analyse Tool'});
});

router.post('/test/theFunction', function(req, res){
    var testingFunction= req.testfunction;
    DB-Actions.createSelectCommand('nutzer', 'nla-beta');

});

module.exports = router;
