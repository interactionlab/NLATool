//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let notMedia = 'Not Media-Related Part: ';
let Tag = 'DB-Actions.js: ';
let sql = 'The resulting SQL Command is:';

//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
let jsonConfigurator = require('jsonfile');
let wait = require('wait.for');
//var corenlp = require('corenlp');
let jsonAction = require('../modules/jsonActions');
const isReachable = require('is-reachable');
let coreNLP = require('../modules/corenlp');
//var wait = require('wait.for');
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
            }catch (e){}
            if (nlpStatus.host !== null && nlpStatus.reachable === true) {
                console.log(nlpStatus.host);
            }

        }
    }
};

exports.setupCorenlp = function () {
    const connector = new ConnectorServer({ dsn: nlpStatus.host });
    const props = new Properties({
        annotators: 'tokenize,ssplit,pos,lemma,ner,parse'
    });
    const pipeline = new Pipeline(props, 'English', connector);
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
};
/**
 * Returns true if all the conditions that are specified to
 * @returns {boolean}
 */
exports.positiveNlpStatus = function () {
    return nlpStatus.host !== null && nlpStatus.reachable === true && nlpStatus.error === null;
};