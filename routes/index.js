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
let Tag = 'Server: index.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
const request = require('request');
const net = require('net');
//const server = net.createServer();
const dbAction = require('../modules/db_actions.js');
const dbStub = require('../modules/db_stub.js');
const wait = require('wait.for');
const jsonAction = require('../modules/json_actions');
const corenlp = require('../modules/corenlp');
const io = require('socket.io')(8091);
const fs = require("fs");
//const session = require('client-sessions');
//const isReachable = require('is-reachable');

var configData = JSON.parse(fs.readFileSync("./modules/config.json"));
if (configData.googleapikey === undefined || configData.googleapikey === "" || configData.googleapikey === "YOUR_GOOGLE_API_KEY") {
    console.error("WARNING: No Google API Key specified");
}

/**
 * Object that holds all specific meta info for this route.
 * @type {{head: {meta: [null,null,null,null]}}}
 */
let vueRenderOptions = {
    head: {
        meta: [
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-blue.min.css'},
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-blue.min.css'}
        ]
    }
};

let json2;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json2 = jsonAction.getJsonConfiguration();
    json2 = JSON.parse(json2);
}

let language = 'English';

let vueData = {
    lang: language
};

let allTextUploads = [];
let switchToNewUpload = true;
io.on('connection', function (socket) {
    socket.on('initupload', function (title) {
        console.log(Tag + 'Recieving upload Request. ');
        if (switchToNewUpload) {
            wait.launchFiber(initialisingTextUpload, socket, title);
            console.log(Tag + 'Accepting upload Request. ');
        } else {
            console.log(Tag + 'Declining upload Request. ');
        }

    });
    socket.on('uploadtextparts', function (docid, start, textpart) {
        let uploadindex = -1;
        //TODO: inflate compressed Text here if pako is implemented on the client.
        for (let i = 0; i < allTextUploads.length; i++) {
            if (allTextUploads[i].docid === docid) {
                uploadindex = i;
                break;
            }
        }
        if (uploadindex > -1) {
            allTextUploads[uploadindex].text = stringSplice(allTextUploads[uploadindex].text, start, 0, textpart);
            console.log(Tag + 'Uploaded: ' + docid + ' up to: ' + (start + textpart.length));
        } else {
            console.log(Tag + 'upload was issued before init of upload.');
        }
    });
    socket.on('endupload', function (docid) {
        console.log(Tag + 'Upload of: ' + docid + ' is finished. Start of analysis and storage');
        let uploadIndex = -1;
        for (let i = 0; i < allTextUploads.length; i++) {
            if (allTextUploads[i].docid === docid) {
                uploadIndex = i;
                break;
            }
        }
        //let firstTimeCheck = new Date();
        wait.launchFiber(loadWrittenText, socket, allTextUploads[uploadIndex], uploadIndex);
        //let lastTimeCheck = new Date();
        //console.log('Time setting up transaction took: ' + (lastTimeCheck.getTime() - firstTimeCheck.getTime()) + ' ms');
    });
});

function initialisingTextUpload(socket, title) {
    title = stringifyForDB(title);
    let documentInsertResult = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createInsertCommand('documents', ['name', 'userID', 'loadingStatus'], [title, 0, 0], null, null)));
    allTextUploads.push({docid: documentInsertResult.insertId, title: title, text: ''});
    socket.emit('resinitupload', documentInsertResult.insertId);
}

//https://stackoverflow.com/questions/111529/how-to-create-query-parameters-in-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
function encodeQueryData(data) {
    let ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}

