<template>
    <!DOCTYPE html>
    <html>
    <body>

    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader" v-bind:title="title"></component>
        <component is="headernavbar" v-bind:title_small="title_small"></component>
        <main class="mdl-layout__content">

            <form action="/loadtext/loadWrittenText" method="post">
                <br/>
                <!-- Textfield for title-->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--4-col graybox" style="text-align: left">
                    <input class="mdl-textfield__input" type="text" id="titlebox" name="title">
                    <label class="mdl-textfield__label" for="titlebox">Title</label>
                </div>
                <!-- Textfield for textinput -->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col graybox" style="text-align: center">
                    <textarea class="mdl-textfield__input" type="text" rows="6" id="textbox" name="textInput">
                    </textarea>
                    <label class="mdl-textfield__label" for="textbox">
                        Enter text here ...
                    </label>
                </div>
                <!-- TODO add link to analysis use on-click -->
                <div class="mdl-cell mdl-cell--12-col graybox " style="text-align: center">
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button mdl-navigation__link" href="analysis">Analyze</b>
                    </button>
                </div>
            </form>
        </main>
    </div>
    </body>
    </html>
</template>
<script>
    import headernavbar from './components/global/headernavbar.vue';
    import mainheader from './components/global/mainheader.vue';

    export default {
        data: function () {
            return {}
        },
        components: {
            mainheader,
            headernavbar
        }
    }
</script>