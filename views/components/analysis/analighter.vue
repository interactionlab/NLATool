<template>
    <div>
        <component :is="showmode"
                   v-bind:serverip="serverip"
                   v-bind:tokens="tokens"
                   v-bind:columnindex="columnindex"
                   v-bind:tokenstoshow="tokenstoshow"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:docid="docid"
                   v-bind:classestomark="classestomark"
                   v-bind:contentcontrol="contentcontrol"
                   v-bind:hoverdata="hoverdata"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:togglesemanticlass="togglesemanticlass($event)"
                   v-on:endhover="endhover($event)"
                   v-on:starthover="starthover($event)">

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
            tokens: { type: Array, default: function () { return [] }},
            selectedindexes: { type: Object, default: null },
            showmode: { type: String, default: "" },
            docid: { type: Number, default: -1 },
            classestomark: { type: Object, default: null },
            tokenstoshow: { type: Array, default: function () { return [] }},
            wordtomarkonhoverdata: { type: Array, default: function () { return [] }},
            columnindex: { type: Number, default: 0 },
            contentcontrol: { type: Object, default: null },
            hoverdata: { type: Object, default: null},
        },
        data: function () {
            return {
            }
        },
        methods: {
            togglesemanticlass:function (newClassesToMark) {
                this.$emit('togglesemanticlass',newClassesToMark);
            },
            endhover:function (event) {
                this.$emit('endhover',event);
            },
            starthover:function (textIndex) {
                this.$emit('starthover', textIndex);
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