function getLocationInformation(docID, textIndexes, name, upload) {
    if (name !== null) {
        let url = 'https://maps.googleapis.com/maps/api/geocode/json?';
        let params = {
            address: name,
            key: configData.googleapikey,
            format: "jsonp"
        };
        url = url + encodeQueryData(params);
        // console.log(url);
        request({
            url: url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (body.results !== undefined) {
                    if (body.results[0] !== undefined) {
                        if (body.results[0].geometry !== undefined) {
                            // console.log(Tag + "docID " + docID + " Google Geocoding API Query: " + name + " textids " + textIndexes + " location: " + JSON.stringify(body.results[0].geometry));
                            upload['lat'] = body.results[0].geometry.location.lat;
                            upload['lng'] = body.results[0].geometry.location.lng;
                            upload['northEastLat'] = body.results[0].geometry.viewport.northeast.lat;
                            upload['northEastLng'] = body.results[0].geometry.viewport.northeast.lng;
                            upload['southWestLat'] = body.results[0].geometry.viewport.southwest.lat;
                            upload['southwestLng'] = body.results[0].geometry.viewport.southwest.lng;
                            dbStub.makeSQLRequest(dbAction.createInsertCommand('researchedentities',
                                ['docID',
                                    'query',
                                    'semanticClass',
                                    'startIndex',
                                    'endIndex',
                                    'kgID',
                                    'lat', 'lng',
                                    'northEastLat', 'northEastLng',
                                    'southWestLat', 'southwestLng'],
                                [stringifyForDB(upload.docID),
                                    stringifyForDB(upload.query),
                                    stringifyForDB(upload.semanticClass),
                                    stringifyForDB(upload.startIndex),
                                    stringifyForDB(upload.endIndex),
                                    stringifyForDB(upload.kgID),
                                    stringifyForDB(upload.lat),
                                    stringifyForDB(upload.lng),
                                    stringifyForDB(upload.northEastLat),
                                    stringifyForDB(upload.northEastLng),
                                    stringifyForDB(upload.southWestLat),
                                    stringifyForDB(upload.southwestLng)],
                                null, null), function (err, response) {
                                if (err) {
                                    console.log(Tag + err);
                                } else {
                                    //console.log(Tag + JSON.stringify(response));
                                }
                            });

                        } else {
                            console.log('WARNING: Google Geocoding API not activated.');
                        }
                    }
                }
            }
        });
    }
}

function processSegement(docID, list) {
    let query = "";
    let textIndexes = [];
    let type = list[0].semanticClass;
    let researchUpload = {};
    for (let i = 0; i < list.length; i++) {
        textIndexes.push(list[i].textIndex);
        if (i !== 0) {
            query += " ";
        }
        query += list[i].content;
    }
    // console.log(Tag + "Google Query " + textIndexes + ": " + query);
    researchUpload['docID'] = docID;
    researchUpload['startIndex'] = textIndexes[0];
    researchUpload['endIndex'] = textIndexes[textIndexes.length - 1];
    researchUpload['query'] = query;
    researchUpload['semanticClass'] = type;
    let limit = 1;
    let url = 'https://kgsearch.googleapis.com/v1/entities:search?';
    let params = {
        'query': query,
        'limit': limit,
        'indent': true,
        'key': configData.googleapikey,
    };
    url = url + encodeQueryData(params);
    //console.log(url)
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        //console.log(Tag + 'Response StatusCode at processSegment' + error + response.statusCode);
        if (!error && response.statusCode === 200) {
            let name = null;
            try {
                if (body.itemListElement === undefined || body.itemListElement.length < 0) {
                    console.log(Tag + ' no GKG result for ' + query);
                } else {
                    let graphID = body.itemListElement[0].result["@id"];
                    researchUpload['kgID'] = graphID;
                    name = body.itemListElement[0].result["name"];
                    // console.log(Tag + "docID " + docID + " Google Knowledge-graph Query: " + query + " textids " + textIndexes + " @id: " + graphID + " entry: " + name);
                    if (type === "MISC" || type === "LOCATION" || type === "ORGANIZATION") {
                        getLocationInformation(docID, textIndexes, name, researchUpload);
                    } else {
                        dbStub.makeSQLRequest(dbAction.createInsertCommand('researchedentities',
                            ['docID',
                                'query',
                                'semanticClass',
                                'startIndex',
                                'endIndex',
                                'kgID',],
                            [stringifyForDB(researchUpload.docID),
                                stringifyForDB(researchUpload.query),
                                stringifyForDB(researchUpload.semanticClass),
                                stringifyForDB(researchUpload.startIndex),
                                stringifyForDB(researchUpload.endIndex),
                                stringifyForDB(researchUpload.kgID),
                            ],
                            null, null), function (err, response) {
                            if (err) {
                                console.log(Tag + err);
                            } else {
                                //console.log(Tag + JSON.stringify(response));
                            }
                        });
                    }
                }
            } catch (err) {
                console.log(Tag + 'the Result for ' + query + ' is undefined: ' + err);
            }
        } else {
            console.log(Tag + 'request to retrieve researched Entities failed: ' + response.statusCode + ': ' + error);
        }
    })
}


