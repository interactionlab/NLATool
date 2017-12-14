<template>
    <div class="mdl-cell mdl-cell--12-col contentColor">
        <div>
            <!--Switch between word notes and text notes-->
        </div>
        <component :is="noteMode" v-bind:clickedword="clickedword" v-bind:docid="docid"
                   v-bind:notes="notes" ></component>
    </div>
</template>
<script>
    import wordnotes from './components/analysis/notes/wordnotes.vue';

    export default {
        props: {
            wordnotesp: Array,
            clickedword: String,
            docid: String,
            notes: Array
        },
        data: function () {
            return {
                noteMode: 'wordnotes',
                wordnotesp: this.wordnotesp,
                clickedword: this.clickedword,
                docid: this.docid,
                notes: this.notes
            }
        },
        methods:{

        },
        components: {
            wordnotes
        }
    }
</script>