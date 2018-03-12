const express = require('express');
const router = express.Router();

//--------------------------------------------------------
/**
 * Tags for console Errors:
 * @type {string}
 */
let desktop = 'desktop Version: ';
let mobile = 'Mobile Version: ';
let bigDesktop = 'Big Desktop Version: ';
let notMedia = 'Not Media-Related Part: ';
let Tag = 'signup.js: ';

let vueRenderOptions = {
    head: {
        scripts: [
            {script: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js'},
        ],styles:[
            {style: 'https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-orange.min.css'},
            {style: 'https://code.getmdl.io/1.3.0/material.indigo-orange.min.css'}
        ]
    }
};

router.get('/', function (req, res, next) {
    req.vueOptions = vueRenderOptions;
    res.renderVue('signup.vue',  req.vueOptions);
});

module.exports = router;

/*
VUE template

<script>
export default {
    data: function() {
        return {}
    }
}
</script>

*/