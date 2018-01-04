const express = require('express');
const router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
const desktop = 'desktop Version: ';
const mobile = 'Mobile Version: ';
const bigDesktop = 'Big Desktop Version: ';
const notMedia = 'Not Media-Related Part: ';
const Tag = 'profile.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
const dbStub = require('../modules/db_stub');
const dbAction = require('../modules/db_actions');
const wait = require('wait.for');

let vueRenderOptions = {
    head: {
        meta: [
            {script: '/javascripts/data_management.js'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-blue.min.css'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-green.min.css'}
        ]
    }
};

/**
 * Vue data object to be set for this route.
 * @type {{vueText: null, vueTokens: null}}
 */
let vueData = {

};

router.get('/', function (req, res, next) {

    res.renderVue('profile',vueData, vueRenderOptions);
});

module.exports = router;
