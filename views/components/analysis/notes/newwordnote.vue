<template>
    <div class="mdl-grid">
        <p class="mdl-cell mdl-cell--12-col">{{clickedword.word}}</p>
        <form class="mdl-cell mdl-cell--8-col">
            <div class="mdl-textfield mdl-js-textfield">
                <textarea class="mdl-textfield__input contentColor"
                          v-model="newnote"
                          v-on:keyup.enter="save"
                          id="textbox"
                          type="text"
                          rows="1">
                </textarea>
                <label class="mdl-textfield__label" for="textbox">
                    New+
                </label>
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
    export default {
        props: {
            clickedword: String,
            docid: String,
            newnote: String,
            wordnotedb: Object
        },
        data: function () {
            return {
                clickedword: this.clickedword,
                docid: this.docid,
                newnote: this.newnote,
                wordnotedb: this.wordnotedb
            }
        },
        methods: {
            back: function () {
                this.$emit('back');
            },
            save: function () {
                console.log('DOCID: ' + this.docid + ' : ' + this.clickedword.wordID);
                let socket = io('http://localhost:8080');
                if (typeof this.wordnotedb === 'undefined') {
                    socket.emit('savewordnote', this.newnote, this.clickedword.wordID, this.docid);
                    let tempNote = {
                        docID: this.docid,
                        noteID: -1,
                        wordID: -1,
                        content: this.newnote,
                        word: 'Temporaly not possible'
                    };
                    this.newnote = '';
                    this.clickedword = {};
                    this.$emit('back', -1, 1,tempNote);
                } else {
                    socket.emit('updatewordnote', this.wordnotedb.noteID, this.newnote);
                    this.$emit('back', this.wordnotedb.noteID, 2, this.wordnotedb);
                }
            },
            deleting: function () {
                console.log('DOCID: ' + this.docid);
                let socket = io('http://localhost:8080');
                socket.emit('deletenote', this.wordnotedb.noteID, this.clickedword.wordID, this.docid);
                this.$emit('back', this.wordnotedb.nodeID, 0);
            }
        }
    }
</script>