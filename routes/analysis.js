const express = require('express');
const router = express.Router();
//--------------------------------------------------------
/**
 * Tags for console Errors::
 * @type {string}
 */
let desktop = 'desktop Version: ';
let mobile = 'Mobile Version: ';
let bigDesktop = 'Big Desktop Version: ';
let notMedia = 'Not Media-Related Part: ';
let Tag = 'Server: analyse.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
const dbStub = require('../modules/db_stub');
const dbAction = require('../modules/db_actions');
const wait = require('wait.for');
const io = require('socket.io')(8080);
const fs = require("fs");

/**
 * Object for temporal space.
 * @type {{words: Array, textMap: Array, textMetaData: Array, tokens: Array, error: Array, text: string}}
 */
let textDB = {
    words: [],
    textMap: [],
    textMetaData: [],
    tokens: [],
    error: [],
    text: '',
    coref: [],
    researchedEntities: []
};

/**
 * Object that holds all specific meta info for this route.
 * TODO: set title
 * @type {{head: {meta: [null,null,null,null]}}}
 */
let vueRenderOptions = {
    head: {
        meta: [
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js'},
            {script: 'https://code.jquery.com/jquery-3.3.1.min.js'},
            {script: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCILXEEId8MKt4qxS7V-XACNfyxUSgrdPk'},
            {style: 'https://fonts.googleapis.com/css?family=Roboto+Mono'}

        ]
    }
};
//{script: 'https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.0/mark.js'}, CDN for mark.js if npm package doesnt work
//{script: '/javascripts/mark.js'},
// {script: '/socket.io/socket.io.js'},

var configData = JSON.parse(fs.readFileSync("./modules/config.json"));
if (configData.googleapikey === undefined || configData.googleapikey === "" || configData.googleapikey === "YOUR_GOOGLE_API_KEY") {
    console.error("WARNING: No Google API Key specified");
}
/**
 * Vue data object to be set for this route.
 * @type {{vueText: null, vueTokens: null}}
 */
let vueData = {
    vueTokens: null,
    notes: null,
    docID: null,
    meta: null,
    title: configData.projecttitle,
    coref: null,
    researchedEntities: null,
    googleapikey: configData.googleapikey,
};

//--------------------------------------------------------
/**
 * Section for socket.io to listen on port 8080 for events from
 * the client that shouldnt reload the page. This happens especially
 * if writing, deleting or updating a note.
 */
io.on('connection', function (socket) {
    socket.on('savewordnote', function (note, docID, indexes) {
        //console.log(notMedia + Tag + 'Save Word Note: ' + note + ' docID: ' + docID + ' Indexes: ' + JSON.stringify(indexes));
        wait.launchFiber(saveWordNote, note, docID, indexes);
    });
    socket.on('updatewordnote', function (noteID, note) {
        //console.log(notMedia + Tag + 'update Word Note: ');
        wait.launchFiber(updateNote, noteID, note);
    });
    socket.on('deletenote', function (noteID) {
        wait.launchFiber(deleteNote, noteID);
    });
    socket.on('changeTitle', function (docID, newTitle) {
        //console.log(notMedia + Tag + 'update Document Title: ');
        wait.launchFiber(updateTitle, docID, newTitle);
    });

    socket.on('bignote', function () {
        //console.log(notMedia + Tag + 'big Note: ' + value);
        wait.launchFiber(function (note, word) {
            // wait.for(dbStub.makeSQLRequest(dbAction.createInsertCommand('notes',)));
        });
    });
    socket.on('saveresult', function (docID, indexes, researchresultID,) {
        //console.log('saved Result: ');
        wait.launchFiber(saveResult, docID, indexes, researchresultID,);
    });
    socket.on('changeClass', function (tokenToEdit, docID) {
        wait.launchFiber(changeClass, tokenToEdit, docID);
    });

    socket.on('getMoreText', function (docID, endIndex, pagesize) {
        wait.launchFiber(getMoreTextResponse, socket, {docID: docID, endIndex: endIndex, pagesize: pagesize});
    });
});

function getMoreTextResponse(socket, input) {
    let firstTimeCheck = new Date();
    let tokens = selectWithInnerJoin(input.docID, input.endIndex, input.pagesize);
    let lastTimeCheck = new Date();
    console.log(Tag + ' Sending  part of requested Document: ' + input.docID + ' at ' + input.endIndex + ' took: '
        + (lastTimeCheck.getTime() - firstTimeCheck.getTime()) + ' ms');
    //console.log(Tag + 'Content of part: ' + JSON.stringify(tokens));
    socket.emit('sendMoreText', tokens);
}

/**
 * Changes the title of a document on the DB.
 * @param docID
 * @param newTitle
 */
function updateTitle(docID, newTitle) {
    console.log('Changing title:' + docID + newTitle);
    docID = dbAction.stringifyForDB(docID);
    newTitle = dbAction.stringifyForDB(newTitle);
    wait.for(dbStub.makeSQLRequest, dbAction.createUpdateCommand('documents', ['name'], [newTitle], ['docID'], [docID], ['=']));
}

function saveResult(docID, indexes, researchresultID) {
    console.log("saveResult indexes: " + JSON.stringify(indexes));
    let firstTimeCheck = new Date();
    docID = stringifyForDB(docID);
    researchresultID = stringifyForDB(researchresultID);
    for (let i = 0; i < indexes.start.length; i++){
        let updateResult = wait.for(dbStub.makeSQLRequest,
            dbAction.createUpdateCommand('textmap',
                ['knowledgeGraphID'],
                [researchresultID],
                ['docID', 'textIndex', 'textIndex'],
                [docID, stringifyForDB(indexes.start[i]), stringifyForDB(indexes.end[i])],
                ['=', '>=', '<']));
        console.log(Tag + 'updated Word for: ' + docID + ' at ' + indexes.start[i] + ' to ' + indexes.end[i] + ' with a research Result.');
    }
    let lastTimeCheck = new Date();
    console.log('Time for transcation took: ' + (lastTimeCheck.getTime() - firstTimeCheck.getTime()) + ' ms');
}

/**
 * saves a note associated to a word on the Database.
 * @param note
 * @param word
 * @param docID
 */
function saveWordNote(note, docID, indexes) {
    note = stringifyForDB(note);
    docID = stringifyForDB(docID);
    indexes.start = stringifyForDB(indexes.start);
    indexes.end = stringifyForDB(indexes.end);
    let savedNote = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createInsertCommand('notes',
            ['docID', 'content', 'textIndex1', 'textIndex2'],
            [docID, note, indexes.start, indexes.end],
            null, null)));
}

