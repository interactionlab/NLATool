/--------------------------------------------------------
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
//var json = test.json;

var alterDB = {
    tables: {},
    table_options: {
        AUTO_INCREMENT: null,
        AVG_ROW_LENGTH: null,
        CHARACTER_SET: null,
        CHECKSUM: null,
        COLLATE: null,
        COMMENT: null,
        COMPRESSION: null,
        CONNECTION: null,
        DATA_DIRECTORY: null,
        INDEX_DIRECTORY: null,
        DELAY_KEY_WRITE: null,
        ENCRYPTION: null,
        ENGINE: null,
        INSERT_METHOD: null,
        KEY_BLOCK_SIZE: null,
        MAX_ROWS: null,
        MIN_ROWS: null,
        PACK_KEYS: null,
        PASSWORD: null,
        ROW_FORMAT: null,
        STATS_AUTO_RECALC: null,
        STATS_PERSISTENT: null,
        STATS_SAMPLE_PAGES: null,
        TABLESPACE: null,
        UNION: null
    },
    operations: {
        add: {
            columns: {},
            indexes: {},
            keys: {
                uniques: {},
                primarys: {}
            },
            constraints: {},
            foreignKeys: {}
        },
        algorithm: {
            copy: {},
            inplace: {},
            default: {}
        },
        alterColumns: {},
        drop: {
            columns: {},
            indexes: {},
            keys: {
                uniques: {},
                primarys: {}
            },
            constraints: {},
            foreignKeys: {}
        },
        changeColumn: {}

    }
};
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
exports.createAlterTableCommand = function (table, alterSpecifications) {
    var alterCommandString = 'ALTER TABLE ' + table + ' ';

    return alterCommandString;
};

exports.createAlterTableSpecifications = function () {
    var alterSpecificationsString = '';

    return alterSpecificationsString;
};

exports.createAlterTableSpecification = function (tableOption, operation) {
    var alterSpecificationString = '';

    return alterSpecificationString;
};

exports.createAlterTableOperation = function (operator, valuesToChange) {
    var alterOperationString = '';

    return alterOperationString;
};

exports.createAlterTableOption = function (operator, valuesToChange) {
    var alterOptionString = '';

    return alterOptionString;
};
/**
 * Adds Tables to the Alter Command.
 * @param tables
 */
exports.addAlterSpecificationTables = function (tables) {
    var table = 'table';
    for (var i = 0; i < tables.length(); i++) {
        table = table + i;
        alterDB.tables[table] = tables[i];
    }
};

exports.addAlterSpecificationTableOptions = function (optionToAdd, command) {
    if (alterDB.table_options[optionToAdd] === null) {
        alterDB.table_options[optionToAdd] = Command;
    }
};

exports.addAlterSpecificationOperations = function (operation, subOperation, operationObject) {
    if (operation !== null && operationObject !== null && typeof operationObject === "object") {
        if (subOperation !== null) {
            if (typeof alterDB.operations[operation][subOperation] !== "undefined") {
                alterDB.operations[operation][subOperation] = operationObject;
            }
        }else {
            if (typeof alterDB.operations[operation] !== "undefined") {
                alterDB.operations[operation] = operationObject;
            }
        }
    }
    //TODO: Error Handling if needed. (Invalid Parameter Exceptions)
};

exports.addAlterSpecificationOperation = function (operation, subOperation, key, command) {
    if (operation !== null && key !== null && command !== null) {

    }
};
