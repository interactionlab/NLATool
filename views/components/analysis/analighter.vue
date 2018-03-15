<template>
    <div>
        <component :is="showmode"
                   v-bind:serverip="serverip"
                   v-bind:tokens="tokens"
                   v-bind:columnindex="columnindex"
                   v-bind:tokenstoshow="tokenstoshow"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:selectedchain="selectedchain"
                   v-bind:docid="docid"
                   v-bind:classestomark="classestomark"
                   v-bind:contentcontrol="contentcontrol"
                   v-bind:hoverdata="hoverdata"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-bind:researchdatatoedit="researchdatatoedit"
                   v-on:togglesemanticlass="togglesemanticlass($event)"
                   v-on:endhover="endhover($event)"
                   v-on:starthover="starthover($event)"
                   v-on:editresearch="editresearch($event)">

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
            serverip: {type: String, default: ""},
            showmode: {type: String, default: ""},
            selectedindexes: {type: Object, default: null},
            contentcontrol: {type: Object, default: null},
            hoverdata: {type: Object, default: null},
            classestomark: {type: Object, default: null},
            docid: {type: Number, default: -1},
            columnindex: {type: Number, default: 0},
            selectedchain: {type: Number, default: -1},
            tokens: {
                type: Array, default: function () {
                    return []
                }
            },
            tokenstoshow: {
                type: Array, default: function () {
                    return []
                }
            },
            wordtomarkonhoverdata: {
                type: Array, default: function () {
                    return []
                }
            },
        },
        data: function () {
            return {
                researchdatatoedit: {}
            }
        },
        methods: {
            togglesemanticlass: function (newClassesToMark) {
                this.$emit('togglesemanticlass', newClassesToMark);
            },
            endhover: function (event) {
                this.$emit('endhover', event);
            },
            starthover: function (textIndex) {
                this.$emit('starthover', textIndex);
            },
            editresearch: function (researchData){
                //emit for a button on toolbar. To Delete if button on toolbar not needed.
                this.$emit('entercorrectionmode', true);
                this.researchdatatoedit = researchData;
            },
            selectedresearch:function (researchData) {
                this.$emit('entercorrectionmode', false);
                this.researchdatatoedit = researchData;
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