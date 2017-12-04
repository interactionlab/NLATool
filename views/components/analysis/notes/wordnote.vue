<template>
    <div class="mdl-grid" style="width: 100%">
        <a>Link of word</a>
        <p class="mdl-cell mdl-cell--12-col graybox" v-on:click="edit" >{{ wordnote }}</p>
        <!--TODO:@Emmi Replace with Icons-->
        <button class="mdl-button" v-on:click="deleting">Deleteicon</button>
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
                this.$emit('edit', [this.wordnote]);
            },
            deleting: function () {
                //1. delete entry in db
                //2. delete current component
            }
        }
    }
</script>