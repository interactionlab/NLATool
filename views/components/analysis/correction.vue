<template>
    <div>
        <div v-if="changing"
             class="mdl-grid separate"
             style="padding:0px;width: 100%;">
            <div class="mdl-grid semClassFormate"
                 style="width: 100%;"
                 v-bind:class="currentClass">
                <p class="mdl-cell mdl-cell--10-col deleteSpaces"
                   style="padding:0.4em;">
                    <b class="mdc-button">{{contentToChange}}</b>
                </p>
                <div class="mdl-layout-spacer"></div>
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                        v-on:click="switchtoentities">
                    <i class="material-icons">clear</i>
                </button>
            </div>

            <div v-if="semanticClass !== 'ERROR'"
                 style="padding:0.4em;width:100%;">
                <button v-bind:class="{PERSON_strong: currentClass == 'PERSON'}"
                        v-on:click="changeClass('PERSON')"
                        class="mdl-button mdl-js-button PERSON">
                    <small class="mdc-button">PERSON</small>
                </button>
                <button v-bind:class="{LOCATION_strong: currentClass == 'LOCATION'}"
                        v-on:click="changeClass('LOCATION')"
                        class="mdl-button mdl-js-button LOCATION">
                    <small class="mdc-button">LOCATION</small>
                </button>
                <button v-bind:class="{ORGANIZATION_strong: currentClass == 'ORGANIZATION'}"
                        class="mdl-button mdl-js-button ORGANIZATION"
                        v-on:click="changeClass('ORGANIZATION')">
                    <small class="mdc-button">ORGANIZATION</small>
                </button>
                <button v-bind:class="{MISC_strong: currentClass == 'MISC'}"
                        class="mdl-button mdl-js-button MISC"
                        v-on:click="changeClass('MISC')">
                    <small class="mdc-button">MISC</small>
                </button>
                <button v-bind:class="{OTHER_strong: currentClass == 'DATE'}"
                        class="mdl-button mdl-js-button OTHER"
                        v-on:click="changeClass('DATE')">
                    <small class="mdc-button">DATE</small>
                </button>
                <button v-bind:class="{OTHER_strong: currentClass == 'TIME'}"
                        class="mdl-button mdl-js-button OTHER"
                        v-on:click="changeClass('TIME')">
                    <small class="mdc-button">TIME</small>
                </button>
                <button v-bind:class="{OTHER_strong: currentClass == 'DURATION'}"
                        class="mdl-button mdl-js-button OTHER"
                        v-on:click="changeClass('DURATION')">
                    <small class="mdc-button">DURATION</small>
                </button>
                <button v-bind:class="{OTHER_strong: currentClass == 'NUMBER'}"
                        class="mdl-button mdl-js-button OTHER"
                        v-on:click="changeClass('NUMBER')">
                    <small class="mdc-button">NUMBER</small>
                </button>
                <button v-bind:class="{OTHER_strong: currentClass == 'SET'}"
                        class="mdl-button mdl-js-button OTHER"
                        v-on:click="changeClass('SET')">
                    <small class="mdc-button">SET</small>
                </button>
                <button v-bind:class="{OTHER_strong: currentClass == 'ORDINAL'}"
                        class="mdl-button mdl-js-button OTHER"
                        v-on:click="changeClass('ORDINAL')">
                    <small class="mdc-button">ORDINAL</small>
                </button>
                <button v-bind:class="{POS: true}"
                        class="mdl-button mdl-js-button"
                        v-on:click="changeClass('O')">
                    <small class="mdc-button">Discard class</small>
                </button>
            </div>
            <p v-else
               style="padding:0.4em;">
                The selection contains different semantic classes, discard the classes first.
            <p>
        </div>
        <div v-else class="mdl-grid" style="padding:0px;width: 100%;">

            <p class="mdl-cell mdl-cell--12-col"> Select a word to correct its semantic class.
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                        style="float: right;"
                        v-on:click="switchtoentities">
                    <i class="material-icons">clear</i>
                </button>
            </p>
            <p class="mdl-cell mdl-cell--12-col"><span v-bind:class="{POS:true}">Suggested</span> words are the most
                likely ones not to be classified. </p>
        </div>
        <component v-if="semanticClass !== 'O' && semanticClass !== 'ERROR'"
                   is="research"
                   class="mdl-cell mdl-cell--12-col"
                   v-bind:serverip="serverip"
                   v-bind:googleapikey="googleapikey"
                   v-bind:docid="docid"
                   v-bind:researchdatatoedit="researchdatatoedit"
                   v-bind:tokens="tokens"
                   v-bind:contentcontrol="contentcontrol"
                   v-bind:selectedtextindexes="selectedtextindexes"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-bind:selectedchain="selectedchain"
                   v-bind:semanticclass="semanticClass"
                   v-bind:columnindex="columnindex"
                   v-bind:tokenstoshow="tokenstoshow"
                   v-on:saveresult="saveresult($event)">
        </component>
        <p v-else-if="semanticClass !== 'ERROR'"
           style="padding:0.4em;">
            Select a class first in order to add futher information to the selected word.
        <p>
        <component is="store"></component>
    </div>

