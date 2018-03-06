<template>
    <component :is="changing"
               v-bind:newtitle="newtitle"
               v-bind:document="document"
               v-on:editing="editing($event)"
               v-on:deleted="deleted($event)">
    </component>
</template>

<script>
    import editdoc from './editdocument.vue';
    import showdoc from './showdocument.vue';

    export default {
        props: {
            document: Object
        },
        data: function () {
            return {
                document: this.document,
                changing: 'showdoc',
                newtitle: ''
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
                    this.newtitle = this.document.name;
                    console.log('newtitle Var is set:' + this.newtitle + JSON.stringify(this.document));
                    this.changing = 'editdoc';
                }
                else {
                    this.changing = 'showdoc';
                    this.document.name = newTitle;
                    console.log('showing this title now: '+ this.document.name);
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