function changeClass(tokenToEdit, docID) {
    docID = stringifyForDB(docID);
    let classUpdate = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createUpdateCommand('word',
            ['semanticClass'],
            [stringifyForDB(tokenToEdit.semanticClass)],
            ['wordID'],
            [stringifyForDB(tokenToEdit.wordID)],
            ['=']
        )));
}

/**
 * deletes a note associated to a word from the Database.
 * @param noteID
 */
function deleteNote(noteID) {
    noteID = stringifyForDB(noteID);
    wait.for(dbStub.makeSQLRequest, dbAction.createDeleteCommand('notes', ['noteID'], [noteID]));
}

/**
 * updates a note associated to a word on the Database.
 * @param noteID
 * @param note
 */
function updateNote(noteID, note) {
    noteID = stringifyForDB(noteID);
    note = stringifyForDB(note);
    wait.for(dbStub.makeSQLRequest, dbAction.createUpdateCommand('notes', ['content'], [note], ['noteID'], [noteID], ['=']));
}

router.get('/', function (req, res, next) {
    console.log(Tag + "loading document: " + (req.session.docID || req.query.docID));
    if (req.session.docID === undefined && req.query.docID === undefined) {
        console.log(Tag + 'Id of Document (docID) was not defined');
        res.redirect('/');
    } else {
        //dbStub.fiberEstablishConnection();
        wait.launchFiber(getAndShowText, req, res, next);
    }
});

router.get('/a', function (req, res, next) {
    //dbStub.fiberEstablishConnection();
    res.renderVue('analysis', vueData, vueRenderOptions);
});

