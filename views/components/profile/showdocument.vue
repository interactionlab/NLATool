<template>
    <li class="mdl-list__item contentColor" v-on:mouseover="showButns" v-on:mouseout="hideButns" style="padding:0em">
        <form action="/profile/loadDocument" method="post"
              class="mdl-list__item-primary-content contentColor">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect contentColor"
                    name="docID"
                    style="width:100%;text-align:left;text-transform:initial"
                    v-bind:value="document.docID"
                    v-on:click="loadingClick"
            >{{document.name}}</button>
        </form>
        
        <div class="mdl-list__item-secondary-action overridemargin" v-show="ishovered">
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
    </li>    
</template>

<script>
    export default {
        props: {
            document: Object,
            displayloading : String,
        },
        data: function () {
            return {
                ishovered: false,
                document: this.document,
                changing: false,
                displayloading : this.displayloading
            }
        },
        methods: {
            loadingClick: function () {
                console.log("test");
                this.displayloading = "block";
                this.$emit('displayloading', this.displayloading);
            },
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
            hasCancelListener(){
              return this.$listeners && this.$listeners.cancel
            }
        },
    }
</script>

<style scoped>

</style>