<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader"
                   v-bind:title="title"
                   v-bind:preventtitleedit="true">
        </component>
        <component is="headernavbar"
                   v-bind:title_small="title_small">
        </component>

        <main class="mdl-layout__content" style="display: flex; flex-flow: row wrap; width: 100%;">
            <form  class="mdl-grid" style="max-width:2160px; overflow-y:auto; flex-direction:column; width:100%" action="/loadWrittenText" method="post">
                <!-- Textfield for title-->
                <div class="mdl-cell mdl-cell--12-col contentColor" style="flex:0;padding:0.5em 1em 0em 1em">
                    <div class="mdl-textfield mdl-js-textfield" style="width:100%;">
                        <input class="mdl-textfield__input" type="text" id="titlebox" name="title">
                        <label class="mdl-textfield__label" for="titlebox">Enter title here ...</label>
                    </div>
                </div>
                <div class="mdl-layout-spacer mdl-cell--12-col" style="flex:0"></div>

                <!-- Textfield for textinput -->
                <div class="mdl-cell mdl-cell--12-col contentColor"
                     style="flex:2 0px;max-height: 100%; height:auto !important; display:flex;padding:0.5em 1em 0em 1em">
                     <div class="mdl-textfield mdl-js-textfield" style="width:100%;max-height: 100%; height:auto !important; display:flex;">
                        <textarea class="mdl-textfield__input" type="text" id="textbox" name="textInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-gramm="false"></textarea>
                    <label class="mdl-textfield__label" for="textbox">
                        Enter text here ...
                    </label>
                    </div>
                </div>
                <!-- Analyze Button -->
                <div class="mdl-cell mdl-cell--12-col" style="flex:0; text-align: center">
                    <!-- extra div needed to make button in center -->
                    <button class="mdl-button mdl-js-button mdl-button--raised  mdl-button--accent mdc-button--stroked">
                        <b class="mdc-button">Analyze</b>
                    </button>
                </div>
            </form>
        </main>
    </div>
</template>
<script>
    import headernavbar from './components/global/headernavbar.vue';
    import mainheader from './components/global/mainheader.vue';

    export default {

        data: function () {
            return {
                onOff: true,
            }
        },
        components: {
            mainheader,
            headernavbar,

        }, methods: {
            toggleOnOff: function () {
                this.onOff = !this.onOff;
            }
        }
    }
</script>