router.post('/showText', function (req, res) {
    res.renderVue('analysis', vueData, vueRenderOptions);
});

router.post('/clearText', function (req, res) {
    res.redirect('/');
});


/**
 * Main Fiber function that gets all the text data from the Database and send them
 * into the vue that should render the .vue view.
 * @param req
 * @param res
 */
function getAndShowText(req, res) {
    let queryOperators = dbAction.getQueryOperators();
    console.log(Tag + 'Document Id from Session is: ' + req.session.docID + ' or: ' + req.query.docID);
    if (!isNaN(req.session.docID) || !isNaN(req.query.docID)) {
        let docID = (req.query.docID || req.session.docID);
        let firstTimeCheck = new Date();
        let deltaTime = firstTimeCheck.getTime();
        vueData.vueTokens = selectWithInnerJoin(docID, 0, 30);
        vueData.docID = String(docID);
        vueData.notes = getWordNotes(docID);
        getTextMetaData(docID);
        let lastTimeCheck = new Date();
        console.log('Time Join  took: ' + (lastTimeCheck.getTime() - deltaTime) + ' ms');
        vueData.meta = textDB.textMetaData;
        getCorefInfo(docID);
        getResearchedEntities2(docID);
        vueData.coref = textDB.coref;
        vueData.researchedEntities = textDB.researchedEntities
        //console.log('All corefs are: ' + JSON.stringify(vueData.coref));
        //console.log(notMedia + Tag + 'Final Data sent to the client: ' + JSON.stringify(vueData));
    }
    resetTextDB();
    console.log(Tag + 'Server sent text to /analysis');
    res.renderVue('analysis', vueData, vueRenderOptions);
}

function selectWithInnerJoin(docID, start, amount) {
    let tokens = [];
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
            columns: ['textmap.docID'],
            values: [docID,],
            operators: ['='],
        }
    };
    //dbAction.createInnerJoinSelectCommand(queryObject);
    //console.log(Tag + 'Response for Inner Join: ' + wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject, start, amount)));
    tokens = JSON.parse(wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject, start, amount)));
    return tokens;
}

function getResearchedEntities2(docID) {
    if (docID !== 'NULL' && docID !== null && typeof docID !== 'undefined') {
        let researched = JSON.parse(wait.for(dbStub.makeSQLRequest,
            dbAction.createSelectCommand('researchedentities',
                [
                    'docID',
                    'entityID',
                    'query',
                    'semanticClass',
                    'startIndex',
                    'endIndex',
                    'kgID',
                    'lat',
                    'lng',
                    'northEastLat',
                    'northEastLng',
                    'southWestLat',
                    'southWestLng'
                ], [docID], ['='])));
        //console.log(JSON.stringify(researched));
        textDB.researchedEntities = mapEntitiesToID(researched);
        //console.log(Tag + 'Researched Entities are: ' + JSON.stringify(textDB.researchedEntities));
    }
}


