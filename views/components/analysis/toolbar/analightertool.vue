<template>
    <div class="graybox">
        <button v-on:click="showNer"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">NE</b>
        </button>
        <button v-on:click="showNed"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">FM</b>
        </button>
        <button v-on:click="showNec"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">NN</b>
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
        <button>

        </button>

    </div>
</template>

<script>
    export default {
        name: "analightertool",
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