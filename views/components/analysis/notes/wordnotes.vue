<template>
    <div class="mdl-cell mdl-cell--12-col contentColor">
        <component is="wordnote"
                   v-for="wordnotedb in notes"
                   v-bind:wordnotedb="wordnotedb"
                   v-bind:key="wordnotedb.noteID"
                   v-bind:ishovered="ishovered"
                   v-bind:docid="docid"
                   v-on:edit="editnote($event)"
                   v-on:mouseover="showButns"
                   v-on:mouseout="hideButns"
        ></component>

        <component is="newwordnote"
                   v-bind:clickedword="clickedword"
                   v-bind:docid="this.docid"
        ></component>

    </div>
</template>
<script>
    import wordnote from './components/analysis/notes/wordnote.vue';
    import newwordnote from './components/analysis/notes/newwordnote.vue';

    export default {
        props: {
            docid: String,
            notes: Array,
            clickedword: Object
        },
        data: function () {
            return {
                note: '',
                docid: this.docid,
                notes: this.notes,
                clickedword: this.clickedword,
                ishovered: false
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
            back: function (noteID, action, note) {
                if (action === 0) {
                    //delete
                    let i = 0;
                    for(i = 0; i < this.notes.length; i++){
                        if(this.notes[i].noteID === noteID){
                            break;
                        }
                    }
                    console.log('debug splice: ' + typeof this.notes + ' : ' + i + ' : ' + JSON.stringify(this.notes));
                    this.notes.splice(i-1,1);
                    console.log('debug end: ' +  JSON.stringify(this.notes));
                } else if (action === 1) {
                    //new
                    console.log('debug splice: ' + typeof this.notes + ' : ' + i + ' : ' + JSON.stringify(this.notes));
                    this.notes.splice(this.notes.length, 0, note);
                    console.log('debug end: ' +  JSON.stringify(this.notes));
                } else if (action === 2) {
                    //update
                    let i = 0;
                    for(i = 0; i < this.notes.length; i++){
                        if(this.notes[i].noteID === noteID){
                            break;
                        }
                    }
                    console.log('debug splice: ' + typeof this.notes + ' : ' + i + ' : ' + JSON.stringify(this.notes));
                    this.notes.splice(i-1,1,note);
                    console.log('debug end: ' +  JSON.stringify(this.notes));
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