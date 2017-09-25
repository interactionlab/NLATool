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
var Tag = 'analyse.js: ';

router.get('/analyse', function (req, res, next) {
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool'});
});
module.exports = router;