/**
 * Fiber main function that analyses the text input with corenlp and uploads it
 * to the database. Finally redirecting to the analysis route.
 * @param upload
 */
function loadWrittenText(socket, upload, uploadIndex) {
    if (corenlp.positiveNlpStatus()) {
        let originalText = upload.text;
        let transactionInformation = {
            querys: [],
            corefInfo: {},
            transControl: {
                docid: upload.docid,
                getProper: [],
                useProper: []
            },
            words: []
        };
        let firstTimeCheck = new Date();
        let deltaTime = firstTimeCheck.getTime();
        console.log(Tag + 'Starting analysing text');
        let parsedResult = wait.for(corenlp.analyse, originalText);
        console.log(Tag + 'Finished analysing text');
        let lastTimeCheck = new Date();
        console.log(Tag + 'Time corenlp analysis took: ' + (lastTimeCheck.getTime() - deltaTime) + ' ms');

        // console.log(JSON.stringify(parsedResult));
        transactionInformation.words = parsedResult.text;
        transactionInformation.corefInfo = parsedResult.coref;
        //Insert Statement to initiate a Document
        //transactionInformation.querys.push(dbAction.createInsertCommand('documents', ['name'], [title], null, null));
        let helpVariable = true;
        transactionInformation.transControl.getProper.push(helpVariable);
        transactionInformation.querys.push(dbAction.createUpdateCommand('documents',
            ['length', 'author', 'year', 'lang'],
            [transactionInformation.words.length, '"To Implement"', 2049, '"en"'],
            ['docID'], [upload.docid], ['=']));

        console.log(Tag + 'metaInfo uploaded');
        firstTimeCheck = new Date();

        let whitespace = 0;
        let counter = 0;
        //console.log(JSON.stringify(transactionInformation));
        for (let i = 0; i < transactionInformation.words.length; i++) {
            for (let j = 0; j < transactionInformation.words[i].length; j++) {

                if (parsedResult.pos[i][j] === "-LRB-" || parsedResult.pos[i][j] === "-RRB-") {
                    // special chars
                    if (transactionInformation.words[i][j] === "-LRB-") {
                        transactionInformation.words[i][j] = stringifyForDB("(");
                    } else if (transactionInformation.words[i][j] === "-RRB-") {
                        transactionInformation.words[i][j] = stringifyForDB(")");
                    } else if (transactionInformation.words[i][j] === "-LSB-") {
                        transactionInformation.words[i][j] = stringifyForDB("[");
                    } else if (transactionInformation.words[i][j] === "-RSB-") {
                        transactionInformation.words[i][j] = stringifyForDB("]");
                    } else if (transactionInformation.words[i][j] === "-LCB-") {
                        transactionInformation.words[i][j] = stringifyForDB("{");
                    } else if (transactionInformation.words[i][j] === "-RCB-") {
                        transactionInformation.words[i][j] = stringifyForDB("}");
                    } else {
                        transactionInformation.words[i][j] = stringifyForDB(transactionInformation.words[i][j]);
                    }
                } else {
                    transactionInformation.words[i][j] = stringifyForDB(transactionInformation.words[i][j]);
                }
                // console.log(JSON.stringify(transactionInformation.words[i]))
                parsedResult.ner[i][j] = stringifyForDB(parsedResult.ner[i][j]);
                parsedResult.pos[i][j] = stringifyForDB(parsedResult.pos[i][j]);
                whitespace = parsedResult.offsetBegin[counter + 1] - parsedResult.offsetEnd[counter];
                if (isNaN(whitespace)) {
                    whitespace = 0;
                }
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
                    columns: ['docID', 'wordID', 'textIndex', 'beginOffSet', 'EndOffSet', 'whitespaceInfo', 'afterspace'],
                    values: [-1, -1,
                        counter,
                        parsedResult.offsetBegin[counter],
                        parsedResult.offsetEnd[counter],
                        stringifyForDB(whitespace),
                        stringifyForDB(parsedResult.afters[counter])],
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
        console.log(Tag + 'Time setting up transaction with basis text took: ' + (lastTimeCheck.getTime() - firstTimeCheck.getTime()) + ' ms');
        firstTimeCheck = new Date();
        console.log(Tag + 'Preparing Coref');
        transactionInformation = saveCoref(transactionInformation);

        lastTimeCheck = new Date();
        console.log(Tag + 'Time setting up transaction with coref took: ' + (lastTimeCheck.getTime() - firstTimeCheck.getTime()) + ' ms');
        firstTimeCheck = new Date();
        console.log(Tag + 'making transaction');
        let transactionResults = dbStub.makeTransaction(transactionInformation);

        lastTimeCheck = new Date();
        console.log(Tag + 'Time executing transaction took: ' + (lastTimeCheck.getTime() - firstTimeCheck.getTime()) + ' ms');
        console.log(Tag + 'Finished uploading annotated Text to DB. redirecting to analysis');
        //Client should do the redirect. Thus Issue #79 must be solved on the client.
        let url = '/analysis/?docID=' + upload.docid;
        socket.emit('redirectToAnalysis', url);
        console.log(Tag + 'delete Upload from stack.');
        allTextUploads.splice(uploadIndex, 1);


        let queryObject = {
            tables: ['textmap', 'word'],
            columns: [
                {
                    tableIndex: 0,
                    name: 'docID',
                }, {
                    tableIndex: 0,
                    name: 'wordID',
                }, {
                    tableIndex: 0,
                    name: 'textIndex',
                }, {
                    tableIndex: 0,
                    name: 'beginOffSet',
                }, {
                    tableIndex: 0,
                    name: 'EndOffSet',
                }, {
                    tableIndex: 0,
                    name: 'whitespaceInfo',
                }, {
                    tableIndex: 1,
                    name: 'wordID',
                }, {
                    tableIndex: 1,
                    name: 'content',
                }, {
                    tableIndex: 1,
                    name: 'isSpecial',
                }, {
                    tableIndex: 1,
                    name: 'semanticClass',
                }, {
                    tableIndex: 1,
                    name: 'pos',
                },],
            joinConditions: [{
                columnIndexes: [1],
                valueColumnIndexes: [6],
                operator: ['='],
            }],
            kindOfJoin: ['INNER'],
            whereConditions: {
                columns: ['textmap.docID', 'word.semanticClass'],
                values: [upload.docid, stringifyForDB('O')],
                operators: ['=', '!='],
            }
        };
        //dbAction.createInnerJoinSelectCommand(queryObject);
        //console.log(Tag + 'Response for Inner Join: ' + wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject)));
        let wordInDB = JSON.parse(wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject, undefined, undefined)));
        //console.log(JSON.stringify(wordInDB));
        let last = 0;
        for (let i = 0; i < wordInDB.length; i++) {
            //console.log(i + ': ' + wordInDB[i].textIndex + " " + wordInDB[i].content);
            if (wordInDB[i].textIndex - wordInDB[last].textIndex !== i - last) {
                processSegement(upload.docid, wordInDB.slice(last, i));
                last = i;
            }
        }


        wait.for(dbStub.makeSQLRequest, dbAction.createUpdateCommand('documents',
            ['loadingStatus'],
            [1],
            ['docID'], [upload.docid], ['=']));

    } else {
        console.log(Tag + 'Corenlp Status is wrong');
    }
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
    console.log('Start loading Text');
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

/*function postLoadWrittenText(req, res, next) {
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

            transactionInformation.querys.push('...');
            transactionInformation.transControl.useProper[transactionInformation.querys.length - 1] = {
                kindOfQuery: 'insert',
                table: 'text',
                columns: ['docID', 'length', 'title', 'lang', 'author', 'year'],
                values: [-1,
                    transactionInformation.words.length,
                    title,
                    lang,
                    'To Implement',
                    2048
                ],
                numberOfColumns: [0],
                ofResults: [0],
                nameOfPropers: ['insertId'],
                toCompare: null,
                operators: null
            };
            
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
            transactionInformation = saveCoref(transactionInformation);
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
}*/

function saveCoref(input) {
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

/**
 * Author: Louis@https://stackoverflow.com/questions/20817618/is-there-a-splice-method-for-strings (Accepted Answer)
 * edit (Eric Hämmerle): name, typos
 * @param str
 * @param index
 * @param count
 * @param add
 * @returns {*}
 */
function stringSplice(str, index, count, add) {
    // We cannot pass negative indexes directly to the 2nd slicing operation.
    if (index < 0) {
        index = str.length + index;
        if (index < 0) {
            index = 0;
        }
    }
    return str.slice(0, index) + (add || "") + str.slice(index + count);
}

module.exports = router;