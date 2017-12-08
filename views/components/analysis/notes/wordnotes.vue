<template>
    <div>
        <keep-alive>
            <div v-if="newnote">
                <component is="newwordnote" v-bind:note="this.note" v-on:back="shownotes" v-bind:docid="this.docid"
                           v-on:click="test" v-bind:clickedword="clickedword"></component>
            </div>
            <div v-else>
                <component is="wordnote" v-for="wordnotedb in notes" v-bind:wordnotedb="wordnotedb"
                           v-bind:key="wordnotedb.noteID" v-on:edit="editnote($event)"></component>
            </div>
        </keep-alive>
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
        },
        data: function () {
            return {
                newnote: false,
                note: '',
                wordnotes: this.wordnotes,
                docid: this.docid,
                notes: this.notes,
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
            test: function () {
                console.log(this.docid);
            }
        },
        computed: {
            clickedword: function (word) {
                this.newnote = true;
            }
        },
        components: {
            wordnote,
            newwordnote
        }
    }
</script>