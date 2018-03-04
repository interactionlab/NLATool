<template>
    <div>
        <!--TODO after one open close period the button changed font-size and make distance between icon and button smaller-->
        <div class="semClassFormate"
             v-on:click="togglesemanticlass('PERSON')">
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
                   v-if="classestomark.PERSON"
                   v-for="(researchresult,index) in PERSON"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:mapkey="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sourcequery="sortedtokens[0][index]"
                   v-bind:semclass="borderedClasses[0]"
                   v-bind:contentcontrol="contentcontrol.PERSONS"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div class="semClassFormate"
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
                   v-if="classestomark.LOCATION"
                   v-for="(researchresult,index2) in LOCATION"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index2+ PERSON.length"
                   v-bind:index="index2"
                   v-bind:mapkey="index2+ PERSON.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sourcequery="sortedtokens[1][index2]"
                   v-bind:semclass="'LOCATION_BORDERED'"
                   v-bind:contentcontrol="contentcontrol.LOCATIONS"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div class="semClassFormate"
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
                   v-if="classestomark.ORGANIZATION"
                   v-for="(researchresult,index3) in ORGANIZATION"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index3+ PERSON.length + LOCATION.length"
                   v-bind:index="index3"
                   v-bind:mapkey="index3+ PERSON.length+ LOCATION.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sourcequery="sortedtokens[2][index3]"
                   v-bind:semclass="'ORGANIZATION_BORDERED'"
                   v-bind:contentcontrol="contentcontrol.ORGANIZATIONS"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div class="semClassFormate"
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
                   v-if="classestomark.MISC"
                   v-for="(researchresult,index4) in MISC"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index4+ PERSON.length + LOCATION.length + ORGANIZATION.length"
                   v-bind:index="index4"
                   v-bind:mapkey="index4+ PERSON.length+ LOCATION.length+ ORGANIZATION.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sourcequery="sortedtokens[3][index4]"
                   v-bind:semclass="'MISC_BORDERED'"
                   v-bind:contentcontrol="contentcontrol.MISCS"
                   v-on:saveresult="saveResult($event)">
        </component>
    </div>

</template>
<script>
    import filtertokenwithclass from './mixins/analysis/filtertoken.js';
    import researchresult from './components/analysis/researchresult.vue';
    import requests from './mixins/requests.js';

    export default {
        mixins: [filtertokenwithclass],
        props: {
            tokens: Array,
            classestomark: Object,
            docid: Number,
            tokenstoshow: Array,
            colindex: Number

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
                contentcontrol: {
                    PERSONS:{
                        img: true,
                        map: false,
                        information: true
                    },
                    LOCATIONS:{
                        img: true,
                        map: true,
                        information: true
                    },
                    ORGANIZATIONS:{
                        img: true,
                        map: true,
                        information: true
                    },
                    MISCS:{
                        img: true,
                        map: true,
                        information: true
                    }
                }
            }
        },
        methods: {
            researchTokensOfClass: function (semClass, index) {
                this[semClass] = [];
                let tokensResults = [];
                this.sortedtokens.push(this.filtertokenwithclass(this.tokenstoshow[this.colindex], semClass));
                //console.log('all tokens of: '+ semClass + JSON.stringify(this.sortedtokens[index]));
                for (let i = 0; i < this.sortedtokens[index].length; i++) {
                    //console.log('input: '+this.sortedtokens[index][i].name);
                    this.searchGoogle(this.sortedtokens[index][i].name, 1, semClass);
                }
                //console.log('Token results: ' + JSON.stringify(this.researchresults));
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
                        this[semClass].push(this.rerankWithKeywords());
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
                if (typeof this.sortedtokens !== 'undefined' && typeof this.sortedtokens[0] !== 'undefined') {
                    return this.sortedtokens[0].length
                } else {
                    return '';
                }
            },
            numberOfLocations: function () {
                if (typeof this.sortedtokens !== 'undefined' && typeof this.sortedtokens[1] !== 'undefined') {
                    return this.sortedtokens[1].length
                } else {
                    return '';
                }
            },
            numberOfOrganizations: function () {
                if (typeof this.sortedtokens !== 'undefined' && typeof this.sortedtokens[2] !== 'undefined') {
                    return this.sortedtokens[2].length
                } else {
                    return '';
                }
            },
            numberOfMisc: function () {
                if (typeof this.sortedtokens !== 'undefined' && typeof this.sortedtokens[3] !== 'undefined') {
                    return this.sortedtokens[3].length
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
        watch: {},
        components: {
            researchresult,
            requests
        }
    }

</script>