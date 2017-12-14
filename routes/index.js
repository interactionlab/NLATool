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

/**
 * Object that holds all specific meta info for this route.
 * @type {{head: {meta: [null,null,null,null]}}}
 */
let vueRenderOptions = {
    head: {
        meta: [
            {script: '/javascripts/data_management.js'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-blue.min.css'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-green.min.css'}
        ]
    }
};

let results = [];
let json2;


let language = 'English';


wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json2 = jsonAction.getJsonConfiguration();
    json2 = JSON.parse(json2);
}

router.get('/', function (req, res, next) {

    wait.launchFiber(getLoadTextRoutine, req, res, next);
    //let vueData = setVueData();
    res.renderVue('loadtext', vueRenderOptions);
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
function getLoadTextRoutine(res, next) {
    dbStub.fiberEstablishConnection();
    corenlp.getAReachableConnection();
    corenlp.setupCorenlp(language);
    if (corenlp.positiveNlpStatus()) {
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

/**
 * Fiber main function that analyses the text input with corenlp and uploads it
 * to the database. Finally redirecting to the analysis route.
 * @param req
 * @param res
 * @param next
 */
function postLoadWrittenText(req, res, next) {
    if (corenlp.positiveNlpStatus()) {
        let text = req.body.textInput;
        if (!/\S/.test(text)) {
            res.renderVue('loadtext', vueRenderOptions);
        } else {
            //corenlp.setupCorenlp();
            //let parsedText = wait.for(corenlp.parse,text);
            let parsedResult = wait.for(corenlp.analyse, text);
            //let parsedResultSentence = wait.for(corenlp.analyseSentence, text);
            //console.log(notMedia + Tag + 'the parsedText from corenlp is: ' + JSON.stringify(parsedResult));
            //console.log(notMedia + Tag + 'the parsedTex Sentence from corenlp is: ' + JSON.stringify(parsedResult));
            let words = parsedResult.text;
            let title = '"' + req.body.title + '"';

            //Insert Statement to initiate a Document
            let documentInsertResult = wait.for(dbStub.makeSQLRequest,
                dbAction.createInsertCommand('documents', ['name'], [title], null, null));
            documentInsertResult = JSON.parse(documentInsertResult);
            //console.log('DocumentID is: ' + JSON.stringify(documentInsertResult) + ': '+ documentInsertResult.insertId);
            //Inserting Meta Info
            wait.for(sendSQL, dbAction.createInsertCommand(
                'text',
                ['docID', 'length', 'title'],
                [documentInsertResult.insertId, words.length, title],
                null, null));
            req.session.docID = documentInsertResult.insertId;
            req.session.lang = language;
            //TODO: check if word + NER Tag exists already

            let wordInsertResult = null;
            let counter = 0;
            for (let i = 0; i < words.length; i++) {
                for (let j = 0; j < words[i].length; j++) {
                    words[i][j] = stringifyForDB(words[i][j]);
                    parsedResult.ner[i][j] = stringifyForDB(parsedResult.ner[i][j]);
                    parsedResult.pos[i][j] = stringifyForDB(parsedResult.pos[i][j]);
                    parsedResult.offsetBegin[counter] = stringifyForDB(parsedResult.offsetBegin[counter]);
                    parsedResult.offsetEnd[counter] = stringifyForDB(parsedResult.offsetEnd[counter]);

                    wordInsertResult = wait.for(dbStub.makeSQLRequest, dbAction.createInsertCommand(
                        'word',
                        [
                            'content',
                            'isSpecial',
                            'semanticClass',
                            'pos'
                        ],[
                            words[i][j],
                            0,
                            parsedResult.ner[i][j],
                            parsedResult.pos[i][j]
                        ],
                        null, null));

                    wordInsertResult = JSON.parse(wordInsertResult);
                    wait.for(dbStub.makeSQLRequest, dbAction.createInsertCommand(
                        'textmap',
                        [
                            'wordID',
                            'docID',
                            'textIndex',
                            'beginOffSet',
                            'EndOffSet',
                            'whitespaceInfo'
                        ],[
                            wordInsertResult.insertId,
                            documentInsertResult.insertId,
                            counter,
                            parsedResult.offsetBegin[counter],
                            parsedResult.offsetEnd[counter],
                            '"-10"'
                        ],
                        null, null));
                    counter++;
                }

            }
            corenlp.resetResults();
            res.redirect('/analysis');
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

/**
 * Makes sure the Quotas " are set for each word in the sql query.
 * TODO: Get this function into db_Actions.js
 * @param input
 * @returns {string}
 */
function stringifyForDB(input) {
    return '"' + input + '"';
}


module.exports = router;