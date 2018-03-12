<template>
    <div class="mdl-grid textfieldCorrection newwordnote">
        <p class="mdl-cell mdl-cell--12-col"
           v-on:click="jumpMarkText">{{selectedtext}}</p>
        <form class="mdl-cell mdl-cell--8-col">
            <div class="mdl-textfield mdl-js-textfield textfieldCorrection">
                <component is="autotextarea"
                           class="mdl-textfield__input inputFieldNote contentColor"
                           v-bind:inputtext="newnote"
                           v-bind:submitit="submitit"
                           v-on:submitit="save($event)"
                           >
                </component>
            </div>
        </form>
        <div class="mdl-cell mdl-cell--4-col">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:click="save2">
                <i class="material-icons">done</i>
            </button>
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:click="back">
                <i class="material-icons">clear</i>
            </button>
            <button class="mdl-button  mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:click="deleting"
                    id="noteMenu">
                <i class="material-icons">delete</i>
            </button>
        </div>
    </div>
</template>
<script>
    import getselectedtext from 'views/mixins/analysis/gettokensofselectedtext.js';
    import autotextarea from '/global/autosizingtextarea.vue';

    export default {
        mixins: [getselectedtext],
        components: {
            autotextarea
        },
        props: {
            serverip: { type: String, default : ''},
            selectedindexes: { type: Object, default: null },
            docid: { type: Number, default: -1 },
            newnote: { type: String, default: "" },
            wordnotedb: { type: Object, default: null },
            tokens: { type: Array, default: function () { return [] }},
        },
        data: function () {
            return {
                selectedtext: '',
                submitit: false
            }
        },
        methods: {
            back: function () {
                this.$emit('back', [-10, -10, -10]);
            },
            save: function (newnote) {
                //console.log('DOCID: ' + this.docid + ' : ' + this.selectedindexes);
                if (typeof this.selectedindexes !== 'undefined'
                    && this.selectedindexes.start !== -1
                    && this.selectedindexes.end !== -1) {
                    let socket = io(this.serverip+':8080');
                    if (typeof this.wordnotedb === 'undefined') {
                        socket.emit('savewordnote', newnote, this.docid, this.selectedindexes);
                        //TODO: get noteID from DB in callback and correct it while/after render in the background
                        let tempNote = {
                            docID: this.docid,
                            noteID: -1,
                            content: newnote,
                            textIndex1: this.selectedindexes.start,
                            textIndex2: this.selectedindexes.end
                        };
                        this.newnote = '';
                        this.selectedindexes = {};
                        this.$emit('back', [-1, 1, tempNote]);
                    } else {
                        socket.emit('updatewordnote', this.wordnotedb.noteID, newnote);
                        this.wordnotedb.content = newnote;
                        this.$emit('back', [this.wordnotedb.noteID, 2, this.wordnotedb]);
                    }
                }
                this.submitit = false;
            },
            save2:function () {
                this.submitit = true;
            },
            deleting: function () {
                if (typeof this.selectedindexes !== 'undefined'
                    && this.selectedindexes.start !== -1
                    && this.selectedindexes.end !== -1) {
                    let socket = io(this.serverip+':8080');
                    socket.emit('deletenote', this.wordnotedb.noteID);
                    this.$emit('back', this.wordnotedb.nodeID, 0);
                }
            },
            jumpMarkText: function () {
                //href bahavior for #selectedindexes.start
            }
        },
        watch: {
            selectedindexes: {
                handler: function (newSelectedIndexes) {
                    if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                        this.selectedtext = this.generateText(this.gettokensofselectedtext(this.tokens, newSelectedIndexes));

                    }
                },
                deep: true
            },
        }
    }
</script>