var express = require('express');
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
var uword = require('uwords');
var wait = require('wait.for');
var jsonAction = require('../modules/jsonActions');
var corenlp = require('../modules/corenlp');

//const isReachable = require('is-reachable');


var results = [];
var json2;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json2 = jsonAction.getJsonConfiguration();
    json2 = JSON.parse(json2);
}


/* GET home page. */
router.get('/', function (req, res, next) {
    wait.launchFiber(getLoadTextRoutine, req, res, next);
});


router.post('/loadDocument', function (req, res) {
    //TODO: Load & parse a loaded Document
});

router.post('/loadWrittenText', function (req, res) {
    wait.launchFiber(postLoadWrittenText, req, res, req);
});

/**
 * Function that was needed to have the whole get-Routine into one fiber,
 * to support wait.for statements.
 * This function will do anything you want to do in router.get when first
 * addressing this route.
 * @param req
 * @param res
 * @param next
 */
function getLoadTextRoutine(req, res, next) {
    dbStub.fiberEstablishConnection();
    corenlp.getAReachableConnection();
    if (corenlp.positiveNlpStatus()) {
        res.render('./Desktop/loadtext', {title: 'NLA - Natural Language Analyse Tool', result: ''});
    } else {
        var nlpStatus = corenlp.getNlpStatus();
        if (typeof nlpStatus.error !== "undefined" && nlpStatus.error !== null) {
            next(nlpStatus.error);
        } else {
            var err = new Error('Corenlp failed to find a connection, but didnt throw an error!');
            next(err);
        }
    }
}


function postLoadWrittenText(req, res, next) {
    if (corenlp.positiveNlpStatus()) {
        var text = req.body.textInput;
        if (!/\S/.test(text)) {
            res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
        } else {
            //TODO: Parse Text with corenlp
            var words = uword(text);
            console.log('Words are: ' + Array.isArray(words) + words);
            //var words = text.split(' ');
            console.log(text + ' : ' + words.length);
            for (var i = 0; i < words.length; i++) {
                words[i] = '"' + words[i] + '"';
                wait.for(sendSQL, dbAction.createInsertCommand('word', ['content', 'isSpecial'], [words[i], 0], null, null));
                wait.for(sendSQL, dbAction.createInsertCommand('text', ['Counter'], [i], null, null));
            }
            res.redirect('/analyse');
        }
    }
}


function sendSQL(command) {
    try {
        var result = wait.for(dbStub.makeSQLRequest, command);
        results.push(result);
    } catch (err) {
        results.push(err);
    }
}

/*
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
                    var pos = {};

                    for (var i = 0; i <= json["sentences"].length - 1; i++) {
                        for (var j = 0; j <= json["sentences"][i]["tokens"].length - 1; j++) {
                            classes[j] = (JSON.stringify(json["sentences"][i]["tokens"][j].ner));
                            words[j] = (JSON.stringify(json["sentences"][i]["tokens"][j].word));
                            pos[j] = (JSON.stringify(json["sentences"][i]["tokens"][j].pos));
                        }
                    }

                    // write to database

                    dbStub.fiberEstablishConnection();

                    var word = dbAction.createInsertCommand('word', ['content', 'isSpecial', 'semanticClass', 'pos'], [words[k], 0, classes[k], pos[k]]);

                    dbStub.makeSQLRequest(word, function (err, result) {
                        if (err) {
                            res.render('./testview', {
                                title: 'NLA - Natural Language Analyse Tool',
                                result: err
                            });
                        } else {
                            res.render('Desktop/loadtext', {
                                title: 'NLA - Natural Language Analyse Tool',
                                result: result
                            })
                        }
                    });

                })

        }
    });

    //if Core NLP is offline:
    server.once('listening', function () {
        server.close();
        setTimeout(function () {
            console.log("Server offline")
        }, 5000);
        res.render('Desktop/loadtext', {
            title: 'NLA - Natural Language Analyse Tool',
            result: "Error 501: CoreNLP Server is offline"
        }, null);

    });
 */


module.exports = router;