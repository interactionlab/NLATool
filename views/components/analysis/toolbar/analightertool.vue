
<template>

    <div class = "mdl-tabs mdl-js-tabs">
            <div class = "mdl-tabs__tab-bar">
                <a href = "#tab1-panel" class = "mdl-tabs__tab is-active">Tab 1</a>
                <a href = "#tab2-panel" class = "mdl-tabs__tab">Tab 2</a>
                <a href = "#tab3-panel" class = "mdl-tabs__tab">Tab 3</a>
            </div>

            <div class = "mdl-tabs__panel is-active" id = "tab1-panel">
                <p>Tab 1 Content</p>
            </div>

            <div class = "mdl-tabs__panel" id = "tab2-panel">
                <p>Tab 2 Content</p>
            </div>

            <div class = "mdl-tabs__panel" id = "tab3-panel">
                <p>Tab 3 Content</p>
            </div>
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