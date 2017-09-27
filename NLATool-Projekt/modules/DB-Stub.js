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

var dbName = null, host = null, port = null, user = null, password = null;
/**
 * Reading Configuration file requirements:
 */
var jsonconfigurator = require('jsonfile');
var dbconfig = './modules/dbconfig.json';

/**
 * Reading config file to get the connection data of the Database Server.
 */
jsonconfigurator.readFile(dbconfig, function (err, obj) {
    if (err) {
        console.log(notMedia + Tag + err);
        //TODO: Create a possibility for the user to configure this config file for his own Database
    } else {
        dbName = obj.Database.name;
        host = obj.Database.host;
        port = obj.Database.port;
        user = obj.Database.user;
        password = obj.Database.password;
    }
});


var pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: dbName
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