<template>
    <div class="mdl-grid">
        <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--10-col contentColor" style="margin:0;padding:0.5em 1em 0em 1em">
            <input type="text"
                   v-model="newtitle"
                   v-on:keyup.enter="edit"
                   v-on:keyup.esc="back"
                   class="mdl-textfield__input"/>
        </div>
        <div class="mdl-cell mdl-cell--2-col contentColor" style="margin-bottom:0;margin-top:0">
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:click="edit">
                <i class="material-icons">done</i>
            </button>
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon"
                    v-on:click="back">
                <i class="material-icons">clear</i>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            document: Object,
            newtitle: String
        },
        data: function () {
            return {
                document: this.document,
                changing: 'showdoc',
                newtitle: this.newtitle
            }
        },
        methods: {
            edit: function () {
                let socket = io('http://localhost:8081');

                this.document.name = this.newtitle;
                socket.emit('changeTitle', this.document.docID, this.newtitle);
                this.$emit('editing', this.newtitle);
            },
            back: function () {
                this.$emit('editing', this.document.name);
            }
        },
        computed: {}
    }
</script>

<style scoped>

</style>