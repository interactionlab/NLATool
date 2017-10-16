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
var jsonAction = require('./jsonActions');
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
};

/**
 * Starting the Fiber for establish Connection for the use of wait.for
 */
exports.fiberEstablishConnection = function () {
    wait.launchFiber(establishConnection);
};

/**
 * sets up the whole connection Process, checking the database, setting up the database,
 * synchronises all the Settings made in the dbconfig.json with those on the DB itself.
 *
 */
function establishConnection() {
    var connectSettings;
    json = dbAction.getJsonConfiguration();
    json = JSON.parse(json);
    //console.log(notMedia + Tag + 'json outside before parse: ' + json);

    for (var connect in json.database.connections) {
        connectSettings = getConnectionSettings(json.database.connections[connect]);
        //console.log(notMedia + Tag + 'connection Settings: ' + JSON.stringify(connectSettings));
        dbStub.createConnection(connectSettings);
        if (dbStatus.connection !== null && dbStatus.connected !== false) {
            break;
        }
    }
    if (dbStatus.connection !== null && dbStatus.connected !== false) {
        testDatabase();
        if (syncDatabase()) {
            console.log(notMedia + Tag + 'Establishing Connection to Server and checking it for mistakes is successful');
        } else {
            console.log(notMedia + Tag + 'Establishing Connection to Server and checking it for mistakes failed.');
        }
    } else {
        console.connectionError(notMedia + Tag + 'No Database was available or all connection Settings a wrong!')
    }
}

/**
 * On the basis of dbStatus, this method will change/create the Database to match the settings in the dbconfig.json.
 * After that is tests if the Database matches the settings.
 * @returns {boolean}
 */
