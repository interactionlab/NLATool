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

        <main class="mdl-layout__content">
            <form action="/loadWrittenText" method="post">

                <div class="mdl-grid">
                    <!-- Textfield for title-->
                    <div class="mdl-grid mdl-cell--8-col">
                        <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col contentColor">
                            <input class="mdl-textfield__input" type="text" id="titlebox" name="title">
                            <label class="mdl-textfield__label" for="titlebox">Enter title here ...</label>
                        </div>
                        <div class="mdl-layout-spacer"></div>
                    </div>

                    <!-- Textfield for textinput -->
                    <div class="mdl-grid mdl-cell--8-col">
                        <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--8-col contentColor"
                             style="width: 100%">
                    <textarea class="mdl-textfield__input" type="text" rows="15" id="textbox" name="textInput">
                    </textarea>
                            <label class="mdl-textfield__label" for="textbox">
                                Enter text here ...
                            </label>
                        </div>
                    </div>
                </div>
                <!-- Analyze Button -->
                <div class="mdl-grid mdl-cell--2-col">
                    <div class="mdl-grid" style="text-align: center">
                        <!-- extra div needed to make button in center -->
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">
                            <b class="mdc-button">Analyze</b>
                        </button>
                    </div>
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