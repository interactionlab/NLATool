const express = require('express');
const router = express.Router();
const nlpPort = 4000;
//--------------------------------------------------------
/**
 * Tags for console Errors::
 * @type {string}
 */
let desktop = 'desktop Version: ';
let mobile = 'Mobile Version: ';
let bigDesktop = 'Big Desktop Version: ';
let notMedia = 'Not Media-Related Part: ';
let Tag = 'index.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
const net = require('net');
//const server = net.createServer();
const dbAction = require('../modules/db_actions.js');
const dbStub = require('../modules/db_stub.js');
const uword = require('uwords');
const wait = require('wait.for');
const jsonAction = require('../modules/json_actions');
const corenlp = require('../modules/corenlp');
//const session = require('client-sessions');
//const isReachable = require('is-reachable');


let results = [];
let json2;
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
    corenlp.setupCorenlp();
    if (corenlp.positiveNlpStatus()) {
        res.render('./Desktop/loadtext', {title: 'NLA - Natural Language Analyse Tool', result: ''});
    } else {
        let nlpStatus = corenlp.getNlpStatus();
        if (typeof nlpStatus.error !== "undefined" && nlpStatus.error !== null) {
            next(nlpStatus.error);
        } else {
            let err = new Error('Corenlp failed to find a connection, but didnt throw an error!');
            next(err);
        }
    }
}


//TODO: uninstall uword when its usage is deprecated; override let words


function postLoadWrittenText(req, res, next) {
    if (corenlp.positiveNlpStatus()) {
        let text = req.body.textInput;
        if (!/\S/.test(text)) {
            res.render('./Desktop/loadtext', {title: 'NLA - Natural Language Analyse Tool', result: ''});
        } else {
            //corenlp.setupCorenlp();
            //let parsedText = wait.for(corenlp.parse,text);
            let parsedResult = wait.for(corenlp.analyse, text);
            //let parsedResultSentence = wait.for(corenlp.analyseSentence, text);
            console.log(notMedia + Tag + 'the parsedText from corenlp is: ' + JSON.stringify(parsedResult));
            //console.log(notMedia + Tag + 'the parsedTex Sentence from corenlp is: ' + JSON.stringify(parsedResult));
            //let words = uword(text);
            let words = parsedResult.text;
            let title = '"' + req.body.title + '"';

            let documentInsertResult = wait.for(dbStub.makeSQLRequest, dbAction.createInsertCommand('documents', ['name'], [title], null, null));
            documentInsertResult = JSON.parse(documentInsertResult);
            //console.log('DocumentID is: ' + JSON.stringify(documentInsertResult) + ': '+ documentInsertResult.insertId);
            wait.for(sendSQL, dbAction.createInsertCommand(
                'text',
                ['docID', 'length', 'title'],
                [documentInsertResult.insertId, words.length, title],
                null, null));
            req.session.docID = documentInsertResult.insertId;

            //TODO: check if word + NER Tag exists already

            let wordInsertResult = null;
            let counter = 0;
            for (let i = 0; i < words.length; i++) {
                for (let j = 0; j < words[i].length; j++) {
                    words[i][j] = stringifyForDB(words[i][j]);
                    parsedResult.ner[i][j] = stringifyForDB(parsedResult.ner[i][j]);
                    parsedResult.pos[i][j] = stringifyForDB(parsedResult.pos[i][j]);
                    wordInsertResult = wait.for(dbStub.makeSQLRequest, dbAction.createInsertCommand(
                        'word',
                        ['content', 'isSpecial', 'semanticClass', 'pos'],
                        [words[i][j], 0, parsedResult.ner[i][j], parsedResult.pos[i][j]],
                        null, null));

                    wordInsertResult = JSON.parse(wordInsertResult);
                    wait.for(dbStub.makeSQLRequest, dbAction.createInsertCommand(
                        'textWords',
                        ['wordID', 'docID', 'counter'],
                        [wordInsertResult.insertId, documentInsertResult.insertId, counter],
                        null, null));
                    counter++;
                }

            }
            res.redirect('/analyse');
        }
    }
}

function sendSQL(command) {
    try {
        let result = wait.for(dbStub.makeSQLRequest, command);
        results.push(result);
    } catch (err) {
        results.push(err);
    }
}

function stringifyForDB(input) {
    return '"' + input + '"';
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