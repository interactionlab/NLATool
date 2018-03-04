<template>
    <div class="mdl-grid">
        <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--8-col contentColor">
            <input type="text"
                   v-model="newtitle"
                   v-on:keyup.enter="edit"
                   v-on:keyup.esc="back"
                   class="mdl-textfield__input"/>
        </div>
        <div class="mdl-cell mdl-cell--4-col contentColor">
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