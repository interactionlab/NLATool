var express = require('express');
var corenlp = require("corenlp-request-wrapper");
var router = express.Router();
var nlpPort = 4000;
//--------------------------------------------------------
/**
 * Tags for console Errors::
 * @type {string}
 */
var desktop = 'desktop Version: ';
var mobile = 'Mobile Version: ';
var bigDesktop = 'Big Desktop Version: ';
var notMedia = 'Not Media-Related Part: ';
var Tag = 'index.js: ';
var net = require('net');
var server = net.createServer();
var dbAction = require('../modules/DB-Actions.js');
var dbStub = require('../modules/DB-Stub.js');
var mySQL = require('mysql');
var wait = require('wait.for');

var connectionSettings = {
    database: "nlatool",
    host: "turcan.de",
    user: "nlatool",
    password: "1EcH1pHr1VHhdknm",
    port: "3306"
};

var json2;
wait.launchFiber(getJSONConfig);


function getJSONConfig() {
    json2 = dbAction.getJsonConfiguration();
    json2 = JSON.parse(json2);
}


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('./Desktop/loadtext', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});

router.post('/nlp2', function (req, res) {

    //check if CoreNLP server is online
    server.listen(nlpPort);

    server.once('error', function (err) {

        if (err.code === 'EADDRINUSE') {
            //port is currently in use, so...
            console.log("Server online");

            var input = req.body.testFunction;

            corenlp.parse(
                input, nlpPort, "ner", "json", function (err, parsedText) {
                    //console.log(JSON.stringify(JSON.parse(parsedText), null, 2));

                    //Object -> Json -> String
                    var json = JSON.parse(parsedText);
                    var words = {};
                    var classes = {};
                    var person = {};
                    var loc = {};
                    var orga = {};

                    var personSize = 0,
                        locSize = 0,
                        orgaSize = 0;

                    for (var i = 0; i <= json["sentences"].length - 1; i++) {
                        for (var j = 0; j <= json["sentences"][i]["tokens"].length - 1; j++) {
                            if (json["sentences"][i]["tokens"][j].ner !== "O") {
                                classes[j] = (JSON.stringify(json["sentences"][i]["tokens"][j].ner));
                                words[j] = (JSON.stringify(json["sentences"][i]["tokens"][j].word));
                                if (words[j] !== undefined) {

                                    for (var k = 0; k <= j; k++) {
                                        if (classes[j] === '"PERSON"') {
                                            person[personSize] = words[j];
                                            personSize++;
                                        } else if (classes[j] === '"LOCATION"') {
                                            loc[locSize] = words[j];
                                            locSize++;
                                        } else if (classes[j] === '"ORGANIZATION"') {
                                            orga[orgaSize] = words[j];
                                            orgaSize++;
                                        }
                                    }

                                }
                            }
                        }
                    }

                    console.log(person);
                    console.log(loc);
                    console.log(orga);


                    /**
                     * write to database
                     *
                    var bla = dbAction.createInsertCommand('word', ['content'],[words[0]], null, null);
                    var connection = dbStub.createConnection(connectionSettings);
                    connection.query(bla);
                     */

                    res.render('Desktop/loadtext', {
                        title: 'NLA - Natural Language Analyse Tool',
                        //result: highlight("test",input)
                        result: input
                    })
                })

        }
    });

    //if Core NLP is offline:
    server.once('listening', function () {
        server.close();
        setTimeout(function(){console.log("Server offline")}, 5000);
        res.render('Desktop/loadtext', {
            title: 'NLA - Natural Language Analyse Tool',
            result: "Error 501: CoreNLP Server is offline"
        }, null);

    });
});


function highlight(string, inputText){

    var index = inputText.indexOf(string);
    if ( index >= 0 )
    {
        inputText = inputText.substring(0,index) + "<span class='highlight'>" + inputText.substring(index,index+string.length) + "</span>" + inputText.substring(index + string.length);
    }
    return inputText;
}


module.exports = router;