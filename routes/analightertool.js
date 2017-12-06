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
var Tag = 'analighter.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */

let vueRenderOptions = {
    head: {
        meta: [
            {script: '/javascripts/data_management.js'},
            {script: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-blue.min.css'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-blue.min.css'},
            {style: 'https://fonts.googleapis.com/icon?family=Material+Icons'},
            {style: '/css/style.css'},

        ]
    }
};

router.get('/', function (req, res, next) {
    res.renderVue('analysis',vueRenderOptions);
});

module.exports = router;
