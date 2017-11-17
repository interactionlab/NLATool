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
let Tag = 'profile.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
const dbAction = require('../modules/db_actions');
const jsonConfigurator = require('jsonfile');
const wait = require('wait.for');
const dbStub = require('../modules/db_stub');
const jsonAction = require('../modules/json_actions');
const testJson = './modules/test.json';

let json;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = jsonAction.getJsonConfiguration();
    json = JSON.parse(json);
}

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

let vueData = {
    ResultOfSetNewConnection : null
};

router.get('/', function (req, res, next) {
    res.renderVue('setupdb', vueData, vueRenderOptions);
});

router.post('/setNewConnection', function (req, res) {

    let newConnection = 'connection';
    let i = 0;
    let connections = json.database.connections;
    for (let connec in connections) {
        connections[connec].priority = connections[connec].priority + 1;
        i++;
    }
    newConnection = newConnection + i;
    //json.database.connections[newConnection] = {};

    //console.log('"3435345' + newConnection + ': ' + req.body.host + ', ' + req.body.port + ', ' + req.body.user + ', ' + req.body.password);
    connections[newConnection] = {
        host: req.body.host,
        port: req.body.port,
        user: req.body.user,
        password: req.body.password,
        priority: '1'
    };
    console.log(connections[newConnection]);

    let connection = dbStub.createConnection(connections[newConnection]);
    if (dbStub.isDBReadyForQuery()) {
        jsonConfigurator.writeFile(testJson, json, function (err, result) {
            if (err) {
                res.renderVue('setupdb', vueData, vueRenderOptions);
            } else {
                res.renderVue('setupdb', vueData, vueRenderOptions);
            }
        });
    }
});
module.exports = router;
