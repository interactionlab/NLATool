<template>
    <div>
        <div class="graybox">
            <button v-on:click="showNer"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">ALL</b>
            </button>
            <button v-on:click="showPersons"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">PERSONS</b>
            </button>
            <button v-on:click="showLoc"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">LOCATION</b>
            </button>
            <button v-on:click="showOrg"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">ORGANIZATION</b>
            </button>
            <button v-on:click="showMisc"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">MISC</b>
            </button>
            <button v-on:click="showNed"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">(FM)</b>
            </button>
            <button v-on:click="showNec"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">(NN)</b>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        //TODO: set default view to NE, doesn't work right now
        name: "analightertool",
        showMode: 'nerVue',
        markermode: 'NE',
        methods: {
            showNer: function () {
                //console.log('FM Filter on the tokens: ' + this.filterPos(this.tokens, 'FM'));
                this.showMode = 'nerVue';
                this.$emit('changemarkermode', ['NE']);
            },
            showNed: function () {
                this.showMode = 'nedVue';
                this.$emit('changemarkermode', ['FM']);
            },
            showNec: function () {
                this.showMode = 'necVue';
                this.$emit('changemarkermode', ['NN']);
            },
            showPersons: function () {
                this.showMode = 'nerVue';
                this.$emit('changemarkermode', ['I-PER']);
            },
            showLoc: function () {
                this.showMode = 'nerVue';
                this.$emit('changemarkermode', ['I-LOC']);
            },
            showOrg: function () {
                this.showMode = 'nerVue';
                this.$emit('changemarkermode', ['I-ORG']);
            },
            showMisc: function () {
                this.showMode = 'nerVue';
                this.$emit('changemarkermode', ['I-MISC']);
            }
        },
    }
</script>

<style scoped>

</style>