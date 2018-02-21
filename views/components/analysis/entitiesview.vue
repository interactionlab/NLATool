<template>
    <div>
        <span>PERSON</span>
        <component is="researchresult"
                   v-for="(researchresult,index) in PERSON"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-on:saveresult="saveResult($event)">
        </component>

        <span>LOCATION</span>
        <component is="researchresult"
                   v-for="(researchresult,index) in LOCATION"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-on:saveresult="saveResult($event)">
        </component>

        <span>ORGANIZATION</span>
        <component is="researchresult"
                   v-for="(researchresult,index) in ORGANIZATION"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-on:saveresult="saveResult($event)">
        </component>

        <span>MISC</span>
        <component is="researchresult"
                   v-for="(researchresult,index) in MISC"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
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
            docid: Number
        },
        data: function () {
            return {
                PERSON: [],
                LOCATION: [],
                ORGANIZATION: [],
                MISC: [],
                tokens: this.tokens,
                classestomark: this.classestomark,
                docid: this.docid,
                researchresults: []
            }
        },
        methods: {
            researchTokensOfClass: function (semClass) {
                let tokensResults = [];
                let tokens = this.filtertokenwithclass(this.tokens, semClass);
                console.log('all tokens of: ' + semClass + ' are: ' + tokens);
                for (let i = 0; i < tokens.length; i++) {
                    this.searchGoogle(tokens[i], 1, semClass);
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
            classestomark: {
                handler: function (newclassestomark) {
                    if (newclassestomark.PERSON) {
                        this.researchTokensOfClass('PERSON');

                    } else if (newclassestomark.LOCATION){
                        this.researchTokensOfClass('LOCATION');

                    }
                },
                deep: true
            }
        },
        components: {
            researchresult,
            requests
        }
    }

</script>