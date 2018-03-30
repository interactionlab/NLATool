<template>
    <div>
        <component :is="showmode"
                   v-bind:serverip="serverip"
                   v-bind:googleapikey="googleapikey"
                   v-bind:tokens="tokens"
                   v-bind:columnindex="columnindex"
                   v-bind:researchedentities="researchedentities"
                   v-bind:tokenstoshow="tokenstoshow"
                   v-bind:selectedindexes="selectedindexes"
                   v-bind:selectedchain="selectedchain"
                   v-bind:docid="docid"
                   v-bind:classestomark="classestomark"
                   v-bind:contentcontrol="contentcontrol"
                   v-bind:hoverdata="hoverdata"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-bind:researchdatatoedit="researchdatatoedit"
                   v-bind:researchdatatoupdate="researchdatatoupdate"
                   v-on:updateclassestomark="updateclassestomark($event)"
                   v-on:endhover="endhover($event)"
                   v-on:starthover="starthover($event)"
                   v-on:editresearch="editresearch($event)"
                   v-on:saveresult="saveresult($event)"
                   v-on:selectclass="selectedclass()"
        >

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
            googleapikey: {type: String, default: ""},
            selectedindexes: {type: Object, default: null},
            contentcontrol: {type: Object, default: null},
            hoverdata: {type: Object, default: null},
            classestomark: {type: Object, default: null},
            docid: {type: Number, default: -1},
            columnindex: {type: Number, default: 0},
            selectedchain: {type: Number, default: -1},
            researchedentities: {
                type: Array, default: function () {
                    return []
                },
            },
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
            wordtomarkonhoverdata: {type: Object, default: null},
        },
        data: function () {
            return {
                researchdatatoedit: null,
                researchdatatoupdate: {},
                showmode: 'entitiesview',

            }
        },
        methods: {
            updateclassestomark: function (newClassesToMark) {
                this.$emit('updateclassestomark', newClassesToMark);
            },
            endhover: function (event) {
                this.$emit('endhover', event);
            },
            starthover: function (textIndex) {
                this.$emit('starthover', textIndex);
            },
            editresearch: function (researchData) {
                this.classestomark.POS = true;
                this.showmode = 'correction';
                if (researchData !== undefined) {
                    this.researchdatatoedit = JSON.parse(JSON.stringify(researchData));
                } else {
                    this.researchdatatoedit = null;
                }
                this.researchdatatoupdate = null;
                this.$emit('updateclassestomark', this.classestomark);
            },
            saveresult: function (researchData) {
                this.classestomark.POS = false;
                this.researchdatatoedit = null;
                this.showmode = 'entitiesview';
                this.researchdatatoupdate = JSON.parse(JSON.stringify(researchData));
                console.log('finished Edit: ' + JSON.stringify(this.researchdatatoupdate));
                this.updateclassestomark(this.classestomark);
            },
            selectedclass: function () {
                this.classestomark.POS = false;
                this.showmode = 'entitiesview';
                this.updateclassestomark(this.classestomark);
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