<template>
    <div class="mdl-grid" style="width: 100%">
        <a>Set a Link for word</a>
        <textarea class="mdl-cell mdl-cell--12-col graybox" v-model="note"></textarea>
        <button class="mdl-button" v-on:click="save">Save</button>
        <button class="mdl-button" v-on:click="back">Back</button>
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
                this.$emit('back');
            },
            save: function(){
                let socket = io('http://localhost:8080');
                socket.emit('savewordnote', this.note, 'genericword');
                socket.close();
                this.$emit('back');
            }
        }
    }
</script>