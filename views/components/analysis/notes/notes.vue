<template>
    <div class="mdl-cell mdl-cell--12-col graybox">
        <div>
            <!--Switch between word notes and text notes-->
        </div>
        <component :is="noteMode" v-bind:clickedword="clickedword"  v-bind:docID="docID"></component>
    </div>
</template>
<script>
    import wordnotes from './components/analysis/notes/wordnotes.vue';
    export default {
        props:{
            wordnotesp: Array,
            clickedword: String,
            docID:String
        },
        data: function () {
            return{
                noteMode: 'wordnotes',
                wordnotesp: this.wordnotesp,
                clickedword: this.clickedword,
                docID: this.docID
            }
        },
        components:{
            wordnotes
        }
    }
</script>