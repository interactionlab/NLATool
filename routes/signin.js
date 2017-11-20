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
let Tag = 'signin.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */

let vueRenderOptions = {
    head: {
        meta: [
            {script: '/javascripts/ui_functions.js'},
            {script: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-orange.min.css'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-orange.min.css'}

        ]
    }
};

router.get('/', function (req, res, next) {
    res.renderVue('signin', vueRenderOptions);
});

router.post('/login',function (req, res, next) {

});

function loginDB(user, pass) {

}
module.exports = router;


