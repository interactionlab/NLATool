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
            {script: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js'},
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js'},
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.0/mark.js'},

            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-orange.min.css'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-orange.min.css'}
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
    docID: 293,
    notes: null
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
        filterWordList();
        vueData.vueTokens = textDB.tokens;
        vueData.vueText = textDB.text;
        vueData.docID = String(docID);
        vueData.notes = getWordNotes(306);
        console.log(notMedia + Tag + 'Final Data sent to the client: ' + JSON.stringify(vueData));
    }
    resetTextDB();
    res.renderVue('analysis', vueData, vueRenderOptions);
}

/**
 * Naive way to filter the words of the set of tokens and stringify them.
 */
function filterWordList() {
    for (let i = 0; i < textDB.tokens.length; i++) {
        textDB.words.push(textDB.tokens[i].content);
        textDB.text = textDB.text + ' ' + textDB.tokens[i].content;
    }
}

/**
 * Gets all the tokens of the uploaded text and fills the textDB Object with them for
 * later use.
 * @param docID
 */
function getTextFromDB(docID) {
    textDB.textMap = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createSelectCommand('textmap', ['docID', 'wordID', 'textIndex'], [docID], ['='])));
    console.log(notMedia + Tag + 'Result of selecting text in textmap: ' + JSON.stringify(textDB.textMap));
    for (let i = 0; i < textDB.textMap.length; i++) {
        if (textDB.textMap[i].textIndex === i) {
            let word = wait.for(dbStub.makeSQLRequest,
                dbAction.createSelectCommand('word',
                    ['wordID', 'content', 'isSpecial', 'semanticClass', 'pos'],
                    [textDB.textMap[i].wordID], ['=']));
            textDB.tokens.push(JSON.parse(word)[0]);
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
        dbAction.createSelectCommand('notes', ['docID', 'noteID', 'content'], [docID], ['='])));
    console.log(notMedia + Tag + 'Notes from DB: ' + JSON.stringify(tempWordNotes));
    return tempWordNotes;
}

/**
 * Should get the Meta-Data from a specified text by ID.
 * Results depend on Database.
 * @param docID
 */
function getTextMetaData(docID) {
    textDB.textMetaData = wait.for(dbStub.makeSQLRequest,
        dbAction.createSelectCommand('text', ['docID', 'length', 'title', 'author', 'year'], [docID], ['=']));
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
