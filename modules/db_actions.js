//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let notMedia = 'Not Media-Related Part: ';
let Tag = 'db_actions.js: ';
let sql = 'The resulting SQL Command is:';

//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
let jsonConfigurator = require('jsonfile');
let wait = require('wait.for');
let dbConfig = './modules/config.json';
let dbAction = require('./db_actions');
let dbStub = require('./db_stub');
let jsonAction = require('./json_actions');
//var json = test.json;
/**
 * Compare Operations for Where-Query of SQL:
 * @type {[string,string,string,string,string,string,string,string,string]}
 */
let queryOperators = ['=', '<>', '>', '<', '>=', '<=', 'BETWEEN', 'LIKE', 'IN'];
exports.getQueryOperators = function () {
    return queryOperators;
};

/**
 * Loads the Database Configuration at the beginning of the of this file so
 * that it is available for every function here.
 */
let json = null;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = jsonAction.getJsonConfiguration();
    json = JSON.parse(json);
}


exports.setupdb = function (connection) {
    wait.launchFiber(setupDBs, connection);
};

/**
 * This Method should setup a new Database with the given connection to a
 * mysql Server.
 * @param connection - of type mysql.connection
 */
setupDBs = function (connection) {
    let createDB = createDatabaseCommand();
    connection.query(createDB, function (err) {
        if (err) {
            console.log(notMedia + Tag + 'Couldnt Create Database' + err);
            createAllTables(connection);
        }
        else {
            console.log(notMedia + Tag + 'Database created');
            createAllTables(connection);
        }
    });
};

createAllTables = function (connection) {
    let i = 0;
    for (let table in json) {
        if (json[table].isTable) {
            connection.query(dbAction.createTableCommand(json[table].name), function (err) {
                if (err) console.log(notMedia + Tag + 'couldnt create Table: ' + ': ' + err);
            });
        }
        i++;
    }
};

/**
 * Creates the query String for the SQL Command CREATE DATABASE (database Name)
 * @returns {string}
 */
createDatabaseCommand = function () {
    //console.log(notMedia + Tag + 'in Create Dababase' + JSON.stringify(json.database.name));
    return 'CREATE DATABASE ' + json.database.name;
};

/**
 * Creates the command String for the SQL Command CREATE TABLE.
 * Needs the json of the config.json and the name of the table you want to create.
 * @param tableName
 * @returns {string}
 */
exports.createTableCommand = function (tableName) {
    let commandString = 'CREATE TABLE ' + json.database.name + ' . ' + tableName + ' (';
    for (let table in json) {
        if (json[table].name === tableName) {
            let i = 1;
            for (let column in json[table]) {
                if (column !== 'isTable' && column !== 'name') {
                    //console.log(notMedia + Tag + 'the current parameter for column: ' + JSON.stringify(json[table][column]));
                    let options = getOptionsOfColumn(json[table], i);

                    let tempCommandString = transformColumnToSQL(json[table][column], options);

                    //console.log(notMedia + Tag + 'tempCommandString: ' + tempCommandString);
                    commandString = commandString + tempCommandString + ',';

                    i++;
                }
            }
            commandString = commandString + addKeySettingsToSQLCommand(json[table]);
            break;
        }
    }

    //commandString = setCharAt(commandString, commandString.length - 1, ')');
    console.log(notMedia + Tag + 'Final Create Table SQL Command: ' + commandString);
    return commandString;
};

/**
 * Retrieves all settings (key: value) of a given table (json)
 * Only works with the structure of config.json
 * @param table
 * @param columnNumber
 * @returns {{}}
 */
getOptionsOfColumn = function (table, columnNumber) {
    let column = 'column' + columnNumber;
    //console.log(column);
    let options = {};
    for (let option in table[column]) {
        options[option] = table[column][option];
    }
    //console.log(notMedia + Tag + 'getOptionsOfColumn: ' + JSON.stringify(options));
    return options;
};

/**
 * create a whole line of options for a column so that
 * you can just add them to the CREATE TABLE query
 * @param column
 * @param options
 * @returns {*}
 */
