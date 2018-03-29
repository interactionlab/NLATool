<template>
    <div>
        <div v-if="changing" class="mdl-grid">
            <p class="mdl-cell mdl-cell--4-col" v-bind:class="currentClass">{{contentToChange}}</p>
            <p class="mdl-cell mdl-cell--6-col">Current Class: {{currentClass}}</p>
            <div>
                <p class="mdl-cell mdl-cell--6-col">Make a selection: </p>
                <button v-bind:class="{PERSON: true}"
                        v-on:click="changeClass('PERSON')"
                        class="mdl-button mdl-js-button">
                    <small class="mdc-button">PERSON</small>
                </button>
                <button v-bind:class="{LOCATION: true}"
                        v-on:click="changeClass('LOCATION')"
                        class="mdl-button mdl-js-button">
                    <small class="mdc-button">LOCATION</small>
                </button>
                <button v-bind:class="{ORGANIZATION: true}"
                        class="mdl-button mdl-js-button"
                        v-on:click="changeClass('ORGANIZATION')">
                    <small class="mdc-button">ORGANIZATION</small>
                </button>
                <button v-bind:class="{MISC: true}"
                        class="mdl-button mdl-js-button"
                        v-on:click="changeClass('MISC')">
                    <small class="mdc-button">MISC</small>
                </button>
                <button v-bind:class="{POS: true}"
                        class="mdl-button mdl-js-button"
                        v-on:click="changeClass('O')">
                    <small class="mdc-button">Discard class</small>
                </button>
            </div>
        </div>
        <div v-else class="mdl-grid">
            <p class="mdl-cell mdl-cell--12-col"> Select a word to correct its semantic class. </p>
            <p class="mdl-cell mdl-cell--12-col"><span v-bind:class="{POS:true}">Suggested</span> words are the most
                likely ones not to be classified. </p>
        </div>
        <component is="research"
                   class="mdl-cell mdl-cell--12-col"
                   v-bind:serverip="serverip"
                   v-bind:googleapikey="googleapikey"
                   v-bind:docid="docid"
                   v-bind:researchdatatoedit="researchdatatoedit"
                   v-bind:tokens="tokens"
                   v-bind:contentcontrol="contentcontrol"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-bind:selectedchain="selectedchain"
                   v-on:saveresult="saveresult($event)">
        </component>

    </div>

</template>
<script>
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';
    import research from './components/analysis/research.vue';

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
            wordtomarkonhoverdata: {
                type: Array, default: function () {
                    return []
                }
            },
            researchdatatoedit: {type: Object, default: null},
            contentcontrol: {type: Object, default: null},
            selectedindexes: {type: Object, default: null},
            docid: {type: Number, default: -1},
            selectedchain: {type: Number, default: -1},
        },
        data: function () {
            return {
                showNewClasses: false,
                index: 0,
                suggestions: false
            }

        },
        watch: {},
        computed: {
            selectedtokens: function () {
                if (this.selectedindexes.start > -1 && this.selectedindexes.end > -1) {
                    this.researchdatatoedit = null;
                }
                return this.gettokensofselectedtext(this.tokens, this.selectedindexes);
            },
            semclassofselected: function () {
                // let tokenClass = {};
                // tokenClass[this.selectedtokens[0].semanticClass] = true;
                // return tokenClass;
            },
            changing: function () {
                let toChange = this.selectedtokens.length > 0 || this.researchdatatoedit !== null;
                console.log('Changing: ' + toChange);
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
                        return this.researchdatatoedit.sourcequery.entities[0];
                    }
                }
            },
            currentClass: function () {
                if (this.changing) {
                    if (this.selectedtokens.length === 1) {
                        return this.selectedtokens[0].semanticClass;
                    } else if (this.researchdatatoedit !== null) {
                        return this.researchdatatoedit.sourcequery.source[0].semanticClass;
                    } else {
                        return 'To many words with different semantic classes.'
                    }
                }
            }
        },
        methods: {
            saveresult: function (researchdata) {
                this.$emit('selectresearch', researchdata);
            },
            changeClass: function (newClass) {
                //console.log(this.selectedtokens[0].content + " with class " + this.selectedtokens[0].semanticClass+ " is changed to " + newClass);
                // this.selectedtokens[0].semanticClass = newClass;
                // let socket = io(this.serverip + ':8080');
                // socket.emit('changeClass', this.selectedtokens[0], this.docid);
            },
            toggleSuggestions: function () {
                this.suggestions = !this.suggestions;
                this.$emit('toggleSuggestions', this.suggestions);
            }
        },
        components: {
            research,
        }
    }
</script>