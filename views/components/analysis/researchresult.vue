<template> <!--editordocument in 8080-->

    <div class="mdl-layout mdl-js-layout">
        <main class="mdl-layout__content deleteSpaces contentColor separate"
              v-on:mouseout="mouseout"
              v-on:mouseover="accentuate"
              v-on:click="showdetail">
            <div class="mdl-grid deleteSpaces">
                <div class="mdl-cell mdl-cell--12-col deleteSpaces" style="width:100%">
                    <div v-bind:class="generalstyleclass">
                        <div class="mdl-grid deleteSpaces"
                             v-if="typeof researchdata.result !== 'undefined' ">
                            <div class="mdl-grid mdl-cell mdl-cell--12-col deleteSpaces">
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
                                        v-on:click.stop="saveResult">
                                    <i class="material-icons">check</i>
                                </button>
                                <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                                        v-on:click.stop="showSource">
                                    <i class="material-icons">public</i>
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--12-col deleteSpaces">
                                <img v-if="(localcontentcontrol.img) & (typeof researchdata.result.image !== 'undefined')"
                                     v-bind:src="researchdata.result.image.contentUrl"
                                     style="float: left; max-width: 30%; margin-right: 0.5em; max-height: 12em;     width: auto !important;"/>
                                <div style="float: left; width: 30%; margin-right: 1em;">
                                    <component is="googlemap" v-if="ifShowMap"
                                               v-bind:mapcoordinates="mapcoordinates"
                                               v-bind:index="mapkey"
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
            researchdata: {type: Object, default: null},
            index: {type: Number, default: -1},
            mapkey: {type: Number, default: -1},
            docid: {type: Number, default: -1},
            mapcoordinates: {
                type: Array, default: function () {
                    return []
                }
            },
            semclass: {type: String, default: ""},
            contentcontrol: {type: Object, default: null},
            wordtomarkonhoverdata: {
                type: Array, default: function () {
                    return []
                }
            },
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
                let hoverdata = {
                    hoverstarted: "research",
                    offsetstart: null,
                    offsetend: this.$el.getBoundingClientRect(),
                    startword: null,
                    semanticClass: this.researchdata.sourcequery.source[0].semanticClass,
                    startresearch: undefined,
                    wordtomarkonhover: this.researchdata.sourcequery.wordids,
                };
                this.$emit('starthover', hoverdata);
            },
            saveResult: function () {
                this.$emit('saveresult', this.researchdata);
                console.log('Save research Changes.'+ JSON.stringify(this.researchdata.result['@id']));
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
            }
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
                if (this.researchdata.sourcequery.source[0].semanticClass !== 'PERSON') {
                    return this.localcontentcontrol.map;
                } else {
                    return false;
                }
            },
            generalstyleclass: function () {
                let htmlclass = {
                    researchdatahover: this.hover
                };
                if (this.wordtomarkonhoverdata != null
                    && this.wordtomarkonhoverdata.wordtomarkonhover !== undefined
                    && this.wordtomarkonhoverdata.wordtomarkonhover.length > 0
                    && this.researchdata.sourcequery.wordids.indexOf(this.wordtomarkonhoverdata.wordtomarkonhover[0]) > -1) {
                    htmlclass[this.researchdata.sourcequery.source[0].semanticClass + "_BORDERED_strong"] = true;
                    htmlclass[this.researchdata.sourcequery.source[0].semanticClass + "_BORDERED"] = false;
                } else {
                    htmlclass[this.researchdata.sourcequery.source[0].semanticClass + "_BORDERED_strong"] = false;
                    htmlclass[this.researchdata.sourcequery.source[0].semanticClass + "_BORDERED"] = true;
                }

                return htmlclass;
            },
            title: function () {
                let title = '';
                if (typeof this.researchdata.sourcequery !== 'undefined') {
                    if (typeof this.researchdata.sourcequery.querys !== 'undefined') {
                        let t = "";
                        for (let i = 0; i < this.researchdata.sourcequery.querys.length; i++) {
                            if (this.researchdata.sourcequery.querys[i].length > t.length) {
                                t = this.researchdata.sourcequery.querys[i];
                            }
                        }
                        title = title + t;
                        if (typeof this.researchdata.sourcequery.freq !== 'undefined') {
                            title = title + ' (' + this.researchdata.sourcequery.freq + ') ';
                        }
                    } else {
                        title = title + this.researchdata.sourcequery;
                    }
                }
                title = title + ' -> ' + this.researchdata.result.name;
                return title;


            }
        }
    }
</script>