</template>
<script>
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';
    import research from './components/analysis/research.vue';
    import store from './components/analysis/globalstore.vue';
    export default {
        mixins: [getselectedtext],
        props: {
            serverip: {type: String, default: ""},
            googleapikey: {type: String, default: ""},
            tokens: {
                type: Array, default: function () {
                    return []
                }
            },
            wordtomarkonhoverdata: {type: Object, default: null},
            researchdatatoedit: {type: Object, default: null},
            contentcontrol: {type: Object, default: null},
            selectedtextindexes: {type: Object, default: null},
            docid: {type: Number, default: -1},
            selectedchain: {type: Number, default: -1},
            columnindex: {type: Number, default: 0},
            tokenstoshow: {
                type: Array, default: function () {
                    return []
                }
            },
        },
        data: function () {
            return {
                showNewClasses: false,
                index: 0,
                suggestions: false,
                semanticClass: ""
            }
        },
        computed: {
            selectedtokens: function () {
                return this.gettokensofselectedtext(this.tokens, this.selectedtextindexes);
            },
            changing: function () {
                let toChange = this.selectedtokens.length > 0 || this.researchdatatoedit !== null;
                return toChange;
            },
            contentToChange: function () {
                if (this.changing) {
                    if (this.selectedtokens.length > 0) {
                        let content = '';
                        for (let i = 0; i < this.selectedtokens.length; i++) {
                            content = content + ' ' + this.selectedtokens[i].content;
                        }
                        return content;
                    } else {
                        return this.researchdatatoedit.sourcequery.query[0];
                    }
                }
            },
            currentClass: function () {
                if (this.changing) {
                    if (this.selectedtokens !== null
                        && this.selectedtokens[0] !== undefined) {
                        let semClass = this.selectedtokens[0].semanticClass;
                        for (let i = 1; i < this.selectedtokens.length; i++) {
                            if (this.selectedtokens[i].semanticClass !== semClass) {
                                semClass = "ERROR";
                            }
                        }
                        this.semanticClass = semClass;
                    } else if (this.researchdatatoedit !== null) {
                        this.semanticClass = this.researchdatatoedit.sourcequery.semanticClass;
                    } else {
                        this.semanticClass = "";
                    }
                    return this.semanticClass;
                }
            }
        },
        methods: {
            switchtoentities: function (event) {
                this.$emit('switchtoentities');
            },
            saveresult: function (researchdata) {
                this.$emit('saveresult', researchdata);
            },
            changeClass: function (newClass) {
                if (this.researchdatatoedit !== null && this.researchdatatoedit !== undefined) {
                    let socket = io(this.serverip + ':8080');
                    for (let k = 0; k < this.researchdatatoedit.sourcequery.textindexes.length; k++) {
                        this.tokens[this.researchdatatoedit.sourcequery.textindexes[k]].semanticClass = newClass;
                        socket.emit('changeClass', this.tokens[this.researchdatatoedit.sourcequery.textindexes[k]], this.docid);
                        this.researchdatatoedit.sourcequery.semanticClass = newClass;
                    }
                    this.semanticClass = newClass;
                    return true;
                } else {
                    this.selectedtokens[0].semanticClass = newClass;
                    this.semanticClass = newClass;
                    let socket = io(this.serverip + ':8080');
                    socket.emit('changeClass', this.selectedtokens[0], this.docid);
                    return true;
                }
            },
            toggleSuggestions: function () {
                this.suggestions = !this.suggestions;
                this.$emit('toggleSuggestions', this.suggestions);
            }
        },
        components: {
            research,
            store
        }
    }
</script>