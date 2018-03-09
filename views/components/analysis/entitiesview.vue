<template>
    <div>
        <!--TODO after one open close period the button changed font-size and make distance between icon and button smaller-->
        <div class="semClassFormate"
             ref="personresultsparent"
             v-on:click="togglesemanticlass('PERSON')"
             v-on:mouseover="log">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.PERSON"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">PERSON ({{numberOfPersons}})</b>
            </button>
        </div>
        <component is="researchresult"
                   ref="personresults"
                   v-if="classestomark.PERSON"
                   v-for="(researchresult,index) in PERSON"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:mapkey="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sourcequery="sourcequery[0][index]"
                   v-bind:semclass="borderedClasses[0]"
                   v-bind:contentcontrol="contentcontrol.PERSONS"
                   v-on:saveresult="saveResult($event)">
        </component>
        <div class="semClassFormate"
             ref="locationresultsparent"
             v-on:click="togglesemanticlass('LOCATION')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.LOCATION"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">LOCATION ({{numberOfLocations}})</b>
            </button>
        </div>
        <component is="researchresult"
                   ref="locationresults"
                   v-if="classestomark.LOCATION"
                   v-for="(researchresult,index2) in LOCATION"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index2+ PERSON.length"
                   v-bind:index="index2"
                   v-bind:mapkey="index2+ PERSON.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sourcequery="sourcequery[1][index2]"
                   v-bind:semclass="'LOCATION_BORDERED'"
                   v-bind:contentcontrol="contentcontrol.LOCATIONS"
                   v-on:saveresult="saveResult($event)">
        </component>
        <div class="semClassFormate"
             ref="organisazionresultsparent"
             v-on:click="togglesemanticlass('ORGANIZATION')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.ORGANIZATION"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">ORGANIZATION ({{numberOfOrganizations}})</b>
            </button>
        </div>
        <component is="researchresult"
                   ref="organisazionresults"
                   v-if="classestomark.ORGANIZATION"
                   v-for="(researchresult,index3) in ORGANIZATION"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index3+ PERSON.length + LOCATION.length"
                   v-bind:index="index3"
                   v-bind:mapkey="index3+ PERSON.length+ LOCATION.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sourcequery="sourcequery[2][index3]"
                   v-bind:semclass="'ORGANIZATION_BORDERED'"
                   v-bind:contentcontrol="contentcontrol.ORGANIZATIONS"
                   v-on:saveresult="saveResult($event)">
        </component>
        <div class="semClassFormate"
             ref="miscresultsparent"
             v-on:click="togglesemanticlass('MISC')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.MISC"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">MISC ({{numberOfMisc}})</b>
            </button>
        </div>
        <component is="researchresult"
                   ref="miscresults"
                   v-if="classestomark.MISC"
                   v-for="(researchresult,index4) in MISC"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index4+ PERSON.length + LOCATION.length + ORGANIZATION.length"
                   v-bind:index="index4"
                   v-bind:mapkey="index4+ PERSON.length+ LOCATION.length+ ORGANIZATION.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sourcequery="sourcequery[3][index4]"
                   v-bind:semclass="'MISC_BORDERED'"
                   v-bind:contentcontrol="contentcontrol.MISCS"
                   v-on:saveresult="saveResult($event)">
        </component>
    </div>

