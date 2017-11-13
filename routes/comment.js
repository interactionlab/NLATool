var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    let uid = req.body.uid;
    let id = req.body.id;
    let word = req.session.wordTables[uid].words[id];
    let comment = req.session.wordTables[uid].comments[id];
    res.json({word: word, comment: comment});
});


router.post('/save', function (req, res) {
    let uid = req.body.uid;
    let id = req.body.id;
    req.session.wordTables[uid].comments[id] = req.body.comment;
    res.json({});
});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

router.post('/init', function (req, res) {
    let uid = guid();
    let words = req.body.words;
    let comments = new Array(words.length);
    if (!req.session.wordTables) {
        req.session.wordTables = {};
    }
    req.session.wordTables[uid] = {words: words, comments: comments};
    res.json({uuid: uuid});
    res.render('./Desktop/comment', {
        title: 'NLA - Natural Language Analyse Tool'
        //result :
    });

});
    module.exports = router;