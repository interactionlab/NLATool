<template> <!--editordocument in 8080-->

    <div class="mdl-layout mdl-js-layout">  
        <main class="mdl-layout__content deleteSpaces contentColor separate">
            <div class="mdl-grid deleteSpaces">
                <div class="mdl-cell mdl-cell--12-col deleteSpaces" style="width:100%"
                     v-if="everythingshow">

                    <div v-bind:class="generalstyleclass"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate">
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
                                <img v-if="(contentcontrol.img) & (typeof researchresult.result.image !== 'undefined')"
                                     v-bind:src="researchresult.result.image.contentUrl"
                                     style="float: left; max-width: 30%; margin-right: 0.5em; max-height: 12em;     width: auto !important;"/>
                                <div style="float: left; width: 30%; margin-right: 1em;">
                                    <component is="googlemap" v-if="contentcontrol.map"
                                               v-bind:mapcoordinates="mapcoordinates"
                                               v-bind:index="mapkey"
                                               >
                                    </component>
                                </div>
                                <div v-if="contentcontrol.information">
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

                <div class="mdl-cell mdl-cell--12-col" v-else>
                    <div v-bind:class="{researchresulthover: hover}"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate"
                         v-on:click="showdetail">
                        <div class="mdl-cell mdl-cell--12-col"
                             v-if="typeof researchresult.result !== 'undefined'">
                            {{researchresult.result.name}}
                        </div>
                        <div class="mdl-cell mdl-cell--12-col"
                             v-if="typeof researchresult.result.description !== 'undefined'">
                            {{researchresult.result.description.articleBody}}
                        </div>
                    </div>
                    <div class="mdl-grid deleteSpaces">
                        <div class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button"
                                    v-on:click="saveResult">
                                <i class="mdc-button">Save</i>
                            </button>
                        </div>
                        <div v-if="showallon" class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button"
                                    v-on:click="showallresults">
                                <i class="mdc-button">Show All</i>
                            </button>
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
            researchresult: Object,
            index: Number,
            mapkey: Number,
            docid: Number,
            showallon: Boolean,
            mapcoordinates: Array,
            sourcequery: String,
            semclass: String,
            contentcontrol: Object
        },
        data: function () {
            return {
                showimage: false,
                everythingshow: true,
                researchresult: this.researchresult,
                hover: false,
                index: this.index,
                docid: this.docid,
                showallon: this.showallon,
                mapcoordinates: this.mapcoordinates,
                sortedtoken: this.sourcequery,
                semclass: this.semclass,
                mapkey: this.mapkey,
                contentcontrol: this.contentcontrol
            }
        },
        methods: {
            showallresults: function () {
                this.$emit('showallresults');
                this.showallon = false;
            },
            showdetail: function () {
                this.everythingshow = !this.everythingshow;
            },
            accentuate: function () {
                this.hover = !this.hover;
            },
            saveResult: function () {
                let socket = io('http://localhost:8080');
                socket.emit('saveresult', this.index, this.researchresult, this.docid);
                this.$emit('saveresult', this.index);
                this.showallon = true;
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
            generalstyleclass: function () {
                let htmlclass = {
                    researchresulthover: this.hover
                };
                htmlclass[this.semclass] = true;
                if (this.semclass === 'PERSON_BORDERED') {
                    htmlclass['PERSON_BORDERED'] = true;
                }
                return htmlclass;
            },
            title: function () {
                let title = '';
                if (typeof this.sourcequery !== 'undefined') {
                    if (typeof this.sourcequery.name !== 'undefined') {
                        title = title + this.sourcequery.name;
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

<style scoped>

</style>