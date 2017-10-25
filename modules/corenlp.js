//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
var notMedia = 'Not Media-Related Part: ';
var Tag = 'DB-Actions.js: ';
var sql = 'The resulting SQL Command is:';

//--------------------------------------------------------
/**
 * Setup Configuration file Requirements:
 */
var jsonConfigurator = require('jsonfile');
var wait = require('wait.for');
var corenlp = require('corenlp');
var jsonAction = require('../modules/jsonActions');
const isReachable = require('is-reachable');
//import CoreNLP, { Properties, Pipeline, ConnectorServer } from 'corenlp';
/**
 * Loads the Database Configuration at the beginning of the of this file so
 * that it is available for every function here.
 */
var json = null;
wait.launchFiber(getJSONConfig);
function getJSONConfig() {
    json = jsonAction.getJsonConfiguration();
    json = JSON.parse(json);
}

var nlpStatus = {
    reachable: false
};

/**
 * Reachability Check of Corenlp Server.
 */
exports.isReachable = function (res, next) {
    var reached = isReachable('http://projects.hcilab.org/CoreNLP/');
    reached.then(function (reached) {
        console.log(reached);
        if (reached) {
            nlpStatus.reachable = reached;
            res.render('./Desktop/loadtext', {title: 'NLA - Natural Language Analyse Tool', result: ''});
        } else {
            nlpStatus.reachable = reached;
            var err = new Error('CoreNlp not reachable');
            err.status = 501;
            next(err);
        }
    }).catch(function (e) {
        nlpStatus.reachable = reached;
        var err = new Error('CoreNlp not reachable' + e);
        err.status = 502;
        next(err);
    });
};

const connector = new ConnectorServer({ dsn: 'http://localhost:9000' });
const props = new Properties({
    annotators: 'tokenize,ssplit,pos,lemma,ner,parse'
});
const pipeline = new Pipeline(props, 'English', connector);
