<template>
    <component :is="changing"
               v-bind:document="document"
               v-on:editing="editing($event)"
               v-on:deleted="deleted($event)"
    ></component>
</template>

<script>
    import editdoc from './components/profile/editdocument.vue';
    import showdoc from './components/profile/showdocument.vue';

    export default {
        props: {
            document: Object
        },
        data: function () {
            return {
                document: this.document,
                changing: 'showdoc',
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
            editing: function (newTitle) {
                if (this.changing === 'showdoc') {
                    this.changing = 'editdoc';
                }
                else {
                    this.changing = 'showdoc';
                    this.document.name = newTitle;
                }
            },
            deleted:function(docID){
                this.$emit('deleted', docID);
            }
        },
        computed: {
        },
        components: {
            editdoc,
            showdoc
        }
    }
</script>

<style scoped>

</style>