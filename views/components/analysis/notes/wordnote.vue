<template>
    <div class="contentColor">
        <div class="mdl-cell--12-col contentColor" style="width: 100%">
            <p></p>
        </div>

        <div class="mdl-cell--12-col contentColor" style="width: 100%">
            <p  v-on:click="edit" >{{ wordnotedb.content }}</p>
        </div>

        <div class="mdl-cell--12-col contentColor" style="width: 100%; text-align: right">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" v-on:click="deleting" id="noteMenu">
                <i class="material-icons">delete</i>
            </button>
        </div>
    </div>
</template>
<script>
    export default {
        props:[
            'wordnotedb'
        ],
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