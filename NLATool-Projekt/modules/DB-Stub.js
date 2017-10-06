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

var dbName = null, host = null, port = null, user = null, password = null, res = null;
/**
 * Reading Configuration file requirements:
 */
var jsonconfigurator = require('jsonfile');
var dbconfig = './modules/dbconfig.json';

/**
 * Reading config file to get the connection data of the Database Server.
 */
exports.fiberEstablishConnection = function () {
    wait.launchFiber(establishConnection);
};
establishConnection = function () {
    var json = dbAction.getJsonConfiguration();
    //console.log(notMedia+Tag+ 'establish Connection json: '+ json);
    json = JSON.parse(json);
    var connectSettings;
    for (var connect in json.database.connections) {
        connectSettings = getConnectionSettings(json.database.connections[connect]);
        var pool = mysql.createPool(connectSettings);
        if (wait.for(databaseCreated, pool)) {
            console.log(notMedia + Tag + 'Setup of DB complete.');
            break;
        }
    }
};

getConnectionSettings = function (connect) {
    var settings = {};
    for (var setting in connect) {
        settings[setting] = connect[setting];
    }
    return settings;
};

databaseCreated = function (pool, callback) {
    var created = false;
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(notMedia + Tag + 'connection to db failed: ' + err);

        } else {
            console.log(notMedia + Tag + 'connection to db succeeded.');

            dbAction.setupDB(connection);
            res = connection.query(dbAction.createSelectCommand('word', null, null, null));
            console.log(notMedia + Tag + 'Result of Select in databaseCreated: ' + res.id);
            created = true;
        }
    });
    callback(null, created);
};

exports.testDBConnection = function (table, columns, values, valuesToCompare, operators) {
    //TODO: Solve this Quickrepair in more efficient way
    var pool = mysql.createPool({
        host: host,
        user: user,
        password: password,
        database: dbName
    });
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        // dbAction.createInsertCommand(table, columns, values, valuesToCompare, operators)
        connection.query('', function (error, results, fields) {
            if (error) throw error;
            else {
                for (var i = 0; i < results; i++) {
                    console.log(notMedia + Tag + results[i]);
                }
            }
        });
    });
};
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