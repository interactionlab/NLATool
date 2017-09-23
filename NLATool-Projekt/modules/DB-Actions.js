//TODO: DB-Actions ist kein router!!, muss geändert werden


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
var dbName = 'nla-alpha';


//Nutzerdaten Tabelle
var dbNutzerdatentable = 'nutzerdaten ';
var dbNutzerdatenIDCol = 'id ';          //primary
var dbNutzerdatenUserCol = 'username ';  //unique
var dbNutzerdatenEmailCol = 'email ';    //unique
var dbNutzerdatenPassCol = 'password ';
*/

var queryOperators = ['=', '<>', '>', '<', '>=', '<=', 'BETWEEN', 'LIKE', 'IN'];

exports.createDB = function() {


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

}

/**
 * generates String for SQL Command SELECT
 * If no columns are specified, everything will be selected and returned.
 * If no table name is specified the sql query is not valid thus the returned value will be null.
 *
 * @param columns represents an array or something similar.
 * @param table
 * @returns {*}
 */
exports.createSelectCommant = function(columns, table) {
    var commandString = 'SELECT ';
    if (table != null) {
        if (columns == null) {
            commandString = '* FROM ' + table;
        } else {
            commandString = commandString + columns[0];
            for (var i = 1; i < columns.length - 1; i++) {
                commandString = commandString + ',' + columns[i];
            }
            commandString = commandString + ' FROM ' + table;
        }
        console.log(notMedia + Tag + commandString);
        return commandString;
    }
    console.log(notMedia + Tag + 'Select Command Creation failed!');
    return null;
}

/**
 *  Generates the query for the SQL Command INSERT INTO.
 *  If table, columns, values are empty (==null) the function returnes null.
 *
 * @param columns
 * @param table
 * @param values
 * @param query
 */
exports.createInsertCommand = function (columns, table, values, query) {
    var commandString = 'INSERT INTO ';
    if (table != null && columns != null && values != null) {
        commandString = commandString + table + ' ' + columns[0];
        for (var i = 1; i < columns - 1; i++) {
            commandString = commandString + ',' + columns[i];
        }
        commandString = commandString + ' VALUES ';
        for (var j = 1; j < values.length - 1; j++) {
            commandString = commandString + ',' + values[j];
        }
        if (query != null) {
            commandString = commandString + ' WHERE ' + query;
        }
        console.log(notMedia + Tag + commandString);
        return commandString;
    }
    console.log(notMedia + Tag + 'Insert Command Creation failed!');
    return null;
}

/**
 * Generates the query for the SQL Command UPDATE.
 * @param column
 * @param table
 * @param value
 * @param query
 * @returns {*}
 */
exports.createUpdateCommand = function (column, table, value, query) {
    var commandString = 'UPDATE ';
    if (table != null && column != null && value != null) {
        commandString = commandString + table + ' SET ' + column + ' = ' + value;
        if (query != null) {
            commandString = commandString + query;
            console.log(notMedia + Tag + commandString);
            return commandString;
        }
    }
    console.log(notMedia + Tag + 'Update Command Creation failed!');
    return null;
}

/**
 * Generates the query for the SQL Command DELETE FROM.
 * @param collum
 * @param table
 * @param value
 * @param query
 * @returns {*}
 */
exports.createDeleteCommand = function (collum, table, value, query) {
    var commandString = 'DELETE FROM ';
    if (table != null && collum != null && value != null && query != null) {
        var operator = [queryOperators[0]];
        commandString = commandString + table + createWhereQuery(collum, table, operator);
        console.log(notMedia + Tag + commandString);
        return commandString;
    }
    console.log(notMedia + Tag + 'Delete Command Creation failed!');
    return null;
}

/**
 * Generates the query for the SQL Command-extension WHERE.
 * The Result follows the structure below:
 * "WHERE column1 = value1 AND column2 <> value2
 * Der Operator muss die SQL-Richtlinien einhalten d.h. operatoren sind:
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
exports.createWhereQuery = function (columns, values, operators) {
    var queryString = 'WHERE ';
    if (columns != null && values != null && operators != null) {
        queryString = queryString + columns[0] + ' ' + operators[0] + ' ' + values[0];
        for (var i = 1; i < columns.length; i++) {
            queryString = queryString + ' AND ' + columns[i] + ' ' + operators[i] + ' ' + values[i];
        }
        console.log(notMedia + Tag + queryString);
        return queryString;
    }
    console.log(notMedia + Tag + 'Where Query Creation failed!');
    return null;
}

//--------------------------------------------------------
/**
 * Datenbank konfigurierung
 * Es kann gut sein, dass Teile davon in app.js gehören.
 * Gerade CREATE DATABASE sollte nicht jedes mal ausgeführt werden wenn man auf index.js geht.
 */
var db = require('mysql');

var connection = db.createConnection({
    host: "localhost",
    user: "guest",
    password: "ichbingasthier"
});

connection.connect(function (err) {
    if (err) {
        console.log(notMedia + Tag + 'connection to Database failed.');
    }

    console.log(notMedia + Tag + 'DB Connected');
    connection.query("", function (err, result) {
        if (err) throw err;
        console.log(notMedia + Tag + 'DB created.');
    });


}

