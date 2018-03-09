<template>
    <div>
        <div v-if="selectedtokens.length !== 0" class="mdl-grid">
            <p class="mdl-cell mdl-cell--4-col" v-bind:class="semclassofselected">{{selectedtokens[0].content}}</p>
            <p class="mdl-cell mdl-cell--6-col">Current Class: {{selectedtokens[0].semanticClass}}</p>
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


                <!--<div class="mdc-switch contentColor" style="border: white 2px">-->
                <!--<input v-on:click="toggleSuggestions()" type="checkbox" id="basic-switch" class="mdc-switch__native-control" />-->
                <!--<div class="mdc-switch__background">-->
                <!--<div class="mdc-switch__knob"></div>-->
                <!--</div>-->
                <!--<label for="basic-switch" class="mdc-switch-label">Show suggestions</label>-->
                <!--</div>-->

            </div>
        </div>
        <div v-if="selectedtokens.length === 0" class="mdl-grid">
            <p class="mdl-cell mdl-cell--12-col"> Select a word to correct its semantic class. </p>
            <p class="mdl-cell mdl-cell--12-col"><span v-bind:class="{POS:true}">Suggested</span> words are the most
                likely ones not to be classified. </p>
        </div>

    </div>

</template>
<script>
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';

    export default {
        mixins: [getselectedtext],
        props: {
            serverip: String,
            tokens: Array,
            selectedindexes: Object,
            docid: String,
        },
        data: function () {
            return {
                serverip: this.serverip,
                showNewClasses: false,
                tokens: this.tokens,
                selectedtokens: [],
                selectedindexes: this.selectedindexes,
                classesPerToken: [],
                index: 0,
                docid: this.docid,
                suggestions: false
            }

        },
        watch: {
            selectedindexes: {
                handler: function (newselectedindexes) {
                    this.selectedtokens =
                        this.gettokensofselectedtext(this.tokens, newselectedindexes);
                    for (let i = 0; i < this.selectedtokens.length; i++) {
                        this.classesPerToken[i] = false;
                    }
                },
                deep: true
            }
        },
        computed: {
            shownclassespertoken: function () {
                return this.classesPerToken[this.index];
            },
            semclassofselected: function () {
                let tokenClass = {};
                tokenClass[this.selectedtokens[0].semanticClass] = true;
                return tokenClass;
            }
        },
        methods: {
            showClasses: function (index) {
                this.index = index;
                this.classesPerToken[index] = !this.classesPerToken[index];
            },
            changeClass: function (newClass) {
                //console.log(this.selectedtokens[0].content + " with class " + this.selectedtokens[0].semanticClass+ " is changed to " + newClass);
                this.selectedtokens[0].semanticClass = newClass;
                let socket = io(this.serverip + ':8080');
                socket.emit('changeClass', this.selectedtokens[0], this.docid);
            },
            toggleSuggestions: function () {
                this.suggestions = !this.suggestions;
                this.$emit('toggleSuggestions', this.suggestions);
            }
        }
    }
</script>