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
                   v-on:back="shownotes"
        ></component>

    </div>
</template>
<script>
    import wordnote from './components/analysis/notes/wordnote.vue';
    import newwordnote from './components/analysis/notes/newwordnote.vue';

    export default {
        props: {
            wordnotes: Array,
            docid: String,
            notes: Array,
            clickedword: Object
        },
        data: function () {
            return {
                newnote: false,
                note: '',
                wordnotes: this.wordnotes,
                docid: this.docid,
                notes: this.notes,
                clickedword: this.clickedword,
                ishovered: false
            }
        },
        methods: {
            editnote: function (editText) {
                this.note = editText;
                this.newnote = true;
            },
            shownotes: function () {
                this.newnote = false;
            },
            showButns: function () {
                this.ishovered = true;
                console.log('got hovered!');
            },
            hideButns: function () {
                this.ishovered = false;
            }
        },
        computed: {},
        components: {
            wordnote,
            newwordnote
        }
    }
</script>