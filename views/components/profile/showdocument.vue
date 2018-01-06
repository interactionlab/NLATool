<template>
    <div v-on:mouseover="showButns"
         v-on:mouseout="hideButns"
         class="mdl-grid">
        <form action="/profile/loadDocument"
              method="post"
              class="mdl-cell--10-col contentColor">
            <button class="mdl-cell--12-col contentColor"
                    name="docID"
                    v-bind:value="document.docID"
            >{{document.name}}
            </button>
        </form>
        <div class="mdl-cell mdl-cell--2-col contentColor"
             v-show="ishovered">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:click="editing">
                <i class="material-icons">edit</i>
            </button>
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:clickt="deleting"
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
                console.log('got hovered!');
            },
            hideButns: function () {
                this.ishovered = false;
            },
            editing: function () {
                this.$emit('editing');
            },
            deleting: function () {

            },
        },
    }
</script>

<style scoped>

</style>