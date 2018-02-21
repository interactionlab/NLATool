<template>
    <div>
        <div>PERSON</div>
        <component is="researchresult"
                   v-if="classestomark.PERSON"
                   v-for="(researchresult,index) in PERSON"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:sortedtoken="sortedtokens[index]"
                   v-bind:semclass="borderedClasses[0]"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div>LOCATION</div>
        <component is="researchresult"
                   v-if="classestomark.LOCATION"
                   v-for="(researchresult2,index2) in LOCATION"
                   v-bind:researchresult="researchresult2"
                   v-bind:key="index2"
                   v-bind:index="index2"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:semclass="'PERSON_BORDERED'"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div>ORGANIZATION</div>
        <component is="researchresult"
                   v-if="classestomark.ORGANIZATION"
                   v-for="(researchresult3,index3) in ORGANIZATION"
                   v-bind:researchresult="researchresult3"
                   v-bind:key="index3"
                   v-bind:index="index3"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-on:saveresult="saveResult($event)">
        </component>

        <div>MISC</div>
        <component is="researchresult"
                   v-if="classestomark.MISC"
                   v-for="(researchresult4,index4) in MISC"
                   v-bind:researchresult="researchresult4"
                   v-bind:key="index4"
                   v-bind:index="index4"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-on:saveresult="saveResult($event)">
        </component>
        <!-- TODO: right index for sortedtoken-->
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
            docid: Number
        },
        data: function () {
            return {
                PERSON: [],
                LOCATION: [],
                ORGANIZATION: [],
                MISC: [],
                borderedClasses:['PERSON_BORDERED',],
                tokens: this.tokens,
                classestomark: this.classestomark,
                docid: this.docid,
                researchresults: [],
                sortedtokens:[]
            }
        },
        methods: {
            researchTokensOfClass: function (semClass) {
                this[semClass] = [];
                let tokensResults = [];
                this.sortedtokens = this.filtertokenwithclass(this.tokens, semClass);
                console.log('all tokens of: ' + semClass + ' are: ' + this.sortedtokens);
                for (let i = 0; i < this.sortedtokens.length; i++) {
                    this.searchGoogle(this.sortedtokens[i], 1, semClass);
                }
                console.log('Token results: ' + JSON.stringify(this.researchresults));
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
                        console.log('this semanticlass: ' + semClass + ' has: ' + JSON.stringify(this[semClass]));
                    }
                });
            },

            saveResults: function () {
                console.log('TODO: Trying to save but not implemented.');
            }
        },
        computed: {},
        mounted() {
            this.researchTokensOfClass('PERSON');
            this.researchTokensOfClass('LOCATION');
            this.researchTokensOfClass('ORGANIZATION');
            this.researchTokensOfClass('MISC');
        },
        watch: {
        },
        components: {
            researchresult,
            requests
        }
    }

</script>