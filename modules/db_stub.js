/**
 * Database Configuration
 * There is a great possibility that parts of this will be moved into the app.js
 */
//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let desktop = 'desktop Version: ';
let mobile = 'Mobile Version: ';
let bigDesktop = 'Big Desktop Version: ';
let notMedia = 'Not Media-Related Part: ';
let Tag = 'db_stub.js: ';

//--------------------------------------------------------
const mysql = require('mysql');
const dbAction = require('./db_actions');
const dbStub = require('./db_stub');
const wait = require('wait.for');
const jsonAction = require('./json_actions');
//var test = require('../modules/test');


let json = null;
let connection = null;
//console.log(notMedia + Tag + 'connection Status1' + connection + typeof connection);
let dbStatus = {
    connected: false,
    connectionError: null,
    exists: false,
    tablesCorrect: false,
    columnsCorrect: false,
    settingsCorrect: false,
    isCorrect: false,
    connection: null,
    error: null
};
let queryStatus = {
    error: null,
    executed: false,
    result: null
};
let differences = {};

/**
 * Starting the Fiber for establish Connection for the use of wait.for
 */
exports.fiberEstablishConnection = function () {
    wait.launchFiber(establishConnection);
};

exports.nonFiberEstablishConnection = function () {
    establishConnection();
};

/**
 * sets up the whole connection Process, checking the database, setting up the database,
 * synchronises all the Settings made in the config.json with those on the DB itself.
 *
 */
function establishConnection() {
    let connectSettings;
    json = jsonAction.getJsonConfiguration();
    json = JSON.parse(json);
    //console.log(notMedia + Tag + 'json outside before parse: ' + json);
    for (let connect in json.database.connections) {
        connectSettings = jsonAction.getConnectionSettings(json.database.connections[connect]);
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
        console.log(notMedia + Tag + 'No Database was available or all connection Settings a wrong!')
    }
}

/**
 * On the basis of dbStatus, this method will change/create the Database to match the settings in the config.json.
 * After that it tests if the Database matches the settings.
 * @returns {boolean}
 */
