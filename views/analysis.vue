<template>
    <!DOCTYPE html>
    <html>
    <body>

    <div class="demo-layout-waterfall mdl-layout mdl-js-layout">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader" v-bind:title="title" v-bind:title_small="this.title_small"></component>

        <main class="mdl-layout__content">
            <div class="page-content">
                <div class="mdl-grid">
                    <!-- old Featrue field-->
                </div>

                <div class="mdl-grid"> <!-- separate window in two-->
                    <!--left grid for text stuff -->
                    <div class="mdl-cell mdl-cell--6-col graybox">
                        <div class="mdl-grid"> <!-- clear button -->
                            <div>
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                    <i class="material-icons">delete</i>
                                </button>
                            </div>
                        </div>

                        <div class="mdl-grid"> <!-- Resizable Textfield-->
                            <div style="width: 100%">
                                <p>{{ result }}</p>
                            </div>
                        </div>
                    </div>

                    <!--right grid for result stuff -->
                    <div class="mdl-cell mdl-cell--6-col graybox">
                        <!-- Features -->
                        <nav class="mdl-navigation">
                            <button v-on:click="getAnalighter"
                                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                <b class="mdc-button">Analysis</b>
                            </button>
                            <button v-on:click="getNotes"
                                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                <b class="mdc-button">Notes</b>
                            </button>
                            <button v-on:click="getResearch"
                                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                <b class="mdc-button">Research</b>
                            </button>
                        </nav>
                        <component :is="analysisMode"></component>
                    </div>
                </div>
            </div>
        </main>
    </div>
    </body>
    </html>

</template>
<script>

    import research from './components/analysis/research.vue';
    import analighter from './components/analysis/analighter.vue';

    import mainheader from './components/global/mainHeader.vue';

    export default {
        data: function () {
            return {
                analysisMode: 'research',
            }
        },
        methods: {
            getAnalighter: function () {
                console.log('Got clicked1');
                this.analysisMode = 'analighter'
            },
            getNotes: function () {
                console.log('got Clicked2');
                this.analysisMode = 'notes';

            },
            getResearch: function () {
                console.log('Got clicked3');
                this.analysisMode = 'research';
            }
        },
        components: {
            research,
            analighter,
            mainheader
        }
    }
</script>
