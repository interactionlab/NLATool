<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <component
                is="mainheader"
                v-bind:title="title"
                v-bind:docid="docID"
                v-bind:route="'analysis'"
                v-bind:numberofcolumns="numberOfColumns"
                v-bind:preventtitleedit="false"
                v-bind:autochecked="resizing"
                v-on:newcolumnnumber="setNumberOfColumns($event)"
                v-on:contenttoggle="toogleResearchContent($event)">
        </component>
        <component
                is="headernavbar"
                v-bind:title_small="title_small">
        </component>

        <main class="mdl-layout__content"
              style="display: flex; flex-flow: row wrap; width: 100%; flex-direction: column;">
            <!-- Toolbar-->
            <div class="headerRowLight" style="flex: 0;width: 100%;">
                <component
                        is="toolbar"
                        v-bind:tokens="vueTokens"
                        v-bind:selectedindexes="selectedtextindexes"
                        v-bind:classestomark="classesToMark"
                        v-bind:style="{left: columnsizetoolbarpos+ '%'}"
                        v-on:emitanalighter="getAnalighter"
                        v-on:emitnotes="getNotes"
                        v-on:emitresearch="getResearch"
                        v-on:changemarkermode="changeMarkerMode($event)"
                        v-on:changenotemode="changeNoteMode($event)"
                        v-on:entercorrectionmode="entercorrectionmode($event)">
                </component>
            </div>
            <div style="flex: 0;width: 100%; position: relative;">
                <component is="textviewcontrol"
                           v-on:changescope="changeScope($event)"
                           v-bind:style="{left: columnsizetoolbarpos + '%', width : columnsize2 + '%'}">
                </component>
            </div>
            <div class="mdl-grid"
                 style="width:100%;overflow: hidden;height: auto !important;max-height: 100%;flex: 2 1 0px;padding:0em">
                <div
                        style="height: auto !important;max-height: 100%;display: flex;overflow: hidden;width:100%;"
                        v-for="(col, colIndex) in tokenstoshow"
                        v-bind:style="{width : columnsize2 + '%'}">
                    <component id="textfeatureviewport"
                               is="textfeatureviewport"
                               v-bind:col="col"
                               v-bind:colindex="colIndex"
                               v-bind:splitted="splitted"
                               v-bind:tokenstoshow="tokenstoshow"
                               v-bind:textcolumnposition="textcolumnposition"
                               v-bind:tokens="vueTokens"
                               v-bind:mentions="coref"
                               v-bind:selectedindexes="selectedtextindexes"
                               v-bind:classestomark="classesToMark"
                               v-bind:hoveredchain="hoveredChain"
                               v-bind:analysismode="analysisMode"
                               v-bind:docid="docID"
                               v-bind:notes="notes"
                               v-bind:notemodes="notemodes"
                               v-bind:researchmode="researchmode"
                               v-bind:selectedchain="selectedChain"
                               v-bind:showmode="showMode"
                               v-bind:contentcontrol="contentcontrol"
                               v-on:movetoolbar="movetoolbar($event)"
                               v-on:hoverchain="hoverChain($event)"
                               v-on:startselection="selectText($event,0)"
                               v-on:endselection="selectText($event,1)"
                               v-on:jumpmarktext="selectText2($event)"
                               v-on:togglesemanticlass="changeMarkerMode($event)"
                               v-on:setoffsetstart="setoffsetstart($event)"
                               v-on:hoverlinesetoffsetend="hoverlinesetoffsetend($event)">
                    </component>
                </div>
            </div>
        </main>
        <component is="variablehelper"
                   v-bind:tokens="vueTokens"
                   v-on:resize="setTokens($event)">
        </component>
        <component is="linetohover"
                   id="line"
                   v-if="offsetstart != null && offsetend != null"
                   v-bind:offsetstart="offsetstart"
                   v-bind:offsetend="offsetend">
        </component>
    </div>

