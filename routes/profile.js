const express = require('express');
const router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
const desktop = 'desktop Version: ';
const mobile = 'Mobile Version: ';
const bigDesktop = 'Big Desktop Version: ';
const notMedia = 'Not Media-Related Part: ';
const Tag = 'profile.js: ';
//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
const dbStub = require('../modules/db_stub');
const dbAction = require('../modules/db_actions');
const wait = require('wait.for');
const io = require('socket.io')(8081);

/**
 * Object that holds all specific meta info for this route.
 * @type {{head: {meta: [null,null,null,null]}}}
 */
let vueRenderOptions = {
    head: {
        meta: [
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js'},
        ]
    }
};

/**
 * Vue data object to be set for this route.
 * @type {{documents: null}}
 */
let vueData = {
    documents: null,
    amountOfDocuments: null,
    amountOfButtons: null
};
/**
 * locally global Variable package.
 * @type {{documents: null}}
 */
let profileData = {
    documents: null,
    amountOfDocuments: null,
    amountOfButtons: null,
    generalAmount: 50
};

/**
 * Socket.io section for changing titles of documents and
 * getting other specified documents.
 */
io.on('connection', function (socket) {
    socket.on('changeTitle', function (docID, newTitle) {
        //console.log(notMedia + Tag + 'update Document Title: ');
        wait.launchFiber(updateTitle, docID, newTitle);
    });
    socket.on('deleteDocument', function (docID) {
        //console.log('Got here with this ID: ' + docID);
        wait.launchFiber(deleteDocument, docID);
    });
});

router.get('/', function (req, res, next) {
    wait.launchFiber(prepareProfile, req, res, next);
});

router.post('/loadMoreDocuments', function (req, res, next) {
    wait.launchFiber(loadMoreDocuments, req, res, next);
});

router.post('/loadDocument', function (req, res, next) {
    req.session.docID = req.body.docID;
    //console.log(JSON.stringify(req.body));
    res.redirect('/analysis');
});

/**
 * replaces router.get with a fiber function.
 * It retrieves the first 50 documents from the DB and sends it to the client
 * while rendering the client page.
 * @param req
 * @param res
 * @param next
 */
function prepareProfile(req, res, next) {
    dbStub.nonFiberEstablishConnection();
    profileData.amountOfDocuments = JSON.parse(wait.for(dbStub.makeSQLRequest, 'SELECT COUNT(*) FROM documents'));
    profileData.amountOfDocuments = profileData.amountOfDocuments[0]['COUNT(*)'];

    profileData.amountOfButtons = Math.trunc(profileData.amountOfDocuments / profileData.generalAmount);
    if (profileData.amountOfDocuments % profileData.generalAmount > 0) {
        profileData.amountOfButtons++;
    }
    if (typeof req.session.numberOfButton !== 'undefined') {
        getDocuments(req.session.numberOfButton * profileData.generalAmount, profileData.generalAmount);
    } else {
        getDocuments(0, profileData.generalAmount);
    }
    vueData.documents = profileData.documents;
    vueData.amountOfDocuments = profileData.amountOfDocuments;
    vueData.amountOfButtons = profileData.amountOfButtons;
    res.renderVue('profile', vueData, vueRenderOptions);
}

/**
 * Replaces router.post to retrieve documents in another
 * specified range.
 * @param req
 * @param res
 * @param next
 */
function loadMoreDocuments(req, res, next) {
    //(notMedia + Tag + 'load More Documents: ' + JSON.stringify(req.body.numberOfButton));
    req.session.numberOfButton = req.body.numberOfButton - 1;
    res.redirect('/profile');
}

/**
 * Gets and returns the Documentinfo in a specified range.
 * @param start
 * @param amount
 */
function getDocuments(start, amount) {
    profileData.documents = JSON.parse(wait.for(
        dbStub.makeSQLRequest,
        dbAction.createLimitedSelectCommand(
            'documents',
            ['docID', 'userID', 'name'],
            start, amount
        )
    ));
    for (let i = 0; i < profileData.documents.length; i++) {
        if (profileData.documents[i].name.length === 0) {
            profileData.documents[i].name = 'No Name specified';
        }
    }
    //console.log(notMedia + Tag + 'documents: ' + JSON.stringify(profileData.documents));
}

/**
 * Changes the title of a document on the DB.
 * @param docID
 * @param newTitle
 */
function updateTitle(docID, newTitle) {
    docID = dbAction.stringifyForDB(docID);
    newTitle = dbAction.stringifyForDB(newTitle);
    wait.for(dbStub.makeSQLRequest, dbAction.createUpdateCommand('documents', ['name'], [newTitle], ['docID'], [docID], ['=']));
}

function deleteDocument(docID) {
    docID = dbAction.stringifyForDB(docID);
    wait.for(dbStub.makeSQLRequest, dbAction.createDeleteCommand('corefmentions', ['docID'], [docID]));
    wait.for(dbStub.makeSQLRequest, dbAction.createDeleteCommand('searchResults', ['docID'], [docID]));
    wait.for(dbStub.makeSQLRequest, dbAction.createDeleteCommand('notes', ['docID'], [docID]));
    wait.for(dbStub.makeSQLRequest, dbAction.createDeleteCommand('text', ['docID'], [docID]));
    wait.for(dbStub.makeSQLRequest, dbAction.createDeleteCommand('textmap', ['docID'], [docID]));
    wait.for(dbStub.makeSQLRequest, dbAction.createDeleteCommand('textnote', [docID], [docID]));
    wait.for(dbStub.makeSQLRequest, dbAction.createDeleteCommand('documents', ['docID'], [docID]));
}

module.exports = router;
