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
        scripts: [
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js'},
        ],
        styles: [
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-blue.min.css'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-blue.min.css'}
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
    //console.log('socket check');
    socket.on('setLanguage', function (language) {
        //console.log('socket check2 ' + language);
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
    req.vueOptions = vueRenderOptions;
    res.renderVue('loadtext.vue', vueData, req.vueOptions);
});


router.post('/loadDocument', function (req, res) {
    //TODO: Load & parse a loaded Document
});

router.post('/loadWrittenText', function (req, res) {
    console.log('Start loading Text');
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
            req.vueOptions = vueRenderOptions;
            res.renderVue('loadtext.vue', req.vueOptions);
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
            let firstTimeCheck = new Date();
            let deltaTime = firstTimeCheck.getTime();
            console.log('Starting analysing text');
            let parsedResult = wait.for(corenlp.analyse, text);
            console.log('Finished analysing text');
            let lastTimeCheck = new Date();
            console.log('Time corenlp analysis took: ' + (lastTimeCheck.getTime() - deltaTime) + ' ms');

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
            firstTimeCheck = new Date();
            deltaTime = firstTimeCheck.getTime();
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
            lastTimeCheck = new Date();
            console.log('Time setting up transaction with basis text took: ' + (lastTimeCheck.getTime() - deltaTime) + ' ms');
            firstTimeCheck = new Date();
            deltaTime = firstTimeCheck.getTime();
            transactionInformation = saveCoref(transactionInformation, counter);
            lastTimeCheck = new Date();
            console.log('Time setting up transaction with coref took: ' + (lastTimeCheck.getTime() - deltaTime) + ' ms');
            firstTimeCheck = new Date();
            deltaTime = firstTimeCheck.getTime();
            let transactionResults = dbStub.makeTransaction(transactionInformation);
            lastTimeCheck = new Date();
            console.log('Time executing transaction took: ' + (lastTimeCheck.getTime() - deltaTime) + ' ms');
            transactionResults[0].getProper = JSON.parse(transactionResults[0].getProper);
            req.session.docID = transactionResults[0].getProper.insertId;
            console.log('Finished uploading annotated Text to DB. redirecting to analysis');
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
        //console.log('Chain: ' + JSON.stringify(input.corefInfo[chain]) + typeof input.corefInfo[chain]);
        for (let mention in input.corefInfo[chain]) {
            //console.log('Mention: ' + JSON.stringify(input.corefInfo[chain][mention])
            // + input.corefInfo[chain][mention].isRepresentativeMention());
            input.corefInfo[chain][mention].startIndex = getCorefStartIndex(input, chain, mention);
            input.corefInfo[chain][mention].endIndex = getCorefEndIndex(input, chain, mention);

            if (input.corefInfo[chain][mention].isRepresentativeMention() || representativeIndex === -1) {
                //console.log('++++++++++Representative: ' + JSON.stringify(input.corefInfo[chain][mention]));
                input.querys.push('some Representative');
                input.transControl.useProper[input.querys.length - 1] = {
                    kindOfQuery: 'insert',
                    table: 'corefmentions',
                    columns: ['representative', 'gender', 'type', 'number', 'animacy', 'docID', 'startIndex', 'endIndex'],
                    values: [-1,
                        stringifyForDB(input.corefInfo[chain][mention].gender()),
                        stringifyForDB(input.corefInfo[chain][mention].type()),
                        stringifyForDB(input.corefInfo[chain][mention].number()),
                        stringifyForDB(input.corefInfo[chain][mention].animacy()),
                        -1,
                        stringifyForDB(input.corefInfo[chain][mention].startIndex),
                        stringifyForDB(input.corefInfo[chain][mention].endIndex)
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
                //console.log('----------nonRepresentative:' + JSON.stringify(input.corefInfo[chain][mention]));
                input.querys.push('Some Referent');
                if (representativeIndex !== -1) {
                    //console.log('Check2: '  + representativeIndex);
                    input.transControl.useProper[input.querys.length - 1] =
                        {
                            kindOfQuery: 'insert',
                            table: 'corefmentions',
                            columns: ['representative', 'gender', 'type', 'number', 'animacy', 'docID', 'startIndex', 'endIndex'],
                            values: [-1,
                                stringifyForDB(input.corefInfo[chain][mention].gender()),
                                stringifyForDB(input.corefInfo[chain][mention].type()),
                                stringifyForDB(input.corefInfo[chain][mention].number()),
                                stringifyForDB(input.corefInfo[chain][mention].animacy()),
                                -1,
                                stringifyForDB(input.corefInfo[chain][mention].startIndex),
                                stringifyForDB(input.corefInfo[chain][mention].endIndex)
                            ],
                            numberOfColumns: [0, 5],
                            ofResults: [representativeIndex, 0],
                            nameOfPropers: ['insertId', 'insertId'],
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

function addNestedInformation(input, chain, mention) {
    let tempMentions = [];
    try {
        for (let i = chain + 1; i < input.corefInfo.length; i++) {
            for (let j = mention; j < input.corefInfo[chain].length; i++) {
                tempMentions = testNestedity(input.corefInfo[chain][mention], input.corefInfo[i][j]);

            }
        }
    } catch (err) {
        //got out of Array
    }

}

function testNestedity(mention1, mention2) {
    let nestedInfo = 'nested';
    let inner = 'inner';
    let outer = 'outer';
    let first = 'first';
    let second = 'second';
    try {
        if (mention1.startIndex >= mention2.startIndex
            && mention1.startIndex <= mention2.endIndex) {
            if (mention1.endIndex <= mention2.endIndex) {
                // i Mention is in j Mention
                mention1[nestedInfo].push({inner: mention2});
                mention2[nestedInfo].push({outer: mention1});
            } else {
                // i Mention starts after j Mention starts
                mention1[nestedInfo].push({second: mention2});
                mention2[nestedInfo].push({first: mention1});

            }
        } else if (mention2.startIndex >= mention1.startIndex
            && mention2.startIndex <= mention1.endIndex) {
            if (mention2.endIndex <= mention1.endIndex) {
                // j Mention is in i Mention
                mention1[nestedInfo] = outer;
                mention2[nestedInfo] = inner;
            } else {
                // j Mention starts after i Mention starts
                mention1[nestedInfo] = first;
                mention2[nestedInfo] = second;
            }
        }
        return [mention1, mention2];
    } catch (err) {
        console.log('nested Chains Recognition failed:' + err);
        return [];
    }
}

function getCorefStartIndex(input, chain, mention) {
    let tempMention = input.corefInfo[chain][mention];
    let textLengthToMention = 0;
    for (let i = 0; i < tempMention.sentNum() - 1; i++) {
        textLengthToMention = textLengthToMention + input.words[i].length;
    }
    return textLengthToMention + tempMention.startIndex() - 1;
}

function getCorefEndIndex(input, chain, mention) {
    let tempMention = input.corefInfo[chain][mention];
    let textLengthToMention = 0;
    for (let i = 0; i < tempMention.sentNum() - 1; i++) {
        textLengthToMention = textLengthToMention + input.words[i].length;
    }
    return textLengthToMention + tempMention.endIndex() - 1;
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