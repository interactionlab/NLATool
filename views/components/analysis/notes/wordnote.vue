<template>
    <div class="contentColor separate"
         v-on:mouseover="showButns"
         v-on:mouseout="hideButns">
        <div class="mdl-grid"
             v-if="!editing">
            <div class="mdl-cell--12-col contentColor"
                v-on:click="jumpMarkText">
                <p>{{linkedtextfornote}}</p>
            </div>
            <div class="mdl-cell--10-col contentColor">
                <p v-on:click="edit">{{wordnotedb.content}}</p>
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
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:tokens="tokens"
                   v-bind:docid="this.docid"
                   v-on:back="back($event)">
        </component>
    </div>
</template>
<script>
    import newwordnote from './components/analysis/notes/newwordnote.vue';
    import gettokensofselectedtext from './mixins/analysis/gettokensofselectedtext.js';
    export default {
        mixins:[gettokensofselectedtext],
        props: {
            wordnotedb: Object,
            docid: String,
            tokens:Object
        },
        data: function () {
            return {
                wordnotedb: this.wordnotedb,
                ishovered: false,
                editing: false,
                docid: this.docid,
                tokens:this.tokens 
            }
        },
        computed:{
            linkedtextfornote:function () {
                let noteRanges = {
                    start:  this.wordnotedb.textIndex1,
                    end: this.wordnotedb.textIndex2
                };
                return this.generateText(this.gettokensofselectedtext(this.tokens, noteRanges));
            }
        },
        methods: {
            edit: function () {
                this.setSelectedRanges();
                this.editing = true;
                this.$emit('edit', [this.wordnotedb]);
            },
            deleting: function () {
                let socket = io('http://localhost:8080');
                socket.emit('deletenote', this.wordnotedb.noteID);
                this.editing = false;
            },
            showButns: function () {
                this.ishovered = true;
                console.log('got hovered!');
            },
            hideButns: function () {
                this.ishovered = false;
            },
            setSelectedRanges: function () {
                this.selectedindexes.start = this.wordnotedb.textIndex1;
                this.selectedindexes.end = this.wordnotedb.textIndex2;
            },
            back: function (noteToChange) {
                console.log('Check: ' + noteToChange[0] +' : ' + noteToChange[1] + ' : ' + noteToChange[2]);
                this.editing = false;
                if(noteToChange[0]!== -10 && noteToChange[1]!== -10 && noteToChange[2]!== -10){
                    this.$emit('back', noteToChange);
                }
            },
            jumpMarkText:function () {
                this.setSelectedRanges();
                this.$emit('jumpmarktext',this.selectedindexes);
                //href #selectesindexes.start behavior
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