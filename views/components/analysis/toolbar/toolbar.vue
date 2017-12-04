<template>
    <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--12-col">
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
            <component :is="tool"> </component>
        </div>
    </div>
</template>
<script>
    import analightertool from './components/analysis/toolbar/analightertool.vue';
    import researchtool from './components/analysis/toolbar/researchtool.vue';
    export default {
        data: function () {
            return {
                tool: 'analightertool'
            }
        },
        methods: {
            emitanalighter: function () {
                this.$emit('emitanalighter');
            },
            emitnotes: function () {
                this.$emit('emitnotes');
            },
            emitresearch: function () {
                this.$emit('emitresearch');
            },
            changetool:function (tool) {
                this.tool = tool;
            }
        },
        components:{
            analightertool,
            researchtool
        }
    }
</script>