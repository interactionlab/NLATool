<template>
    <div>
    <md-tabs>
        <md-tab id="tab-home" md-label="Home"></md-tab>
        <md-tab id="tab-pages" md-label="Pages"></md-tab>
        <md-tab id="tab-posts" md-label="Posts"></md-tab>
        <md-tab id="tab-favorites" md-label="Favorites"></md-tab>
    </md-tabs>
    </div>

</template>

<script>
    export default {
        //TODO: set default view to NE, doesn't work right now
        name: "analightertool",
        name: 'TabAlignments',
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
    .md-tabs {
        margin-bottom: 24px;
    }
</style>