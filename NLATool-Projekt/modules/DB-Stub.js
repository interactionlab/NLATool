/**
 * Database Configuration
 * There is a great possibility that parts of this will be moved into the app.js
 */
//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
var desktop = 'desktop Version: ';
var mobile = 'Mobile Version: ';
var bigDesktop = 'Big Desktop Version: ';
var notMedia = 'Not Media-Related Part: ';
var Tag = 'DB-Stub.js: ';

//--------------------------------------------------------
var mysql = require('mysql');
var dbAction = require('./DB-Actions');
var dbStub = require('./DB-Stub');
var wait = require('wait.for');
//var test = require('../modules/test');


var json = null;
var connection = null;
console.log(notMedia + Tag + 'connection Status1' + connection + typeof connection);
var dbStatus = {
    connected: false,
    error: null,
    exists: false,
    isCorrect: false,
    connection: null
};


/**establishConnection();*/

/**
 * Reading config file to get the connection data of the Database Server.
 */
exports.fiberEstablishConnection = function () {

    wait.launchFiber(establishConnection);
};

function establishConnection() {
    var connectSettings;
    json = dbAction.getJsonConfiguration();
    json = JSON.parse(json);
    //console.log(notMedia + Tag + 'json outside before parse: ' + json);

    for (var connect in json.database.connections) {
        connectSettings = getConnectionSettings(json.database.connections[connect]);
        //console.log(notMedia + Tag + 'connection Settings: ' + JSON.stringify(connectSettings));
        createConnection(connectSettings);
        if (dbStatus.connection !== null && dbStatus.connected !== false) {
            break;
        }
    }
    if (dbStatus.connection !== null && dbStatus.connected !== false) {
        if (checkDatabase(4)) {
            console.log('finished');
        } else {
            console.log('failed to create DB.');
        }
    } else {
        console.error(notMedia + Tag + 'No Database was available or all connection Settings a wrong!')
    }

}

checkDatabase = function () {
    if (!dbStatus.exists) {
        dbAction.setupDB(connection);
        console.log(notMedia + Tag + 'Setup of DB complete.');
        var res = makeSQLRequest(dbAction.createSelectCommand('word', null, null, null));
        console.log(notMedia + Tag + 'Result of Select in databasCreated: ' + res.id);
        dbStatus.exists = true;
        dbStatus.isCorrect = true;
    } else if(!dbStatus.isCorrect){
        
    }
    return true;
};

makeSQLRequest = function (query) {
    try {
        var res = connection.query(query);
        console.log(notMedia + Tag + 'Result of the SQL Request: ' + res);
        return res;
    } catch (err) {
        console.error(notMedia + Tag + 'The SQL Requet failed: ' + err);
        return null;
    }
};

getConnectionSettings = function (connect) {
    var settings = {};
    for (var setting in connect) {
        if (setting !== 'priority') {
            settings[setting] = connect[setting];
        }
    }
    return settings;
};

testDatabase = function () {


};

createConnection = function (connectionSettings) {
    connection = mysql.createConnection(connectionSettings);
    testConnection(connection);
};

function testConnection(connection) {
    if (dbStatus.connected !== true || dbStatus.error === null) {
        try {
            var res = wait.forMethod(connection, "ping");
            //console.log(notMedia + Tag + 'result of ping: ' + JSON.stringify(res));
            dbStatus.connected = true;
            dbStatus.error = null;
            dbStatus.connection = connection;
        } catch (err) {
            dbStatus.connected = false;
            dbStatus.error = err;
            console.log(notMedia + Tag + 'ping threw error: ' + dbStatus.error);
        }
    }
    //console.log(JSON.stringify(dbStatus));
};

exports.createPool = function (connectionSettings) {
    var pool = mysql.createPool(connectionSettings);
    return pool;
};

exports.getDBStatus = function () {
    return dbStatus;
};

/*
connection.connect(function (err) {
    if (err) {
        console.log(notMedia + Tag + 'connection to Database failed.');
    }

    console.log(notMedia + Tag + 'DB Connected');
    connection.query("", function (err, result) {
        if (err) throw err;
        console.log(notMedia + Tag + 'DB created.');
    });
});
*/