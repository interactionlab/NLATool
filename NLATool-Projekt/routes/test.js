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
const corenlp = require("corenlp-request-wrapper");
var jsonconfigurator = require('jsonfile');
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
    var jsonOptions = {name: "first", type: "INT"};
    var columnName = 'Irgendwas';
    wait.launchFiber(testGeneration, req, res);




    var resultOfSQL = '';
//    dbAction.transformColumnToSQL(columnName, jsonOptions);
//    dbStub.testDBConnection('nlatool', columns, values, valuesToCompare, oper);

//    res.render('./testview', {title: 'NLA - Natural Language Analyse Tool', result: resultOfSQL});
});

function testGeneration(req, res) {
    var json = wait.for(jsonconfigurator.readFile, dbconfig);
    var resultingString = wait.for(dbAction.generateCreateCommand, json, 'accountData');
    console.log(notMedia + Tag + 'Result of generateCreateCommand:' + JSON.stringify(resultingString));
    res.render('./testview', {title: 'NLA - Natural Language Analyse Tool', result: resultingString});
}

router.post('/nlp', function (req, res) {

    var input = req.body.testFunction;
    console.log(input);

    //TODO: check if CoreNLP server is online

    //start server with command
    //java -mx1g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -timeout 15000
    //where -mx_g is the number of GBs of RAM you want to allocate

    corenlp.parse(
        input, 9000, "pos,lemma,ner", "json", function (err, parsedText) {
            console.log(JSON.stringify(JSON.parse(parsedText), null, 2));
            res.render('./testview', {
                title: 'NLA - Natural Language Analyse Tool',
                result: JSON.stringify(JSON.parse(parsedText))
            })
        });

});

module.exports = router;
