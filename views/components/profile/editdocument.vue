<template>
    <input type="text"
           v-model="newTitle"
           v-on:keyup.enter="edit"
           v-bind:value="document.name"
    />
    
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
        },
        computed: {}
    }
</script>

<style scoped>

</style>