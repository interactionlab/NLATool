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
    //coref: [],
    isSpecial: [],
    text: [],
    ner: [],
    pos: []
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
            console.log(reached);
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
        }).catch(function (e) {
            nlpStatus.reachable = reached;
            let err = new Error('CoreNlp not reachable' + e);
            err.status = 502;
            nlpStatus.error = err;
            callback(err, null);
        });
    }
};
/**
 * checks all connections specified in config.json if they are reachable.
 */
exports.getAReachableConnection = function () {
    for (let connection in json.corenlp.connections) {
        console.log(json.corenlp.connections[connection].host);
        if (!nlpReachability()) {
            try {
                wait.for(coreNLP.isReachable, json.corenlp.connections[connection].host);
            } catch (e) {
            }
            if (nlpStatus.host !== null && nlpStatus.reachable === true) {
                console.log(nlpStatus.host);
            }

        }
    }
};


exports.setupCorenlp = function () {
    nlpStatus.connector = new corenlp.ConnectorServer({dsn: nlpStatus.host});
    nlpStatus.props = new corenlp.Properties({
        annotators: 'tokenize,ssplit,pos,lemma,ner,parse,dcoref'
    });
    nlpStatus.pipeline = new corenlp.Pipeline(nlpStatus.props, 'English', nlpStatus.connector);
    pipeline = new corenlp.Pipeline(nlpStatus.props, 'English', nlpStatus.connector);
};

exports.parse = function (text, callback) {
    const sent = new CoreNLP.simple.Sentence(text);
    let ners = [];
    nlpStatus.pipeline.annotate(sent)
        .then(sent => {
            console.log('parse', sent.parse());
            console.log('parse Tree Result: ' + CoreNLP.util.Tree.fromSentence(sent).dump());
            ners = sent.nerTags();
            console.log('NER Tags: ' + ners);
            callback(null, null);
        })
        .catch(err => {
            console.log('err', err);
            nlpStatus.error = err;
            callback(err, null);
        });
};

//TODO: figure out a way to save different usages of interpunctuation to database

exports.analyse = function (text, callback) {

    const doc = new CoreNLP.simple.Document(text);
    console.log('got here0' + text);
    console.log(nlpStatus.pipeline.getService());
    nlpStatus.pipeline.annotate(doc).then(doc => {
        console.log('got here1');
        let sentences = doc.sentences();
        console.log('got here2');
        for (let i = 0; i < sentences.length; i++) {
            console.log('got here3');
            //console.log('words: ' + sentences[i].words());
            console.log('got here4');
        }
        callback(null, results);
    }).catch(err => {
        callback(err, null);
    });

    /*
    for (let i = 0; i < sentences.length; i++) {
        nlpStatus.pipeline.annotate(sentences[i]).then(sentence => {
            console.log('analyse Results: ');
            console.log('nerTags: ' + sentence.nerTags());
            results.ner.push(sentence.nerTags());
            console.log('posTags:' + sentence.posTags());
            results.pos.push(sentence.posTags());
            console.log('tokens:' + sentence.tokens());
            console.log('nerTags: ' + sentence.nerTags());
            console.log('words: ' + sentence.words());
            callback(null, results);
        }).catch(err => {
            callback(err, null);
        });
    }
    */

};
exports.analyseSentence = function (text, callback) {
    let sentence = new CoreNLP.simple.Sentence(text);
    console.log(JSON.stringify(pipeline) + '--------' + sentence.toString());
        pipeline.annotate(sentence).then(sentence => {
            //console.log('analyse Results: ');
            //console.log('nerTags: ' + sentence.nerTags());
            results.ner.push(sentence.nerTags());
            //console.log('posTags:' + sentence.posTags());
            results.pos.push(sentence.posTags());
            //console.log('tokens:' + sentence.tokens());
            //console.log('nerTags: ' + sentence.nerTags());
            results.text.push(sentence.words());
            //console.log('words: ' + sentence.words());
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
    /**
     * Returns true if all the conditions that are specified to
     * @returns {boolean}
     */
    exports.positiveNlpStatus = function () {
        return nlpStatus.host !== null
            && nlpStatus.reachable === true
            && nlpStatus.error === null
            && nlpStatus.connector !== null
            && nlpStatus.pipeline !== null
            && nlpStatus.props !== null;
    };

    function nlpReachability() {
        return nlpStatus.host !== null
            && nlpStatus.reachable === true
            && nlpStatus.error === null;
    }

