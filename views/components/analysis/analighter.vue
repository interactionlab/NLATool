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
            serverip: { type: String, default: "" },
            tokens: { type: Array, default: [] },
            selectedindexes: { type: Object, default: null },
            showmode: { type: String, default: "" },
            docid: { type: String, default: '' },
            classestomark: { type: Object, default: null },
            tokenstoshow: { type: Array, default: [] },
            colindex: { type: Number, default: -1 },
            contentcontrol: { type: Object, default: null },
            entitytoline: { type: Array, default: [] },
            whereislinefrom: { type: String, default: "" },
        },
        data: function () {
            return {
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