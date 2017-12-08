<template>
    <div class="mdl-grid" style="width: 100%">
        <textarea class="mdl-cell mdl-cell--12-col graybox" v-model="newnote"></textarea>
        <button class="mdl-button" v-on:click="save">Save</button>
        <button class="mdl-button" v-on:click="back">Back</button>
    </div>
</template>
<script>
    export default {
        props:{
            clickedword: String,
            docid: String
        },
        data: function () {
            return{
                note: this.note,
                clickedword:this.clickedword,
                docid: this.docid,
                newnote: ''
            }
        },
        computed:{
          note:function (newNote) {
              this.docid = newNote.docid;
              this.newnote = newNote.content;
          }
        },
        methods: {
            back: function(){
                this.$emit('back');
            },
            save: function(){
                console.log('DOCID: '+this.docid);
                let socket = io('http://localhost:8080');

                socket.emit('savewordnote', this.note, this.clickedword, this.docid);
                this.$emit('back');
            }
        }
    }
</script>