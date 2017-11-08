const express = require('express');
const router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let desktop = 'desktop Version: ';
let mobile = 'Mobile Version: ';
let bigDesktop = 'Big Desktop Version: ';
let notMedia = 'Not Media-Related Part: ';
let Tag = 'test.js: ';

//--------------------------------------------------------
/**
 * Special required modules/files:
 */
const dbAction = require('../modules/db_actions');
const jsonAction = require('../modules/json_actions');
const dbStub = require('../modules/db_stub');
const corenlp = require("corenlp-request-wrapper");
const jsonConfigurator = require('jsonfile');
const dbconfig = './modules/config.json';
const wait = require('wait.for');


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
    let resultOfSQL = '';
    let jsonOptions = {name: "first", type: "INT"};
    let columnName = 'Irgendwas';
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

    let input = req.body.testFunction;
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
