<template>
    <div class="graybox">
        <button
                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">Information</b>
        </button>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">Map</b>
        </button>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">Statistics</b>
        </button>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            <b class="mdc-button">Correction</b>
        </button>
    </div>
</template>

<script>
    export default {
        name: "researchtool",
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