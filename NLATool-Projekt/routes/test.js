var express = require('express');
var router = express.Router();

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
/**
 * Special required modules/files:
 */
var dbAction = require('../modules/DB-Actions');
var dbStub = require('../modules/DB-Stub');
router.get('/', function (req, res, next) {
    res.render('./testview', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});


router.post('/theFunction', function (req, res) {
    var testingFunction = req.testfunction;
    var table = 'accountdata';
    var columns = ['id', 'email', 'username', 'pass']
    var values = ['eins', 'zwei', 'drei', 'vier'];
    var valuesToCompare = ['zwei', 'vier', 'fünf'];
    var oper = ['=', '=', '='];
    var resultOfSQL = dbAction.createInsertCommand(table, columns, values, valuesToCompare, oper);

    var jsonOptions = {"name": "first", "type": "INT"}

    dbAction.synchColumnWithDefault(jsonOptions);
    dbStub.testDBConnection('nlatool', columns, values, valuesToCompare, oper);
    res.render('./testview', {title: 'NLA - Natural Language Analyse Tool', result: resultOfSQL});
});


module.exports = router;
