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

import CoreNLP, { Properties, Pipeline, ConnectorServer } from 'corenlp';

const connector = new ConnectorServer({ dsn: 'http://localhost:9000' });
const props = new Properties({
    annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
});
const pipeline = new Pipeline(props, 'English', connector);