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
    connection: null,
    error: null
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
            res = JSON.parse(res);
            console.log(notMedia + Tag + 'Result of Select in databasCreated: ' + res);
            dbStatus.exists = true;
            dbStatus.isCorrect = true;
            return true;
        } catch (err) {
            dbStatus.isCorrect = false;
        }
    } else if (!dbStatus.isCorrect) {
        return true;
    }

};
/**
 * It sends a given MySQL Command/query (as string) to the database.
 * Can be used with the callback paradigm or within a try/catch when using wait.for.
 * (dont forget to use JSON.parse since its callback sends a stringified version of the result.
 * It also updates the queryStatus for further control.
 * @param query
 * @param callback
 */
makeSQLRequest = function (query, callback) {
    connection.query(query, function (err, result) {
        if (err) {
            //console.log(err);
            queryStatus.executed = false;
            queryStatus.error = err;
            callback(err, null);
        }
        else {
            //console.log(notMedia + Tag + 'Result of the SQL Request: ' + JSON.stringify(result));
            queryStatus.result = result;
            queryStatus.executed = true;
            callback(null, JSON.stringify(result));
        }
    });
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

/*
try {
        var dbSelected = wait.for(makeSQLRequest, 'SELECT DATABASE()');
        dbSelected = JSON.parse(dbSelected);
        console.log(notMedia + Tag + 'Result of dbSelected: ' + JSON.stringify(dbSelected));
    }
    catch (err) {
        console.connectionError(notMedia + Tag + 'catched a Error with the SQL Request: ' + err);

    }
* */

testDatabase = function () {
    useDatabase(json.database.name);
    if (dbStatus.exists === true) {
        var jsonList = dbAction.getTableListFromJson();
        console.log(notMedia + Tag + 'Table List in the json file: ' + jsonList);
        try {
            var tablesOnDB = wait.for(makeSQLRequest, 'SHOW TABLES');
            tablesOnDB = JSON.parse(tablesOnDB);
        } catch (err) {
            dbStatus.isCorrect = false;
            dbStatus.error = err;
            return false;
        }
        var dbList = [];
        for (var i = 0; i < tablesOnDB.length; i++) {
            dbList.push(tablesOnDB[i]['Tables_in_' + json.database.name]);
        }
        console.log(notMedia + Tag + 'Table List on the current Database Server: ' + dbList);
        if (isArrayTheSame(jsonList, dbList)) {
            for (var i = 0; i < jsonList.length; i++) {
                var jsonColumns = dbAction.getColumnsOfOneTable(jsonList[i]);
                //console.log(notMedia + Tag + 'Columns of the Json: ' + jsonColumns);
                try {
                    var dbColumns = wait.for(makeSQLRequest, 'DESCRIBE ' + jsonList[i]);
                    console.log(notMedia + Tag + 'Column: ' + jsonList[i] + ' of the Database: ' + dbColumns);
                    dbColumns = JSON.parse(dbColumns);
                    makeColumnDescriptionComparableToJson(dbColumns);
                } catch (err) {
                    console.error(notMedia + Tag + 'Describe ' + jsonList[i] + ' has Error: ' + err);
                }

            }
        } else {
            dbStatus.isCorrect = false;
        }
    } else {
        dbStatus.isCorrect = false;
        dbStatus.exists = false;
    }
};
makeColumnDescriptionComparableToJson = function (sqlResult) {
    var columns = {};
    var column = 'column';
    for (var i = 0; i < sqlResult.length; i++) {
        column = column + (i + 1);
        for (var setting in sqlResult[i]) {
            if (setting === 'Field') {
                columns[column]['name'] = sqlResult[i][setting];
            } else if (setting === 'Type') {
                var type = sqlResult[i][setting];
                var length = null;
                var index = type.indexOf('(');
                type = type.substr(0,index-1);
                length = type.substr(index);
                console.log(notMedia + Tag + 'type: ' + type + ' length: ' +length);
                columns[column]['type'] = type;
                columns[column]['length'] = length;
            } else if (setting === 'Null') {
                if (sqlResult[i].Null === 'NO') {
                    columns[column]['null'] = 'NOT NULL';
                } else {
                    columns[column]['null'] = 'NULL';
                }
            } else if (setting === 'Key') {
                if (sqlResult[i][setting] === 'PRI') {
                    columns[column]['PRIMARY'] = true;
                    columns[column]['UNIQUE'] = false;

                } else if (sqlResult[i][setting] === 'UNI') {
                    columns[column]['PRIMARY'] = false;
                    columns[column]['UNIQUE'] = true;
                }
            } else if(setting === 'Extra'){
                if(sqlResult[i][setting]=== 'auto_increment'){
                    columns[column]['AUTO_INCREMENT'] = true;
                } else {
                    columns[column]['AUTO_INCREMENT'] = false;
                }
            }
        }
    }
};

isArrayTheSame = function (array1, array2) {
    var isTheSame = false;
    if (array1.length !== array2.length) {
        isTheSame = false;
    } else {
        for (var i = 0; i < array1.length; i++) {
            if (array2.indexOf(array1[i]) > -1) {
                isTheSame = true;
            } else {
                isTheSame = false;
                break;
            }
        }
    }
    //console.log(notMedia + Tag + 'isArrayTheSame Result is: ' + isTheSame);
    return isTheSame;
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

function resetQueryStatus() {
    queryStatus.error = null;
    queryStatus.executed = false;
    queryStatus.result = null;
}

function useDatabase(name) {
    try {
        wait.for(makeSQLRequest, 'USE ' + name);
        dbStatus.exists = true;
    } catch (err) {
        dbStatus.exists = false;
        dbStatus.error = err;
    }
    resetQueryStatus();
}

exports.createPool = function (connectionSettings) {
    var pool = mysql.createPool(connectionSettings);
    return pool;
};

exports.getDBStatus = function () {
    return dbStatus;
};

exports.getQueryStatus = function () {
    return queryStatus;
};