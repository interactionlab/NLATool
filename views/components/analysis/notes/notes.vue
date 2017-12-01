<template>
    <div class="mdl-cell mdl-cell--12-col graybox">
        <div>
            <!--Switch between word notes and text notes-->
        </div>
        <component :is="noteMode"></component>
    </div>
</template>
<script>
    import wordnotes from './components/analysis/notes/wordnotes.vue';
    export default {
        props:{
            wordnotesp: Array
        },
        data: function () {
            return{
                noteMode: 'wordnotes',
                wordnotesp: this.wordnotesp
            }
        },
        components:{
            wordnotes
        }
    }
</script>