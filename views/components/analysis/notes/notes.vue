<template>
    <div class="mdl-cell mdl-cell--12-col contentColor height100">
        <component :is="noteMode"
                   v-bind:serverip="serverip"
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
            serverip: { type: String, default: "" },
            wordnotesp: { type: Array, default: function () { return [] }},
            selectedindexes: { type: Object, default: null },
            docid: { type: Number, default: -1 },
            notes: { type: Array, default: function () { return [] }},
            tokens: { type: Array, default: function () { return [] }},
            notemodes: { type: Object, default: null },
        },
        data: function () {
            return {
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