</template>
<script>
    import research from './components/analysis/research.vue';
    import notes from './components/analysis/notes/notes.vue';
    import mainheader from './components/global/mainheader.vue';
    import headernavbar from './components/global/headernavbar.vue';
    import toolbar from './components/analysis/toolbar/toolbar.vue';
    import textviewcontrol from './components/analysis/toolbar/textviewcontrol.vue';
    import analighter from './components/analysis/analighter.vue';
    import markjs from './components/analysis/mark.vue';
    import tex from './components/analysis/text.vue';
    import variablehelper from './components/global/variablehelper.vue';
    import textfeatureviewport from './components/analysis/textfeatureviewport.vue';
    import linetohover from './components/analysis/linetohover.vue';

    export default {
        data: function () {
            return {
                offsetstart: null,
                offsetend: null,
                analysisMode: 'analighter',
                showMode: 'entitiesview',
                researchmode: '',
                classesToMark: {
                    coref: false,
                    PERSON: false,
                    LOCATION: false,
                    ORGANIZATION: false,
                    MISC: false,
                    POS: false
                },
                selectedtextindexes: {
                    start: -1,
                    end: -1
                },
                notemodes: {
                    wordnote: true,
                    globalnote: false
                },
                hoveredChain: -1,
                selectedChain: -1,
                screenOptions: {
                    screenWidth: -1,
                    screenHeight: -1,
                    minimumColumnWidth: 400,
                    minimColumnHeight: 500,
                    maxColumnWidth: 800,
                    maxColumnHeight: -1
                },
                numberOfColumns: 0,
                splitted: [],
                tokenstoshow: [],

                columnsize2: 100,
                columnsizetoolbarpos: 0,
                textcolumnposition: {
                    start: -1,
                    end: -1,
                    difference: -1
                },
                tokens: [1],
                splittNotes: [],
                resizing: true,
                contentcontrol: {
                    PERSONS: {
                        img: true,
                        map: false,
                        information: true
                    },
                    LOCATIONS: {
                        img: true,
                        map: true,
                        information: true
                    },
                    ORGANIZATIONS: {
                        img: true,
                        map: true,
                        information: true
                    },
                    MISCS: {
                        img: true,
                        map: true,
                        information: true
                    }

                }
            }
        },
        methods: {
            toogleResearchContent: function (toToggle) {
                this.contentcontrol.PERSONS[toToggle] = !this.contentcontrol.PERSONS[toToggle];
                this.contentcontrol.LOCATIONS[toToggle] = !this.contentcontrol.LOCATIONS[toToggle];
                this.contentcontrol.ORGANIZATIONS[toToggle] = !this.contentcontrol.ORGANIZATIONS[toToggle];
                this.contentcontrol.MISCS[toToggle] = !this.contentcontrol.MISCS[toToggle];
                this.contentcontrol.PERSONS['map'] = false;
            },
            setTokens: function (newTokens) {
                this.tokens = newTokens;
            },
            hoverChain: function (chain) {
                this.hoveredChain = chain;
            },
            movetoolbar: function (colIndex) {
                this.columnsizetoolbarpos = (colIndex / this.numberOfColumns)*100.0;
            },
            getAnalighter: function () {
                this.analysisMode = 'analighter';
            },
            getNotes: function () {
                this.analysisMode = 'notes';
            },
            getResearch: function () {
                this.analysisMode = 'research';
            },
            changeMarkerMode: function (newClassesToMark) {
                // console.log('classesToMark: ' + JSON.stringify(newClassesToMark));
                this.classesToMark = newClassesToMark;
            },
            entercorrectionmode: function (correctionMode) {
                if (correctionMode === true) {
                    this.showMode = 'correction';
                } else {
                    this.showMode = 'entitiesview';
                }

            },
            selectText: function (index, modus) {
                if (modus === 0) {
                    this.selectedtextindexes.start = index;
                    this.selectedtextindexes.end = -1;
                } else if (modus === 1) {
                    this.selectedtextindexes.end = index;
                }
                if (this.selectedtextindexes.start !== -1 && this.selectedtextindexes.end !== -1) {
                    //console.log(this.selectedtextindexes.start + ' >> ' + this.selectedtextindexes.end - 1);
                    if (this.selectedtextindexes.start > this.selectedtextindexes.end - 1) {
                        let tempstart = this.selectedtextindexes.start + 1;
                        this.selectedtextindexes.start = this.selectedtextindexes.end - 1;
                        this.selectedtextindexes.end = tempstart;
                    }
                }
                //console.log('selectedIndexes: ' + JSON.stringify(this.selectedtextindexes));
            },
            selectText2: function (newSelectedIndexes) {
                this.selectedindexes = newSelectedIndexes;
            },
            changeNoteMode: function (newNoteModes) {
                //console.log('changing Note Modes: ' + newNoteModes);
                this.notemodes = newNoteModes;
            },
            setColumnSize2: function () {
                this.columnsize2  = 100.0 / this.numberOfColumns;
                this.showTokens(this.numberOfColumns, this.numberOfColumns);

            },
            showTokens: function (difference, end) {
                this.tokenstoshow = [];
                let newtokenstoshow = [];
                //console.log('Input for showTokens: ' + end + ': ' + difference + ' : ' + (this.splitted.length));
                if (end > this.splitted.length) {
                    newtokenstoshow = this.splitted.slice(0, this.splitted.length);
                    for (let i = 0; i < newtokenstoshow.length; i++) {
                        this.tokenstoshow.push(newtokenstoshow[i]);
                    }
                    this.textcolumnposition.end = this.splitted.length - 1;
                    this.textcolumnposition.start = 0;
                } else {
                    if (end - difference >= 0) {
                        newtokenstoshow = this.splitted.slice(end - difference, end);
                        for (let i = 0; i < newtokenstoshow.length; i++) {
                            this.tokenstoshow.push(newtokenstoshow[i]);
                        }
                        this.textcolumnposition.start = end - difference;
                    } else {
                        newtokenstoshow = this.splitted.slice(0, difference);
                        for (let i = 0; i < newtokenstoshow.length; i++) {
                            this.tokenstoshow.push(newtokenstoshow[i]);
                        }
                        this.textcolumnposition.start = 0;
                        //console.log('Got here3');
                    }
                    this.textcolumnposition.end = end;
                }
                this.textcolumnposition.difference = difference;
                //console.log('The textcolumnposition: ' + JSON.stringify(this.textcolumnposition));
                //console.log('Tokens to show: ' + JSON.stringify(this.tokenstoshow));
                //console.log('tokenstoshow different to splitted? ' + this.splitted.length + '==?' + this.tokenstoshow.length);
            },
            changeScope: function (direction) {
                //console.log('changing Scope: Check 0 ' + direction);
                if (direction) {
                    if (this.textcolumnposition.end >= this.textcolumnposition.difference) {
                        //console.log('changing Scope: Check 1');
                        this.showTokens(this.textcolumnposition.difference, this.textcolumnposition.end - 1);
                    }
                } else if (!direction) {
                    if (this.textcolumnposition.end < this.splitted.length) {
                        //console.log('changing Scope: Check 2');
                        this.showTokens(this.textcolumnposition.difference, this.textcolumnposition.end + 1);
                    }
                }
            },
            splitNotes: function () {
                for (let i = 0; i < this.splitted; i++) {
                    for (let j = 0; j < this.notes; j++) {
                        if (this.splitted[i][this.splitted[i].length - 1] === 0) {
                        }
                    }
                }
            },
            splitTokens: function () {
                let splitPoint = Math.trunc(this.tokens.length / this.numberOfColumns) + 1;
                //console.log('new splitpoint is: ' + splitPoint);
                let startSlice = 0;
                this.splitted = [];
                for (let i = 0; i < this.numberOfColumns; i++) {
                    this.splitted.push(this.tokens.slice(startSlice, startSlice + splitPoint));
                    startSlice = startSlice + splitPoint;
                }
                if (startSlice < this.tokens.length) {
                    this.splitted[this.numberOfColumns - 1].push(this.tokens.slice(startSlice, this.tokens.length));
                }
                //console.log('splitted Tokens:' + JSON.stringify(this.splitted));
            },
            splitTokens2: function () {
                this.splitted = [];
                if (this.screenOptions.screenHeight > this.screenOptions.maxColumnHeight) {

                } else {
                    this.splitted.push(this.tokens);
                }
            },
            computeNumberOfColumns: function () {
                this.numberOfColumns = Math.trunc(this.screenOptions.screenWidth / this.screenOptions.maxColumnWidth);
                if (this.numberOfColumns === 0) {
                    this.numberOfColumns++;
                }
                //console.log('screenValues:' + JSON.stringify(this.screenOptions));
                //console.log('colQuantity:' + this.numberOfColumns);
            },
            setNumberOfColumns: function (number) {
                if (number > 0 && number !== this.numberOfColumns) {
                    this.numberOfColumns = number;
                    this.splitTokens();
                    this.setColumnSize2();
                    this.resizing = false;
                } else {
                    this.resizing = true;
                    this.resize();
                }
            },
            setScreenOptions: function () {
                //console.log('changing Screensizes:');
                this.screenOptions = {
                    screenWidth: window.innerWidth,
                    screenHeight: window.outerHeight,
                    minimumColumnWidth: 650,
                    minimColumnHeight: 650,
                    maxColumnWidth: 1300,
                    maxColumnHeight: window.innerHeight
                };
            },
            resize: function () {
                if (this.resizing) {
                    this.setScreenOptions();
                    this.computeNumberOfColumns();
                    this.splitTokens();
                    this.setColumnSize2();
                }
            },
            setoffsetstart: function (event) {
                this.offsetstart = event[0];
                //let hoveredentitiy = event[1];

            },
            hoverlinesetoffsetend: function (event) {
                this.offsetend = event;
            },
        },
        mounted() {
            window.addEventListener('resize', this.resize);
            this.resize();
        },
        beforeDestroy() {
            window.removeAllListeners();
        },
        computed: {},
        watch: {
            selectedtextindexes: {
                handler: function (newSelectedIndexes) {
                    this.selectedChain = -1;
                    if (this.classesToMark.coref) {
                        if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                            for (let i = newSelectedIndexes.start; i < newSelectedIndexes.end; i++) {
                                if (typeof this.tokens[i].coref !== 'undefined') {
                                    this.selectedChain = this.tokens[i].coref[0].mentionID;
                                    for (let j = 0; j < this.tokens[i].coref.length; j++) {
                                        if (this.tokens[i].coref[j].kind === 'outer') {
                                            this.selectedChain = this.tokens[i].coref[j].mentionID;
                                            break;
                                        } else if (this.tokens[i].coref[j].kind === 'inner') {
                                            if (this.tokens[i].coref[j].endIndex >= newSelectedIndexes.end) {
                                                this.selectedChain = this.tokens[i].coref[j].mentionID;
                                                break;
                                            }
                                        } else if (this.tokens[i].coref[j].kind === 'first') {
                                            this.selectedChain = this.tokens[i].coref[j].mentionID;
                                        } else if (this.tokens[i].coref[j].kind === 'second') {
                                            this.selectedChain = this.tokens[i].coref[j].mentionID;
                                            break;
                                        }
                                    }
                                }

                            }
                        }
                    }
                    //console.log('Watcher got new selected Chain: ' + this.selectedChain);
                },
                deep: true
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
            tex,
            variablehelper,
            textfeatureviewport,
            textviewcontrol,
            linetohover
        }
    }
</script>
