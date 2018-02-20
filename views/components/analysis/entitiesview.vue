<template>
    <div>
        <span>PERSON</span>
        <component is="researchresult"
                   v-if="this.classestomark.PERSON === true"
                   v-for="(researchresult,index) in person"
                   v-bind:researchresult="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:researchresults="researchresults"
                   v-bind:docid="docid"
                   v-bind:showallon="resultselected"
                   v-bind:mapcoordinates="mapcoordinates"
                   v-on:saveresult="saveResult($event)">
        </component>


        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.ORGANIZATION === true">
            <span>ORGANIZATION</span>
            <ul class="demo-list-item mdl-list" v-for="key in organizations">
                <span class="mdl-list__item-primary-content" v-bind:class="{ORGANIZATION:true}">
                    {{key}}
                </span>
            </ul>
        </div>

        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.MISC === true">
            <span>MISC</span>
            <ul class="demo-list-item mdl-list" v-for="key in miscs">
                <span class="mdl-list__item-primary-content" v-bind:class="{MISC:true}">
                    {{key}}
                </span>
            </ul>
        </div>
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
                console.log('TODO: Save ' );
            }
        },
        computed: {
            persons: function () {
                return this.researchTokensOfClass('PERSON');
            },
            organizations: function () {
                return this.researchTokensOfClass('ORGANIZATION');
            },
            miscs: function () {
                return this.researchTokensOfClass('MISC');
            },

            researchresult,
            requests
        },
    }
</script>