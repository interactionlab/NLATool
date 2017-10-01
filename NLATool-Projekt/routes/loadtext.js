var express = require('express');
var router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors::
 * @type {string}
 */
var desktop = 'desktop Version: ';
var mobile = 'Mobile Version: ';
var bigDesktop = 'Big Desktop Version: ';
var notMedia = 'Not Media-Related Part: ';
var Tag = 'index.js: ';


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('./Desktop/loadtext.js', {title: 'NLA - Natural Language Analyse Tool'});
});


module.exports = router;