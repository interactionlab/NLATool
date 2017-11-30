<template>
    <div>
        <a>Link of word</a>
        <p>{{ wordnote }}</p>
        <button v-on:click="edit">Editicon</button>
        <button v-on:click="deleting">Deleteicon</button>
    </div>
</template>
<script>
    export default {
        props:{
            wordnote: String
        },
        data: function () {
            return{
                wordnote: this.wordnote
            }
        },
        methods: {
            edit: function(){

            },
            deleting: function () {
                //1. delete entry in db
                //2. delete current component
            }
        }
    }
</script>