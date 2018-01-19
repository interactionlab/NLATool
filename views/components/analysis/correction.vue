<template>
    <div>
        <div v-for="token in tokens">
            <p>{{token.content}}</p>
            <p v-on:click="showClasses">{{token.semanticClass}}</p>
            <div v-if="showNewClasses">
                <button v-bind:class="{PERSON: classesToMark.PERSON}"
                        class="mdl-button mdl-js-button">
                    <small class="mdc-button">PERSONS</small>
                </button>
                <button v-bind:class="{LOCATION: classesToMark.LOCATION}"
                        class="mdl-button mdl-js-button">
                    <small class="mdc-button">LOCATION</small>
                </button>
                <button v-bind:class="{ORGANIZATION: classesToMark.ORGANIZATION}"
                        class="mdl-button mdl-js-button">
                    <small class="mdc-button">ORGANIZATION</small>
                </button>
                <button v-bind:class="{MISC: classesToMark.MISC}"
                        class="mdl-button mdl-js-button">
                    <small class="mdc-button">MISC</small>
                </button>
            </div>

        </div>
    </div>

</template>
<script>
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';

    export default {
        mixins: [getselectedtext],
        props: {
            tokens: Array,
            selectedindexes: Object
        },
        data: function () {
            return{
                showNewClasses: false,
                tokens: this.tokens,
                selectedindexes: this.selectedindexes
            }

        },
        methods:{
            showClasses: function () {
                this.showNewClasses = !this.showNewClasses;
            },
            changeClass: function (newClass) {

            }
        }
    }
</script>