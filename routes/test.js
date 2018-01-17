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
let Tag = 'test.js: ';

//--------------------------------------------------------
/**
 * Special required modules/files:
 */
const dbAction = require('../modules/db_actions');
const jsonAction = require('../modules/json_actions');
const dbStub = require('../modules/db_stub');
const corenlp = require("corenlp-request-wrapper");
const jsonConfigurator = require('jsonfile');
const dbconfig = './modules/config.json';
const wait = require('wait.for');

let vueRenderOptions = {
    head: {
        meta: [
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-blue.min.css'},
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-green.min.css'}
        ]
    }
};

let vueData = {
   worked: false
};

router.get('/', function (req, res, next) {
    wait.launchFiber(getTest, req, res, next);
});

function getTest(req,res, next) {
    dbStub.fiberEstablishConnection();
    res.renderVue('test', vueData, vueRenderOptions);
}

router.post('/theFunction', function (req, res) {
    wait.launchFiber(test, req,res);
});

function test(req, res, next) {
    let querys = [];
    let transControl = {
        useId: []
    };
    let values = [];
    values.push('Max');
    values.push('Musterman');

    values[1] = stringifyForDB(values[1]);
    for(let i =0; i < 20; i++){
        values[0] = stringifyForDB(i);
        querys.push(dbAction.createInsertCommand('accountData',['email', 'username'],values, null, null));
        transControl.useId.push(-1);
    }

    wait.for(dbStub.makeTransaction,querys, transControl);
    vueData.worked = true;
    res.renderVue('test', vueData, vueRenderOptions);
}
/**
 * Makes sure the Quotas " are set for each word in the sql query.
 * TODO: Get this function into db_Actions.js
 * @param input
 * @returns {string}
 */
function stringifyForDB(input) {
    return '"' + input + '"';
}

module.exports = router;
