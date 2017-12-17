<template>
    <div class="contentColor"
         v-on:mouseover="showButns"
         v-on:mouseout="hideButns">
        <div class="mdl-cell mdl-cell--10-col contentColor">
            <p>The linked word from the DB</p>
        </div>
        <div class="mdl-grid"
             v-if="!editing">
            <div class="mdl-cell--10-col contentColor">
                <p v-on:click="edit">{{ wordnotedb.content }}</p>
            </div>
            <div class="mdl-cell mdl-cell--2-col contentColor"
                 v-show="ishovered">
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                        v-on:click="edit">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                        v-on:click="deleting"
                        id="noteMenu">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
        <component is="newwordnote"
                   v-else
                   v-bind:note="wordnotedb"
                   v-bind:newnote="wordnotedb.content"
                   v-bind:clickedword="clickedword"
                   v-bind:docid="this.docid"
                   v-on:back="editing = false">
        </component>
    </div>
</template>
<script>
    import newwordnote from './components/analysis/notes/newwordnote.vue';
    export default {
        props: {
            wordnotedb: Object,
            docid: String,
        },
        data: function () {
            return {
                wordnotedb: this.wordnotedb,
                ishovered: false,
                editing: false,
                docid: this.docid,
                clickedword:{
                    wordID:'',
                    word:''
                }
            }
        },
        methods: {
            edit: function () {
                this.editing = true;
                this.$emit('edit', [this.wordnotedb]);
            },
            deleting: function () {
                //1. delete entry in db
                //2. delete current component
            },
            showButns: function () {
                this.ishovered = true;
                console.log('got hovered!');
            },
            hideButns: function () {
                this.ishovered = false;
            }
        },
        computed:{
            clickedword:function () {
                this.wordID = this.wordnotedb.wordID;
                this.word = this.wordnotedb.word;
            }

        },
        components:{
            newwordnote
        }
    }
</script>
<style>
    .hover {
        visibility: visible;
    }
</style>