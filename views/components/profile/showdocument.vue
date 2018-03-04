<template>
    <div v-on:mouseover="showButns"
         v-on:mouseout="hideButns"
         class="mdl-grid">
        <form action="/profile/loadDocument"
              method="post"
              class="mdl-cell--10-col contentColor">
            <button class="mdl-cell--12-col mdl-button mdl-js-button mdl-js-ripple-effect contentColor"
                    name="docID"
                    style="width:100%;text-align:left;text-transform:initial"
                    v-bind:value="document.docID"
            >{{document.name}}
            </button>
        </form>
        <div class="mdl-cell mdl-cell--2-col contentColor overridemargin"
             v-show="ishovered">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:click="editing">
                <i class="material-icons">edit</i>
            </button>
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:click="deleting"
                    id="noteMenu">
                <i class="material-icons">delete</i>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            document: Object
        },
        data: function () {
            return {
                ishovered: false,
                document: this.document,
                changing: false,
            }
        },
        methods: {
            showButns: function () {
                this.ishovered = true;
            },
            hideButns: function () {
                this.ishovered = false;
            },
            editing: function () {
                this.$emit('editing');
            },
            deleting: function () {
                let socket = io('http://localhost:8081');
                socket.emit('deleteDocument', this.document.docID);
                this.$emit('deleted', this.document.docID);
            },
        },
    }
</script>

<style scoped>

</style>