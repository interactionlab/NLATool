const express = require('express');
const router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let notMedia = 'Not Media-Related Part: ';
let Tag = 'Server imprint.js: ';


let vueRenderOptions = {
};
/**
 * Vue data object to be set for this route.
 * @type {{documents: null}}
 */
let vueData = {
};

router.get('/', function (req, res, next) {
    res.renderVue('imprint',vueRenderOptions);
});
module.exports = router;


