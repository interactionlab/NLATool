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
const wait = require('wait.for');
const jsonAction = require('../modules/json_actions');
const corenlp = require('../modules/corenlp');
const io = require('socket.io')(8090);
//const session = require('client-sessions');
//const isReachable = require('is-reachable');

/**
 * Object that holds all specific meta info for this route.
 * @type {{head: {meta: [null,null,null,null]}}}
 */
let vueRenderOptions = {
    head: {
        meta: [
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-blue.min.css'},
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-green.min.css'}
        ]
    }
};

let results = [];
let json2;


let language = 'English';

let vueData = {
    lang: language
};

io.on('connection', function (socket) {
    console.log('socket check');
    socket.on('setLanguage', function (language) {
        console.log('socket check2 ' + language);
        corenlp.resetPipeline(language);
        this.language = language;
    });
});

wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json2 = jsonAction.getJsonConfiguration();
    json2 = JSON.parse(json2);
}

router.get('/', function (req, res, next) {

    wait.launchFiber(getLoadTextRoutine, req, res, next);
    //let vueData = setVueData();
    res.renderVue('loadtext', vueData, vueRenderOptions);
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
            let transactionInformation = {
                querys: [],
                corefInfo: {},
                transControl: {
                    getProper: [],
                    useProper: []
                },
                words: []
            };
            let parsedResult = wait.for(corenlp.analyse, text);
            transactionInformation.words = parsedResult.text;
            let title = stringifyForDB(req.body.title);
            let lang = stringifyForDB(language);
            transactionInformation.corefInfo = parsedResult.coref;
            //Insert Statement to initiate a Document
            transactionInformation.querys.push(dbAction.createInsertCommand('documents', ['name'], [title], null, null));
            let helpVariable = true;
            transactionInformation.transControl.getProper.push(helpVariable);

            //-------------------------------------------------------------------------------------!
            /* let documentInsertResult = wait.for(dbStub.makeSQLRequest,
                 dbAction.createInsertCommand('documents', ['name'], [title], null, null));
             documentInsertResult = JSON.parse(documentInsertResult);*/
            //console.log('DocumentID is: ' + JSON.stringify(documentInsertResult) + ': '+ documentInsertResult.insertId);
            //Inserting Meta Info
            //TODO: make sure German is selected in database, change the button design first
            //-------------------------------------------------------------------------------------
            transactionInformation.querys.push('...');
            transactionInformation.transControl.useProper[transactionInformation.querys.length - 1] = {
                kindOfQuery: 'insert',
                table: 'text',
                columns: ['docID', 'length', 'title', 'lang'],
                values: [-1,
                    transactionInformation.words.length,
                    title,
                    lang],
                numberOfColumns: [0],
                ofResults: [0],
                nameOfPropers: ['insertId'],
                toCompare: null,
                operators: null
            };
            //-------------------------------------------------------------------------------------!
            /*wait.for(sendSQL, dbAction.createInsertCommand(
                'text',
                ['docID', 'length', 'title', 'lang'],
                [documentInsertResult.insertId, words.length, title, lang],
                null, null));*/
            //-------------------------------------------------------------------------------------

            //req.session.docID = documentInsertResult.insertId;
            req.session.lang = language;
            //TODO: check if word + NER Tag exists already
            let wordInsertResult = null;
            let counter = 0;
            for (let i = 0; i < transactionInformation.words.length; i++) {
                for (let j = 0; j < transactionInformation.words[i].length; j++) {
                    transactionInformation.words[i][j] = stringifyForDB(transactionInformation.words[i][j]);
                    parsedResult.ner[i][j] = stringifyForDB(parsedResult.ner[i][j]);
                    parsedResult.pos[i][j] = stringifyForDB(parsedResult.pos[i][j]);
                    parsedResult.offsetBegin[counter] = stringifyForDB(parsedResult.offsetBegin[counter]);
                    parsedResult.offsetEnd[counter] = stringifyForDB(parsedResult.offsetEnd[counter]);

                    transactionInformation.querys.push(dbAction.createInsertCommand(
                        'word',
                        [
                            'content',
                            'isSpecial',
                            'semanticClass',
                            'pos'
                        ], [
                            transactionInformation.words[i][j],
                            0,
                            parsedResult.ner[i][j],
                            parsedResult.pos[i][j]
                        ],
                        null, null));
                    transactionInformation.transControl.getProper[transactionInformation.querys.length - 1] = true;
                    transactionInformation.querys.push('...?');
                    transactionInformation.transControl.useProper[transactionInformation.querys.length - 1] = {
                        kindOfQuery: 'insert',
                        table: 'textmap',
                        columns: ['docID', 'wordID', 'textIndex', 'beginOffSet', 'EndOffSet', 'whitespaceInfo'],
                        values: [-1, -1,
                            counter,
                            parsedResult.offsetBegin[counter],
                            parsedResult.offsetEnd[counter],
                            '"-10"'],
                        numberOfColumns: [0, 1],
                        ofResults: [0, transactionInformation.querys.length - 2],
                        nameOfPropers: ['insertId', 'insertId'],
                        toCompare: null,
                        operators: null
                    };
                    counter++;
                }
            }
            transactionInformation = saveCoref(transactionInformation, counter);
            let transactionResults = dbStub.makeTransaction(transactionInformation);
            transactionResults[0].getProper = JSON.parse(transactionResults[0].getProper);
            req.session.docID = transactionResults[0].getProper.insertId;
            res.redirect('/analysis');
        }
    }
}

