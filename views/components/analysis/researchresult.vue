<template> <!--editordocument in 8080-->

    <div class="mdl-layout mdl-js-layout">
        <main class="mdl-layout__content deleteSpaces contentColor separate">
            <div class="mdl-grid deleteSpaces">
                <div class="mdl-cell mdl-cell--12-col deleteSpaces" style="width:100%">
                    <div v-bind:class="generalstyleclass"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate"
                         v-on:click="showdetail">
                        <div class="mdl-grid deleteSpaces"
                             v-if="typeof researchresult.result !== 'undefined' ">
                            <div class="mdl-grid mdl-cell mdl-cell--12-col deleteSpaces">
                                <div class="mdl-cell mdl-cell--10-col deleteSpaces"
                                     v-if="typeof researchresult.result !== 'undefined'">
                                    {{title}}
                                </div>
                                <div class="mdl-layout-spacer"></div>
                                <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                                        v-on:click="editResearch">
                                    <i class="material-icons">edit</i>
                                </button>
                                <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                                        v-on:click="showSource">
                                    <i class="material-icons">public</i>
                                </button>
                            </div>
                            <div class="mdl-cell mdl-cell--12-col deleteSpaces">
                                <img v-if="(localcontentcontroler.img) & (typeof researchresult.result.image !== 'undefined')"
                                     v-bind:src="researchresult.result.image.contentUrl"
                                     style="float: left; max-width: 30%; margin-right: 0.5em; max-height: 12em;     width: auto !important;"/>
                                <div style="float: left; width: 30%; margin-right: 1em;">
                                    <component is="googlemap" v-if="localcontentcontroler.map"
                                               v-bind:mapcoordinates="mapcoordinates"
                                               v-bind:index="mapkey"
                                    >
                                    </component>
                                </div>
                                <div v-if="localcontentcontroler.information">
                                    <div v-if="typeof researchresult.result.description !== 'undefined'">
                                        {{researchresult.result.description.articleBody}}
                                    </div>

                                    <div v-if="typeof researchresult.result.detailedDescription !== 'undefined'">
                                        {{researchresult.result.detailedDescription.articleBody}}
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
            serverip: { type: String, default: "" },
            researchresult: { type: Object, default: null },
            index: { type: Number, default: -1 },
            mapkey: { type: Number, default: -1 },
            docid: { type: Number, default: -1 },
            mapcoordinates: { type: Array, default: function () { return [] }},
            sourcequery: { type: Object, default: null },
            semclass: { type: String, default: "" },
            contentcontrol: { type: Object, default: null },  
            hoveredentity: { type: String, default: "" },
        },
        data: function () {
            return {
                hover: false,                
                localcontentcontrol: {
                    img: true,
                    map: true,
                    information: true
                },                
            }
        },
        methods: {
            showallresults: function () {
                this.$emit('showallresults');
            },
            showdetail: function () {

            },
            accentuate: function () {
                this.hover = !this.hover;
                
                //mouseover
                let textIndex = this.sourcequery.source[0].textIndex;
                this.$emit('pickresearchresult', [textIndex, "research"]);
            },
            saveResult: function () {
                let socket = io(this.serverip + ':8080');
                socket.emit('saveresult', this.index, this.researchresult, this.docid);
                this.$emit('saveresult', this.index);
            },
            showSource: function () {
                try {
                    let url = this.researchresult.result.detailedDescription.url;
                    let win = window.open(url, '_blank');
                    win.focus();
                } catch (err) {
                    //console.log('Showing the source of Article failed: ' + err);
                }
            },
            editResearch: function () {
            }
        },
        components: {
            googlemap
        },
        computed: {
            localcontentcontroler: function () {
                if (this.contentcontrol.img && this.contentcontrol.map && this.contentcontrol.information) {
                    this.localcontentcontrol.img = false;
                    this.localcontentcontrol.map = false;
                    this.localcontentcontrol.information = false;
                } else {
                    this.localcontentcontrol.img = true;
                    this.localcontentcontrol.map = true;
                    this.localcontentcontrol.information = true;
                }
                if (this.sourcequery.source[0].semanticClass === 'PERSON') {
                    this.localcontentcontrol.map = false;
                }
                return this.localcontentcontrol;
            },
            generalstyleclass: function () {
                let htmlclass = {
                    researchresulthover: this.hover
                };
                
                if (this.hoveredentity == this.sourcequery.query)
                {
                    this.hover = true;
                    htmlclass[this.semclass + "_strong"] = true;
                    htmlclass[this.semclass] = false;
                } else {
                    this.hover = false;
                    htmlclass[this.semclass + "_strong"] = false;
                    htmlclass[this.semclass] = true;
                }
                
                return htmlclass;
            },
            title: function () {
                let title = '';
                if (typeof this.sourcequery !== 'undefined') {
                    if (typeof this.sourcequery.query !== 'undefined') {
                        title = title + this.sourcequery.query;
                        if (typeof this.sourcequery.freq !== 'undefined') {
                            title = title + ' (' + this.sourcequery.freq + ') ';
                        }
                    } else {
                        title = title + this.sourcequery;
                    }
                }
                title = title + ' -> ' + this.researchresult.result.name;
                return title;


            }
        }
    }
</script>