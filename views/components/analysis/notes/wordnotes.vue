<template>
    <div>
        <div v-if="newnote">
            <component is="newwordnote" v-bind:note="this.note"></component>
        </div>
        <div v-else>
            <component is="wordnote" v-for="notesfromdbnotcorrectyet" v-on:edit="editnote($event)"></component>
        </div>
        <div>

        </div>
    </div>
</template>
<script>
    import wordnote from './components/analysis/notes/wordnote.vue';
    import newwordnote from './components/analysis/notes/newwordnote.vue';
    export default {
        props:{
            wordnotes: Array
        },
        data: function () {
            return{
                newnote: false,
                note: '',
                wordnotes: this.wordnotes
            }
        },
        methods:{
            editnote:function (editText) {
                this.note = editText;
                this.newnote= true;
            }
        },
        components:{
            wordnote,
            newwordnote
        }
    }
</script>