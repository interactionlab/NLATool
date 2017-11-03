//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let notMedia = 'Not Media-Related Part: ';
let Tag = 'DB-Actions.js: ';
let sql = 'The resulting SQL Command is:';
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
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
let jsonConfigurator = require('jsonfile');
let wait = require('wait.for');
let dbConfig = './modules/config.json';
let testJson = './modules/test.json';
let jsonAction = require('./jsonActions');


let json = null;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = getJsonConfiguration();
    //json = JSON.parse(json);
}

/**
 * Reads the database Configuration and returns an json Object.
 * @returns {*}
 */
exports.getJsonConfiguration = function () {
    let json2 = wait.for(jsonConfigurator.readFile, dbConfig);
    json2 = JSON.stringify(json2);
    console.log(notMedia + Tag + 'json2: ' + json2);
    return json2;
};

function getJsonConfiguration() {
    let json = wait.for(jsonConfigurator.readFile, dbConfig);
    json = JSON.stringify(json);
    console.log(notMedia + Tag + 'json: ' + json);
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

exports.getTableListFromJson = function () {
    var tableList = [];
    for (var table in json) {
        if (json[table].isTable) {
            tableList.push(json[table].name);
        }
    }
    return tableList;
};

exports.getColumnsOfOneTable = function (table) {
    var columns = {};
    for (var entity in json) {
        if (json[entity].isTable && json[entity].name === table) {
            for (var column in json[entity]) {
                if (column !== 'isTable' && column !== 'name') {
                    columns[column] = json[entity][column];
                    columns[column] = jsonAction.syncColumnWithDefault(columns[column]);
                }
            }
        }
    }
    columns = JSON.stringify(columns);
    //console.log(notMedia + Tag + 'getColumns Result:' + columns);
    return columns;
};

exports.getSettingsOfOneColumn = function (table, column) {
    var settings = {};
    for (var entity in json) {
        if (json[entity].isTable) {
            if (json[entity].name === table) {
                for (var col in json[entity]) {
                    if (json[entity][col].name === column) {
                        settings = json[entity][col];
                        break;
                    }
                }
                break;
            }
        }
    }
};

/**
 * Synchronises the default settings for a column with the specified ones.
 * @param options
 * @returns {*}
 */
exports.syncColumnWithDefault = function (options) {
    //console.log('Before sync: ' + JSON.stringify(obj.default));
    for (var key in json.default) {
        if (json.default.hasOwnProperty(key) && key !== 'isTable') {
            if (!jsonAction.isKeyInObject(key, options)) {
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
exports.isKeyInObject = function (key, obj) {
    for (var otherKey in obj) {
        if (key === otherKey) {
            return true;
        }
    }
    return false;
};

/**
 * This function will extract all the important values you need to create a connection or pool.
 * @param connect
 * @returns {{}}
 */
exports.getConnectionSettings = function (connect) {
    var settings = {};
    for (var setting in connect) {
        if (setting !== 'priority') {
            settings[setting] = connect[setting];
        }
    }
    return settings;
};