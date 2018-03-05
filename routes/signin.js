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
const dbAction = require('../modules/db_actions');
const dbStub = require('../modules/db_stub');
const wait = require('wait.for');

let vueRenderOptions = {
    head: {
        meta: [
            {script: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-orange.min.css'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-orange.min.css'}

        ]
    }
};

let vueData = {};

router.get('/', function (req, res, next) {
    res.renderVue('signin', vueRenderOptions);
});

router.post('/login', function (req, res, next) {
    try {
        if (wait.launchFiber(loginDB, req.body.user, req.body.pass)) {
            req.session.user = req.body.user;
            res.renderVue('signin', vueRenderOptions);
        }
    }catch (err){
        console.log(Tag+'Login failed due to error:' + err);
        res.redirect('/signin');
    }
});

router.post('/register', function (req, res, next) {
    res.renderVue('signin', vueRenderOptions);
});


function loginDB(user, pass) {
    wait.for(dbStub.makeSQLRequest, dbAction.createSelectCommand('accountData', ['email', 'username', 'pass']));

    return false;
}

module.exports = router;


