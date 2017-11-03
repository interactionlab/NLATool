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
const dbAction = require('../modules/DB-Actions');
const jsonConfigurator = require('jsonfile');
const wait = require('wait.for');
const dbStub = require('../modules/DB-Stub');
const jsonAction = require('../modules/jsonActions');
const testJson = './modules/test.json';

let json;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = jsonAction.getJsonConfiguration();
    json = JSON.parse(json);
}

router.get('/', function (req, res, next) {
    res.render('./Desktop/setupDB', {
        title: 'NLA - Natural Language Analyse Tool',
        ResultOfSetNewConnection: ''
    });
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
                res.render('./Desktop/setupDB', {
                    title: 'NLA - Natural Language Analyse Tool',
                    ResultOfSetNewConnection: 'Uh...Oh...We couldnt connect to the Database.' + err
                });
            } else {
                res.render('./Desktop/setupDB', {
                    title: 'NLA - Natural Language Analyse Tool',
                    ResultOfSetNewConnection: 'Success!'
                });
            }
        });
    }
});
module.exports = router;
