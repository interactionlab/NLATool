<template>
    <div class="mdl-grid" style="width: 100%">
        <p>{{clickedword}}</p>
        <textarea class="mdl-cell mdl-cell--12-col graybox" v-model="note"></textarea>
        <button class="mdl-button" v-on:click="save">Save</button>
        <button class="mdl-button" v-on:click="back">Back</button>
    </div>
</template>
<script>

    export default {
        props:{
            note: String,
            clickedword: String,
            docID: String
        },
        data: function () {
            return{
                note: this.note,
                clickedword:this.clickedword,
                docID: this.docID
            }
        },
        methods: {
            back: function(){
                this.$emit('back');
            },
            save: function(){
                let socket = io('http://localhost:8080');
                socket.emit('savewordnote', this.note, this.clickedword, this.docID);
                this.$emit('back');
            }
        }
    }
</script>