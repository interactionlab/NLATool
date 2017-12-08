<template>
    <div class="mdl-grid" style="width: 100%">
        <p>{{clickedword}}</p>
        <p class="mdl-cell mdl-cell--12-col graybox" v-on:click="edit" >{{ wordnotedb.content }}</p>
        <!--TODO:@Emmi Replace with Icons-->
        <button class="mdl-button" v-on:click="deleting">Deleteicon</button>
    </div>
</template>
<script>
    export default {
        props:{
            wordnotedb: String
        },
        data: function () {
            return{
                wordnotedb: this.wordnotedb
            }
        },
        methods: {
            edit: function(){
                this.$emit('edit', [this.wordnotedb]);
            },
            deleting: function () {
                //1. delete entry in db
                //2. delete current component
            }
        }
    }
</script>