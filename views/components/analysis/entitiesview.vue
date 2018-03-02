<template>
    <div>
        <!--TODO after one open close period the button changed font-size and make distance between icon and button smaller-->
        <div class="semClassFormate"
             v-on:click="togglesemanticlass('PERSON')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button  mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.PERSON"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--2-col mdl-button mdl-js-button  deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">PERSON ({{this.sortedtokens[0].length}})</b>
            </button>
        </div>
        <component is="researchresult"
                   v-if="classestomark.PERSON"
                   v-for="(researchresult,index) in PERSON"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sortedtoken="sortedtokens[0][index]"
                   v-bind:semclass="borderedClasses[0]"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div class="semClassFormate"
             v-on:click="togglesemanticlass('LOCATION')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button  mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.LOCATION"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--2-col mdl-button mdl-js-button  deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">LOCATION ({{this.sortedtokens[1].length}})</b>
            </button>
        </div>
        <component is="researchresult"
                   v-if="classestomark.LOCATION"
                   v-for="(researchresult,index) in LOCATION"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sortedtoken="sortedtokens[1][index2]"
                   v-bind:semclass="'LOCATION_BORDERED'"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div class="semClassFormate"
             v-on:click="togglesemanticlass('ORGANIZATION')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button  mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.ORGANIZATION"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--2-col mdl-button mdl-js-button  deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">ORGANIZATION ({{this.sortedtokens[2].length}})</b>
            </button>
        </div>
        <component is="researchresult"
                   v-if="classestomark.ORGANIZATION"
                   v-for="(researchresult,index) in ORGANIZATION"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sortedtoken="sortedtokens[2][index3]"
                   v-bind:semclass="'ORGANIZATION_BORDERED'"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div class="semClassFormate"
             v-on:click="togglesemanticlass('MISC')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button  mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.MISC"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--2-col mdl-button mdl-js-button  deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">MISC ({{this.sortedtokens[3].length}})</b>
            </button>
        </div>
        <component is="researchresult"
                   v-if="classestomark.MISC"
                   v-for="(researchresult,index) in MISC"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sortedtoken="sortedtokens[3][index4]"
                   v-bind:semclass="'MISC_BORDERED'"
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
                colindex: this.colindex
            }
        },
        methods: {
            researchTokensOfClass: function (semClass, index) {
                this[semClass] = [];
                let tokensResults = [];
                this.sortedtokens.push( this.filtertokenwithclass(this.tokenstoshow[this.colindex], semClass));
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
        computed: {},
        mounted() {
            this.researchTokensOfClass('PERSON',0);
            this.researchTokensOfClass('LOCATION',1);
            this.researchTokensOfClass('ORGANIZATION',2);
            this.researchTokensOfClass('MISC',3);
        },
        watch: {},
        components: {
            researchresult,
            requests
        }
    }

</script>