syncDatabase = function () {
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
    } else if (dbStatus.isCorrect) {
        return true;
    } else if (!dbStatus.isCorrect) {
        //TODO: Corect the Database. Commands like ALTER TABLE will be needed.
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

/**
 * It sends a given MySQL Command/query (as string) to the database.
 * Can be used with the callback paradigm or within a try/catch when using wait.for.
 * (dont forget to use JSON.parse since its callback sends a stringified version of the result.
 * It also updates the queryStatus for further control.
 * This Function requires a positive Result of isDBReadyforQuery()
 * @param query
 * @param callback
 */
exports.makeSQLRequest = function (query, callback) {
    if (dbStub.isDBReadyForQuery()) {
        connection.query(query, function (err, result) {
            if (err) {
                console.log(err);
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
        });
    } else {
        var err = 'ERROR: Database not ready for query. Either the connection is faulty or the Database cennected to, is not correctly setup! ' +
            'Please check with "getDbStatus" if there is an error.';
        callback(err, null);
    }
};

/**
 * This function will extract all the important values you need to create a connection or pool.
 * @param connect
 * @returns {{}}
 */
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
/**
 * Checks if the Database matches the dbconfig Settings.
 * @returns {boolean}
 */
testDatabase = function () {
    var isTheSame = true;
    useDatabase(json.database.name);
    if (dbStatus.exists === true) {
        var jsonList = jsonAction.getTableListFromJson();
        //console.log(notMedia + Tag + 'Table List in the json file: ' + jsonList);
        try {
            var tablesOnDB = wait.for(makeSQLRequest, 'SHOW TABLES');
            tablesOnDB = JSON.parse(tablesOnDB);
        } catch (err) {
            dbStatus.isCorrect = false;
            dbStatus.error = err;
            return false;
        }
        var dbList = [];
        for (var j = 0; j < tablesOnDB.length; j++) {
            dbList.push(tablesOnDB[j]['Tables_in_' + json.database.name]);
        }
        //console.log(notMedia + Tag + 'Table List on the current Database Server: ' + dbList);
        if (isArrayTheSame(jsonList, dbList)) {
            for (var i = 0; i < jsonList.length; i++) {
                var jsonColumns = jsonAction.getColumnsOfOneTable(jsonList[i]);
                //jsonColumns = dbAction.syncWithDeafault
                //console.log(notMedia + Tag + 'Columns of the Json: ' + jsonColumns);
                try {
                    var dbColumns = wait.for(makeSQLRequest, 'DESCRIBE ' + jsonList[i]);
                    //console.log(notMedia + Tag + 'Column: ' + jsonList[i] + ' of the Database: ' + dbColumns);
                    dbColumns = JSON.parse(dbColumns);
                    dbColumns = makeColumnDescriptionComparableToJson(dbColumns);
                    //dbColumns = JSON.parse(dbColumns);
                } catch (err) {
                    //console.error(notMedia + Tag + 'Describe ' + jsonList[i] + ' has Error: ' + err);
                    dbStatus.isCorrect = false;
                }
                //dbColumns = JSON.stringify(dbColumns);
                if (!compareColumns(jsonColumns, dbColumns)) {
                    console.error(notMedia + Tag + 'One Table has different Settings as described in dbconfig.json: ' + jsonList[i]);
                    console.error(notMedia + Tag + 'Here are the settings vof Both Tables: ');
                    console.error(notMedia + Tag + +jsonList[i] + ': ' + jsonColumns);
                    console.error(notMedia + Tag + +jsonList[i] + ': ' + dbColumns);
                    isTheSame = false;
                }
            }
            dbStatus.isCorrect = isTheSame;
        } else {
            dbStatus.isCorrect = false;
        }
    } else {
        dbStatus.isCorrect = false;
        dbStatus.exists = false;
    }
};

/**
 * Compares the Columns of 2 sources on the basis of json in the structure of
 * the dbconfig.json.
 * @param columns1
 * @param columns2
 */
compareColumns = function (columns1, columns2) {
    columns1 = JSON.parse(columns1);
    // columns2 = JSON.parse(columns2);
    var isTheSame = true;
    for (var column1 in columns1) {
        if (isTheSame !== false) {
            for (var column2 in columns2) {
                if (columns1[column1].name === columns2[column2].name && isTheSame !== false) {
                    for (var field in columns1[column1]) {
                        if (columns1[column1][field] !== columns2[column1][field]) {
                            //console.log('Comparison failed because of2: ' + columns1[column1][field] + ' !== ' + columns2[column1][field]);
                            isTheSame = false;
                            break;
                        } else {
                            //console.log('Comparison failed because of2: ' + columns1[column1][field] + ' === ' + columns2[column1][field]);
                            isTheSame = true;
                        }
                    }
                } else {
                    break;
                }
            }
        } else {
            break;
        }
    }
    return isTheSame;
};

/**
 * MySql has a wierd output for their Table Descriptions, thus this function
 * should translate the Output in a way that it can be compared with the structure
 * of the dbconfig.json
 * @param sqlResult
 */
makeColumnDescriptionComparableToJson = function (sqlResult) {
    var type;
    var columns = {};
    var column = 'column';
    for (var i = 0; i < sqlResult.length; i++) {
        column = column + (i + 1);
        columns[column] = {};
        for (var setting in sqlResult[i]) {
            if (setting === 'Field') {
                columns[column]['name'] = sqlResult[i][setting];
            } else if (setting === 'Type') {
                var tempType = sqlResult[i][setting];
                var length = null;
                var index = tempType.indexOf('(');
                if (index > -1) {
                    type = tempType.substr(0, index);
                    length = tempType.substr(index + 1);
                    length = jsonAction.setCharAt(length, length.length - 1, '');
                    columns[column]['length'] = length;
                } else {
                    type = tempType;
                }
                columns[column]['type'] = type.toUpperCase();
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
                } else if (sqlResult[i][setting] !== 'PRI' && sqlResult[i][setting] !== 'UNI') {
                    columns[column]['PRIMARY'] = false;
                    columns[column]['UNIQUE'] = false;
                }
            } else if (setting === 'Extra') {
                if (sqlResult[i][setting] === 'auto_increment') {
                    columns[column]['AUTO_INCREMENT'] = true;
                } else {
                    columns[column]['AUTO_INCREMENT'] = false;
                }
            }
        }
        column = jsonAction.setCharAt(column, column.length - 1, '');
    }
    //console.log(notMedia + Tag + 'Result of makeColumnDescriptionComparable: ' + JSON.stringify(columns));
    return columns;
};

/**
 * Checks whether or not 2 Arrays of Strings are the same.
 * @param array1
 * @param array2
 * @returns {boolean}
 */
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

/**
 * Establishes a Connection to the MySql Database Server.
 * It needs an Object that specifies the host, port, user and password
 * to work. You can also specify the database you want to connect to.
 * @param connectionSettings
 */
exports.createConnection = function (connectionSettings) {
    connection = mysql.createConnection(connectionSettings);
    testConnection(connection);
};

/**
 * Tests if if the connection works. It uses the Ping method
 * and needs to be used in a wait.for Fiber to work.
 * @param connection
 */
function testConnection(connection) {
    if (dbStatus.connected !== true || dbStatus.connectionError === null) {
        try {
            wait.forMethod(connection, "ping");
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

/**
 * Resets the dbStatus to its default values.
 */
function resetDbStatus() {
    dbStatus.isCorrect = false;
    dbStatus.connection = null;
    dbStatus.exists = false;
    dbStatus.connectionError = null;
    dbStatus.connected = false;
}

/**
 * Checks dbStatus if the Database is ready for querys that wont create Errors
 * based on Connection errors or Structural Differences.
 * @returns {boolean}
 */
exports.isDBReadyForQuery = function () {
    return dbStatus.connected === true
        && dbStatus.connection !== null
        && dbStatus.error === null
        && dbStatus.connectionError === null
        && dbStatus.exists === true
        && dbStatus.isCorrect === true;
}

/**
 * Resets the queryStatus to its default values.
 */
function resetQueryStatus() {
    queryStatus.error = null;
    queryStatus.executed = false;
    queryStatus.result = null;
}

/**
 * Selects/uses a specified Database.
 * @param name
 */
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

/**
 * Create a Pool of Connections to the database.
 * TODO: Test the pool afterwards.
 * @param connectionSettings
 * @returns {Pool}
 */
exports.createPool = function (connectionSettings) {
    var pool = mysql.createPool(connectionSettings);
    return pool;
};

/**
 * Returns the Status of the DB.
 * @returns {{connected: boolean, connectionError: null, exists: boolean, isCorrect: boolean, connection: null, error: null}}
 */
exports.getDBStatus = function () {
    return dbStatus;
};

/**
 * Returns the Status of the current Query.
 * @returns {{error: null, executed: boolean, result: null}}
 */
exports.getQueryStatus = function () {
    return queryStatus;
};