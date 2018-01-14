<template>
    <div class="mdl-cell mdl-cell--12-col contentColor">
        <component is="wordnote"
                   v-for="wordnotedb in notes"
                   v-bind:wordnotedb="wordnotedb"
                   v-bind:key="wordnotedb.noteID"
                   v-bind:ishovered="ishovered"
                   v-bind:docid="docid"
                   v-bind:tokens="tokens"
                   v-on:edit="editnote($event)"
                   v-on:back="back($event)"
                   v-on:mouseover="showButns"
                   v-on:mouseout="hideButns">
        </component>

        <component is="newwordnote"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:docid="this.docid"
                   v-bind:tokens="tokens"
                   v-on:back="back($event)">
        </component>

    </div>
</template>
<script>
    import wordnote from './components/analysis/notes/wordnote.vue';
    import newwordnote from './components/analysis/notes/newwordnote.vue';

    export default {
        props: {
            docid: String,
            notes: Array,
            selectedindexes: Object,
            tokens: Object
        },
        data: function () {
            return {
                note: '',
                docid: this.docid,
                notes: this.notes,
                selectedindexes: this.selectedindexes,
                ishovered: false,
                tokens: this.tokens
            }
        },
        methods: {
            editnote: function (editText) {
                this.note = editText;
            },
            showButns: function () {
                this.ishovered = true;
                console.log('got hovered!');
            },
            hideButns: function () {
                this.ishovered = false;
            },
            back: function (noteToChange) {
                console.log('got here: 3');
                console.log('action: '+ noteToChange[1]);
                if (noteToChange[1] === 0) {
                    //delete
                    let i = 0;
                    for(i = 0; i < this.notes.length; i++){
                        if(this.notes[i].noteID === noteToChange[0]){
                            break;
                        }
                    }
                    this.notes.splice(i,1);
                } else if (noteToChange[1] === 1) {
                    //new
                    this.notes.splice(this.notes.length, 0, noteToChange[2]);
                } else if (noteToChange[1] === 2) {
                    //update
                    let i = 0;
                    for(i = 0; i < this.notes.length; i++){
                        if(this.notes[i].noteID === noteToChange[1]){
                            break;
                        }
                    }
                    this.notes.splice(i-1,1,noteToChange[2]);
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