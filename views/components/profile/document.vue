<template>
    <component :is="changing"
               v-bind:newtitle="newtitle"
               v-bind:document="document"
               v-bind:serverip="serverip"
               v-bind:displayloading="displayloading"
               v-on:editing="editing($event)"
               v-on:deleted="deleted($event)"
               v-on:displayloading="displayloadingClicked($event)">
    </component>
</template>

<script>
    import editdoc from './components/profile/editdocument.vue';
    import showdoc from './components/profile/showdocument.vue';

    export default {
        props: {
            document: { type: Object, default: null },
            serverip: { type: String, default: "" },
            displayloading : { type: String, default: "" },
        },
        data: function () {
            return {
                changing: 'showdoc',
                newtitle: '',
            }
        },
        methods: {
            displayloadingClicked: function (displayloading) {
                this.$emit('displayloading', this.displayloading);
            },
            showButns: function () {
                this.ishovered = true;
                //console.log('got hovered!');
            },
            hideButns: function () {
                this.ishovered = false;
            },
            editing: function (newTitle) {
                if (this.changing === 'showdoc') {
                    this.newtitle = this.document.name;
                    //console.log('newtitle Var is set:' + this.newtitle + JSON.stringify(this.document));
                    this.changing = 'editdoc';
                }
                else {
                    this.changing = 'showdoc';
                    this.document.name = newTitle;
                    //console.log('showing this title now: '+ this.document.name);
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