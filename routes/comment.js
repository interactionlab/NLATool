var express = require('express');
var router = express.Router();

let vueRenderOptions = {
    head: {
        meta: [
            {script: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js'},
            //{script: '/javascripts/comment.js'},
            {script: 'https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.0/mark.js'},
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-orange.min.css'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-orange.min.css'}
        ]
    }
};

router.get('/', function (req, res) {
    let uid = req.query.uid;
    if (uid) {
        res.renderVue('comment', {uid: uid, id: '', word: '', comment: '', words: req.session.wordTables[uid].words}, vueRenderOptions);
    } else {
        res.renderVue('comment', {uid: '', id: '', word: '', comment: '', words: []}, vueRenderOptions);
    }
});

router.get('/:id', function (req, res) {
    let uid = req.query.uid;
    let id = req.params.id;
    let word = req.session.wordTables[uid].words[id];
    let comment = req.session.wordTables[uid].comments[id];
    res.renderVue('comment', {uid: uid, id: id, word: word, comment: comment, words: req.session.wordTables[uid].words}, vueRenderOptions);
});


router.post('/save', function (req, res) {
    let uid = req.body.uid;
    let id = req.body.id;
    req.session.wordTables[uid].comments[id] = req.body.comment;
    res.redirect('/comment?uid=' + uid);
    //res.renderVue('comment', {uid: uid, id: '', word: '', comment: '', words: req.session.wordTables[uid].words}, vueRenderOptions);
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
    let words = req.body.text.split(' ');
    let comments = new Array(words.length);
    if (!req.session.wordTables) {
        req.session.wordTables = {};
    }
    req.session.wordTables[uid] = {words: words, comments: comments};
    res.redirect('/comment?uid=' + uid);
});
module.exports = router;