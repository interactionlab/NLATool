var express = require('express');
var corenlp = require("corenlp-request-wrapper");
var router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors::
 * @type {string}
 */
var desktop = 'desktop Version: ';
var mobile = 'Mobile Version: ';
var bigDesktop = 'Big Desktop Version: ';
var notMedia = 'Not Media-Related Part: ';
var Tag = 'index.js: ';


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('./Desktop/loadtext', {title: 'NLA - Natural Language Analyse Tool', result:''});
});

router.post('/nlp2', function (req, res) {

    var input = req.body.testFunction;
    console.log(input);

    //TODO: check if CoreNLP server is online

    //start server with command
    //java -mx1g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -timeout 15000
    //where -mx_g is the number of GBs of RAM you want to allocate

    corenlp.parse(
        input, 9000, "pos,lemma,ner", "json", function (err, parsedText) {
            console.log(JSON.stringify(JSON.parse(parsedText), null, 2));
            res.render('Desktop/loadtext', {
                title: 'NLA - Natural Language Analyse Tool',
                result: JSON.stringify(JSON.parse(parsedText))
            })
        });

});



module.exports = router;