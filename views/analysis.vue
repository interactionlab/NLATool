<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <component is="mainheader" v-bind:title="title"></component>
        <component is="headernavbar" v-bind:title_small="title_small"></component>

        <main class="mdl-layout__content">
            <component is="toolbar" v-on:emitanalighter="getAnalighter" v-on:emitnotes="getNotes"
                       v-on:emitresearch="getResearch" v-on:changemarkermode="changeMarkerMode($event)"></component>
            <div class="mdl-grid"> <!-- separate window in two-->
                <!--left grid for text stuff -->
                <div class="mdl-cell mdl-cell--6-col graybox">
                    <div class="mdl-grid">
                        <!-- clear button -->
                        <!--<button class="mdl-button mdl-js-button mdl-button&#45;&#45;raised mdl-js-ripple-effect mdl-button&#45;&#45;accent">-->
                        <!--<i class="material-icons">delete</i>-->
                        <!--</button>-->
                    </div>

                    <div class="mdl-grid" id="textWindow" ref="textWindow" style="width: 100%">
                        <!-- Resizable Textfield-->
                        <markjs v-bind:markermode="markermode" v-bind:tokens="vueTokens">
                            <p>{{ vueText }}</p>
                        </markjs>
                    </div>
                </div>
                <!--right grid for result stuff -->
                <div class="mdl-cell mdl-cell--6-col graybox">
                    <component :is="analysisMode" v-bind:tokens="vueTokens"></component>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
    import research from './components/analysis/research.vue';
    import notes from './components/analysis/notes/notes.vue';
    import mainheader from './components/global/mainheader.vue';
    import headernavbar from './components/global/headernavbar.vue';
    import toolbar from './components/analysis/toolbar/toolbar.vue';
    import analighter from './components/analysis/analighter.vue';
    import markjs from './components/analysis/mark.vue';

    export default {
        data: function () {
            return {
                analysisMode: 'research',
                markermode: 'NE'
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
            changeMarkerMode: function (mode) {
                console.log('Got event to change the marker Mode: ' + mode);
                this.markermode = mode;
            }


        },
        components: {
            mainheader,
            headernavbar,
            toolbar,
            research,
            notes,
            analighter,
            markjs
        }
    }
</script>
