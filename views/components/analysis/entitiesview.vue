<template>
    <div>
        <span>PERSON</span>
        <component is="researchresult"
                   v-if="this.classestomark.PERSON === true"
                   v-for="(researchresult,index) in persons"
        >
        </component>

        <span>LOCATION</span>
        <component is="researchresult"
                   v-if="this.classestomark.LOCATION === true"
                   v-for="(researchresult,index) in locations"
        >
        </component>

        <span>ORGANIZATION</span>
        <component is="researchresult"
                   v-if="this.classestomark.ORGANIZATION === true"
                   v-for="(researchresult,index) in organizations"
        >
        </component>

        <span>MISC</span>
        <component is="researchresult"
                   v-if="this.classestomark.MISC === true"
                   v-for="(researchresult,index) in miscs"
        >
        </component>

    </div>
</template>
<script>

    import filtertokenwithclass from './mixins/analysis/filtertoken.js';
    import researchresult from './components/analysis/researchresult.vue';
    import requests from './mixins/requests.js';

    export default {
        mixins: [filtertokenwithclass, requests],
        props: {
            tokens: Array,
            classestomark: Object,
            docid: Number,
        },
        data: function () {
            return {
                tokens: this.tokens,
                classestomark: this.classestomark,
                docid: this.docid,
            }
        },
        methods: {
            researchTokensOfClass: function (semClass) {
                let tokensResults = [];
                let tokens = this.filtertokenwithclass(this.tokens, semClass);
                for (let i = 0; i < tokens.length; i++) {
                    tokensResults.push(this.searchGoogle(tokens[i]));
                }
                return tokensResults;
            },
            saveResult: function () {
                console.log('TODO: Save ');
            }
        },
        computed: {
            persons: function () {
                return this.researchTokensOfClass('PERSON');
            },
            locations: function () {
                return this.researchTokensOfClass('LOCATION');
            },
            organizations: function () {
                return this.researchTokensOfClass('ORGANIZATION');
            },
            miscs: function () {
                return this.researchTokensOfClass('MISC');
            }
        },
        components: {
            researchresult,
            requests
        }
    }

</script>