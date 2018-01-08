<template>
    <div class="mdl-grid">
        <input type="text"
               v-model="newTitle"
               v-on:keyup.enter="edit"
               v-bind:value="document.name"
               class="mdl-cell mdl-cell--8-col contentColor"/>
        <div class="mdl-cell mdl-cell--4-col contentColor">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect"
                    v-on:click="edit"
            >Save</button>
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect"
                    v-on:click="back"
                    id="noteMenu"
            >Back</button>
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
                document: this.document,
                changing: 'showdoc',
                newTitle: ''
            }
        },
        methods: {
            edit: function () {
                let socket = io('http://localhost:8081');
                socket.emit('changeTitle', this.document.docID, this.newTitle);
                this.$emit('editing', this.newTitle);
            },
            back: function(){
                this.$emit('editing', this.document.name);
            }
        },
        computed: {}
    }
</script>

<style scoped>

</style>