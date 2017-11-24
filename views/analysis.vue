<template>
    <!DOCTYPE html>
    <html>
    <body>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <component is="mainheader" v-bind:title="title" ></component>
        <component is="headernavbar" v-bind:title_small="title_small"></component>


        <main class="mdl-layout__content">
            <div class="page-content">
                <component is="titletools" v-on:emitanalighter="getAnalighter" v-on:emitnotes="getNotes"
                           v-on:emitresearch="getResearch"></component>
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

                        <div class="mdl-grid" id="textWindow"> <!-- Resizable Textfield-->
                            <div style="width: 100%">
                                <p>{{ vueText }}</p>
                            </div>
                        </div>
                    </div>

                    <!--right grid for result stuff -->
                    <div class="mdl-cell mdl-cell--6-col graybox">
                        <component :is="analysisMode"></component>
                    </div>
                </div>
            </div>
            <!--


            import analighter from './components/analysis/analighter.vue';

            analighter,
    -->
        </main>
    </div>
    </body>
    </html>
</template>
<script>
    import research from './components/analysis/research.vue';
    import notes from './components/analysis/notes.vue';
    import mainheader from './components/global/mainheader.vue';
    import headernavbar from './components/global/headernavbar.vue';
    import titletools from './components/analysis/titletools.vue';

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
            },
            components: {
                mainheader:mainheader,
                headernavbar,
                titletools,
                research,
                notes,
            }
        }
    }
</script>
