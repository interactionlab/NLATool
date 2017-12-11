<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Header:-->
        <component is="mainheader" v-bind:title="title"></component>
        <component is="headernavbar" v-bind:title_small="title_small"></component>

        <main class="mdl-layout__content">
            <!-- Toolbar-->
            <div class="headerRowLight">
                <component is="toolbar" v-on:emitanalighter="getAnalighter" v-on:emitnotes="getNotes"
                           v-on:emitresearch="getResearch" v-bind:lang="lang" v-on:changemarkermode="changeMarkerMode($event)">
                </component>
            </div>

            <div class="mdl-grid">
                <!--left grid for text stuff -->
                <div class="mdl-cell mdl-cell--6-col contentColor">
                    <div class="mdl-grid">
                        <!-- clear button -->
                        <!--<button class="mdl-button mdl-js-button mdl-button&#45;&#45;raised mdl-js-ripple-effect mdl-button&#45;&#45;accent">-->
                        <!--<i class="material-icons">delete</i>-->
                        <!--</button>-->
                    </div>
                    <div class="mdl-grid" id="textWindow" ref="textWindow" style="width: 100%">
                        <markjs v-bind:markermode="markermode" v-bind:tokens="vueTokens"
                                v-on:perEvent="setPersons($event)" v-bind:lang="lang">
                            <p v-on:click="clickWord">{{ vueText }}</p>
                        </markjs>
                    </div>
                </div>
                <!--right grid for result stuff -->
                <div class="mdl-cell mdl-cell--6-col contentColor" v-on:click="test">
                    <component :is="analysisMode" v-bind:tokens="vueTokens" v-bind:clickedword="clickedWord"
                               v-bind:docid="docID" v-bind:notes="notes" v-bind:persons="persons"></component>
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
                analysisMode: 'analighter',
                markermode: 'NE',
                showMode: 'nerVue',
                clickedWord: '',
                persons: ''
            }
        },
        methods: {
            getAnalighter: function () {
                console.log('Got clicked1' + this.docID);
                this.analysisMode = 'analighter';
            },
            getNotes: function () {
                this.analysisMode = 'notes';

            },
            getResearch: function () {
                this.analysisMode = 'research';
            },
            changeMarkerMode: function (mode) {
                console.log('Got event to change the marker Mode: ' + mode);
                this.markermode = mode;
            },
            clickWord: function (element) {
                let content = element.target.textContent;
                let pos = window.getSelection().anchorOffset;
                console.log('Pos: ' + pos + ' WindowSelection:' + window.getSelection().baseOffset);
                content = content
                    .substring(0, content.indexOf(' ', pos))
                    .trim();
                content = content
                    .substr(content.lastIndexOf(' ') + 1)
                    .replace(/[.,:;!?()+-]/g, '');
                this.clickedWord = content;
                console.log(content);
            },
            test: function () {
                console.log(JSON.stringify(this.notes));
            },
            setPersons: function (persons) {
                this.persons = persons;
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
