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
let Tag = 'analyse.js: ';
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
    text: ''
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
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.0/mark.js'},
            {script: 'https://code.jquery.com/jquery-3.2.1.min.js'}
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
    lang: null
};

//--------------------------------------------------------
io.on('connection', function (socket) {
    socket.on('savewordnote', function (note, word, docID) {
        console.log(notMedia + Tag + 'Save Word Note: ' + note + word + ' docID:' + docID);
        wait.launchFiber(saveWordNote, note, word, docID);
    });
    socket.on('updatewordnote', function () {
        console.log(notMedia + Tag + 'update Word Note: ' + value);
        wait.launchFiber(function (note, word) {
            // wait.for(dbStub.makeSQLRequest(dbAction.createUpdateCommand('notes',)));
        });
    });
    socket.on('deletenote', function () {

    });

    socket.on('bignote', function () {
        console.log(notMedia + Tag + 'big Note: ' + value);
        wait.launchFiber(function (note, word) {
            // wait.for(dbStub.makeSQLRequest(dbAction.createInsertCommand('notes',)));
        });
    });
});

function saveWordNote(note, word, docID) {
    note = stringifyForDB(note);
    word = stringifyForDB(word);
    docID = stringifyForDB(docID);
    wait.for(dbStub.makeSQLRequest, dbAction.createInsertCommand('notes', ['docID', 'content', 'wordID'], [docID, note, '"440"'], null, null));
}


router.get('/', function (req, res, next) {
    dbStub.fiberEstablishConnection();
    wait.launchFiber(getAndShowText, req, res, next);
});

router.get('/a', function (req, res, next) {
    dbStub.fiberEstablishConnection();
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
    let docID = '';
    console.log(notMedia + Tag + 'Document Id from Session is: ' + req.session.docID);
    if (!isNaN(req.session.docID)) {
        let docID = req.session.docID;

        getTextFromDB(docID);
        //console.log(textDB.tokens);
        buildText();
        vueData.vueTokens = textDB.tokens;
        vueData.vueText = textDB.text;
        vueData.docID = String(docID);
        vueData.notes = getWordNotes(306);
        getTextMetaData(docID);
        vueData.meta = textDB.textMetaData;
        vueData.lang = req.session.lang;
        console.log(notMedia + Tag + 'Final Data sent to the client: ' + JSON.stringify(vueData));
    }
    resetTextDB();
    res.renderVue('analysis', vueData, vueRenderOptions);
}

/**
 * Naive way to filter the words of the set of tokens and stringify them.
 */
function buildText() {
    let gap = '';
    textDB.text = textDB.tokens[0].content;
    for (let i = 1; i < textDB.tokens.length; i++) {
        //textDB.words.push(textDB.tokens[i].content);
        console.log(textDB.tokens[i - 1]);
        gap = getWordGap(
            textDB.tokens[i - 1].offsetEnd,
            textDB.tokens[i].offsetBegin,
            textDB.tokens[i - 1].whitespaceInfo);
        textDB.text = textDB.text + gap + textDB.tokens[i].content;
    }
    console.log(notMedia + Tag + 'Builded Text: ' + textDB.text);
}

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
                'whitespaceInfo'
            ],
            [docID], ['='])));
    //console.log(notMedia + Tag + 'Result of selecting text in textmap: ' + JSON.stringify(textDB.textMap));
    for (let i = 0; i < textDB.textMap.length; i++) {
        if (textDB.textMap[i].textIndex === i) {
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
        } else {
            let err = new Error('Iteration is not synchronized with the counter attribute of the textMap.');
            textDB.error.push(err);
            break;
        }
    }
    //console.log(notMedia + Tag + 'the current Word List:' + JSON.stringify(textDB.tokens));
}

/**
 * Retrieves all wordnotes from DB
 * @param docID
 */
function getWordNotes(docID) {
    let tempWordNotes = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createSelectCommand('notes', ['docID', 'noteID', 'wordID', 'content'], [docID], ['='])));
    console.log(notMedia + Tag + 'Notes from DB: ' + JSON.stringify(tempWordNotes));
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
    console.log(notMedia + Tag + 'Metadata from DB: ' + JSON.stringify(textDB.textMetaData));
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
