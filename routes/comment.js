var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    /*
    id=id

    return:
    {
        word: word,
        comment: comment
    }
    */
});

router.post('/save', function (req, res, next) {
    /*
    {
        id: id,
        comment: comment
    }
    */
});

router.post('/init', function (req, res, next) {
    /*
    {
        words: ["word1", "word2", "word3"]
    }
    */
});














module.exports = router;