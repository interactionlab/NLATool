<template>
    <div>
        <a>Set a Link for word</a>
        <textarea v-model="note"></textarea>
        <button v-on:click="save"></button>
        <button v-on:click="back"></button>
    </div>
</template>
<script>
    export default {
        props:{
            note: String,
        },
        data: function () {
            return{
                note: this.note
            }
        },
        methods: {
            back: function(){
                this.$emit()
            },
            save: function(){
                //TODO: send note to Server -> DB
                //TODO: change Component to wordnotes
            }
        }
    }
</script>