transformColumnToSQL = function (column, options) {
    options = jsonAction.syncColumnWithDefault(options);
    if (options !== null && column !== null) {
        let transformString = '';
        let tempKey = '';
        let specialSetting = null;
        for (let key in options) {
            //console.log(key +  ': ' + options[key] +' last:'+ tempKey);
            if (!isNaN(options[key]) && !(typeof options[key] === "boolean")) {
                transformString = transformString + ' (' + options[key] + ')';
            } else if(key ==='FOREIGN'){}
            else if (!(typeof options[key] === "boolean") && isNaN(options[key])) {
                transformString = transformString + ' ' + options[key];
            } else if (key === 'AUTO_INCREMENT' && options[key] === true) {
                transformString = transformString + ' ' + key;
            } else if(key ==='FOREIGN'){}

            tempKey = key;
        }
        /*if (specialSetting === 'UNIQUE' || specialSetting === 'PRIMARY KEY' || specialSetting === 'FOREIGN KEY') {
            transformString = transformString + addKeySettingToSQLCommand(specialSetting, options.name);
        }*/
        //console.log(notMedia + Tag + 'Result of transform SQL String: ' + transformString);
        return transformString;
    } else {
        return null;
    }
};

/**
 * If columns with Key Settings are found, those settings will be translated to a part of a MySql Command.
 * @param table
 * @returns {string}
 */
addKeySettingsToSQLCommand = function (table) {
    let keySettings = findKeyColumns(table);

    let keySQLString = '';
    for (let column in keySettings) {
        if (keySettings[column] === 'PRIMARY KEY' || keySettings[column] === 'UNIQUE') {
            keySQLString = keySQLString + keySettings[column] + '(' + column + '), ';
        } else {
            keySQLString = keySQLString + 'FOREIGN KEY (' + column + ') REFERENCES ' + keySettings[column] + '(' + column + '), ';
        }
    }
    keySQLString = jsonAction.setCharAt(keySQLString, keySQLString.length - 2, ');');
    return keySQLString;
};

/**
 * Looks for all the columns that contain Setting for Primary or Unique Keys.
 * @param table
 * @returns {{}}
 */
findKeyColumns = function (table) {
    let keySettings = {};
    //console.log('The table in findKeyColumns: ' + JSON.stringify(table));
    for (let column in table) {
        if (column !== 'isTable' && column !== 'name') {
            for (let key in table[column]) {
                if (table[column].PRIMARY === true) {
                    keySettings[table[column].name] = 'PRIMARY KEY';
                } else if (table[column].UNIQUE === true) {
                    keySettings[table[column].name] = 'UNIQUE';
                } else if (typeof table[column].FOREIGN !== 'undefined') {
                    keySettings[table[column].name] = table[column].FOREIGN;
                }
            }
        }
    }
    //console.log(notMedia + Tag + 'Columns with Key Settings: ' + JSON.stringify(keySettings));
    return keySettings;
};

findAndTranslateForeignKeySettings = function () {
    //TODO: find and translate Foreign Key Settings
};

/**
 * generates String for SQL Command SELECT
 * If no columns are specified, everything will be selected and returned.
 * If no table name is specified the sql query is not valid thus the returned value will be null.
 *
 * @param columns represents an array or something similar.
 * @param table
 * @param valuesToCompare
 * @param operators
 * @returns {*}
 */
exports.createSelectCommand = function (table, columns, valuesToCompare, operators) {
    let commandString = 'SELECT ';
    if (table !== null) {
        if (columns !== null) {
            commandString = commandString + columns[0];
            for (let i = 1; i < columns.length; i++) {
                commandString = commandString + ',' + columns[i];
            }
            commandString = commandString + ' FROM ' + json.database.name + ' . ' + table;
        } else {
            commandString = commandString + '* FROM ' + json.database.name + ' . ' + table;
        }
        commandString = commandString + ' ' + createWhereQuery(columns, valuesToCompare, operators);
        console.log(notMedia + Tag + sql + commandString);
        return commandString;
    } else {
        commandString = commandString + json.database.name;
        console.log(notMedia + Tag + sql + commandString);
        return commandString;
    }


};

exports.createInnerJoinSelectCommand = function (table1, table2, joinCondition) {
    let commandString = 'SELECT ' + table1 + ' INNER JOIN ' + table2 + ' ' + joinCondition;
    return commandString;
};

exports.createInnerJoinCondition = function (valuesToCompare1, valuesToCompare2, operators) {
    let queryString = 'ON';
    if (valuesToCompare1.length === valuesToCompare2.length && operators.length === valuesToCompare1.length) {
        for (let i = 0; i < valuesToCompare1.length; i++) {
            queryString = queryString + ' ' + valuesToCompare1[i] + ' ' + operators [i] + ' ' + valuesToCompare2[i];
        }
    }
};