</template>
<script>
    import filtertokenwithclass from './mixins/analysis/filtertoken.js';
    import researchresult from './components/analysis/researchresult.vue';

    export default {
        mixins: [filtertokenwithclass],
        props: {
            tokens: Array,
            classestomark: Object,
            docid: Number,
            tokenstoshow: Array,
            colindex: Number,
            contentcontrol: Object,
            hoveredentitiy: Array,
        },
        data: function () {
            return {
                PERSON: [],
                LOCATION: [],
                ORGANIZATION: [],
                MISC: [],
                borderedClasses: ['PERSON_BORDERED',],
                tokens: this.tokens,
                classestomark: this.classestomark,
                docid: this.docid,
                researchresults: [],
                sortedtokens: [],
                tokenstoshow: this.tokenstoshow,
                colindex: this.colindex,
                contentcontrol: this.contentcontrol,
                sourcequery: []
            }
        },
        methods: {
            log: function () {
                //console.log("entitiesview: " + JSON.stringify(this.hoveredentitiy));
            },
            researchTokensOfClass: function (semClass, index) {
                this[semClass] = [];
                let query = '';
                let frequency = 0;
                let searched = false;
                this.sortedtokens.push(this.filtertokenwithclass(this.tokenstoshow[this.colindex], semClass));
                this.sourcequery.push([]);
                for (let i = 0; i < this.sortedtokens[index].length; i++) {
                    //console.log('sortedTokens before getting the query: ' + JSON.stringify(this.sortedtokens[index][i]));
                    for (let j = 0; j < this.sortedtokens[index][i].length; j++) {
                        for (let k = 0; k < this.sourcequery[index].length; k++) {
                            // console.log('Was searched: '
                            //     + this.sourcequery[index][k].query + ':'
                            //     + this.sortedtokens[index][i][j].content
                            //     + this.sourcequery[index][k].query.indexOf(this.sortedtokens[index][i][j].content));
                            if (this.sourcequery[index][k].query.indexOf(this.sortedtokens[index][i][j].content) !== -1) {
                                searched = true;
                            }
                        }
                        if (searched === false) {
                            frequency++;
                            query = query + ' ' + this.sortedtokens[index][i][j].content;
                        }
                        searched = false;
                    }
                    //console.log('Query for Research: ' + query);
                    if (query !== '') {
                        this.sourcequery[index].push({
                            query: query,
                            freq: frequency,
                            source: this.sortedtokens[index][i]
                        });
                        this.searchGoogle(query, 1, semClass);
                    }
                    query = '';
                    frequency = 0;
                }
            },
            searchGoogle: function (query, limit, semClass) {
                if (limit < 1) {
                    return null;
                }
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let params = {
                    'query': query,
                    'limit': limit,
                    'indent': true,
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };
                $.getJSON(service_url + '?callback=?', params, (response) => {
                }).done((response) => {
                    if (limit > 1) {
                        // this[semClass].push(this.rerankWithKeywords());
                    } else {
                        //console.log('Response for Research: ' + JSON.stringify(response));
                        this[semClass].push(response.itemListElement[0]);
                        //console.log('this semanticlass: ' + semClass + ' has: ' + JSON.stringify(this[semClass]));
                    }
                });
            },
            togglesemanticlass: function (semClass) {
                this.classestomark[semClass] = !this.classestomark[semClass];
                this.$emit('togglesemanticlass', this.classestomark);
            },
            saveResults: function () {
                //console.log('TODO: Trying to save but not implemented.');
            }
        },
        computed: {
            numberOfPersons: function () {
                if (typeof this.sourcequery !== 'undefined' && typeof this.sourcequery[0] !== 'undefined') {
                    return this.sourcequery[0].length;
                } else {
                    return '';
                }
            },
            numberOfLocations: function () {
                if (typeof this.sourcequery !== 'undefined' && typeof this.sourcequery[1] !== 'undefined') {
                    return this.sourcequery[1].length;
                } else {
                    return '';
                }
            },
            numberOfOrganizations: function () {
                if (typeof this.sourcequery !== 'undefined' && typeof this.sourcequery[2] !== 'undefined') {
                    return this.sourcequery[2].length;
                } else {
                    return '';
                }
            },
            numberOfMisc: function () {
                if (typeof this.sourcequery !== 'undefined' && typeof this.sourcequery[3] !== 'undefined') {
                    return this.sourcequery[3].length;
                } else {
                    return '';
                }
            },
        },
        mounted() {
            this.researchTokensOfClass('PERSON', 0);
            this.researchTokensOfClass('LOCATION', 1);
            this.researchTokensOfClass('ORGANIZATION', 2);
            this.researchTokensOfClass('MISC', 3);
        },
        watch: {
            hoveredentitiy: {
                handler: function (newValue) {
                    let newWord = newValue[0].content;
                    let bb = null;
                    if (newValue[0].semanticClass === 'PERSON') {
                        if (this.$refs["personresults"] !== undefined && this.$refs["personresults"].length > 0) {
                            for (let i = 0; i < this.$refs["personresults"].length; i++) {
                                if (this.$refs.personresults[i].sourcequery.source[0].content.indexOf(newWord) > -1) {
                                    bb = this.$refs.personresults[i].$el.getBoundingClientRect();
                                }
                            }
                        } else {
                            bb = this.$refs["personresultsparent"].getBoundingClientRect()
                        }
                    } else if (newValue[0].semanticClass === 'LOCATION') {
                        if (this.$refs["locationresults"] !== undefined && this.$refs["locationresults"].length > 0) {
                            for (let i = 0; i < this.$refs["locationresults"].length; i++) {
                                if (this.$refs.locationresults[i].sourcequery.source[0].content.indexOf(newWord) > -1) {
                                    bb = this.$refs["locationresults"][i].$el.getBoundingClientRect();
                                }
                            }
                        } else {
                            bb = this.$refs["locationresultsparent"].getBoundingClientRect()
                        }
                    } else if (newValue[0].semanticClass === "ORGANIZATION") {
                        if (this.$refs["organisazionresults"] !== undefined && this.$refs["organisazionresults"].length > 0) {
                            for (let i = 0; i < this.$refs["organisazionresults"].length; i++) {
                                if (this.$refs.organisazionresults[i].sourcequery.source[0].content.indexOf(newWord) > -1) {
                                    bb = this.$refs.organisazionresults[i].$el.getBoundingClientRect();
                                }
                            }
                        } else {
                            bb = this.$refs["organisazionresultsparent"].getBoundingClientRect()
                        }
                    } else if (newValue[0].semanticClass === "MISC") {
                        if (this.$refs["miscresults"] !== undefined && this.$refs["miscresults"].length > 0) {
                            for (let i = 0; i < this.$refs["miscresults"].length; i++) {
                                if (this.$refs.miscresults[i].sourcequery.source[0].content.indexOf(newWord) > -1) {
                                    bb = this.$refs.miscresults[i].$el.getBoundingClientRect();
                                }
                            }
                        } else {
                            bb = this.$refs["miscresultsparent"].getBoundingClientRect()
                        }
                    } else {
                        bb = null;
                    }
                    this.$emit('hoverlinesetoffsetend', bb);
                }, deep: true
            }
        },
        components: {
            researchresult
        }
    }
</script>