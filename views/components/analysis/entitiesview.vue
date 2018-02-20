<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.PERSON === true">
            <span>PERSON</span>
            <component is="researchresult"
            v-for="(researchresult,index) in researchresults">

            </component>
        </div>


        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.ORGANIZATION === true">
            <span>ORGANIZATION</span>
            <ul class="demo-list-item mdl-list" v-for="key in this.organizations">
                <span class="mdl-list__item-primary-content" v-bind:class="{ORGANIZATION:true}">
                    {{key}}
                </span>
            </ul>
        </div>

        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.MISC === true">
            <span>MISC</span>
            <ul class="demo-list-item mdl-list" v-for="key in this.miscs">
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
            classestomark: Object
        },
        data: function () {
            return {
                tokens: this.tokens,
                classestomark: this.classestomark
            }
        },
        computed: {
            persons: function () {
                this.searchgoogle
                this.filtertokenwithclass(this.tokens, 'PERSON');

            },
            locations: function () {
                return this.filtertokenwithclass(this.tokens, 'LOCATION');
            },
            organizations: function () {
                return this.filtertokenwithclass(this.tokens, 'ORGANIZATION');
            },
            miscs: function () {
                return this.filtertokenwithclass(this.tokens, 'MISC');
            },
            researchresult,
            requests
        },
        methods: {}
    }
</script>