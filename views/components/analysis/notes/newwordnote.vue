<template>
    <div>
        <p>{{clickedword}}</p>
        <div class="mdl-grid">
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
                <textarea class="mdl-cell mdl-cell--12-col mdl-textfield__input contentColor"
                      style="width: 100%"
                      v-model="newnote"
                      id="textbox"
                      type="text"
                      rows="1">
                </textarea>
                <label class="mdl-textfield__label" for="textbox">
                    New+
                </label>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-layout-spacer"></div>
            <div class="mdl-cell mdl-cell--4-col">
                <button class="mdl-button "
                        v-on:click="save">Save
                </button>
                <button class="mdl-button "
                        v-on:click="back">Back
                </button>
                <button class="mdl-button  mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                        v-on:click="deleting"
                        id="noteMenu">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            clickedword: String,
            docid: String
        },
        data: function () {
            return {
                note: this.note,
                clickedword: this.clickedword,
                docid: this.docid,
                newnote: '',
            }
        },
        computed: {
            note: function (newNote) {
                this.docid = newNote.docid;
                this.newnote = newNote.content;
            }
        },
        methods: {
            back: function () {
                this.$emit('back');
            },
            save: function () {
                console.log('DOCID: ' + this.docid);
                let socket = io('http://localhost:8080');

                socket.emit('savewordnote', this.note, this.clickedword, this.docid);
                this.$emit('back');
            },
            deleting: function () {
                console.log('DOCID: ' + this.docid);
                let socket = io('http://localhost:8080');

                socket.emit('deletenote', this.note, this.clickedword, this.docid);
                this.$emit('back');
            }
        }
    }
</script>