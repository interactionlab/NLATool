//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let notMedia = 'Not Media-Related Part: ';
let Tag = 'db_actions.js: ';
let sql = 'The resulting SQL Command is:';

//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
require('babel-polyfill');
const jsonConfigurator = require('jsonfile');
const wait = require('wait.for');
const corenlp = require('corenlp');
const jsonAction = require('./json_actions');
const isReachable = require('is-reachable');
const coreNLP = require('../modules/corenlp');
const CoreNLP = corenlp.default;
//import CoreNLP, { Properties, Pipeline, ConnectorServer } from 'corenlp';

/**
 * Loads the Database Configuration at the beginning of the of this file so
 * that it is available for every function here.
 */
let json = null;
wait.launchFiber(getJSONConfig);

function getJSONConfig() {
    json = jsonAction.getJsonConfiguration();
    json = JSON.parse(json);
}

/**
 * Global Variables for this Document.
 */
let nlpStatus = {
    reachable: false,
    host: null,
    error: null,
    connector: null,
    props: null,
    pipeline: null
};
let pipeline = null;
//TODO: check for errors, reset after usage
let results = {
    coref: [],
    isSpecial: [],
    text: [],
    ner: [],
    pos: [],
    offsetBegin: [],
    offsetEnd: []
};

exports.getResults = function () {
    return results;
};

/**
 * Reachability Check of Corenlp Server.
 */
exports.isReachable = function (host, callback) {
    if (!coreNLP.positiveNlpStatus()) {
        let reached = isReachable(host);
        reached.then(function (reached) {
            if (reached) {
                nlpStatus.reachable = reached;
                nlpStatus.host = host;
                callback(null, reached);
            } else {
                nlpStatus.reachable = reached;
                let err = new Error('CoreNlp not reachable');
                err.status = 502;
                nlpStatus.error = err;
                callback(err, reached);
            }
        });
        /* .catch(function (e) {
         nlpStatus.reachable = reached;
         let err = new Error('CoreNlp not reachable' + e);
         err.status = 502;
         nlpStatus.error = err;
         console.log('Got to Error!');
         callback(err, null);
     });*/
    }
};
/**
 * checks all connections specified in config.json if they are reachable.
 */
exports.getAReachableConnection = function () {
    for (let connection in json.corenlp.connections) {

        console.log(nlpReachability());
        if (!nlpReachability()) {
            console.log('Checking Host: ' + json.corenlp.connections[connection].host);
            wait.for(coreNLP.isReachable, json.corenlp.connections[connection].host);

            if (nlpStatus.host !== null && nlpStatus.reachable === true) {
                console.log('Reachable Host is: ' + nlpStatus.host);
            }

        }
    }
};


exports.setupCorenlp = function (language) {
    if (typeof language === 'undefined') {
        language = 'English';
    }
    nlpStatus.connector = new corenlp.ConnectorServer({dsn: nlpStatus.host});
    nlpStatus.props = new corenlp.Properties({
        annotators: 'tokenize,ssplit,pos,lemma,ner,parse,coref'
    });
    nlpStatus.pipeline = new corenlp.Pipeline(nlpStatus.props, language, nlpStatus.connector);
    pipeline = new corenlp.Pipeline(nlpStatus.props, language, nlpStatus.connector);
};

exports.resetPipeline = function (language) {
    nlpStatus.pipeline = new corenlp.Pipeline(nlpStatus.props, language, nlpStatus.connector);
};

//TODO: figure out a way to save different usages of interpunctuation to database

exports.analyse = function (text, callback) {
    const doc = new CoreNLP.simple.Document(text);
    //console.log('got here0' + text);
    console.log(nlpStatus.pipeline.getService());
    nlpStatus.pipeline.annotate(doc).then(doc => {
        let sentences = doc.sentences();
        results.coref = doc.corefs();
        //console.log('coref Annotation:' + JSON.stringify(corefChains));
        for (let i = 0; i < sentences.length; i++) {
            results.ner.push(sentences[i].nerTags());
            results.pos.push(sentences[i].posTags());
            results.text.push(sentences[i].words());
            //console.log(results);
            // const tree = CoreNLP.util.Tree.fromSentence(sentences[i]);
            // console.log('the tree: '+tree.dump());
            for (let j = 0; j < sentences[i].tokens().length; j++) {
                results.offsetBegin.push(sentences[i].tokens()[j].characterOffsetBegin());
                results.offsetEnd.push(sentences[i].tokens()[j].characterOffsetEnd());
            }
            console.log(notMedia + Tag + 'Begin offsets: ' + results.offsetBegin);
            console.log(notMedia + Tag + 'End offsets: ' + results.offsetEnd);
        }
        resetResults();
        callback(null, results);
    }).catch(err => {
        callback(err, null);
    });
};

//--------------------------------------------------------
/**
 * Section for managing nlpStatus
 */
/**
 * Returns the whole Object Representing the Nlp Server Status
 * from node.js Server point of view.
 * @returns {{reachable: boolean, host: null, error: null}}
 */
exports.getNlpStatus = function () {
    return nlpStatus;
};
/**
 * Resets the nlpStatus Object to its default values.
 */
exports.resetNlpStatus = function () {
    nlpStatus.error = null;
    nlpStatus.reachable = false;
    nlpStatus.host = null;
    nlpStatus.pipeline = null;
    nlpStatus.props = null;
    nlpStatus.connector = null;
};

resetResults = function () {
    for (let key in results) {
        results[key] = [];
    }
};
/**
 * Returns true if all the conditions that are specified to
 * @returns {boolean}
 */
exports.positiveNlpStatus = function () {
    return nlpStatus.host !== null && nlpStatus.reachable === true && nlpStatus.error === null && nlpStatus.connector !== null && nlpStatus.pipeline !== null && nlpStatus.props !== null;
};

function nlpReachability() {
    return nlpStatus.host !== null && nlpStatus.reachable === true && nlpStatus.error === null;
}

