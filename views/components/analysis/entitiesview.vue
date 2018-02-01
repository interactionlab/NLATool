<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.PERSON === true">
            <dl>
                <dt>PERSON</dt>
                <dd v-for="key in this.persons"><span v-bind:class="{PERSON:true}">{{key.content}}</span></dd>
            </dl>
        </div>
        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.LOCATION === true">
            <dl>
                <dt>LOCATION</dt>
                <dd v-for="key in this.locations"><span v-bind:class="{LOCATION:true}">{{key.content}}</span></dd>
            </dl>
        </div>
        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.ORGANIZATION === true">
            <dl>
                <dt>ORGANIZATION</dt>
                <dd v-for="key in this.organizations"><span v-bind:class="{ORGANIZATION:true}">{{key.content}}</span></dd>
            </dl>
        </div>
        <div class="mdl-cell mdl-cell--3-col" v-if="this.classestomark.MISC === true">
            <dl>
                <dt>MISC</dt>
                <dd v-for="key in this.miscs"><span v-bind:class="{MISC:true}">{{key.content}}</span></dd>
            </dl>
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