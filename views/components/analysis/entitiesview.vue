<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.PERSON === true">
            <span>PERSON ({{this.persons.length}})</span>
            <ul class="demo-list-item mdl-list" v-for="key in this.persons">
                <span class="mdl-list__item-primary-content" v-bind:class="{PERSON:true}">
                    {{key}}
                </span>
            </ul>
        </div>

        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.LOCATION === true">
            <span>LOCATION ({{this.locations.length}})</span>
            <ul class="demo-list-item mdl-list" v-for="key in this.locations">
                <span class="mdl-list__item-primary-content" v-bind:class="{LOCATION:true}">
                    {{key}}
                </span>
            </ul>
        </div>

        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.ORGANIZATION === true">
            <span>ORGANIZATION ({{this.organizations.length}})</span>
            <ul class="demo-list-item mdl-list" v-for="key in this.organizations">
                <span class="mdl-list__item-primary-content" v-bind:class="{ORGANIZATION:true}">
                    {{key}}
                </span>
            </ul>
        </div>

        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.MISC === true">
            <span>MISC ({{this.miscs.length}})</span>
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

    export default {
        mixins: [filtertokenwithclass],
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
                return this.filtertokenwithclass(this.tokens, 'PERSON');
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
        }
        ,
        methods: {}
    }
</script>