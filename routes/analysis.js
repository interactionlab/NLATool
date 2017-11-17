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

let textDB = {
    textMap: [],
    textMetaData: [],
    wordList: [],
    error: []
};
let vueRenderOptions = {
    head: {
        meta: [
            {script: '/javascripts/ui_functions.js'},
            {script: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-orange.min.css'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-orange.min.css'}

        ]
    }
};

let vueData = {
    result: null
};

router.get('/', function (req, res, next) {
    dbStub.fiberEstablishConnection();
    wait.launchFiber(getAndShowText, req, res, next);
});

router.post('/showText', function (req, res) {
    res.render('./Desktop/analyse', {title: 'NLA - Natural Language Analyse Tool', result: ''});
});

function getAndShowText(req, res) {
    let queryOperators = dbAction.getQueryOperators();
    let docID = '';
    console.log(notMedia + Tag + 'Document Id from Session is: ' + req.session.docID);
    if (!isNaN(req.session.docID)) {
        let docID = req.session.docID;
        getTextFromDB(docID);
        vueData.result = textDB.wordList;
    }
    res.renderVue('analysis', vueData, vueRenderOptions);
}

function getTextFromDB(docID) {
    textDB.textMap = JSON.parse(wait.for(dbStub.makeSQLRequest,
        dbAction.createSelectCommand('textWords', ['docID', 'wordID', 'counter'], [docID], ['='])));
    //console.log(notMedia + Tag + 'Result of selecting text in textWords: ' + JSON.stringify(textDB.textMap));
    for (let i = 0; i < textDB.textMap.length; i++) {
        if (textDB.textMap[i].counter === i) {
            let word = wait.for(dbStub.makeSQLRequest,
                dbAction.createSelectCommand('word',
                    ['wordID', 'content', 'isSpecial', 'semanticClass', 'pos'],
                    [textDB.textMap[i].wordID], ['=']));
            textDB.wordList.push(JSON.parse(word));
        } else {
            let err = new Error('Iteration is not synchronized with the counter attribute of the textMap.');
            textDB.error.push(err);
            break;
        }
    }
    //console.log(notMedia + Tag + 'the current Word List:' + JSON.stringify(textDB.wordList));
}

function getTextMetaData(docID) {
    textDB.textMetaData = wait.for(dbStub.makeSQLRequest,
        dbAction.createSelectCommand('text', ['docID', 'length', 'title', 'author', 'year'], [docID], ['=']));
}

module.exports = router;
