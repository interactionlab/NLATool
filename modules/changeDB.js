//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
var notMedia = 'Not Media-Related Part: ';
var Tag = 'changeDB.js: ';

//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
var jsonConfigurator = require('jsonfile');
var wait = require('wait.for');
var dbConfig = './modules/dbconfig.json';
var dbAction = require('./DB-Actions');
var dbStub = require('./DB-Stub');
var jsonAction = require('./jsonActions');
var changeDB = require('./changeDB');
//var json = test.json;

var json = null;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = jsonAction.getJsonConfiguration();
    json = JSON.parse(json);
}

/**
 * General Section for altering tables.
 * */
//-----------------------------------------------------------
var alterDB = {
    tables: {},
    table_options: {
        AUTO_INCREMENT: {},
        AVG_ROW_LENGTH: {},
        CHARACTER_SET: {},
        CHECKSUM: {},
        COLLATE: {},
        COMMENT: {},
        COMPRESSION: {},
        CONNECTION: {},
        DATA_DIRECTORY: {},
        INDEX_DIRECTORY: {},
        DELAY_KEY_WRITE: {},
        ENCRYPTION: {},
        ENGINE: {},
        INSERT_METHOD: {},
        KEY_BLOCK_SIZE: {},
        MAX_ROWS: {},
        MIN_ROWS: {},
        PACK_KEYS: {},
        PASSWORD: {},
        ROW_FORMAT: {},
        STATS_AUTO_RECALC: {},
        STATS_PERSISTENT: {},
        STATS_SAMPLE_PAGES: {},
        TABLESPACE: {},
        UNION: {}
    },
    operations: {
        ADD_COLUMNS: {},
        ADD_INDEXES: {},
        ADD_KEYS: {},
        ADD_CONSTRAINTS: {},
        ADD_FULLTEXT_INDEXES: {},
        ADD_FULLTEXT_KEYS: {},
        ADD_SPATIAL_INDEXES: {},
        ADD_SPATIAL_KEY: {},
        ALGORITHM: {},
        ALTER: {},
        ALTER_COLUMNS: {},
        CHANGE: {},
        CHANGE_COLUMNS: {},
        CHARACTER_SET: {},
        CONVERT_TO_CHARACTER_SET: {},
        DISABLE_KEYS: {},
        ENABLE_KEYS: {},
        DISCARD_TABLESPACE: {},
        IMPORT_TABLESPACE: {},
        DROP: {},
        DROP_COLUMNS: {},
        DROP_INDEXES: {},
        DROP_KEYS: {},
        DROP_PRIMARY_KEYS: {},
        DROP_FOREIGN_KEY: {},
        FORCE: {},
        LOCK: {},
        MODIFY: {},
        MODIFY_COLUMN: {},
        ORDER_BY: {},
        RENAME_INDEXES: {},
        RENAME_KEYS: {},
        RENAME_TO: {},
        RENAME_AS: {},
        WITHOUT_VALIDATION: {},
        WITH_VALIDATION: {},
        ADD_PARTITIONS: {},
        DROP_PARTITIONS: {},
        DISCARD_PARTITIONS: {},
        IMPORT_PARTITIONS: {},
        TRUNCATE_PARTITIONS: {},
        COALESCE_PARTITIONS: {},
        REORGANIZE_PARTITIONS: {},
        EXCHANGE_PARTITIONS: {},
        ANALYZE_PARTITIONS: {},
        CHECK_PARTITIONS: {},
        OPTIMIZE_PARTITIONS: {},
        REBUILD_PARTITIONS: {},
        REPAIR_PARTITIONS: {},
        REMOVE_PARTITIONING: {},
        UPGRADE_PARTITIONING: {}
    }
};

var operationObject = {};

