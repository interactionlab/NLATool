<template>
        <div >
            <!--Main Navigation:-->
            <span>
            <nav class="mdl-navigation">
                <button v-on:click="changetool('analightertool')"
                        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    <b class="mdc-button">Analysis</b>
                </button>
                <button v-on:click="changetool('notestool')"
                        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    <b class="mdc-button">Notes</b>
                </button>
                <button v-on:click="changetool('researchtool')"
                        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    <b class="mdc-button">Research</b>
                </button>
            </nav>
            </span>
            <component :is="tool" v-on:changemarkermode="changeMarkerMode($event)"></component>
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