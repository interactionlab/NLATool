//TODO: DB-Actions ist kein router!!, muss geändert werden


//--------------------------------------------------------
/**
 * Tag für Konsolen Fehlersuche:
 * @type {string}
 */

var notMedia = 'Not Media-Related Part: ';
var Tag = 'DB-Actions.js: ';

//--------------------------------------------------------
/**
 * Datenbank Tabellennamen & andere öfter genutzte Namen
 */
var dbName = 'nla-alpha';


//Nutzerdaten Tabelle
var dbNutzerdatentable = 'nutzerdaten ';
var dbNutzerdatenIDCol = 'id ';          //primary
var dbNutzerdatenUserCol = 'username ';  //unique
var dbNutzerdatenEmailCol = 'email ';    //unique
var dbNutzerdatenPassCol = 'password ';

var queryOperators = ['=', '<>', '>', '<', '>=', '<=', 'BETWEEN', 'LIKE', 'IN'];

/**
 * Generiert String des SQL-Select Befehls.
 * Falls keine Spalten spezifiziert, wird alles zurückgegeben.
 * Falls kein Tabellenname spezifiziert, wird null zurückgegeben,
 * da der SQL-Befehl sonst nicht gültig ist.
 * collums soll ein Array von Strings, also der Spaltennamen darstellen.
 * @param collums
 * @param table
 * @returns {*}
 */
function createSelectCommand(collums, table) {
    var commandString = 'SELECT ';
    if (table != null) {
        if (collums == null) {
            commandString = '* FROM ' + table;
        } else {
            commandString = commandString + collums[0];
            for (var i = 1; i < collums.length - 1; i++) {
                commandString = commandString + ',' + collums[i];
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
 *  Generiert String des SQL-Insert Befehls.
 *  Wenn table, collums, values leer sind wird null zurückgegeben.
 *  query sind suchoptionen nach dem SQL Befehl WHERE.
 * @param collums
 * @param table
 * @param values
 * @param query
 */
function createInsertCommand(collums, table, values, query) {
    var commandString = 'INSERT INTO ';
    if (table != null && collums != null && values != null) {
        commandString = commandString + table + ' ' + collums[0];
        for (var i = 1; i < collums - 1; i++) {
            commandString = commandString + ',' + collums[i];
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
 * Generiert String des SQL-Update Befehls.
 * Dieser ändert einer Spalte alle Werte die den query erfüllen.
 * @param collum
 * @param table
 * @param value
 * @param query
 * @returns {*}
 */
function createUpdateCommand(collum, table, value, query) {
    var commandString = 'UPDATE ';
    if (table != null && collum != null && value != null) {
        commandString = commandString + table + ' SET ' + collum + ' = ' + value;
        if (query != null) {
            commandString = commandString + query;
            console.log(notMedia + Tag + commandString);
            return commandString;
        }
    }
    console.log(notMedia + Tag + 'Update Command Creation failed!');
    return null;
}

function createDeleteCommand(collum, table, value, query) {
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
 * Generiert String für SQL Abfragen bzw. Auswahlbedingungen mit dem WHERE Operator.
 * Dabei kommt ein Ergebnis dieser Struktur heraus:
 * "WHERE spalte1 = wert1 AND spalte2 <> wert2
 * Der Operator muss die SQL-Richtlinien einhalten d.h. operatoren sind:
 * Operator     Beschreibung
 * =            Gleichheit
 * <>          (manche Dialekte auch !=)Ungleichheit
 * >            Größerals
 * <            Kleinerals
 * >=           Größeroder Gleich
 * <=           Kleineroder Gleich
 * BETWEEN      Innerhalbeines Bereichs(oft unterschiedlich interpretiert von DB zu DB) --!! Wird noch nicht richtig unterstützt
 * LIKE         Suchenach Mustern mit % und _ als Wildcards
 * IN           Ergebnisraumbeschränkenauf bestimmteWerte
 *
 * mit dem Array queryo
 * @param collums
 * @param values
 * @param operators
 * @returns {*}
 */
function createWhereQuery(collums, values, operators) {
    var queryString = 'WHERE ';
    if (collums != null && values != null && operators != null) {
        queryString = queryString + collums[0] + ' ' + operators[0] + ' ' + values[0];
        for (var i = 1; i < collums.length; i++) {
            queryString = queryString + ' AND ' + collums[i] + ' ' + operators[i] + ' ' + values[i];
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


});

