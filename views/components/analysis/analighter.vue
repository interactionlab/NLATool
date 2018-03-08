<template>
    <div>
        <component :is="showmode"
                   v-bind:tokens="tokens"
                   v-bind:colindex="colindex"
                   v-bind:tokenstoshow="tokenstoshow"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:docid="docid"
                   v-bind:classestomark="classestomark"
                   v-bind:contentcontrol="contentcontrol"
                   v-bind:hoveredentitiy="hoveredentitiy"
                   v-on:togglesemanticlass="togglesemanticlass($event)"
                   v-on:hoverlinesetoffsetend="hoverlinesetoffsetend($event)">

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
            tokens: Array,
            selectedindexes: Object,
            showmode: String,
            docid: String,
            classestomark: Object,
            tokenstoshow: Array,
            colindex: Number,
            contentcontrol: Object,
            hoveredentitiy: Array,
        },
        data: function () {
            return {
                tokens: this.tokens,
                showmode: this.showmode,
                selectedindexes: this.selectedindexes,
                docid: this.docid,
                classestomark: this.classestomark,
                tokenstoshow:this.tokenstoshow,
                colindex:this.colindex,
                contentcontrol:this.contentcontrol,
                hoveredentitiy:this.hoveredentitiy,
            }
        },
        methods: {
            togglesemanticlass:function (newClassesToMark) {
                this.$emit('togglesemanticlass',newClassesToMark);
            },
            hoverlinesetoffsetend:function (event) {
                this.$emit('hoverlinesetoffsetend',event);
            }
        },
        components: {
            nerVue,
            necVue,
            correction,
            entitiesview
        }
    }
</script>