function mapEntitiesToID(researchedEntities) {
    let mappedEntities = {};
    for (let i = 0; i < researchedEntities.length; i++) {
        let key = [researchedEntities[i].kgID, researchedEntities[i].semanticClass];
        if (key in mappedEntities) {
            mappedEntities[key].freq += 1
            mappedEntities[key].entityID.push(researchedEntities[i].entityID);
            mappedEntities[key].startIndex.push(researchedEntities[i].startIndex);
            mappedEntities[key].endIndex.push(researchedEntities[i].endIndex);
            mappedEntities[key].query.push(researchedEntities[i].query);
        } else {
            let obj = {
                freq: 1,
                entityID: [researchedEntities[i].entityID],
                startIndex: [researchedEntities[i].startIndex],
                endIndex: [researchedEntities[i].endIndex],
                query: [researchedEntities[i].query],
                semanticClass: researchedEntities[i].semanticClass,
                docID: researchedEntities[i].docID,
                kgID: researchedEntities[i].kgID,
                lat: researchedEntities[i].lat,
                lng: researchedEntities[i].lng,
                northEastLat: researchedEntities[i].northEastLat,
                northEastLng: researchedEntities[i].northEastLng,
                southWestLat: researchedEntities[i].southWestLat,
                southWestLng: researchedEntities[i].southWestLng,
                textindexes: []

            }
            mappedEntities[key] = obj;
        }
    }

    //console.log(JSON.stringify(mappedEntities));
    let arr = Object.keys(mappedEntities).map(function(key){
        return mappedEntities[key];
    });

    for (let i = 0; i < arr.length; i++) {
        for (let k = 0;k < arr[i].startIndex.length; k++) {
            for (let j = arr[i].startIndex[k]; j <= arr[i].endIndex[k]; j++) {
                if (j - 1 > 0) {
                    arr[i].textindexes.push(j);
                }
            }
        }
        arr[i].textindexes = arr[i].textindexes.sort((a, b) => a - b);
    }
    return arr;

    /*for (let i = 0; i < researchedEntities.length - 1; i++) {
        mappedEntities.push({
            kgID: researchedEntities[i].kgID,
            entities: [researchedEntities[i]],
            freq: 1
        });
        for (let j = i + 1; j < researchedEntities.length; j++) {
            if (mappedEntities[i].kgID === researchedEntities[j].kgID) {
                mappedEntities[i].entities.push(researchedEntities[j]);
                mappedEntities[i].freq++;
                researchedEntities.splice(j, 1);
            }
        }
    }*/
}

function getCorefs(docID, start, amount) {
    let queryObject = {
        tables: ['textmap', 'corefmentions', 'nestedcorefs'],
        columns: [
            {
                tableIndex: 0,
                name: 'docID',
            }, {
                tableIndex: 0,
                name: 'textIndex',
            }, {
                tableIndex: 1,
                name: 'docID',
                alias: 'corefdocID'
            }, {
                tableIndex: 1,
                name: 'mentionID',
            }, {
                tableIndex: 1,
                name: 'representative',
            }, {
                tableIndex: 1,
                name: 'gender',
            }, {
                tableIndex: 1,
                name: 'type',
            }, {
                tableIndex: 1,
                name: 'number',
            }, {
                tableIndex: 1,
                name: 'animacy',
            }, {
                tableIndex: 1,
                name: 'startIndex',
            }, {
                tableIndex: 1,
                name: 'endIndex',
            }, {
                tableIndex: 2,
                name: 'docID',
                alias: 'nesteddocId'
            }, {
                tableIndex: 2,
                name: 'mentionID',
                alias: 'nestedMentionID'
            }, {
                tableIndex: 2,
                name: 'kind',
            }, {
                tableIndex: 2,
                name: 'relatedMention',
            }],
        joinConditions: [{
            columnIndexes: [0, 1, 1],
            valueColumnIndexes: [2, 9, 10],
            operator: ['=', '>=', '<'],
        }, {
            columnIndexes: [3],
            valueColumnIndexes: [12],
            operator: ['='],
        }],
        kindOfJoin: ['INNER', 'LEFT'],
        whereConditions: {
            columns: ['textmap.docID', 'textmap.textIndex', 'textmap.textIndex'],
            values: [docID, start, start + amount],
            operators: ['=', '>=', '<='],
        }
    };
    //console.log(Tag + 'Coref Query: ' + dbAction.createInnerJoinSelectCommand(queryObject));
    //console.log(Tag + 'Response for Inner Join COREF: ' + wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject)));
    return JSON.parse(wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject)));
}

function getCorefInfo(docID) {
    if (docID !== 'NULL' && docID !== null && typeof docID !== 'undefined') {
        let mention = JSON.parse(wait.for(dbStub.makeSQLRequest,
            dbAction.createSelectCommand('corefmentions',
                [
                    'docID',
                    'mentionID',
                    'representative',
                    'gender',
                    'type',
                    'number',
                    'animacy',
                    'startIndex',
                    'endIndex'
                ], [docID], ['='])));
        textDB.coref = mention;
        //console.log('Mention from db: ' + JSON.stringify(textDB.coref));
    }
}

