<template>
    <div class="mdl-tabs mdl-js-tabs">
        <!--Main Navigation:-->
        <div class="mdl-tabs__tab-bar">
            <a href="#tab1-panel" class="mdl-tabs__tab is-active" v-on:click="changetool('analightertool')">Analysis</a>
            <a href="#tab2-panel" class="mdl-tabs__tab" v-on:click="changetool('notestool')">Notes</a>
            <a href="#tab3-panel" class="mdl-tabs__tab" v-on:click="changetool('researchtool')">Research</a>
        </div>
        <div class="mdl-tabs__panel is-active " id="tab1-panel">
            <button v-on:click="changeMarkerMode('NE')"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">ALL</b>
            </button>
            <button v-on:click="changeMarkerMode('I-PER')"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">PERSONS</b>
            </button>
            <button v-on:click="changeMarkerMode('I-LOC')"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">LOCATION</b>
            </button>
            <button v-on:click="changeMarkerMode('I-ORG')"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">ORGANIZATION</b>
            </button>
            <button v-on:click="changeMarkerMode('I-MISC')"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">MISC</b>
            </button>
            <button v-on:click="changeMarkerMode('FM')"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">(FM)</b>
            </button>
            <button v-on:click="changeMarkerMode('NN')"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">(NN)</b>
            </button>
        </div>

        <div class="mdl-tabs__panel " id="tab2-panel">
            <p>Notetools</p>
        </div>

        <div class="mdl-tabs__panel " id="tab3-panel">
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


        <!--<div class="mdl-tabs__tab-bar">-->
        <!--<button v-on:click="changetool('analightertool')"-->
        <!--class="mdl-tabs__tab is-active">-->
        <!--<b class="mdc-button">Analysis</b>-->
        <!--</button>-->
        <!--<button v-on:click="changetool('notestool')"-->
        <!--class="mdl-tabs__tab">-->
        <!--<b class="mdc-button">Notes</b>-->
        <!--</button>-->
        <!--<button v-on:click="changetool('researchtool')"-->
        <!--class="mdl-tabs__tab">-->
        <!--<b class="mdc-button">Research</b>-->
        <!--</button>-->
        <!--</div>-->
        <!--<keep-alive>-->
        <!--<component :is="tool" v-on:changemarkermode="changeMarkerMode($event)"></component>-->
        <!--</keep-alive>-->
    </div>
</template>
<script>
    import analightertool from './components/analysis/toolbar/analightertool.vue';
    import researchtool from './components/analysis/toolbar/researchtool.vue';
    import notestool from './components/analysis/toolbar/notestool.vue';

    export default {
        data: function () {
            return {
                tool: 'analightertool',
            }
        },
        methods: {
            changetool: function (tool) {
                if (tool === 'analightertool') {
                    this.$emit('emitanalighter');
                } else if (tool === 'notestool') {
                    this.$emit('emitnotes');
                } else if (tool === 'researchtool') {
                    this.$emit('emitresearch');
                }
                this.tool = tool;
            },
            changeMarkerMode: function (mode) {
                this.$emit('changemarkermode', [mode]);
            },
        },
        components: {
            analightertool,
            researchtool,
            notestool
        }
    }
</script>