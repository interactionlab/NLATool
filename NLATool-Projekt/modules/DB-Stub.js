/**
 * Database Configuration
 * There is a great possibility that parts of this will be moved into the app.js
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