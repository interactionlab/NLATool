var express = require('express');
var router = express.Router();

//--------------------------------------------------------
/**
 * Tag für Konsolen Fehlersuche:
 * @type {string}
 */
var desktop = 'desktop Version: ';
var mobile = 'Mobile Version: ';
var bigDesktop = 'Big Desktop Version: ';
var notMedia = 'Not Media-Related Part: ';
var Tag = 'index.js: ';


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('./Desktop/index', {title: 'NLA - Natural Language Analyse Tool'});
});

//---------------------------------------------------------
/**
 * Texte reinladen
 */

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
