<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Header:-->
        <component
                is="mainheader"
                v-bind:title="title"
                v-bind:docid="docID"
                v-bind:preventtitleedit="false">
        </component>
        <component
                is="headernavbar"
                v-bind:title_small="title_small">
        </component>

        <main class="mdl-layout__content">
            <!-- Toolbar-->
            <div class="headerRowLight">
                <component
                        is="toolbar"
                        v-bind:lang="lang"
                        v-on:emitanalighter="getAnalighter"
                        v-on:emitnotes="getNotes"
                        v-on:emitresearch="getResearch"
                        v-on:changemarkermode="changeMarkerMode($event)"
                        v-on:changeresearchrode="changeResearchMode($event)">
                </component>
            </div>

            <div class="mdl-grid">
                <!--left grid for text stuff -->
                <div class="mdl-cell mdl-cell--6-col contentColor">
                    <div class="mdl-grid"
                         id="textWindow"
                         ref="textWindow"
                         style="width: 100%">
                        <component is="tex"
                                   v-for="(token,i) in vueTokens"
                                   v-bind:key="token.wordID"
                                   v-bind:token="token"
                                   v-bind:tokens="vueTokens"
                                   v-bind:index="i+1"
                                   v-bind:classestomark="classesToMark"
                                   v-on:clickword="setClickedWord($event)"
                                   v-on:startsection="selectText($event,0)"
                                   v-on:endselection="selectText($event,1)">
                        </component>
                    </div>
                </div>
                <!--right grid for result stuff -->
                <div class="mdl-cell mdl-cell--6-col contentColor" v-on:click="test">
                    <component
                            :is="analysisMode"
                            v-bind:tokens="vueTokens"
                            v-bind:clickedword="clickedWord"
                            v-bind:docid="docID"
                            v-bind:notes="notes"
                            v-bind:persons="persons"
                            v-bind:researchmode="researchmode">
                    </component>
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
    import tex from './components/analysis/text.vue';

    export default {
        data: function () {
            return {
                analysisMode: 'analighter',
                markermode: 'NE',
                showMode: 'nerVue',
                researchmode: '',
                clickedWord: {},
                persons: '',
                classesToMark: {
                    PERSON: false,
                    LOCATION: false,
                    ORGANIZATION: false,
                    MISC: false,
                    'I-PER': false,
                    'I-LOC': false,
                    'I-ORG': false,
                    'I-MISC': false,
                },
                selectedtextindexes: {
                    start: -1,
                    end: -1
                }
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
                //TODO: All button functionalitiy
                console.log('Got event to change the marker Mode: ' + mode);
                this.markermode = mode;
                console.log('classesToMark: ' + JSON.stringify(mode[1]));
                this.classesToMark[mode[0]] = !this.classesToMark[mode[0]];
            },
            test: function () {
                console.log(JSON.stringify(this.notes));
            },
            setPersons: function (persons) {
                this.persons = persons;
            },
            setClickedWord: function (word) {
                console.log('Setted clickword: ' + JSON.stringify(word));
                //TODO: JSON parse(stringify(OBJECT))
                const x = word;
                this.clickedWord = x;
            },
            changeResearchMode: function (mode) {
                console.log('analysis: Changing researchmode: ' + mode);
                this.researchmode = mode;
            },
            selectText: function (index, modus) {
                if (modus === 0) {
                    this.selectedtextindexes.start = index;
                    this.selectedtextindexes.end= -1;
                } else if (modus === 1) {
                    this.selectedtextindexes.end = index;
                }
            }
        },
        components: {
            mainheader,
            headernavbar,
            toolbar,
            research,
            notes,
            analighter,
            markjs,
            tex
        }
    }
</script>
