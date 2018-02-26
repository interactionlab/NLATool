<template>
    <div class="mdl-cell mdl-cell--12-col contentColor height100">
        <component :is="noteMode"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:docid="docid"
                   v-bind:tokens="tokens"
                   v-bind:notes="notes"
                   v-on:jumpmarktext="jumpmarktext($event)">
        </component>
    </div>
</template>
<script>
    import wordnotes from './components/analysis/notes/wordnotes.vue';
    import globalnote from './components/analysis/notes/globalnote.vue'

    export default {
        props: {
            wordnotesp: Array,
            selectedindexes: Object,
            docid: String,
            notes: Array,
            tokens: Object,
            notemodes: Object
        },
        data: function () {
            return {
                wordnotesp: this.wordnotesp,
                selectedindexes: this.selectedindexes,
                docid: this.docid,
                notes: this.notes,
                tokens: this.tokens,
                notemodes: this.notemodes
            }
        },
        methods: {
            jumpmarktext: function (newSelectedIndexes) {
                this.selectedindexes = newSelectedIndexes;
                this.$emit('jumpmarktext', this.selectedindexes);
            },
        },
        computed: {
            noteMode: function () {
                if (this.notemodes.wordnote && !this.notemodes.globalnote) {
                    return 'wordnotes';
                } else {
                    return 'globalnote';
                }
            }
        },
        components: {
            wordnotes,
            globalnote
        }
    }
</script>