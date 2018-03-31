<template> <!--editordocument in 8080-->
    <div class="mdl-layout mdl-js-layout">
        <main class="mdl-layout__content deleteSpaces contentColor separate"
              v-on:mouseout="mouseout"
              v-on:mouseover="accentuate"
              v-on:click="showdetail">
            <div class="mdl-grid deleteSpaces">
                <div class="mdl-cell mdl-cell--12-col deleteSpaces" style="width:100%">
                    <div v-bind:class="generalstyleclass" style="padding: 0.4em;">
                        <div class="mdl-grid deleteSpaces"
                             v-if="typeof researchdata.result !== 'undefined' ">
                            <div class="mdl-grid mdl-cell mdl-cell--12-col deleteSpaces"
                                    style="width: 100%;">
                                <div class="mdl-cell mdl-cell--10-col deleteSpaces"
                                     v-if="typeof researchdata.result !== 'undefined'">
                                    {{title}}
                                </div>
                                <div class="mdl-layout-spacer"></div>
                                <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                                        v-if="viewing"
                                        v-on:click.stop="editResearch">
                                    <i class="material-icons">edit</i>
                                </button>
                                <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                                        v-else
                                        v-on:click.stop="saveresult">
                                    <i class="material-icons">check</i>
                                </button>
                                <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                                        v-on:click.stop="showSource">
                                    <i class="material-icons">public</i>
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--12-col deleteSpaces"
                                    style="width: 100%;">
                                <img v-if="(localcontentcontrol.img) & (typeof researchdata.result.image !== 'undefined')"
                                     v-bind:src="researchdata.result.image.contentUrl"
                                     style="float: left; max-width: 30%; margin-right: 0.5em; max-height: 12em;     width: auto !important;"/>
                                <div style="float: left; width: 30%; margin-right: 1em;">
                                    <component is="googlemap" v-if="ifShowMap"
                                               v-bind:name="researchdata.result.name"
                                               v-bind:googleapikey="googleapikey"
                                               v-bind:index="mapkey"
                                               v-bind:researchedentity="researchdata.sourcequery"
                                    >
                                    </component>
                                </div>
                                <div v-if="localcontentcontrol.information">
                                    <div v-if="typeof researchdata.result.description !== 'undefined'">
                                        {{researchdata.result.description.articleBody}}
                                    </div>

                                    <div v-if="typeof researchdata.result.detailedDescription !== 'undefined'">
                                        {{researchdata.result.detailedDescription.articleBody}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import googlemap from './components/analysis/googlemap.vue';

    export default {
        props: {
            serverip: {type: String, default: ""},
            googleapikey: {type: String, default: ""},
            researchdata: {type: Object, default: null},
            index: {type: Number, default: -1},
            mapkey: {type: Number, default: -1},
            docid: {type: Number, default: -1},
            semclass: {type: String, default: ""},
            contentcontrol: {type: Object, default: null},
            indexcorrector: {type: Number, default: 0},
            columnlength: {type: Number, default: 0},
            columnindex: {type: Number, default: 0},
            wordtomarkonhoverdata: {type: Object, default: null},
            viewing: {type: Boolean, default: true}
        },
        data: function () {
            return {
                hover: false,
                localcontentcontrol: {
                    img: true,
                    map: true,
                    information: true,
                    test: false
                },
                mapcoordinates: {
                    type: Array, default: function () {
                        return []
                    }
                },
            }
        },
        methods: {
            showallresults: function () {
                this.$emit('showallresults');
            },
            showdetail: function () {
                if (!this.localcontentcontrol.img && !this.localcontentcontrol.map && !this.localcontentcontrol.information) {
                    this.localcontentcontrol.img = true;
                    this.localcontentcontrol.map = true;
                    this.localcontentcontrol.information = true;
                } else {
                    this.localcontentcontrol.img = false;
                    this.localcontentcontrol.map = false;
                    this.localcontentcontrol.information = false;
                }
                //console.log('Clicked on result: ' + JSON.stringify(this.localcontentcontrol));
            },
            mouseout: function () {
                this.hover = false;
            },
            accentuate: function () {
                this.hover = true;
                //console.log(JSON.stringify( this.researchdata.sourcequery));
                let hoverdata = {
                    hoverstarted: "research",
                    offsetstart: null,
                    offsetend: this.$el.getBoundingClientRect(),
                    startword: null,
                    semanticClass: this.researchdata.sourcequery.semanticClass,
                    startresearch: undefined,
                    wordtomarkonhover: this.researchdata.sourcequery.textindexes,
                    columnindex: this.columnindex
                };
                this.$emit('starthover', hoverdata);
            },
            saveresult: function () {
                console.log(JSON.stringify(this.researchdata));
                this.$emit('saveresult', this.researchdata);
            },
            showSource: function () {
                try {
                    let url = this.researchdata.result.detailedDescription.url;
                    let win = window.open(url, '_blank');
                    win.focus();
                } catch (err) {
                    //console.log('Showing the source of Article failed: ' + err);
                }
            },
            editResearch: function () {
                this.$emit('editresearch', this.researchdata);
            },
        },
        components: {
            googlemap
        },
        watch: {
            contentcontrol: {
                handler: function (newControl) {
                    this.localcontentcontrol = JSON.parse(JSON.stringify(newControl));
                    //console.log('Overwritten localcontentcontrol : ' + JSON.stringify(this.localcontentcontrol));
                },
                deep: true
            }
        },
        computed: {
            ifShowMap: function () {
                if (this.researchdata.sourcequery.semanticClass !== 'PERSON') {
                    return this.localcontentcontrol.map;
                } else {
                    return false;
                }
            },
            generalstyleclass: function () {
                let htmlclass = {
                    researchdatahover: this.hover
                };
                if (this.wordtomarkonhoverdata.textindexes !== undefined
                    && this.wordtomarkonhoverdata.textindexes.length > 0
                    && this.researchdata.sourcequery.textindexes.indexOf(this.wordtomarkonhoverdata.textindexes[0]) > -1) {

                    //console.log(JSON.stringify(this.wordtomarkonhoverdata));
                    //console.log(JSON.stringify(this.researchdata.sourcequery.textindexes));
                    htmlclass[this.researchdata.sourcequery.semanticClass + "_BORDERED_strong"] = true;
                    htmlclass[this.researchdata.sourcequery.semanticClass + "_BORDERED"] = false;
                } else {
                    htmlclass[this.researchdata.sourcequery.semanticClass + "_BORDERED_strong"] = false;
                    htmlclass[this.researchdata.sourcequery.semanticClass + "_BORDERED"] = true;
                }

                return htmlclass;
            },
            title: function () {
                //console.log(JSON.stringify(this.researchdata.sourcequery.query));
                let title = '';
                if (this.researchdata.sourcequery !== undefined) {
                    if (this.researchdata.sourcequery.query !== undefined) {    
                        if (this.researchdata.sourcequery.query.length === 1 && 
                        this.researchdata.sourcequery.query[0].content  === undefined){
                            title = this.researchdata.sourcequery.query[0];
                            if (typeof this.researchdata.sourcequery.freq !== 'undefined') {
                                title += ' (' + this.researchdata.sourcequery.freq + ') ';
                            }
                        }                        
                    } else {
                        console.log(JSON.stringify(this.researchdata));
                        for (let i = 0; i < this.researchdata.sourcequery.source.length && i < 2; i++) {
                            title += this.researchdata.sourcequery.source[i].content;
                            title += " ";
                        }
                        console.log(title);
                        if (this.researchdata.sourcequery.source.length > 4){
                            title += "[...] ";
                        }
                        let start = this.researchdata.sourcequery.source.length - 1;
                        console.log(start);
                        if (start < 2){
                            console.log("cut");
                            start = 2;
                        }
                        console.log(start);
                        for (let i = start; i < this.researchdata.sourcequery.source.length; i++) {
                            title += this.researchdata.sourcequery.source[i].content;
                            title += " ";
                        }
                    }
                }
                title = title + ' -> ' + this.researchdata.result.name;
                return title;
            }
        }
    }
</script>