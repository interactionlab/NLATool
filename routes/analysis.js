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
    coref: []
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
            {script: 'https://code.jquery.com/jquery-3.2.1.min.js'},
            {script: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCILXEEId8MKt4qxS7V-XACNfyxUSgrdPk'},
            {style: 'https://fonts.googleapis.com/css?family=Roboto+Mono'}

        ]
    }
};
//{script: 'https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.0/mark.js'}, CDN for mark.js if npm package doesnt work
//{script: '/javascripts/mark.js'},
// {script: '/socket.io/socket.io.js'},

/**
 * Vue data object to be set for this route.
 * @type {{vueText: null, vueTokens: null}}
 */
let vueData = {
    vueText: null,
    vueTokens: null,
    notes: null,
    docID: 293,
    meta: null,
    title: 'NLA - Natural Language Analyse Tool',
    coref: null
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
    let tokens = selectWithInnerJoin(input.docID, input.endIndex, input.pagesize);
    console.log(Tag + ' Sending  part of requested Document: ' + input.docID + ' at ' + input.endIndex);
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
    wait.for(dbStub.makeSQLRequest, dbAction.createUpdateCommand('text', ['title'], [newTitle], ['docID'], [docID], ['=']));
}

function saveResult(docID, indexes, researchresultID,) {
    docID = stringifyForDB(docID);
    researchresultID = stringifyForDB(researchresultID);
    let updateResult = wait.for(dbStub.makeSQLRequest,
        dbAction.createUpdateCommand('textmap',
            ['knowledgeGraphID'],
            [researchresultID],
            ['docID', 'textIndex', 'textIndex'],
            [docID, stringifyForDB(indexes.start), stringifyForDB(indexes.end)],
            ['=', '>=', '<']));
    console.log(Tag + 'updated Word with a research Result: ' + updateResult);
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

        //getTextFromDB(docID);
        //console.log(textDB.tokens);
        //vueData.vueTokens = textDB.tokens;
        //vueData.vueText = buildText();
        vueData.docID = String(docID);
        vueData.notes = getWordNotes(docID);
        getTextMetaData(docID);
        let lastTimeCheck = new Date();
        console.log('Time Join  took: ' + (lastTimeCheck.getTime() - deltaTime) + ' ms');
        //getCorefInfo(docID);
        vueData.meta = textDB.textMetaData;
        //vueData.coref = textDB.coref;
        console.log(notMedia + Tag + 'Final Data sent to the client: ' + JSON.stringify(vueData));
    }
    resetTextDB();
    console.log(Tag + 'Server sent text to /analysis');
    res.renderVue('analysis', vueData, vueRenderOptions);
}

/**
 * Gets all the tokens of the uploaded text and fills the textDB Object with them for
 * later use.
 * @param docID
 */
function getTextFromDB(docID) {
    textDB.textMap = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createSelectCommand('textmap',
            [
                'docID',
                'wordID',
                'textIndex',
                'beginOffSet',
                'EndOffSet',
                'whitespaceInfo',
            ],
            [docID], ['='])));
    //console.log(notMedia + Tag + 'Result of selecting text in textmap: ' + JSON.stringify(textDB.textMap));
    for (let i = 0; i < textDB.textMap.length; i++) {
        if (textDB.textMap[i].textIndex === i) {
            try {
                let word = JSON.parse(wait.for(dbStub.makeSQLRequest,
                    dbAction.createSelectCommand('word',
                        [
                            'wordID',
                            'content',
                            'isSpecial',
                            'semanticClass',
                            'pos'
                        ],
                        [textDB.textMap[i].wordID], ['='])));
                word[0]['offsetBegin'] = textDB.textMap[i].beginOffSet;
                word[0]['offsetEnd'] = textDB.textMap[i].EndOffSet;
                word[0]['whitespaceInfo'] = textDB.textMap[i].whitespaceInfo;
                //console.log(JSON.stringify(word));
                textDB.tokens.push(word[0]);
            } catch (err) {
                console.log('Loading Text form DB failed: ' + err);
            }
        } else {
            let err = new Error('Iteration is not synchronized with the counter attribute of the textMap.');
            textDB.error.push(err);
            break;
        }
    }
    //console.log(notMedia + Tag '+ 'the current Word List:' + JSON.stringify(textDB.tokens));
}

function selectWithInnerJoin(docID, start, amount) {
    let tokens = [];
    let queryObject = {
        tables: ['textmap', 'word'],
        columns: [{
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
            tableIndex: 0,
            name: 'knowledgeGraphID',
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
            valueColumnIndexes: [7],
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
    //console.log(Tag + 'Response for Inner Join: ' + wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject)));
    tokens = JSON.parse(wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject, start, amount)));
    let corefs = getCorefs(docID, start, amount);
    for (let i = 0; i < tokens.length - 1; i++) {
        for (let j = 0; j < corefs.length; j++) {
            //console.log('Word: ' + vueData.vueTokens[i].content + ':' + vueData.vueTokens[i].textIndex + ' = ' + corefs[j].textIndex);
            if (tokens[i].textIndex === corefs[j].textIndex) {
                if (typeof  tokens[i].coref === 'undefined') {
                    tokens[i]['coref'] = [];
                }
                tokens[i]['coref'].push({
                    mentionID: corefs[j].mentionID,
                    representative: corefs[j].representative,
                    gender: corefs[j].gender,
                    type: corefs[j].type,
                    number: corefs[j].number,
                    animacy: corefs[j].animacy,
                    startIndex: corefs[j].startIndex,
                    endIndex: corefs[j].endIndex,
                    kind: corefs[j].kind,
                    relatedMention: corefs[j].relatedMention
                });
            }
        }
    }
    return tokens;
}

function getCorefs(docID, start, amount) {
    let queryObject = {
        tables: ['textmap', 'corefmentions', 'nestedcorefs'],
        columns: [{
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
            columns: ['textmap.docID'],
            values: [docID],
            operators: ['='],
        }
    };
    // console.log(Tag + 'Response for Inner Join COREF: ' + wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject)));
    return JSON.parse(wait.for(dbStub.makeSQLRequest, dbAction.createInnerJoinSelectCommand(queryObject, start, amount)));
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
        textDB.coref.push(mention);
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
        dbAction.createSelectCommand('text', ['docID', 'title', 'length', 'author', 'year'], [docID], ['='])));
    //console.log(notMedia + Tag + 'Metadata from DB: ' + JSON.stringify(textDB.textMetaData));
    if (textDB.textMetaData.length > 0 && textDB.textMetaData[0].title.length > 0) {
        vueData.title = textDB.textMetaData[0].title;
    } else {
        vueData.title = 'NLA - Natural Language Analyse Tool';
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
