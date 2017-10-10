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
console.log(notMedia + Tag + 'connection Status1'+ connection + typeof connection);
var dbStatus = {
    connected: false,
    error: null,
    isCorrect: false
};

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
        console.log(notMedia + Tag + 'connection Status2'+ connection + typeof connection);
        connection = createConnection(connectSettings);
        console.log(notMedia + Tag + 'connection Status3'+ connection + typeof connection);
        break;
    }
    if (wait.for(databaseCreated, 4)) {
        console.log('finished');
    }

}

databaseCreated = function (times) {
    console.log('Still ' + times + ' trys');
    if (times === 0) {
        console.log(notMedia + Tag + 'Not connected to Database!');
        return false;
    }

    if (dbStatus.connected === false ||(typeof connection ==="undefined")) {
        console.log(notMedia + Tag + 'Not yet connected to Database!'+ connection + typeof connection);
        setTimeout(function () {
            return databaseCreated(times - 1);
        }, 1000);
    } else {
        console.log(notMedia+ Tag +'Hier: '+ JSON.stringify(dbStatus));
        dbAction.setupDB(connection);
        console.log(notMedia + Tag + 'Setup of DB complete.');
        var res = makeSQLRequest(dbAction.createSelectCommand('word', null, null, null));
        console.log(notMedia + Tag + 'Result of Select in databaseCreated: ' + res.id);
        return true;
    }


};

makeSQLRequest = function (query) {
    return wait.for(connection.query(query));
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
    console.log(notMedia + Tag + 'connection Status4'+ connection + typeof connection);
    wait.launchFiber(testConnection, connection);
    setTimeout(function () {
        if (dbStatus.connected === true) {
            console.log(notMedia + Tag + 'connection Status5'+ connection + typeof connection);
            return connection;
        } else if (dbStatus.error !== null) {
            console.log('got here2');
            return null;
        } else {
            console.log('got here3: ' + JSON.stringify(dbStatus));
            return null;
        }
    }, 100);
};

function testConnection(connection) {
    console.log(notMedia + Tag + 'connection Status6'+ connection + typeof connection);
    if (dbStatus.connected !== true || dbStatus.error === null) {
        try {
            var res = wait.forMethod(connection, "ping");
            console.log(notMedia + Tag + 'connection Status7'+ connection + typeof connection);
            console.log(notMedia + Tag + 'result of ping: ' + JSON.stringify(res));
            dbStatus.connected = true;
            dbStatus.error = null;
        } catch (err) {
            dbStatus.connected = false;
            dbStatus.error = err;
            console.log(notMedia + Tag + 'ping threw error: ' + dbStatus.error);
        }
    }
    console.log(JSON.stringify(dbStatus));
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