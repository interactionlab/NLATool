//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */

var notMedia = 'Not Media-Related Part: ';
var Tag = 'DB-Actions.js: ';

//--------------------------------------------------------
/*
/!**
 *
 *!/
*/
/**
 * Setup Configuration file Requirements:
 */
var jsonConfigurator = require('jsonfile');
var async = require("async");
var dbConfig = './modules/dbConfig.json';
//var async = require('async');
/**
 * Compare Operations for Where-Query of SQL:
 * @type {[string,string,string,string,string,string,string,string,string]}
 */
var queryOperators = ['=', '<>', '>', '<', '>=', '<=', 'BETWEEN', 'LIKE', 'IN'];
/**
 *
 */
exports.setupDB = function () {

    jsonConfigurator.readFile(dbConfig, function (err, obj) {
        if (err) {
            console.log(notMedia + Tag + err);
        } else {
            //get all default properties
            var defaultArray = Object.keys(obj.default);
            //get all table options and column options
            for (var entity in obj) {
                if (entity.isTable) {
                    for (var table in entity) {
                        var tableName = table.name;
                        for (var column in table) {

                        }

                    }
                }
            }
        }
    });
};
/**
 * generates String for SQL Command CREATE
 * name is either the name of the database -> CREATE DATABASE name
 * or the name of the table -> CREATE TABLE name (column1 options, column2 options,..)
 * @param dbName
 * @param table
 * @param columns
 */
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

/**
 * create a whole line of options for a column so that
 * you can just add them to the CREATE TABLE query
 *
 */
exports.transformColumnToSQL = function (column, options) {

    async.waterfall([
        function (callback) {
            var a = 1;
            console.log(a);
            callback(null, a);
        }, function (a, callback) {
            a++;
            console.log(a);
            callback(null, a);
        }
    ]);
    async.waterfall([
        async.apply(a, 1),
        async.asyncify(b)
    ]);

    function a(a, callback) {
        console.log('rhgerrgrg' + a);
        callback(null, a);
    }

    function b(b) {
        b++;
        console.log('fgdrergeg' + b);
        return b;
    }

    async.waterfall([
        async.apply(jsonConfigurator.readFile, dbConfig),
        function (obj, callback) {
            callback(null, obj, options);
        },
        syncColumnWithDefault,
        function (options, callback) {
            //console.log(options);
            if (options !== null && column !== null) {
                var transformString = column + ' ';

                for (var key in options) {
                    if (!isNaN(options[key])) {
                        transformString = transformString + ' (' + options[key] + ')';
                    } else {
                        transformString = transformString + ' ' + options[key];
                    }
                }

                console.log('Result of SQL String: ' + transformString);
                callback(null, transformString);
            } else {
                callback(null, null);
            }
        }
    ]);

};

/**
 * synchronise default configuration with the special configuration of a column.
 */
syncColumnWithDefault = function (obj, options, callback) {
    console.log('Before sync: ' + JSON.stringify(obj.default));
    for (var key in obj.default) {
        //console.log('Current Key ' + key);
        if (obj.default.hasOwnProperty(key) && key !== 'isTable') {
            if (!isKeyInObject(key, options)) {
                options[key] = obj.default[key];
            }
        }
    }
    //console.log(notMedia + Tag + JSON.stringify(options));
    console.log('before: ' + options);
    callback(null, options);
};

isKeyInObject = function (key, obj) {

    for (var otherKey in obj) {
        //console.log('isKeyInObject: ' + key + ' =? '+  otherKey);
        if (key === otherKey) {
            //  console.log('true');
            return true;
        }
    }
    //console.log('false');
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
        if (columns === null) {
            commandString = '* FROM ' + table;
        } else {
            commandString = commandString + columns[0];
            for (var i = 1; i < columns.length; i++) {
                commandString = commandString + ',' + columns[i];
            }
            commandString = commandString + ' FROM ' + table;
        }
        commandString = commandString + ' ' + createWhereQuery(columns, valuesToCompare, operators);
        console.log(notMedia + Tag + commandString);
        return commandString;
    }
    console.log(notMedia + Tag + 'Select Command Creation failed!');
    return null;
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

//--------------------------------------------------------

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