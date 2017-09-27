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
var Tag = 'test.js: ';

//--------------------------------------------------------
var mysql = require('mysql');
var dbAction = require('./DB-Actions');

//TODO: automatically read dbconfig file for these info
var host = 'localhost';
var user = 'guest';
var password = 'ichbingasthier';
var db = 'nla-alpha';

var pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: db
});
exports.testDBConnection = function (table, columns, values, valuesToCompare, operators) {
    pool.getConnection(function (err, connection) {
        // dbAction.createInsertCommand(table, columns, values, valuesToCompare, operators)
        connection.query('SELECT * FROM accountdata', function (error, results, fields) {
                if (error) throw error;
                else {
                    for (var i = 0; i < results; i++) {
                        console.log(notMedia + Tag + results[i]);
                    }
                }
            });
    });
}
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'guest',
    password: 'ichbingasthier',
    database: 'nla-alpha'
});

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