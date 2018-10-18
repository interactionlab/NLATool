<template>
    <div class="mdl-cell mdl-cell--12-col contentColor">
        <component class="height100"
                   is="wordnote"
                   v-for="wordnotedb in notes"
                   v-bind:serverip="serverip"
                   v-bind:wordnotedb="wordnotedb"
                   v-bind:key="wordnotedb.noteID"
                   v-bind:ishovered="ishovered"
                   v-bind:docid="docid"
                   v-bind:tokens="tokens"
                   v-bind:selectedindexes="selectedindexes"
                   v-on:edit="editnote($event)"
                   v-on:back="back($event)"
                   v-on:deletenote="deletenote($event)"
                   v-on:jumpmarktext="jumpmarktext($event)"
                   v-on:mouseover="showButns"
                   v-on:mouseout="hideButns">
        </component>

        <component is="newwordnote"
                   v-bind:serverip="serverip"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:docid="this.docid"
                   v-bind:tokens="tokens"
                   v-on:back="back($event)"
                    v-on:resetselectedindexes="resetselectedindexes">
        </component>

    </div>
</template>
<script>
    import wordnote from './components/analysis/notes/wordnote.vue';
    import newwordnote from './components/analysis/notes/newwordnote.vue';

    export default {
        props: {
            serverip: { type: String, default: "" },
            docid: { type: Number, default: -1 },
            notes: { type: Array, default: function () { return [] }},
            selectedindexes: { type: Object, default: null },
            tokens: { type: Array, default: function () { return [] }},
        },
        data: function () {
            return {
                note: '',
                ishovered: false,
            }
        },
        methods: {
            resetselectedindexes:function(){
               this.$emit('resetselectedindexes');
            },
            deletenote:function (noteId) {
                for(let i = 0; i < this.notes.length; i++){
                    if(this.notes[i].noteID === noteId){
                        this.notes.splice(i, 1);
                    }
                }
            },
            jumpmarktext: function (newSelectedIndexes) {
                this.selectedindexes = newSelectedIndexes;
                this.$emit('jumpmarktext', this.selectedindexes);
            },
            editnote: function (editText) {
                this.note = editText;
            },
            showButns: function () {
                this.ishovered = true;
            },
            hideButns: function () {
                this.ishovered = false;
            },
            back: function (noteToChange) {
                if (noteToChange[1] === 0) {
                    //delete
                    let i = 0;
                    for (i = 0; i < this.notes.length; i++) {
                        if (this.notes[i].noteID === noteToChange[0]) {
                            break;
                        }
                    }
                    this.notes.splice(i+1, 1);
                } else if (noteToChange[1] === 1) {
                    //new

                    this.notes.splice(this.notes.length, 0, noteToChange[2]);
                } else if (noteToChange[1] === 2) {
                    //update
                    let i = 0;
                    for (i = 0; i < this.notes.length; i++) {
                        if (this.notes[i].noteID === noteToChange[1]) {
                            break;
                        }
                    }
                    this.notes.splice(i - 1, 1, noteToChange[2]);
                } else {

                }
            }
        },
        components: {
            wordnote,
            newwordnote
        }
    }
</script>