/**
 * Retrieves all wordnotes from DB
 * @param docID
 */
function getWordNotes(docID) {
    let tempWordNotes = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createSelectCommand('notes', ['docID', 'noteID', 'content', 'textIndex1', 'textIndex2'], [docID], ['='])));
    //console.log(notMedia + Tag + 'Notes from DB: ' + JSON.stringify(tempWordNotes));
    return tempWordNotes;
}

/**
 * Should get the Meta-Data from a specified text by ID.
 * Results depend on Database.
 * @param docID
 */
function getTextMetaData(docID) {
    textDB.textMetaData = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createSelectCommand('documents', ['docID', 'name', 'length', 'author', 'year'], [docID], ['='])));
    //console.log(notMedia + Tag + 'Metadata from DB: ' + JSON.stringify(textDB.textMetaData));
    if (textDB.textMetaData.length > 0 && textDB.textMetaData[0].name.length > 0) {
        vueData.title = textDB.textMetaData[0].name;
    } else {
        vueData.title = configData.projecttitle;
    }
}

/**
 * resets the textDB Object to default values.
 */
function resetTextDB() {
    textDB.error = [];
    textDB.text = '';
    textDB.textMap = [];
    textDB.tokens = [];
    textDB.words = [];
    textDB.textMetaData = [];
    textDB.coref = [];
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
 * search Algorithm to find a specific token based on the property
 * you base the search on. value is the value you look for.
 * This will only work if the tokens are sorted based on this property.
 * E.g. property content wont work.
 * @param tokens
 * @param property
 * @param value
 */
function binaryTokensSearch(tokens, property, value) {
    let left = 0;
    let right = tokens.length - 1;
    let middle = 0;
    //console.log('Search started with: tokens = ' + JSON.stringify(tokens) + ' property = ' + property + ' value = ' + value);
    while (left <= right) {
        middle = Math.trunc(left + ((right - left) / 2));
        //console.log('Start Loop with middle = ' + middle);
        //console.log('token = ' + tokens[middle][property] + ' =? ' + value);
        if (tokens[middle][property] === value) {
            return middle;
        } else {
            if (tokens[middle][property] > value) {
                right = middle - 1;
            } else {
                left = middle + 1;
            }
        }
    }
    return -1;
}

/**
 * Naive way to filter the words of the set of tokens and stringify them.
 */
function buildText() {
    let gap = '';
    let text = '<span class="' + textDB.tokens[0].semanticClass + '">' + textDB.tokens[0].content + '</span>';
    for (let i = 1; i < textDB.tokens.length; i++) {
        //textDB.words.push(textDB.tokens[i].content);
        //console.log(textDB.tokens[i - 1]);
        gap = getWordGap(
            textDB.tokens[i - 1].offsetEnd,
            textDB.tokens[i].offsetBegin,
            textDB.tokens[i - 1].whitespaceInfo);
        text = text
            + '<span v-bind:class="{gap: true}">'
            + gap
            + '</span>'
            + '<span v-bind:class="{' + textDB.tokens[i].semanticClass + ':classesToMark.' + textDB.tokens[i].semanticClass + '}">'
            + textDB.tokens[i].content
            + '</span>'
        ;
    }
    text = encodeURI(text);
    //console.log(notMedia + Tag + 'Builded Text: ' + text);
    return text;
}

/**
 * Determines the kind and length of a gap between the words for rebuilding a text.
 * @param word1OffsetEnd
 * @param word2OffsetBegin
 * @param whitespaceInfo
 * @returns {string}
 */
function getWordGap(word1OffsetEnd, word2OffsetBegin, whitespaceInfo) {
    //default Setting: 1 space * difference between Offsets
    let gap = '';
    if (whitespaceInfo === -10) {
        let dist = word2OffsetBegin - word1OffsetEnd;
        //console.log(notMedia + Tag + 'Distance: ' + dist + ' ' + word1OffsetEnd + ' ' + word2OffsetBegin);
        for (let i = 0; i < word2OffsetBegin - word1OffsetEnd; i++) {
            gap = gap + ' ';
        }
    }
    return gap;
}

module.exports = router;
