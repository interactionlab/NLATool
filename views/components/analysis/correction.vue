<template>
    <div>
        <div v-for="(token,i) in selectedtokens">
            <p>{{token.content}}</p>
            <p v-on:click="showClasses(i)">{{token.semanticClass}}</p>
            <div v-if="shownclassespertoken">
                <button v-bind:class="{PERSON: true}"
                        v-on:click="changeClass('PERSON')"
                        class="mdl-button mdl-js-button">
                    <small class="mdc-button">PERSONS</small>
                </button>
                <button v-bind:class="{LOCATION: true}"
                        v-on:click="changeClass('LOCATION')"
                        class="mdl-button mdl-js-button">
                    <small class="mdc-button">LOCATION</small>
                </button>
                <button v-bind:class="{ORGANIZATION: true}"
                        class="mdl-button mdl-js-button"
                        v-on:click="changeClass('ORGANIZATION')">
                    <small class="mdc-button">ORGANIZATION</small>
                </button>
                <button v-bind:class="{MISC: true}"
                        class="mdl-button mdl-js-button"
                        v-on:click="changeClass('MISC')">
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
            return {
                showNewClasses: false,
                tokens: this.tokens,
                selectedtokens: [],
                selectedindexes: this.selectedindexes,
                classesPerToken: [],
                index: 0
            }

        },
        watch: {
            selectedindexes: {
                handler: function (newselectedindexes) {
                    this.selectedtokens =
                        this.gettokensofselectedtext(this.tokens, newselectedindexes);
                    for(let i = 0; i < this.selectedtokens.length; i++){
                        this.classesPerToken[i] = false;
                    }
                },
                deep: true
            }
        },
        computed:{
            shownclassespertoken:function () {
                console.log('Checkpoint shownclassespertoken: ');
                return this.classesPerToken[this.index];
            }
        },
        methods: {
            showClasses: function (index) {
                console.log('Index for shown classes: '+index);
                this.index = index;
                this.classesPerToken[index] = !this.classesPerToken[index];
            },
            changeClass: function (newClass) {
                for (let token in this.selectedtokens) {
                    console.log(token + "gets class " + newClass);
                }
            }
        }
    }
</script>