/**
 *  Generates the query for the SQL Command INSERT INTO.
 *  If table, columns, values are empty (==null) the function returnes null.
 *
 * @param columns
 * @param table
 * @param values
 * @param valuesToCompare
 * @param operators
 */
exports.createInsertCommand = function (table, columns, values, valuesToCompare, operators) {
    let commandString = 'INSERT INTO ';
    if (table !== null && values !== null) {
        if (columns === null) {
            commandString = commandString + table + ' VALUES (' + values[0];
        }
        else {
            commandString = commandString + table + ' (' + columns[0];
            for (let i = 1; i < columns.length; i++) {
                commandString = commandString + ', ' + columns[i];
            }
            commandString = commandString + ') VALUES (' + values[0];
        }
        for (let j = 1; j < values.length; j++) {
            commandString = commandString + ', ' + values[j];
        }
        commandString = commandString + ')';
        if (valuesToCompare !== null && operators !== null) {
            commandString = commandString + ' ' + createWhereQuery(columns, valuesToCompare, operators);
        }
        commandString = commandString + ';';
        console.log(notMedia + Tag + commandString);
        return commandString;
    }
    console.log(notMedia + Tag + 'Insert Command Creation failed!');
    return null;
};

/**
 * Generates the query for the SQL Command UPDATE.
 * @param table
 * @param columns
 * @param values
 * @param valuesToCompare
 * @param operators
 * @returns {*}
 */
exports.createUpdateCommand = function (table, columns, values, valuesToCompare, operators) {
    let commandString = 'UPDATE ';
    if (table !== null && columns !== null && values !== null) {
        commandString = commandString + table + ' SET ' + columns[0] + ' = ' + values[0];
        for (let i = 1; i < values.length; i++) {
            commandString = commandString + ', ' + columns[i] + ' = ' + values[i];
        }
        if (valuesToCompare !== null && operators !== null) {
            commandString = commandString + ' ' + createWhereQuery(columns, valuesToCompare, operators);
        }
        console.log(notMedia + Tag + commandString);
        return commandString;
    }
    console.log(notMedia + Tag + 'Update Command Creation failed!');
    return null;
};

/**
 * Generates the query for the SQL Command DELETE FROM.
 * @param column
 * @param table
 * @param value
 * @param valueToCompare
 * @returns {*}
 */
exports.createDeleteCommand = function (table, column, value, valueToCompare) {
    let commandString = 'DELETE FROM ';
    if (table !== null && column !== null && value !== null) {
        let operator = [queryOperators[0]];
        commandString = commandString + table + ' ' + createWhereQuery(column, valueToCompare, operator);
        console.log(notMedia + Tag + commandString);
        return commandString;
    }
    console.log(notMedia + Tag + 'Delete Command Creation failed!');
    return null;
};

/**
 * Generates the query for the SQL Command-extension WHERE.
 * The Result follows the structure below:
 * "WHERE column1 = value1 AND column2 <> value2
 * Operator     Discription
 * =            Equals
 * <>           imparity, inequality (sometimes: !=)
 * >            greater than
 * <            smaller than
 * >=           greater than or equals
 * <=           greater than or equals
 * BETWEEN      In a specified Area of values(differently interpreted from different Databases) --!! Is not yet supported
 * LIKE         Search with % and _ as Wildcards
 * IN           Result space restriction for specific values
 *
 * mit dem Array query
 * @param columns
 * @param values
 * @param operators
 * @returns {*}
 */
createWhereQuery = function (columns, values, operators) {
    let queryString = 'WHERE ';
    if (columns !== null && values !== null && operators !== null) {
        queryString = queryString + columns[0] + ' ' + operators[0] + ' ' + values[0];
        for (let i = 1; i < operators.length; i++) {
            queryString = queryString + ' AND ' + columns[i] + ' ' + operators[i] + ' ' + values[i];
        }
        console.log(notMedia + Tag + queryString);
        return queryString;
    }
    console.log(notMedia + Tag + 'Where Query Creation failed!');
    return '';
};

exports.createDropDBCommand = function () {
    let json = jsonAction.getJsonConfiguration();
    return 'DROP DATABASE ' + json.database.name + ' IF EXISTS';

};
//--------------------------------------------------------