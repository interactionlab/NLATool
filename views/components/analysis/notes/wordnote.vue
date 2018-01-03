<template>
    <div class="contentColor"
         v-on:mouseover="showButns"
         v-on:mouseout="hideButns">
        <div class="mdl-grid"
             v-if="!editing">
            <div class="mdl-cell--12-col contentColor">
                <p>{{wordnotedb.word}}</p>
            </div>
            <div class="mdl-cell--10-col contentColor">
                <p v-on:click="edit">{{ wordnotedb.content }}</p>
            </div>
            <div class="mdl-cell mdl-cell--2-col contentColor"
                 v-show="ishovered">
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                        v-on:click="edit">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                        v-on:click="deleting"
                        id="noteMenu">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
        <component is="newwordnote"
                   v-else
                   v-bind:wordnotedb="wordnotedb"
                   v-bind:newnote="wordnotedb.content"
                   v-bind:clickedword="clickedword"
                   v-bind:docid="this.docid"
                   v-on:back="back($event)">
        </component>
    </div>
</template>
<script>
    import newwordnote from './components/analysis/notes/newwordnote.vue';

    export default {
        props: {
            wordnotedb: Object,
            docid: String,
        },
        data: function () {
            return {
                wordnotedb: this.wordnotedb,
                ishovered: false,
                editing: false,
                docid: this.docid,
                clickedword: {
                    wordID: '',
                    word: ''
                }
            }
        },
        methods: {
            edit: function () {
                this.setclickedword();
                this.editing = true;
                this.$emit('edit', [this.wordnotedb]);
            },
            deleting: function () {
                console.log('DOCID: ' + this.docid);
                let socket = io('http://localhost:8080');

                socket.emit('deletenote', this.wordnotedb.noteID, this.clickedword.wordID, this.docid);
                this.editing = false;
            },
            showButns: function () {
                this.ishovered = true;
                console.log('got hovered!');
            },
            hideButns: function () {
                this.ishovered = false;
            },
            setclickedword: function () {
                this.clickedword.wordID = this.wordnotedb.wordID;
                this.clickedword.content = this.wordnotedb.content;
            },
            back: function (noteToChange) {
                console.log('Check: ' + noteToChange[0] +' : ' + noteToChange[1] + ' : ' + noteToChange[2]);
                this.editing = false;
                if(noteToChange[0]!== -10 && noteToChange[1]!== -10 && noteToChange[2]!== -10){
                    this.$emit('back', noteToChange);
                }
            }
        },
        components: {
            newwordnote
        }
    }
</script>
<style>
    .hover {
        visibility: visible;
    }
</style>