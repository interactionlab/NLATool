<template>
    <div class="graybox">
        <button v-on:click="showNer"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">NER</b>
        </button>
        <button v-on:click="showNed"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">NED</b>
        </button>
        <button v-on:click="showNec"
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">NEC</b>
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
        },
    }
</script>

<style scoped>

</style>