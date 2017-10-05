var express = require('express');
var corenlp = require("corenlp-request-wrapper");
var router = express.Router();
var nlpPort = 4000;
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
var net = require('net');
var server = net.createServer();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('./Desktop/loadtext', {title: 'NLA - Natural Language Analyse Tool', result:''});
});

router.post('/nlp2', function (req, res) {

    //check if CoreNLP server is online
    server.listen(nlpPort);

    server.once('error', function (err) {

        if(err.code === 'EADDRINUSE'){
           //port is currently in use, so...
            console.log("Server online");

            var input = req.body.testFunction;

            corenlp.parse(
               input, nlpPort, "ner", "json", function (err, parsedText) {
                    //console.log(JSON.stringify(JSON.parse(parsedText), null, 2));

                    //Object -> Json -> String
                    var json = JSON.parse(parsedText);

                    //console.log(json["sentences"][0]["tokens"][0].word);

                    var words = {};
                    var classes = {};
                    var person = {};
                    var loc = {};
                    var orga = {};

                    for(var i = 0; i <= json["sentences"].length -1; i++) {
                        for (var j = 0; j <= json["sentences"][i]["tokens"].length -1; j++) {
                            if(json["sentences"][i]["tokens"][j].ner !== "O"){
                                classes[j] = (JSON.stringify(json["sentences"][i]["tokens"][j].ner));
                                words[j] = (JSON.stringify(json["sentences"][i]["tokens"][j].word));
                                if(words[j] !== undefined){

                                        if ( classes[j] === '"PERSON"'){
                                            person[words[j]]= person[words[j]]["person"];
                                        }

                                }
                            }
                        }
                    }


                    res.render('Desktop/loadtext', {
                        title: 'NLA - Natural Language Analyse Tool',
                        result: JSON.stringify(JSON.parse(parsedText))
                    })
            })

       }
    });

    //if Core NLP is offline:
    server.once('listening', function () {
        server.close();
        setTimeout(console.log("Server offline"),5000);
        res.render('Desktop/loadtext',{title: 'NLA - Natural Language Analyse Tool', result: "Error 501: CoreNLP Server is offline"},null);

    });
});


module.exports = router;