/**
 * ALTER TABLE tbl_name
 [alter_specification [, alter_specification] ...]

 alter_specification:
 table_options
 | ADD [COLUMN] col_name column_definition
 [FIRST | AFTER col_name]
 | ADD [COLUMN] (col_name column_definition,...)
 | ADD {INDEX|KEY} [index_name]
 [index_type] (index_col_name,...) [index_option] ...
 | ADD [CONSTRAINT [symbol]] PRIMARY KEY
 [index_type] (index_col_name,...) [index_option] ...
 | ADD [CONSTRAINT [symbol]]
 UNIQUE [INDEX|KEY] [index_name]
 [index_type] (index_col_name,...) [index_option] ...
 | ADD FULLTEXT [INDEX|KEY] [index_name]
 (index_col_name,...) [index_option] ...
 | ADD SPATIAL [INDEX|KEY] [index_name]
 (index_col_name,...) [index_option] ...
 | ADD [CONSTRAINT [symbol]]
 FOREIGN KEY [index_name] (index_col_name,...)
 reference_definition
 | ALGORITHM [=] {DEFAULT|INPLACE|COPY}
 | ALTER [COLUMN] col_name {SET DEFAULT literal | DROP DEFAULT}
 | CHANGE [COLUMN] old_col_name new_col_name column_definition
 [FIRST|AFTER col_name]
 | [DEFAULT] CHARACTER SET [=] charset_name [COLLATE [=] collation_name]
 | CONVERT TO CHARACTER SET charset_name [COLLATE collation_name]
 | {DISABLE|ENABLE} KEYS
 | {DISCARD|IMPORT} TABLESPACE
 | DROP [COLUMN] col_name
 | DROP {INDEX|KEY} index_name
 | DROP PRIMARY KEY
 | DROP FOREIGN KEY fk_symbol
 | FORCE
 | LOCK [=] {DEFAULT|NONE|SHARED|EXCLUSIVE}
 | MODIFY [COLUMN] col_name column_definition
 [FIRST | AFTER col_name]
 | ORDER BY col_name [, col_name] ...
 | RENAME {INDEX|KEY} old_index_name TO new_index_name
 | RENAME [TO|AS] new_tbl_name
 | {WITHOUT|WITH} VALIDATION


 index_col_name:
 col_name [(length)] [ASC | DESC]

 index_type:
 USING {BTREE | HASH}

 index_option:
 KEY_BLOCK_SIZE [=] value
 | index_type
 | WITH PARSER parser_name
 | COMMENT 'string'

 table_options:
 table_option [[,] table_option] ...

 table_option:
 AUTO_INCREMENT [=] value
 | AVG_ROW_LENGTH [=] value
 | [DEFAULT] CHARACTER SET [=] charset_name
 | CHECKSUM [=] {0 | 1}
 | [DEFAULT] COLLATE [=] collation_name
 | COMMENT [=] 'string'
 | COMPRESSION [=] {'ZLIB'|'LZ4'|'NONE'}
 | CONNECTION [=] 'connect_string'
 | {DATA|INDEX} DIRECTORY [=] 'absolute path to directory'
 | DELAY_KEY_WRITE [=] {0 | 1}
 | ENCRYPTION [=] {'Y' | 'N'}
 | ENGINE [=] engine_name
 | INSERT_METHOD [=] { NO | FIRST | LAST }
 | KEY_BLOCK_SIZE [=] value
 | MAX_ROWS [=] value
 | MIN_ROWS [=] value
 | PACK_KEYS [=] {0 | 1 | DEFAULT}
 | PASSWORD [=] 'string'
 | ROW_FORMAT [=] {DEFAULT|DYNAMIC|FIXED|COMPRESSED|REDUNDANT|COMPACT}
 | STATS_AUTO_RECALC [=] {DEFAULT|0|1}
 | STATS_PERSISTENT [=] {DEFAULT|0|1}
 | STATS_SAMPLE_PAGES [=] value
 | TABLESPACE tablespace_name [STORAGE {DISK|MEMORY|DEFAULT}]
 | UNION [=] (tbl_name[,tbl_name]...)

 partition_options:
 (see CREATE TABLE options)
 */
exports.createAlterTableCommand = function (table) {
    var alterCommandString = 'ALTER TABLE ' + table + ' ';
    //Add all the table_options for the specified table.
    for (var i = 0; i < alterDB.table_options[table].length; i++) {
        if (alterDB.table_options[table].length === 1) {
            alterCommandString = alterCommandString + alterDB.table_options[table][0];
            break;
        } else {
            alterCommandString = alterCommandString + alterDB.table_options[table][0] + ', ';
        }
    }
    //Add all the operations for the specified table.

    return alterCommandString;
};

