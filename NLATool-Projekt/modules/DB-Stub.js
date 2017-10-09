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


var json = dbAction.json;
var connection = null;
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
    console.log(notMedia + Tag + 'json outside before parse: ' + json);
    /*var json = dbAction.getJsonConfiguration();

    json = JSON.parse(json);*/
    console.log(json);
    for (var connect in json.database.connections) {
        connectSettings = getConnectionSettings(json.database.connections[connect]);
        //console.log(notMedia + Tag + 'connection Settings: ' + JSON.stringify(connectSettings));
        connection = createConnection(connectSettings);
        if (wait.for(databaseCreated, connection)) {
            console.log(notMedia + Tag + 'Setup of DB complete.');
            break;
        }
    }

}

databaseCreated = function () {

    dbAction.setupDB(connection);
    var res = makeSQLRequest(dbAction.createSelectCommand('word', null, null, null));
    console.log(notMedia + Tag + 'Result of Select in databaseCreated: ' + res.id);


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
    var connection = mysql.createConnection(connectionSettings);
    testConnection(connection);
    if (dbStatus.connected === true) {
        return connection;
    } else if (dbStatus.error !== null) {
        return dbStatus.error;
    } else {
        return null;
    }
};


testConnection = function (connection) {
    for (var i = 0; i < 4; i++) {
        if (dbStatus.connected !== true || dbStatus.error === null) {
            setTimeout(connection.ping(function (err) {
                if (err) {
                    console.log(notMedia + Tag + 'Server didnt respond!');
                    dbStatus.connected = false;
                    dbStatus.error = err;

                } else {
                    console.log(notMedia + Tag + 'Server responded');
                    dbStatus.connected = true;
                    dbStatus.error = null;
                }
            }), 3000);
        }
    }
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