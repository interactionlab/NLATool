<template>
    <div>
        <div v-if="selectedtokens.length !== 0" class="mdl-grid">
            <p class="mdl-cell mdl-cell--6-col">{{selectedtokens[0].content}}</p>
            <p class="mdl-cell mdl-cell--6-col">Current Class: {{selectedtokens[0].semanticClass}}</p>
            <div>
                <p>Select a new class: </p>
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
            </div>
         <div v-if="selectedtokens.length === 0">
             <p>Select a word</p>
         </div>
        </div>

    </div>

</template>
<script>
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';

    export default {
        mixins: [getselectedtext],
        props: {
            tokens: Array,
            selectedindexes: Object,
            docid: String,
        },
        data: function () {
            return {
                showNewClasses: false,
                tokens: this.tokens,
                selectedtokens: [],
                selectedindexes: this.selectedindexes,
                classesPerToken: [],
                index: 0,
                docid: this.docid,
            }

        },
        watch: {
            selectedindexes: {
                handler: function (newselectedindexes) {
                    this.selectedtokens =
                        this.gettokensofselectedtext(this.tokens, newselectedindexes);
                    for(let i = 0; i < this.selectedtokens.length; i++){
                        this.classesPerToken[i] = false;
                    }
                },
                deep: true
            }
        },
        computed:{
            shownclassespertoken:function () {
                console.log('Checkpoint shownclassespertoken: ');
                return this.classesPerToken[this.index];
            }
        },
        methods: {
            showClasses: function (index) {
                console.log('Index for shown classes: '+index);
                this.index = index;
                this.classesPerToken[index] = !this.classesPerToken[index];
            },
            changeClass: function (newClass) {
                console.log(this.selectedtokens[0].content + " with class " + this.selectedtokens[0].semanticClass+ " now is " + newClass);
                this.selectedtokens[0].semanticClass = newClass;
                let socket = io('http://localhost:8080');
                socket.emit('changeClass', this.selectedtokens[0], this.docid);
            }
        }
    }
</script>