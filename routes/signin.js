const express = require('express');
const router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let desktop = 'desktop Version: ';
let mobile = 'Mobile Version: ';
let bigDesktop = 'Big Desktop Version: ';
let notMedia = 'Not Media-Related Part: ';
let Tag = 'signIn.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */

router.get('/', function (req, res, next) {
    res.render('./Desktop/signin', {title: 'NLA - Natural Language Analyse Tool'});
});
module.exports = router;