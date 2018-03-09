<template>
    <div>
        <component :is="showmode"
                   v-bind:serverip="serverip"
                   v-bind:tokens="tokens"
                   v-bind:colindex="colindex"
                   v-bind:tokenstoshow="tokenstoshow"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:docid="docid"
                   v-bind:classestomark="classestomark"
                   v-bind:contentcontrol="contentcontrol"
                   v-bind:entitytoline="entitytoline"
                   v-bind:whereislinefrom="whereislinefrom"
                   v-on:togglesemanticlass="togglesemanticlass($event)"
                   v-on:hoverlinesetoffsetend="hoverlinesetoffsetend($event)"
                   v-on:pickresearchresult="pickresearchresult($event)">

        </component>
    </div>
</template>
<script>
    import nerVue from './components/analysis/ner.vue';
    import necVue from './components/analysis/nec.vue';
    import correction from './components/analysis/correction.vue';
    import entitiesview from './components/analysis/entitiesview.vue';


    export default {

        props: {
            serverip: String,
            tokens: Array,
            selectedindexes: Object,
            showmode: String,
            docid: String,
            classestomark: Object,
            tokenstoshow: Array,
            colindex: Number,
            contentcontrol: Object,
            entitytoline: Array,
            whereislinefrom: String,
        },
        data: function () {
            return {
                tokens: this.tokens,
                serverip: this.serverip,
                showmode: this.showmode,
                selectedindexes: this.selectedindexes,
                docid: this.docid,
                classestomark: this.classestomark,
                tokenstoshow:this.tokenstoshow,
                colindex:this.colindex,
                contentcontrol:this.contentcontrol,
                entitytoline:this.entitytoline,
                whereislinefrom: this.whereislinefrom,
            }
        },
        methods: {
            togglesemanticlass:function (newClassesToMark) {
                this.$emit('togglesemanticlass',newClassesToMark);
            },
            hoverlinesetoffsetend:function (event) {
                this.$emit('hoverlinesetoffsetend',event);
            },
            pickresearchresult:function (textIndex) {
                this.$emit('pickresearchresult', textIndex);
            },
        },
        components: {
            nerVue,
            necVue,
            correction,
            entitiesview
        }
    }
</script>