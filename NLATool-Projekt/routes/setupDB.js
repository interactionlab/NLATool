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
var Tag = 'profile.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
var dbAction = require('../modules/DB-Actions');
var jsonConfigurator = require('jsonfile');
var wait = require('wait.for');
var dbStub = require('../modules/DB-Stub');

var testJson = './modules/test.json';

var json;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = dbAction.getJsonConfiguration();
    json = JSON.parse(json);
}

router.get('/', function (req, res, next) {
    res.render('./Desktop/setupDB', {
        title: 'NLA - Natural Language Analyse Tool',
        ResultOfSetNewConnection: ''
    });
});

router.post('/setNewConnection', function (req, res) {

    var newConnection = 'connection';
    var i = 0;
    var connections = json.database.connections;
    for (var connec in connections) {
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

    var connection = dbStub.createConnection(connections[newConnection]);
    dbStub.testConnection(connection, function (err) {
        if (err) {
            res.render('./Desktop/setupDB', {
                title: 'NLA - Natural Language Analyse Tool',
                ResultOfSetNewConnection: 'Uh...Oh...We couldnt connect to the Database.' + err
            });
        } else {
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
            /*res.render('./Desktop/setupDB', {
                title: 'NLA - Natural Language Analyse Tool',
                ResultOfSetNewConnection: 'Uh...Oh...We couldnt connect to the Database.' + err
            });*/
        }
    });
});
module.exports = router;
