const express = require('express');
const router = express.Router();
const nlpPort = 4000;
//--------------------------------------------------------
/**
 * Tags for console Errors::
 * @type {string}
 */
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
            {script: '/javascripts/data_management.js'}
        ]
    }
};

let json2;
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
    corenlp.setupCorenlp();
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
            //console.log(Tag + 'the parsedText from corenlp is: ' + JSON.stringify(parsedResult));
            //console.log(Tag + 'the parsedTex Sentence from corenlp is: ' + JSON.stringify(parsedResult));
            //let words = uword(text);
            let words = parsedResult.text;
            let title = '"' + req.body.title + '"';

            let documentInsertResult = wait.for(dbStub.makeSQLRequest, dbAction.createInsertCommand('documents', ['name', 'userID', 'loadingStatus', 'length', 'title'], [title, 0, 0, 0 , words.length, title], null, null));
            documentInsertResult = JSON.parse(documentInsertResult);
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
            corenlp.resetResults(); 

            wait.for(dbStub.makeSQLRequest, dbAction.createUpdateCommand('documents', ['loadingStatus'], [1], ['docID'], [docID], ['=']));
            res.redirect('/analysis');
        }
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