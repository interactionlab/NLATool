<template>
    <div>
        <keep-alive>
            <component v-if="showing === 'entitiesview'"
                    is="entitiesview"
                       v-bind:serverip="serverip"
                       v-bind:googleapikey="googleapikey"
                       v-bind:tokens="tokens"
                       v-bind:columnindex="columnindex"
                       v-bind:researchedentities="researchedentities"
                       v-bind:tokenstoshow="tokenstoshow"
                       v-bind:selectedchain="selectedchain"
                       v-bind:docid="docid"
                       v-bind:classestomark="classestomark"
                       v-bind:contentcontrol="contentcontrol"
                       v-bind:hoverdata="hoverdata"
                       v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                       v-bind:parentviewport="parentviewport"
                       v-bind:researchdatatoupdate="researchdatatoupdate"
                       v-bind:selectedindexes="selectedtextindexes"
                       v-on:updateclassestomark="updateclassestomark($event)"
                       v-on:endhover="endhover($event)"
                       v-on:starthover="starthover($event)"
                       v-on:removehoverline="removehoverline"
                       v-on:editresearch="editresearch($event)"
                       v-on:saveresult="saveresult($event)"
                       v-on:switchtoentities="switchtoentities()">
            </component>
            <component v-else
                       is="correction"
                       v-bind:serverip="serverip"
                       v-bind:googleapikey="googleapikey"
                       v-bind:tokens="tokens"
                       v-bind:researchedentities="researchedentities"
                       v-bind:tokenstoshow="tokenstoshow"
                       v-bind:columnindex="columnindex"
                       v-bind:selectedtextindexes="selectedtextindexes"
                       v-bind:selectedchain="selectedchain"
                       v-bind:docid="docid"
                       v-bind:classestomark="classestomark"
                       v-bind:contentcontrol="contentcontrol"
                       v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                       v-bind:researchdatatoedit="researchdatatoedit"
                       v-bind:researchdatatoupdate="researchdatatoupdate"
                       v-on:updateclassestomark="updateclassestomark($event)"
                       v-on:endhover="endhover($event)"
                       v-on:starthover="starthover($event)"
                       v-on:removehoverline="removehoverline"
                       v-on:editresearch="editresearch($event)"
                       v-on:saveresult="saveresult($event)"
                       v-on:switchtoentities="switchtoentities()">
            </component>
        </keep-alive>
        <component is="store"></component>
    </div>
</template>
<script>
    import correction from './components/analysis/correction.vue';
    import entitiesview from './components/analysis/entitiesview.vue';
    import store from './components/analysis/globalstore.vue';

    export default {
        props: {
            serverip: {type: String, default: ""},
            googleapikey: {type: String, default: ""},
            selectedtextindexes: {type: Object, default: null},
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
            parentviewport: {type: Object, default: null},
            analighterstatus: {
                type: Array, default: function () {
                    return [{column: 0, status: 'entitiesview'}]
                }
            }
        },
        data: function () {
            return {
                researchdatatoedit: null,
                researchdatatoupdate: {},
                showmode: 'entitiesview'
            }
        },
        computed: {
            showing: function () {
                try {
                    return JSON.parse(JSON.stringify(this.analighterstatus[this.columnindex].status));
                } catch (e) {
                    return 'entitiesview'
                }
            }
        },
        methods: {
            removehoverline: function () {
                this.$emit('removehoverline');
            },
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
                this.$emit('removehoverline');
                this.classestomark.POS = true;

                /*
                this.showmode = 'correction';
                this.showing.mode = 'correction';
                this.analighterstatus[this.columnindex].status = 'correction';*/
                this.$emit('updateanalighterstatus', {column: this.columnindex, status: 'correction'});
                if (researchData !== undefined) {
                    this.researchdatatoedit = JSON.parse(JSON.stringify(researchData));
                } else {
                    this.researchdatatoedit = null;
                }
                this.researchdatatoupdate = null;

                this.$emit('updateclassestomark', this.classestomark);
            },
            saveresult: function (researchData) {
                this.$emit('removehoverline');
                this.classestomark.POS = false;
                this.researchdatatoedit = null;
                /* this.showmode = 'entitiesview';
                 this.showing.mode = 'entitiesview';*/
                this.$emit('updateanalighterstatus', {column: this.columnindex, status: 'entitiesview'});
                //this.analighterstatus[this.columnindex].status = 'entitiesview';
                this.researchdatatoupdate = JSON.parse(JSON.stringify(researchData));
                this.updateclassestomark(this.classestomark);
            },
            switchtoentities: function () {
                this.classestomark.POS = false;
                /* this.showmode = 'entitiesview';
                 this.showing.mode = 'entitiesview';*/
                //this.analighterstatus[this.columnindex].status = 'entitiesview';
                this.$emit('updateanalighterstatus', {column: this.columnindex, status: 'entitiesview'});
                this.$emit('removehoverline');
                this.updateclassestomark(this.classestomark);
            }
        },
        watch: {
            showmode: {
                handler: function (newmode) {
                    console.log('in column ' + this.columnindex + 'the mode changed to: ' + newmode);
                }
            },
            columnindex: {
                handler: function (newcolumn) {
                    this.showing.column = newcolumn;
                }
            }
        },
        components: {
            correction,
            entitiesview,
            store
        }
    }
</script>