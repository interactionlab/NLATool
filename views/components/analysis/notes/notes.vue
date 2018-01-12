<template>
    <div class="mdl-cell mdl-cell--12-col contentColor">
        <component :is="noteMode"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:docid="docid"
                   v-bind:tokens="tokens"
                   v-bind:notes="notes">
        </component>
    </div>
</template>
<script>
    import wordnotes from './components/analysis/notes/wordnotes.vue';

    export default {
        props: {
            wordnotesp: Array,
            selectedindexes: Object,
            docid: String,
            notes: Array,
            tokens:Object
        },
        data: function () {
            return {
                noteMode: 'wordnotes',
                wordnotesp: this.wordnotesp,
                selectedindexes: this.selectedindexes,
                docid: this.docid,
                notes: this.notes,
                tokens:this.tokens
            }
        },
        methods: {},
        components: {
            wordnotes
        }
    }
</script>