function saveCoref(input, counter) {
    let queryCounter = input.querys.length - 1;
    //console.log('Checkpoint coref 1:' + queryCounter);
    let representativeIndex = -1;
    let startIndex = 0;
    let endIndex = 0;
    for (let chain in input.corefInfo) {
        console.log('Chain: ' + JSON.stringify(input.corefInfo[chain]) + typeof input.corefInfo[chain]);
        for (let mention in input.corefInfo[chain]) {
            //console.log('Mention: ' + JSON.stringify(input.corefInfo[chain][mention]) + input.corefInfo[chain][mention].isRepresentativeMention());
            if (input.corefInfo[chain][mention].isRepresentativeMention()) {
                //console.log('++++++++++Representative: ' + JSON.stringify(input.corefInfo[chain][mention]));
                startIndex = getCorefStartIndex(input, chain, mention);
                endIndex = getCorefEndIndex(input, chain, mention);
                input.querys.push('some Representative');
                input.transControl.useProper[input.querys.length - 1] ={
                    kindOfQuery: 'insert',
                    table: 'corefmentions',
                    columns: ['representative', 'gender', 'type', 'number', 'animacy','docID','startIndex','endIndex'],
                    values: [-1,
                        stringifyForDB(input.corefInfo[chain][mention].gender()),
                        stringifyForDB(input.corefInfo[chain][mention].type()),
                        stringifyForDB(input.corefInfo[chain][mention].number()),
                        stringifyForDB(input.corefInfo[chain][mention].animacy()),
                        -1,
                        startIndex,
                        endIndex
                    ],
                    numberOfColumns: [5],
                    ofResults: [0],
                    nameOfPropers: ['insertId'],
                    getProper: true,
                    toCompare: null,
                    operators: null
                };
                representativeIndex = input.querys.length - 1;
                //console.log('Check1: ' + representativeIndex);
            } else {
                console.log('----------nonRepresentative:' + JSON.stringify(input.corefInfo[chain][mention]));
                input.querys.push('Some Referent');
                if (representativeIndex !== -1) {
                    //console.log('Check2: '  + representativeIndex);
                    startIndex = getCorefStartIndex(input, chain, mention);
                    endIndex = getCorefEndIndex(input, chain, mention);
                    input.transControl.useProper[input.querys.length - 1] =
                        {
                            kindOfQuery: 'insert',
                            table: 'corefmentions',
                            columns: ['representative', 'gender', 'type', 'number', 'animacy','docID','startIndex','endIndex'],
                            values: [-1,
                                stringifyForDB(input.corefInfo[chain][mention].gender()),
                                stringifyForDB(input.corefInfo[chain][mention].type()),
                                stringifyForDB(input.corefInfo[chain][mention].number()),
                                stringifyForDB(input.corefInfo[chain][mention].animacy()),
                                -1,
                                startIndex,
                                endIndex
                            ],
                            numberOfColumns: [0,5],
                            ofResults: [representativeIndex,0],
                            nameOfPropers: ['insertId','insertId'],
                            getProper: true,
                            toCompare: null,
                            operators: null
                        };

                } else {
                    console.log('ERROR: representativeIndex = -1 -> Representative wasnt uploaded!');
                }
            }
        }
    }
    return input;
}

function addNestedInformation (coref){
    let nestedMentions = {
        fullyNested: [],
        nested: []
    };
    try {
        for (let i = 0; i < coref[0].length; i++) {
            for (let j = i + 1; j < coref[0].length - (i + 1); j++) {
                if (coref[0][i].startIndex >= coref[0][j].startIndex
                    && coref[0][i].startIndex <= coref[0][j].endIndex) {
                    if (coref[0][i].endIndex <= coref[0][j].endIndex) {
                        // i Mention is in j Mention
                        nestedMentions.fullyNested.push({
                            inner: coref[0][i].mentionID,
                            outer: coref[0][j].mentionID
                        });
                    } else {
                        // i Mention starts after j Mention starts
                        nestedMentions.nested.push({
                            first: coref[0][j].mentionID,
                            second: coref[0][i].mentionID
                        });
                    }
                } else if (coref[0][j].startIndex >= coref[0][i].startIndex
                    && coref[0][j].startIndex <= coref[0][i].endIndex) {
                    if (coref[0][j].endIndex <= coref[0][i].endIndex) {
                        // j Mention is in i Mention
                        nestedMentions.fullyNested.push({
                            inner: coref[0][j].mentionID,
                            outer: coref[0][i].mentionID
                        });
                    } else {
                        // j Mention starts after i Mention starts
                        nestedMentions.nested.push({
                            first: coref[0][i].mentionID,
                            second: coref[0][j].mentionID
                        });
                    }
                }
            }
        }
        return nestedMentions;
    }
    catch
        (err) {
        console.log('nested Chains Recognition failed:' + err);
        return nestedMentions;
    }

}

function getCorefStartIndex(input, chain, mention) {
    let tempMention = input.corefInfo[chain][mention];
    let textLengthToMention = 0;
    for (let i = 0; i < tempMention.sentNum()-1; i++) {
        textLengthToMention = textLengthToMention + input.words[i].length;
    }
    return stringifyForDB(textLengthToMention + tempMention.startIndex() - 1);
}
function getCorefEndIndex(input, chain, mention) {
    let tempMention = input.corefInfo[chain][mention];
    let textLengthToMention = 0;
    for (let i = 0; i < tempMention.sentNum()-1; i++) {
        textLengthToMention = textLengthToMention + input.words[i].length;
    }
    return stringifyForDB(textLengthToMention + tempMention.endIndex() - 1);
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