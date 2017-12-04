<template>
    <div class="graybox">
        <button v-on:click="showNer">NER</button>
        <button v-on:click="showNed">NED</button>
        <button v-on:click="showNec">NEC</button>
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