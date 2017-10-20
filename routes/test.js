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
var jsonAction = require('../modules/jsonActions');
var dbStub = require('../modules/DB-Stub');
const corenlp = require("corenlp-request-wrapper");
var jsonConfigurator = require('jsonfile');
var dbconfig = './modules/dbconfig.json';
var wait = require('wait.for');
router.get('/', function (req, res, next) {
    res.render('./testview', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});


router.post('/theFunction', function (req, res) {
    /*
        var testingFunction = req.testfunction;
        var table = 'accountdata';
        var columns = ['id', 'email', 'username', 'pass'];
        var values = ['eins', 'zwei', 'drei', 'vier'];
        var valuesToCompare = ['zwei', 'vier', 'fünf'];
        var oper = ['=', '=', '='];
        var resultOfSQL = dbAction.createInsertCommand(table, columns, values, valuesToCompare, oper);
    */
    var resultOfSQL = '';
    var jsonOptions = {name: "first", type: "INT"};
    var columnName = 'Irgendwas';
    /*columnName = jsonAction.setCharAt(columnName, columnName.length-1, 'A');
    console.log(notMedia + Tag + 'geänderter String:'+ columnName);*/
    dbStub.fiberEstablishConnection();
    dbStub.makeSQLRequest('SELECT * FROM word', function (err, result) {
        if (err) {
            res.render('./testview', {title: 'NLA - Natural Language Analyse Tool', result: err});
        } else {
            res.render('./testview', {title: 'NLA - Natural Language Analyse Tool', result: result});
        }
    });
    /*
    res.render('./testview', {
        title: 'NLA - Natural Language Analyse Tool',
        result: JSON.stringify(jsonAction.getSettingsOfOneColumn('documents', 'docID'))
    });
    */

//    dbAction.transformColumnToSQL(columnName, jsonOptions);
//    dbStub.testDBConnection('nlatool', columns, values, valuesToCompare, oper);

    //res.render('./testview', {title: 'NLA - Natural Language Analyse Tool', result: resultOfSQL});
});


router.post('/nlp', function (req, res) {

    var input = req.body.testFunction;
    console.log(input);

    corenlp.parse(
        input, 9000, "pos,lemma,ner", "json", function (err, parsedText) {
            //console.log(JSON.stringify(JSON.parse(parsedText), null, 2));
            res.render('./testview', {
                title: 'NLA - Natural Language Analyse Tool',
                result: JSON.stringify(JSON.parse(parsedText))
            })
        });

});

module.exports = router;
