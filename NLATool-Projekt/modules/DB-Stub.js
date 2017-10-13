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
//console.log(notMedia + Tag + 'connection Status1' + connection + typeof connection);
var dbStatus = {
    connected: false,
    connectionError: null,
    exists: false,
    isCorrect: false,
    connection: null
};
var queryStatus = {
    error: null,
    executed: false,
    result: null
}


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
        testDatabase();
        if (checkDatabase()) {
            console.log('finished');
        } else {
            console.log('failed to create DB.');
        }
    } else {
        console.connectionError(notMedia + Tag + 'No Database was available or all connection Settings a wrong!')
    }

}

checkDatabase = function () {
    if (!dbStatus.exists) {
        dbAction.setupDB(connection);
        console.log(notMedia + Tag + 'Setup of DB complete.');
        try {
            var res = wait.for(makeSQLRequest, dbAction.createSelectCommand('word', null, null, null));
            console.log(notMedia + Tag + 'Result of Select in databasCreated: ' + res.id);
            dbStatus.exists = true;
            dbStatus.isCorrect = true;
            return true;
        }catch (err){
            dbStatus.isCorrect = false;
        }
    } else if (!dbStatus.isCorrect) {
        return true;
    }

};

makeSQLRequest = function (query, callback) {
    connection.query(query, function (err, result) {
        if (err) {
            //console.log(err);
            queryStatus.executed = false;
            queryStatus.error = err;
            callback(err, null);
        }
        else {
            console.log(notMedia + Tag + 'Result of the SQL Request: ' + JSON.stringify(result));
            queryStatus.result = result;
            queryStatus.executed = true;
            callback(null, JSON.stringify(result));
        }
    })

    /*
    try {
        var res = connection.query(query);
        console.log(notMedia + Tag + 'Result of the SQL Request: ' + res._results);
        console.log(notMedia + Tag + 'Object.keys of the SQL Request: ' + Object.keys(res));
        return res;
    } catch (err) {
        console.connectionError(notMedia + Tag + 'The SQL Requet failed: ' + err);
        return null;
    }*/
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
    try {
        var dbSelected = wait.for(makeSQLRequest, 'USE nlatool');
        dbSelected = JSON.parse(dbSelected);
        console.log(notMedia + Tag + 'Result of dbSelected: ' + JSON.stringify(dbSelected));
    }
    catch (err) {
        console.connectionError(notMedia + Tag + 'catched a Error with the SQL Request: ' + err);

    }

    if (dbSelected === json.database.name) {
        var jsonList = dbAction.getTableListFromJson();
        console.log(notMedia + Tag + 'Table List in the json file: ' + jsonList);
        var tablesOnDB = makeSQLRequest('SHOW TABLES');
        var dbList = [];
        for (var table in tablesOnDB) {
            dbList.push(table);
        }
        console.log(notMedia + Tag + 'Table List on the current Database Server: ' + dbList);
        if (isArrayTheSame(jsonList, dbList)) {
            for (var table in jsonList) {
                var jsonColumns = dbAction.getColumnsOfOneTable(table);
                console.log(notMedia + Tag + 'Columns of the Json: ' + jsonColumns);
                var dbColumns = makeSQLRequest('DESCRIBE ' + table);
                console.log(notMedia + Tag + 'Columns of the Database: ' + dbColumns);

            }
        } else {
            dbStatus.isCorrect = false;
        }
    } else {
        dbStatus.isCorrect = false;
        dbStatus.exists = false;
    }
};

isArrayTheSame = function (array1, array2) {
    var istheSame = false;
    for (var index in array1) {
        if (array2.indexOf(index) > -1) {
            istheSame = true;
        } else {
            istheSame = false;
            break;
        }
    }
    return istheSame;
};


createConnection = function (connectionSettings) {
    connection = mysql.createConnection(connectionSettings);
    testConnection(connection);
};

function testConnection(connection) {
    if (dbStatus.connected !== true || dbStatus.connectionError === null) {
        try {
            var res = wait.forMethod(connection, "ping");
            //console.log(notMedia + Tag + 'result of ping: ' + JSON.stringify(res));
            dbStatus.connected = true;
            dbStatus.connectionError = null;
            dbStatus.connection = connection;
        } catch (err) {
            dbStatus.connected = false;
            dbStatus.connectionError = err;
            console.log(notMedia + Tag + 'ping threw connectionError: ' + dbStatus.connectionError);
        }
    }
}

function resetDbStatus() {
    dbStatus.isCorrect = false;
    dbStatus.connection = null;
    dbStatus.exists = false;
    dbStatus.connectionError = null;
    dbStatus.connected = false;
}

function restQueryStatus() {
    queryStatus.error = null;
    queryStatus.executed = false;
    queryStatus.result = null;
}

exports.createPool = function (connectionSettings) {
    var pool = mysql.createPool(connectionSettings);
    return pool;
};

exports.getDBStatus = function () {
    return dbStatus;
};
