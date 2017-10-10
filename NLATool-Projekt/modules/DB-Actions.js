//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
var notMedia = 'Not Media-Related Part: ';
var Tag = 'DB-Actions.js: ';
var sql = 'The resulting SQL Command is:';

//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
var jsonConfigurator = require('jsonfile');
var wait = require('wait.for');
var dbConfig = './modules/dbconfig.json';
var dbAction = require('./DB-Actions');
var dbStub = require('./DB-Stub');

//var json = test.json;
/**
 * Compare Operations for Where-Query of SQL:
 * @type {[string,string,string,string,string,string,string,string,string]}
 */
var queryOperators = ['=', '<>', '>', '<', '>=', '<=', 'BETWEEN', 'LIKE', 'IN'];
/**
 * Loads the Database Configuration at the beginning of the of this file so
 * that it is available for every function here.
 */

var json = null;
wait.launchFiber(getJSONConfig);
function getJSONConfig() {
    json = getJsonConfiguration();
    json = JSON.parse(json);
}


exports.setupDB = function (connection) {
    wait.launchFiber(setupDBs, connection);
};
/**
 * This Method should setup a new Database with the given connection to a
 * mysql Server.
 * @param connection - of type mysql.connection
 */
setupDBs = function (connection) {



    var createDB = createDatabaseCommand();
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
    var i = 0;
    for (var table in json) {
        if (json[table].isTable) {
            connection.query(createTableCommand(json[table].name), function (err) {
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
 * Needs the json of the dbconfig.json and the name of the table you want to create.
 * @param tableName
 * @returns {string}
 */
createTableCommand = function (tableName) {
    var commandString = 'CREATE TABLE ' + json.database.name + ' . ' + tableName + ' (';
    for (var table in json) {
        if (json[table].name === tableName) {
            var i = 1;
            for (var column in json[table]) {
                if (column !== 'isTable' && column !== 'name') {
                    //console.log(notMedia + Tag + 'the current parameter for column: ' + JSON.stringify(json[table][column]));
                    var options = getOptionsOfColumn(json[table], i);

                    var tempCommandString = transformColumnToSQL(json[table][column], options);

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
 * Only works with the structure of dbconfig.json
 * @param table
 * @param columnNumber
 * @returns {{}}
 */
getOptionsOfColumn = function (table, columnNumber) {
    var column = 'column' + columnNumber;
    //console.log(column);
    var options = {};
    for (var option in table[column]) {
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
    options = syncColumnWithDefault(options);
    if (options !== null && column !== null) {
        var transformString = '';
        var tempKey = '';
        var specialSetting = null;
        for (var key in options) {
            //console.log(key +  ': ' + options[key] +' last:'+ tempKey);
            if (!isNaN(options[key]) && !(typeof options[key] === "boolean") && options[tempKey] === 'VARCHAR') {
                transformString = transformString + ' (' + options[key] + ')';
            } else if (!(typeof options[key] === "boolean") && isNaN(options[key])) {
                transformString = transformString + ' ' + options[key];
            } else if (key === 'AUTO_INCREMENT' && options[key] === true) {
                transformString = transformString + ' ' + key;
            }
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

addKeySettingsToSQLCommand = function (table) {
    var keySettings = findKeyColumns(table);

    var keySQLString = '';
    for (var column in keySettings) {
        keySQLString = keySQLString + keySettings[column] + '(' + column + '), ';
    }
    keySQLString = setCharAt(keySQLString, keySQLString.length - 2, ');');
    return keySQLString;
};
findKeyColumns = function (table) {
    var keySettings = {};
    //console.log('The table in findKeyColumns: ' + JSON.stringify(table));
    for (var column in table) {
        if (column !== 'isTable' && column !== 'name') {
            for (var key in table[column]) {
                if (table[column].PRIMARY === true) {
                    keySettings[table[column].name] = 'PRIMARY KEY';
                } else if (table[column].UNIQUE === true) {
                    keySettings[table[column].name] = 'UNIQUE';
                } else if (table[column].FOREIGN === true) {
                    keySettings[table[column].name] = 'FOREIGN KEY';
                }
            }
        }
    }
    //console.log(notMedia + Tag + 'Columns with Key Settings: ' + JSON.stringify(keySettings));
    return keySettings;
};
/**
 * Synchronises the default settings for a column with the specified ones.
 * @param options
 * @returns {*}
 */
syncColumnWithDefault = function (options) {
    //console.log('Before sync: ' + JSON.stringify(obj.default));
    for (var key in json.default) {
        if (json.default.hasOwnProperty(key) && key !== 'isTable') {
            if (!isKeyInObject(key, options)) {
                options[key] = json.default[key];
            }
        }
    }
    return options;
};

/**
 * A Method to check if a key is in a json-object.
 * @param key
 * @param obj
 * @returns {boolean}
 */
isKeyInObject = function (key, obj) {
    for (var otherKey in obj) {
        if (key === otherKey) {
            return true;
        }
    }
    return false;
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
    var commandString = 'SELECT ';
    if (table !== null) {
        if (columns !== null) {
            commandString = commandString + columns[0];
            for (var i = 1; i < columns.length; i++) {
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
    var commandString = 'INSERT INTO ';
    if (table !== null && values !== null) {
        if (columns === null) {
            commandString = commandString + table + ' VALUES (' + values[0];
        }
        else {
            commandString = commandString + table + ' (' + columns[0];
            for (var i = 1; i < columns.length - 1; i++) {
                commandString = commandString + ',' + columns[i];
            }
            commandString = commandString + ') VALUES (' + values[0];
        }
        for (var j = 1; j < values.length - 1; j++) {
            commandString = commandString + ',' + values[j];
        }
        commandString = commandString + ') ';
        if (valuesToCompare !== null && operators !== null) {
            commandString = commandString + createWhereQuery(columns, valuesToCompare, operators);
        }
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
    var commandString = 'UPDATE ';
    if (table !== null && columns !== null && values !== null) {
        commandString = commandString + table + ' SET ' + columns[0] + ' = ' + values[0];
        for (var i = 1; i < values.length; i++) {
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
    var commandString = 'DELETE FROM ';
    if (table !== null && column !== null && value !== null) {
        var operator = [queryOperators[0]];
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
    var queryString = 'WHERE ';
    if (columns !== null && values !== null && operators !== null) {
        queryString = queryString + columns[0] + ' ' + operators[0] + ' ' + values[0];
        for (var i = 1; i < operators.length; i++) {
            queryString = queryString + ' AND ' + columns[i] + ' ' + operators[i] + ' ' + values[i];
        }
        console.log(notMedia + Tag + queryString);
        return queryString;
    }
    console.log(notMedia + Tag + 'Where Query Creation failed!');
    return '';
};
exports.createDropDBCommand = function () {
    var json = dbAction.getJsonConfiguration();
    return 'DROP DATABASE ' + json.database.name + ' IF EXISTS';

};
/**
 * Reads the database Configuration and returns an json Object.
 * @returns {*}
 */


exports.getJsonConfiguration = function () {
    var json2 = wait.for(jsonConfigurator.readFile, dbConfig);
    json2 = JSON.stringify(json2);
    //console.log(notMedia + Tag + 'json2: ' + json2);
    return json2;
};

function getJsonConfiguration() {
    var json = wait.for(jsonConfigurator.readFile, dbConfig);
    json = JSON.stringify(json);
    //console.log(notMedia + Tag + 'json: ' + json);
    return json;
}
//module.exports.getJsonConfiguration = json;
/**
 * Replaces a character in a String(str) on a specified position (index)
 * with a new one (chr)
 * @param str
 * @param index
 * @param chr
 * @returns {*}
 */
setCharAt = function (str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
};
//--------------------------------------------------------

/**
 * generates String for SQL Command CREATE
 * name is either the name of the database -> CREATE DATABASE name
 * or the name of the table -> CREATE TABLE name (column1 options, column2 options,..)
 * Version1
 * @param dbName
 * @param table
 * @param columns
 */
/*
exports.createCreateCommand = function (dbName, table, columns) {
    var commandString = '';
    if (dbName !== null) {
        if (table !== null && columns !== null) {
            commandString = 'CREATE TABLE ' + dbName + ' . ' + table + ' (' + columns[0];
            for (var i = 1; i < columns.length; i++) {
                commandString = commandString + ', ';
            }
            commandString = commandString + ')';
            console.log(notMedia + Tag + commandString);
            return commandString;
        } else {
            commandString = 'CREATE DATABASE ' + dbName;
            console.log(notMedia + Tag + commandString);
            return commandString;
        }
    } else {
        console.log(notMedia + Tag + 'couldnt create Database/table because name of Database is missing');
        return commandString;
    }
};
*/
/*
 var createAccountDataTable = "CREATE TABLE `nla-alpha`.`AccountData` ( " +
        "`userID` INT NOT NULL AUTO_INCREMENT , " +
        "`email` VARCHAR(255) NOT NULL UNIQUE, " +
        "`username` VARCHAR(255) NOT NULL , " +
        "`password` INT NOT NULL , " +
        "PRIMARY KEY (`userID`)) " +
        "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_bin;";

    var createDocTable = "CREATE TABLE `nla-alpha`.`Document` ( " +
        "`docID` INT NOT NULL AUTO_INCREMENT , " +
        "`userID` INT NOT NULL , " +
        "`title` VARCHAR(255) NOT NULL , " +
        "`author` VARCHAR(255) NOT NULL , " +
        "`year` YEAR NOT NULL , " +
        "PRIMARY KEY (`docID`) USING HASH) " +
        "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_bin " +
        "COMMENT = 'Dokument := tokenisierter Text + Notizen+Suchergebnisse+....';";

    var createSearchResultTable = "CREATE TABLE `nla-alpha`.`SearchResult` ( " +
        "`resultID` INT NOT NULL AUTO_INCREMENT , " +
        "`url` VARCHAR(255) NOT NULL , " +
        "`imagePath` VARCHAR(1024) NOT NULL , " +
        "`shortDiscription` TEXT NOT NULL , " +
        "`longDiscription` MEDIUMTEXT NOT NULL , " +
        "`docID` INT NOT NULL , " +
        "PRIMARY KEY (`resultID`), " +
        "UNIQUE (`url`)) " +
        "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_bin " +
        "COMMENT = 'evtl. Bilder hier dirckt in LongBlobs speichern';";
 */