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
var testJson = './modules/test.json';

var json = null;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = getJsonConfiguration();
    json = JSON.parse(json);
}


/*
TODO: change default Settings
TODO: change database name
TODO: add/delete connection from database
TODO: set Priority for connection
TODO: add/delete/change a table
TODO: add/delete/change a column
TODO: get all Table names aka SHOW TABLES
TODO: get all columns and their Settings aka SHOW COLUMNS FROM db_tablename
TODO: find & return table/column
TODO: update/write json file

 */

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

/**
 * Replaces a character in a String(str) on a specified position (index)
 * with a new one (chr)
 * @param str
 * @param index
 * @param chr
 * @returns {*}
 */
exports.setCharAt = function (str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
};
