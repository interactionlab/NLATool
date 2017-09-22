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