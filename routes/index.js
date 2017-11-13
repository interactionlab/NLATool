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
let Tag = 'index.js: ';


/* GET home page. */
router.get('/', function (req, res, next) {
    res.renderVue('index', {title: 'NLA - Natural Language Analyse Tool'});
});

//---------------------------------------------------------
/**
 * Texte reinladen
 */
router.post ('/loadText', function(req, res, next) {
   res.redirect('/loadtext');
});

//---------------------------------------------------------
/**
 * Analyse Button
 */

//---------------------------------------------------------
/**
 * Menu Button
 */

//---------------------------------------------------------
/**
 * Account button
 */

//---------------------------------------------------------
/**
 * Sonstige Layoutsachen
 */





module.exports = router;
