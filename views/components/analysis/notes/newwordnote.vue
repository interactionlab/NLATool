<template>
    <div class="mdl-grid">
        <p class="mdl-cell mdl-cell--12-col"
            v-on:click="jumpMarkText">{{selectedtext}}</p>
        <form class="mdl-cell mdl-cell--8-col">
            <div class="mdl-textfield mdl-js-textfield">
                <textarea class="mdl-textfield__input contentColor"
                          v-model="newnote"
                          v-on:keyup.enter="save"
                          id="textbox"
                          type="text"
                          rows="1">
                </textarea>
            </div>
        </form>
        <div class="mdl-cell mdl-cell--4-col">
            <button class="mdl-button "
                    v-on:click="save">Save
            </button>
            <button class="mdl-button "
                    v-on:click="back">Back
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
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';
    export default {
        mixins: [getselectedtext],
        props: {
            selectedindexes: Object,
            docid: String,
            newnote: String,
            wordnotedb: Object,
            tokens: Object
        },
        data: function () {
            return {
                selectedindexes: this.selectedindexes,
                docid: this.docid,
                newnote: this.newnote,
                wordnotedb: this.wordnotedb,
                selectedtext: '',
                tokens:this.tokens
            }
        },
        methods: {
            back: function () {
                this.$emit('back',[-10,-10,-10]);
            },
            save: function () {
                console.log('DOCID: ' + this.docid + ' : ' + this.selectedindexes);
                if (typeof this.selectedindexes !== 'undefined'
                    && this.selectedindexes.start !== -1
                    && this.selectedindexes.end !== -1) {
                    let socket = io('http://localhost:8080');
                    if (typeof this.wordnotedb === 'undefined') {
                        console.log('got here: 0');
                        socket.emit('savewordnote', this.newnote, this.docid, this.selectedindexes);
                        console.log('got here: 1');
                        //TODO: get noteID from DB in callback and correct it while/after render in the background
                        let tempNote = {
                            docID: this.docid,
                            noteID: -1,
                            content: this.newnote,
                            word: this.selectedtext
                        };
                        this.newnote = '';
                        this.selectedindexes = {}
                        console.log('got here: 2');
                        this.$emit('back', [-1, 1, tempNote]);
                    } else {
                        socket.emit('updatewordnote', this.wordnotedb.noteID, this.newnote);
                        this.wordnotedb.content = this.newnote;
                        this.$emit('back', [this.wordnotedb.noteID, 2, this.wordnotedb]);
                    }
                }
            },
            deleting: function () {
                if (typeof this.selectedindexes !== 'undefined'
                    && this.selectedindexes.start !== -1
                    && this.selectedindexes.end !== -1) {
                    let socket = io('http://localhost:8080');
                    socket.emit('deletenote', this.wordnotedb.noteID);
                    this.$emit('back', this.wordnotedb.nodeID, 0);
                }
            },
            jumpMarkText:function () {
                //href bahavior for #selectedindexes.start
            }
        },
        watch: {
            selectedindexes: {
                handler: function (newSelectedIndexes) {
                    console.log('Watcher activated: ' + JSON.stringify(newSelectedIndexes));
                    if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                        this.selectedtext = this.generateText(this.gettokensofselectedtext(this.tokens, newSelectedIndexes));

                    }
                },
                deep: true
            },
        }
    }
</script>