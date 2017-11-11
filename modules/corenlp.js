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
    error: null
};

let nlp = {
    connector: null,
    props: null,
    pipeline: null,
    error: null
};

//TODO: check for errors, reset after usage
let results = {
    error: null,
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
        if (!coreNLP.positiveNlpStatus()) {
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
    nlp.connector = new corenlp.ConnectorServer({dsn: nlpStatus.host});
    nlp.props = new corenlp.Properties({
        annotators: 'tokenize,ssplit,pos,lemma,ner,parse'
    });
    nlp.pipeline = new corenlp.Pipeline(nlp.props, 'English', nlp.connector);

};

exports.parse = function (text, callback) {
    const sent = new CoreNLP.simple.Sentence(text);
    let ners = [];
    nlp.pipeline.annotate(sent)
        .then(sent => {
            console.log('parse', sent.parse());
            console.log(CoreNLP.util.Tree.fromSentence(sent).dump());
            ners = sent.nerTags();
            console.log(ners);
            callback(null, null);
        })
        .catch(err => {
            console.log('err', err);
            nlp.error = err;
            callback(err, null);
        });
};

//TODO: figure out a way to save different usages of interpunctuation to database

exports.analyse = function (text) {
    const sent = new CoreNLP.simple.Sentence(text);
    nlp.pipeline.annotate(sent).then(sent => {
        console.log(CoreNLP.util.Tree.fromSentence(sent).visitLeaves.dump());
    }).catch(err => {

    });

};

function fillResults(annotation){

    for(let i = 0; i <= ; i++){
        results.ner;
        results.pos;
        results.isSpecial
    }


}

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
};
/**
 * Returns true if all the conditions that are specified to
 * @returns {boolean}
 */
exports.positiveNlpStatus = function () {
    return nlpStatus.host !== null && nlpStatus.reachable === true && nlpStatus.error === null;
};