syncDatabase = function () {
    if (!dbStatus.isCorrect) {
        //Configuration of DB is not the same, as specified on the Server:
        if (!dbStatus.exists) {
            //DB doesnt exist -> create one on the DB Server
            dbAction.setupdb(connection);
            console.log(notMedia + Tag + 'Setup of DB complete.');
            try {
                let res = wait.for(makeSQLRequest, dbAction.createSelectCommand('word', null, null, null));
                res = JSON.parse(res);
                console.log(notMedia + Tag + 'Result of Select in databasCreated: ' + res);
                dbStatus.exists = true;
                dbStatus.isCorrect = true;
                return true;
            } catch (err) {
                dbStatus.isCorrect = false;
            }
        } else if (!dbStatus.tablesCorrect) {
            //The Tables are not correct. (Missing, different name, new table...)
            for (let table in differences) {
                if (differences[table] === true) {
                    wait.for(makeSQLRequest, dbAction.createTableCommand(table));
                }
                //TODO: If on a table is on the DB that isnt in the config. -> drop table.letdifferences = {};
            }
        }
        else if (!dbStatus.columnsCorrect) {
            //One or more columns of one or more Tables are wrong
            //TODO: Correct the Database. Commands like ALTER TABLE will be needed.
        } else if (!dbStatus.settingsCorrect) {
            //some Setting of a column are wrong.
        }
    } else {
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
    //if (dbStub.isDBReadyForQuery()) {
    connection.query(query, function (err, result) {
        if (err) {
            console.log(err);
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
    /* } else {
         var err = 'ERROR: Database not ready for query.
         Either the connection is faulty or the Database cennected to, is not correctly setup! ' +
             'Please check with "getDbStatus" if there is an error.';
         callback(err, null);
     }*/
};


/**
 * Gets a set of querys and commands on what to do between the querys.
 * Needs to be used in a fiber. (wait.for.launchFiber())
 * @param input
 */
exports.makeTransaction = function (input) {
    let results = [];
    try {
        connection.beginTransaction();
        for (let i = 0; i < input.querys.length; i++) {
            if (input.transControl.getProper[i]) {
                console.log('Checkpoint 1: getProper of: ' + i + ': ' + input.querys[i]);
                let result = wait.for(makeSQLRequest, input.querys[i]);
                let controlResult = {getProper: result};
                results.push(controlResult);
            } else if (input.transControl.select) {
                results.push(wait.for(makeSQLRequest, input.querys[i]));
            } else if (typeof input.transControl.useProper[i] !== 'undefined') {
                let newQuery = '';
                if (input.transControl.useProper[i].kindOfQuery === 'insert') {
                    console.log('Checkpoint 2: ');
                    input.transControl = changeValuesForQuery(input.transControl, results, i);
                    newQuery = dbAction.createInsertCommand(
                        input.transControl.useProper[i].table,
                        input.transControl.useProper[i].columns,
                        input.transControl.useProper[i].values,
                        input.transControl.useProper[i].toCompare,
                        input.transControl.useProper[i].operators);
                    console.log('Checkpoint 2.1: ' + i + ': ' + newQuery);
                    if (input.transControl.useProper[i].getProper) {
                        let result = wait.for(makeSQLRequest, newQuery);
                        let controlResult = {getProper: result};
                        results.push(controlResult);
                    } else {
                        results.push(wait.for(makeSQLRequest, newQuery));
                    }
                } else if (input.transControl.useProper[i].kindOfQuery === 'select') {
                    console.log('Checkpoint 3: ');
                    input.transControl = changeValuesForQuery(input.transControl, results, i);
                } else if (input.transControl.useProper[i].kindOfQuery === 'create') {
                    console.log('Checkpoint 4: ');
                    input.transControl = changeValuesForQuery(input.transControl, results, i);
                } else if (input.transControl.useProper[i].kindOfQuery === 'update') {
                    console.log('Checkpoint 5: ');
                    input.transControl = changeValuesForQuery(input.transControl, results, i);

                    for (let j = 0; j < input.transControl.useProper[i].nrColumnsToCompare.length; j++) {
                        console.log('Check loop here: ' + j);
                        let tempProperResult = JSON.parse(results[input.transControl.useProper[i].ofComparingResults[j]].getProper);

                        input.transControl.useProper[i].valuesToCompare[input.transControl.useProper[i].nrColumnsToCompare[j]]
                            = '"' + tempProperResult[input.transControl.useProper[i].nameOfPropersToCompare[j]] + '"';
                    }
                    newQuery = dbAction.createUpdateCommand(
                        input.transControl.useProper[i].table,
                        input.transControl.useProper[i].columns,
                        input.transControl.useProper[i].values,
                        input.transControl.useProper[i].columnsToCompare,
                        input.transControl.useProper[i].valuesToCompare,
                        input.transControl.useProper[i].operators);
                    results.push(wait.for(makeSQLRequest, newQuery));
                }
            } else {
                console.log('Checkpoint Last: ');
                results.push(wait.for(makeSQLRequest, input.querys[i]));
            }
        }
        connection.commit();
        return results;
    } catch (err) {
        console.log(Tag + err);
        connection.rollback();
        return results;
    }
};

function changeValuesForQuery(transControl, results, index) {
    let tempProperResult = {};
    for (let i = 0; i < transControl.useProper[index].numberOfColumns.length; i++) {
        console.log(JSON.stringify(results[transControl.useProper[index].ofResults[i]]));
        console.log(transControl.useProper[index].ofResults[i]);
        tempProperResult = JSON.parse(results[transControl.useProper[index].ofResults[i]].getProper);
        transControl.useProper[index].values[transControl.useProper[index].numberOfColumns[i]]
            = '"' + tempProperResult[transControl.useProper[index].nameOfPropers[i]] + '"';
    }
    return transControl;
}

/**
 * Checks if the Database matches the dbconfig Settings.
 * @returns {boolean}
 */
testDatabase = function () {
    let dbColumns;
    let isTheSame = true;
    let tablesOnDB = [];
    useDatabase(json.database.name);
    if (dbStatus.exists === true) {
        let jsonList = jsonAction.getTableListFromJson();
        //console.log(notMedia + Tag + 'Table List in the json file: ' + jsonList);
        try {
            tablesOnDB = wait.for(makeSQLRequest, 'SHOW TABLES');
            tablesOnDB = JSON.parse(tablesOnDB);
        } catch (err) {
            dbStatus.isCorrect = false;
            dbStatus.error = err;
            return false;
        }
        let dbList = [];
        for (let j = 0; j < tablesOnDB.length; j++) {
            dbList.push(tablesOnDB[j]['Tables_in_' + json.database.name]);
        }
        //console.log(notMedia + Tag + 'Table List on the current Database Server: ' + dbList);
        if (isArrayTheSame(jsonList, dbList)) {
            for (let i = 0; i < jsonList.length; i++) {
                let jsonColumns = jsonAction.getColumnsOfOneTable(jsonList[i]);
                jsonColumns = JSON.parse(jsonColumns);
                //jsonColumns = dbAction.syncWithDeafault
                //console.log(notMedia + Tag + 'Columns of the Json: ' + jsonColumns);
                try {
                    dbColumns = wait.for(makeSQLRequest, 'DESCRIBE ' + jsonList[i]);
                    //console.log(notMedia + Tag + 'Column: ' + jsonList[i] + ' of the Database: ' + dbColumns);
                    dbColumns = JSON.parse(dbColumns);
                    //console.log(notMedia + Tag + 'Description of the DB: ' + jsonList[i] + ': ' + JSON.stringify(dbColumns));
                    dbColumns = makeColumnDescriptionComparableToJson(dbColumns, jsonList[i]);
                    //dbColumns = JSON.parse(dbColumns);
                } catch (err) {
                    //console.error(notMedia + Tag + 'Describe ' + jsonList[i] + ' has Error: ' + err);
                    dbStatus.isCorrect = false;
                }
                //dbColumns = JSON.stringify(dbColumns);
                /* if (!matchColumnSettings(jsonList[i], jsonColumns, dbColumns)) {
                     console.error(notMedia + Tag + 'One Table has different Settings as described in config.json: ' + jsonList[i]);
                     console.error(notMedia + Tag + 'Here are the settings of Both Tables: ');
                     console.error(notMedia + Tag + jsonList[i] + ': ' + JSON.stringify(jsonColumns));
                     console.error(notMedia + Tag + jsonList[i] + ': ' + JSON.stringify(dbColumns));

                     isTheSame = false;
                 }*/
                matchColumns(jsonList[i], jsonColumns, dbColumns);
                matchColumnSettings(jsonList[i], jsonColumns, dbColumns);
                //console.log('The differences at the end: ' + JSON.stringify(differences));
                //console.error(notMedia + Tag + jsonList[i] + ': ' + JSON.stringify(jsonColumns));
                //console.error(notMedia + Tag + jsonList[i] + ': ' + JSON.stringify(dbColumns));
            }
        }
    }
    console.log('The differences at the end: ' + JSON.stringify(differences));
    isDbCorrect();
};

function isDbCorrect() {
    dbStatus.isCorrect = dbStatus.columnsCorrect && dbStatus.settingsCorrect && dbStatus.tablesCorrect && dbStatus.exists;
}

/**
 * Compares the Columns of 2 sources on the basis of json in the structure of
 * the config.json.
 * @param table
 * @param jsonColumns
 * @param dbColumns
 */
matchsColumnSettings = function (table, jsonColumns, dbColumns) {
    let existingColumns = [];
    let existingJsonColumns = [];
    let existingDbColumns = [];


    for (let column1 in jsonColumns) {
        existingJsonColumns.push(jsonColumns[column1].name);
        for (let column2 in dbColumns) {
            if (existingColumns.indexOf(column2) < 0) {
                existingDbColumns.push(dbColumns[column2].name);
                if (existingColumns.indexOf(column1) < 0) {
                    console.log('Compare: ' + jsonColumns[column1].name + ' with ' + dbColumns[column2].name);
                    if (jsonColumns[column1].name === dbColumns[column2].name) {

                        for (let field in jsonColumns[column1]) {
                            if (jsonColumns[column1][field] !== dbColumns[column1][field]) {
                                //console.log('Comparison failed because of2: ' + columns1[column1][field] + ' !== ' + columns2[column1][field]);
                                differences[table] = {};
                                differences[table][column1] = {};
                                differences[table][column1][field] = jsonColumns[column1][field];
                            }
                        }
                        existingColumns.push(column1);
                    }
                }
            }
        }
        if (existingColumns.indexOf(column1) < 0) {
            //column1 does not exist in dbColumns
            differences[table][column1] = true;
        }
    }
    if (Object.keys(differences).length === 0) {
        dbStatus.columnsCorrect = true;
        dbStatus.settingsCorrect = true;
        return true;
    } else {
        console.log(notMedia + Tag + 'Differences of Config: ' + JSON.stringify(differences));
        dbStatus.columnsCorrect = false;
        dbStatus.settingsCorrect = false;
        return false;
    }
};

matchColumns = function (table, jsonColumns, dbColumns) {
    let existingJsonColumns = [];
    let existingDbColumns = [];
    let matchedCol = [];

    for (let col1 in jsonColumns) {
        existingJsonColumns.push(jsonColumns[col1].name);
    }
    //console.log('JsonColumns: ' + existingJsonColumns);
    for (let col2 in dbColumns) {
        existingDbColumns.push(dbColumns[col2].name);
    }
    //console.log('DBColumns: ' + existingDbColumns);
    if (existingDbColumns.length !== existingJsonColumns.length) {
        dbStatus.columnsCorrect = false;
    }
    for (let i = 0; i < existingJsonColumns.length; i++) {
        if (existingDbColumns.indexOf(existingJsonColumns[i]) < 0) {
            if (typeof differences[table] === "undefined") {
                differences[table] = {}
            }
            differences[table][existingJsonColumns[i]] = true;

        } else {
            matchedCol.push(existingJsonColumns[i]);
        }
    }
    for (let j = 0; j < existingDbColumns.length; j++) {
        if (matchedCol.indexOf(existingDbColumns[j]) < 0) {
            if (existingJsonColumns.indexOf(existingDbColumns[j]) < 0) {
                if (typeof differences[table] === "undefined") {
                    differences[table] = {}
                }
                differences[table][existingDbColumns[j]] = false;
            } else {
                matchedCol.push(existingDbColumns[j]);
            }
        }
    }
    dbStatus.columnsCorrect = (typeof differences[table] === "undefined") || differences[table] === {};
    //console.log('columnsCorrect here?: ' + dbStatus.columnsCorrect + ' type of differences: ' + typeof differences[table]);
    //console.log('matched Columns: ' + matchedCol);
    //console.log('differences of Columns: ' + JSON.stringify(differences));
};

matchColumnSettings = function (table, jsonColumns, dbColumns) {
    if (dbStatus.columnsCorrect) {
        for (var col1 in jsonColumns) {
            for (let setting1 in jsonColumns[col1]) {
                //console.log('1. Comparison Loop: ' + table + ' : ' + col1 + ' : ' + setting1);
                if (jsonColumns[col1][setting1] !== dbColumns[col1][setting1]) {
                    if (typeof differences[table] === "undefined") {
                        differences[table] = {};
                    }
                    if (typeof  differences[table][jsonColumns[col1].name] === "undefined") {
                        differences[table][jsonColumns[col1].name] = {};
                    }
                    //console.log('The difference in here from: ' + table + col1 + jsonColumns[col1][setting1] + ' !== ' + dbColumns[col1][setting1]);
                    differences[table][jsonColumns[col1].name][setting1] = jsonColumns[col1][setting1];
                }
            }
        }
        for (let col2 in dbColumns) {
            for (let setting2 in dbColumns[col2]) {
                if (jsonColumns[col2][setting2] !== dbColumns[col2][setting2]) {
                    if (typeof differences[table] === "undefined") {
                        differences[table] = {};
                    }
                    if (typeof  differences[table][jsonColumns[col1].name] === "undefined") {
                        differences[table][jsonColumns[col1].name] = {};
                    }
                    //console.log('The difference in here2 from: ' + table + col2 + jsonColumns[col2][setting2] + ' !== ' + dbColumns[col2][setting2]);
                    differences[table][jsonColumns[col1].name][setting2] = jsonColumns[col2][setting2];
                }
            }
        }
        if (typeof differences[table] === "undefined" || Object.keys(differences[table]).length <= 0) {
            dbStatus.columnsCorrect = true;
        } else {
            dbStatus.columnsCorrect = false;
        }

        //console.log('Differences of the Settings: ' + JSON.stringify(differences));
    } else {
        dbStatus.columnsCorrect = false;
        dbStatus.isCorrect = false;
    }

};

/**
 * MySql has a wierd output for their Table Descriptions, thus this function
 * should translate the Output in a way that it can be compared with the structure
 * of the config.json
 * @param sqlResult
 */
makeColumnDescriptionComparableToJson = function (sqlResult, table) {
    let type;
    let columns = {};
    let column = 'column';
    for (let i = 0; i < sqlResult.length; i++) {
        column = column + (i + 1);
        columns[column] = {};
        for (let setting in sqlResult[i]) {
            if (setting === 'Field') {
                columns[column]['name'] = sqlResult[i][setting];
            } else if (setting === 'Type') {
                let tempType = sqlResult[i][setting];
                let length = null;
                let index = tempType.indexOf('(');
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
                if (sqlResult[i][setting] !== 'PRI' && sqlResult[i][setting] !== 'UNI' && sqlResult[i][setting] !== 'MUL') {
                    columns[column]['PRIMARY'] = false;
                    columns[column]['UNIQUE'] = false;
                } else {
                    if (sqlResult[i][setting] === 'PRI') {
                        columns[column]['PRIMARY'] = true;
                        columns[column]['UNIQUE'] = false;
                    } else if (sqlResult[i][setting] === 'UNI') {
                        columns[column]['PRIMARY'] = false;
                        columns[column]['UNIQUE'] = true;
                    } else if (sqlResult[i][setting] === 'MUL') {
                        columns[column]['PRIMARY'] = false;
                        columns[column]['UNIQUE'] = false;
                        columns[column]['FOREIGN'] = table;
                    }
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
 * @param jsonList
 * @param dbList
 * @returns {boolean}
 */
isArrayTheSame = function (jsonList, dbList) {
    for (let i = 0; i < jsonList.length; i++) {
        //if(table of jsonList doesnt exists in the dbList)
        if (dbList.indexOf(jsonList[i]) < 0) {
            differences[jsonList[i]] = true;
        }
        //if(table of dbList doesnt exists in jsonList)
        else if (jsonList.indexOf(dbList[i]) < 0) {
            differences[dbList[i]] = false;
        }
    }
    //console.log(notMedia + Tag + 'isArrayTheSame Result is: ' + isTheSame);
    if (Object.keys(differences).length === 0) {
        dbStatus.tablesCorrect = true;
        return true;
    } else {
        dbStatus.tablesCorrect = false;
        return false;
    }
};

correctDatabaseSettings = function () {
    if (!dbStatus.isCorrect) {
        if (!dbStatus.tablesCorrect) {

        } else if (!dbStatus.columnsCorrect) {

        } else if (!dbStatus.settingsCorrect) {

        }
    } else {
        //Everything is correct -> nothing to do
    }
    differences = {};
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
};

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
    let pool = mysql.createPool(connectionSettings);
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