exports.alterTable = function () {
    for (var table in alterDB.tables) {

    }
    try {
        dbStub.makeSQLRequest();
    } catch (err) {

    }
};


exports.addAlterSpecificationOperations = function (operation, subOperation, operationObject) {
    if (operation !== null && operationObject !== null && typeof operationObject === "object") {
        if (subOperation !== null) {
            if (typeof alterDB.operations[operation][subOperation] !== "undefined") {
                alterDB.operations[operation][subOperation] = operationObject;
            }
        } else {
            if (typeof alterDB.operations[operation] !== "undefined") {
                alterDB.operations[operation] = operationObject;
            }
        }
    }
    //TODO: Error Handling if needed. (Invalid Parameter Exceptions)
};


exports.addAlterSpecificationOperation = function (operation, subOperation, key, command) {
    if (operation !== null && key !== null && command !== null) {
        if (subOperation !== null) {
            if (typeof alterDB.operations[operation][subOperation] !== "undefined") {
                alterDB.operations[operation][subOperation][key] = command;
            }
        }
    }
};

/**
 * Section for creating specific Instructions for each Operation in the ALTEr TABLE Command that get stored in alterDB
 */
//-----------------------------------------------------------
/**
 * Creates the Command for adding a column to the database and stores it into the operationObject
 * @param table
 * @param column
 */
exports.generateColumnDefinition = function (table, column) {
    var settingsOfColumn = jsonAction.getSettingsOfOneColumn(table, column);
    var commandString = column + ' ';
    var i = 0;
    for (var t in alterDB.tables) {
        if (alterDB.tables[t] !== table) {
            if (typeof alterDB.tables[t] === "undefined") {
                alterDB.tables[i] = table;
                break;
            }
        } else {
            break;
        }
        i++;
    }
    for (var setting in settingsOfColumn) {
        commandString = commandString + ' ' + settingsOfColumn[setting];
    }
    return commandString;
};

exports.addAlterSpecificationTableOptions = function (table, command) {
    if (Array.isArray(alterDB.table_options[table])) {
        alterDB.table_options[table].push(command);
    } else {
        alterDB.table_options[table] = [];
        alterDB.table_options[table].push(command);
    }
};

exports.addAddColumnOperation = function (table, column) {
    if (Array.isArray(alterDB.operations.ADD_COLUMNS[table])) {
        alterDB.operations.ADD_COLUMNS[table].push(changeDB.generateColumnDefinition(table, column));
    } else {
        alterDB.operations.ADD_COLUMNS[table] = [];
        alterDB.operations.ADD_COLUMNS[table].push(changeDB.generateColumnDefinition(table, column));
    }
};

exports.addDropColumnOperation = function (table, column) {
    if (Array.isArray(alterDB.operations.DROP_COLUMNS[table])) {
        alterDB.operations.DROP_COLUMNS[table].push(column);
    } else {
        alterDB.operations.DROP_COLUMNS[table] = [];
        alterDB.operations.DROP_COLUMNS[table].push(column);
    }
};

exports.addChangeColumnOperation = function (table, column) {
    if (Array.isArray(alterDB.operations.CHANGE_COLUMNS[table])) {
        alterDB.operations.CHANGE_COLUMNS[table].push(changeDB.generateColumnDefinition(table, column));
    } else {
        alterDB.operations.CHANGE_COLUMNS[table] = [];
        alterDB.operations.CHANGE_COLUMNS[table].push(changeDB.generateColumnDefinition(table, column));
    }
};
/**
 * Functions that read the instructions of alterDB and generates Parts of the
 * final MySql Command.
 */

//-----------------------------------------------------------

/**
 * other supportive functions.
 */
//-----------------------------------------------------------
function resetAlterDB() {
    alterDB.tables = {};
    for (var option in alterDB.table_options) {
        alterDB.table_options[option] = {};
    }
    for (var operation in alterDB.operations) {
        alterDB.operations[operation] = {};
    }
}

function resetOpterationObject() {
    operationObject = {};
}

exports.getAlterDB = function () {
    return JSON.stringify(alterDB);
};

exports.setOperationObject = function (key, command) {
    operationObject[key] = command;
};
