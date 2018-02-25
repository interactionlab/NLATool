<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
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
                        v-bind:tokens="vueTokens"
                        v-bind:selectedindexes="selectedtextindexes"
                        v-on:emitanalighter="getAnalighter"
                        v-on:emitnotes="getNotes"
                        v-on:emitresearch="getResearch"
                        v-on:changemarkermode="changeMarkerMode($event)"
                        v-on:changenotemode="changeNoteMode($event)"
                        v-on:entercorrectionmode="entercorrectionmode($event)">
                </component>
            </div>
            <div class="mainbox">
                <div class="scopeButton icon-arrow-left"
                     v-on:click="changeScope(true)"></div>
                <div class="mdl-grid mainbox">
                    <div class="mdl-cell"
                         v-for="(col, colIndex) in tokenstoshow"
                         v-bind:class="columnsize">
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
                                   v-bind:nestedmentions="nestedChains"
                                   v-bind:analysismode="analysisMode"
                                   v-bind:docid="docID"
                                   v-bind:notes="notes"
                                   v-bind:notemodes="notemodes"
                                   v-bind:researchmode="researchmode"
                                   v-bind:selectedchain="selectedChain"
                                   v-bind:showmode="showMode"
                                   v-on:hoverchain="hoverChain($event)"
                                   v-on:startselection="selectText($event,0)"
                                   v-on:endselection="selectText($event,1)"
                                   v-on:jumpmarktext="selectText2($event)"
                        >
                        </component>
                    </div>
                </div>
                <div class="scopeButton icon-arrow-right"
                     id="forwardScopeButton"
                     v-on:click="changeScope(false)">
                </div>
            </div>
        </main>
        <component is="variablehelper"
                   v-bind:tokens="vueTokens"
                   v-on:resize="setTokens($event)">
        </component>
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
    import variablehelper from './components/global/variablehelper.vue';
    import textfeatureviewport from './components/analysis/textfeatureviewport.vue';

    export default {
        data: function () {
            return {
                analysisMode: 'analighter',
                markermode: 'NE',
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
                numberOfColumns: -1,
                splitted: [],
                tokenstoshow: [],
                columnsize: {
                    'mdl-cell--1-col': false,
                    'mdl-cell--2-col': false,
                    'mdl-cell--4-col': false,
                    'mdl-cell--6-col': false,
                    'mdl-cell--8-col': false,
                    'mdl-cell--10-col': false,
                    'mdl-cell--12-col': true,
                },
                textcolumnposition: {
                    start: -1,
                    end: -1,
                    difference: -1
                },
                tokens: [1]
            }
        },
        methods: {
            setTokens: function (newTokens) {
                this.tokens = newTokens;
            },
            hoverChain: function (chain) {
                this.hoveredChain = chain;
            },
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
                //console.log('Got event to change the marker Mode: ' + mode);
                this.markermode = mode;
                //  console.log('classesToMark: ' + JSON.stringify(mode[1]));
                this.classesToMark[mode[0]] = !this.classesToMark[mode[0]];
            },
            test: function () {
                console.log(JSON.stringify(this.notes));
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
                    console.log(this.selectedtextindexes.start + ' >> ' + this.selectedtextindexes.end - 1);
                    if (this.selectedtextindexes.start > this.selectedtextindexes.end - 1) {
                        let tempstart = this.selectedtextindexes.start + 1;
                        this.selectedtextindexes.start = this.selectedtextindexes.end - 1;
                        this.selectedtextindexes.end = tempstart;
                    }
                }

                console.log('selectedIndexes: ' + JSON.stringify(this.selectedtextindexes));

            },
            selectText2: function (newSelectedIndexes) {
                this.selectedindexes = newSelectedIndexes;
            },
            changeNoteMode: function (newNoteModes) {
                console.log('changing Note Modes: ' + newNoteModes);
                this.notemodes = newNoteModes;
            },
            setColumnSizeFalse: function () {
                for (let theClass in this.columnsize) {
                    this.columnsize[theClass] = false;
                }
            },
            setColumnSize: function (columnQuantity) {
                switch (true) {
                    case (columnQuantity >= 12):
                        this.setColumnSizeFalse();
                        this.columnsize["mdl-cell--1-col"] = true;
                        this.showTokens(12, 13);
                        break;
                    case (columnQuantity < 12 && columnQuantity >= 6):
                        this.setColumnSizeFalse();
                        this.columnsize["mdl-cell--2-col"] = true;
                        this.showTokens(columnQuantity, 7);
                        break;
                    case (columnQuantity < 6 && columnQuantity >= 3):
                        this.setColumnSizeFalse();
                        this.columnsize["mdl-cell--4-col"] = true;
                        this.showTokens(columnQuantity, 5);
                        break;
                    case (columnQuantity < 3 && columnQuantity >= 2):
                        this.setColumnSizeFalse();
                        this.columnsize["mdl-cell--6-col"] = true;
                        this.showTokens(columnQuantity, 3);
                        break;
                    case (columnQuantity < 2 && columnQuantity >= 1):
                        this.setColumnSizeFalse();
                        this.columnsize["mdl-cell--12-col"] = true;
                        this.showTokens(columnQuantity, 2);
                        break;
                    default:
                        this.setColumnSizeFalse();
                        this.columnsize["mdl-cell--12-col"] = true;
                        this.showTokens(columnQuantity, columnQuantity + 1);
                        break;
                }
            },
            showTokens: function (difference, end) {
                this.tokenstoshow = [];
                let newtokenstoshow = [];
                console.log('Input for showTokens: ' + end + ': ' + difference + ' : ' + (this.splitted.length));
                if (end > this.splitted.length) {
                    newtokenstoshow = this.splitted.slice(0, this.splitted.length);
                    for (let i = 0; i < newtokenstoshow.length; i++) {
                        this.tokenstoshow.push(newtokenstoshow[i]);
                    }
                    this.textcolumnposition.end = this.splitted.length - 1;
                    this.textcolumnposition.start = 0;
                    console.log('Got here1');
                } else {
                    if (end - difference >= 0) {
                        newtokenstoshow = this.splitted.slice((end + 1) - difference, end);
                        for (let i = 0; i < newtokenstoshow.length; i++) {
                            this.tokenstoshow.push(newtokenstoshow[i]);
                        }
                        this.textcolumnposition.start = (end + 1) - difference;
                        console.log('Got here2');
                    } else {
                        console.log('Got here3');
                        newtokenstoshow = this.splitted.slice(0, end);
                        for (let i = 0; i < newtokenstoshow.length; i++) {
                            this.tokenstoshow.push(newtokenstoshow[i]);
                        }
                        this.textcolumnposition.start = 0;
                    }
                    this.textcolumnposition.end = end;
                }
                this.textcolumnposition.difference = difference;
                console.log('The textcolumnposition: ' + JSON.stringify(this.textcolumnposition));
                console.log('Tokens to show: ' + JSON.stringify(this.tokenstoshow));
                console.log('tokenstoshow different to splitted? ' + this.splitted.length + '==?' + this.tokenstoshow.length);
            },
            changeScope: function (direction) {
                console.log('changing Scope: Check 0 ' + direction);
                if (direction) {
                    if (this.textcolumnposition.end >= this.textcolumnposition.difference) {
                        console.log('changing Scope: Check 1');
                        this.showTokens(this.textcolumnposition.difference, this.textcolumnposition.end - 1);
                    }
                } else if (!direction) {
                    if (this.textcolumnposition.end < this.splitted.length) {
                        console.log('changing Scope: Check 2');
                        this.showTokens(this.textcolumnposition.difference, this.textcolumnposition.end + 1);
                    }
                }
            },
            splitTokens: function () {
                let splitPoint = Math.trunc(this.tokens.length / this.numberOfColumns);
                let startSlice = 0;
                this.splitted = [];
                for (let i = 0; i < this.numberOfColumns; i++) {
                    this.splitted.push(this.tokens.slice(startSlice, startSlice + splitPoint));
                    startSlice = startSlice + splitPoint;
                }
                if (startSlice < this.tokens.length) {
                    this.splitted[this.numberOfColumns - 1].push(this.tokens.slice(startSlice, this.tokens.length));
                }
                console.log('splitted Tokens:' + JSON.stringify(this.splitted));
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
                console.log('screenValues:' + JSON.stringify(this.screenOptions));
                console.log('colQuantity:' + this.numberOfColumns);
            },
            setScreenOptions: function () {
                console.log('changing Screensizes:');
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
                this.setScreenOptions();
                this.computeNumberOfColumns();
                this.splitTokens();
                this.setColumnSize(this.numberOfColumns)
            }
        },
        mounted() {
            window.addEventListener('resize', this.resize);
            this.resize();
        },
        beforeDestroy() {
            window.removeAllListeners();
        },
        computed: {
            nestedChains: function () {
                let nestedMentions = {
                    fullyNested: [],
                    nested: []
                };
                try {
                    for (let i = 0; i < this.coref[0].length; i++) {
                        for (let j = i + 1; j < this.coref[0].length - (i + 1); j++) {
                            if (this.coref[0][i].startIndex >= this.coref[0][j].startIndex
                                && this.coref[0][i].startIndex <= this.coref[0][j].endIndex) {
                                if (this.coref[0][i].endIndex <= this.coref[0][j].endIndex) {
                                    // i Mention is in j Mention
                                    nestedMentions.fullyNested.push({
                                        inner: this.coref[0][i].mentionID,
                                        outer: this.coref[0][j].mentionID
                                    });
                                } else {
                                    // i Mention starts after j Mention starts
                                    nestedMentions.nested.push({
                                        first: this.coref[0][j].mentionID,
                                        second: this.coref[0][i].mentionID
                                    });
                                }
                            } else if (this.coref[0][j].startIndex >= this.coref[0][i].startIndex
                                && this.coref[0][j].startIndex <= this.coref[0][i].endIndex) {
                                if (this.coref[0][j].endIndex <= this.coref[0][i].endIndex) {
                                    // j Mention is in i Mention
                                    nestedMentions.fullyNested.push({
                                        inner: this.coref[0][j].mentionID,
                                        outer: this.coref[0][i].mentionID
                                    });
                                } else {
                                    // j Mention starts after i Mention starts
                                    nestedMentions.nested.push({
                                        first: this.coref[0][i].mentionID,
                                        second: this.coref[0][j].mentionID
                                    });
                                }
                            }
                        }
                    }
                    return nestedMentions;
                }
                catch
                    (err) {
                    console.log('nested Chains Recognition failed:' + err);
                    return nestedMentions;
                }
            }
        },
        watch: {
            selectedtextindexes: {
                handler: function (newSelectedIndexes) {
                    console.log('Watcher activated: ' + JSON.stringify(newSelectedIndexes));
                    let priorisizedFound = false;
                    let nested = false;
                    this.selectedChain = -1;
                    if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                        for (let i = 0; i < this.coref[0].length; i++) {
                            if (priorisizedFound) {
                                break;
                            }
                            console.log(newSelectedIndexes.start + '>=' + this.coref[0][i].startIndex);
                            console.log(newSelectedIndexes.end + '<=' + this.coref[0][i].endIndex);
                            if (newSelectedIndexes.start >= this.coref[0][i].startIndex
                                && newSelectedIndexes.end <= this.coref[0][i].endIndex) {
                                for (let j = 0; j < this.nestedChains.fullyNested.length; j++) {
                                    if (this.nestedChains.fullyNested[j].inner === this.coref[0][i].mentionID) {
                                        if (this.coref[0][i].representative === -1) {
                                            this.selectedChain = this.coref[0][i].mentionID;
                                            priorisizedFound = true;
                                            nested = true;
                                            break;
                                        } else {
                                            this.selectedChain = this.coref[0][i].representative;
                                            priorisizedFound = true;
                                            nested = true;
                                            break;
                                        }
                                    } else if (this.nestedChains.fullyNested[j].outer === this.coref[0][i].mentionID) {
                                        if (this.coref[0][i].representative === -1) {
                                            console.log('outer Check1');
                                            this.selectedChain = this.coref[0][i].mentionID;
                                            nested = true;
                                        } else {
                                            console.log('outer Check2');
                                            this.selectedChain = this.coref[0][i].representative;
                                            nested = true;
                                        }
                                    }
                                }
                                for (let j = 0; j < this.nestedChains.nested.length; j++) {
                                    if (this.nestedChains.nested[j].second === this.coref[0][i].mentionID) {
                                        if (this.coref[0][i].representative === -1) {
                                            this.selectedChain = this.coref[0][i].mentionID;
                                            priorisizedFound = true;
                                            nested = true;
                                            break;
                                        } else {
                                            this.selectedChain = this.coref[0][i].representative;
                                            priorisizedFound = true;
                                            nested = true;
                                            break;
                                        }
                                    } else if (this.nestedChains.nested[j].first === this.coref[0][i].mentionID) {
                                        if (this.coref[0][i].representative === -1) {
                                            this.selectedChain = this.coref[0][i].mentionID;
                                            nested = true;
                                        } else {
                                            this.selectedChain = this.coref[0][i].representative;
                                            nested = true;
                                        }
                                    }
                                }
                                if (!nested) {
                                    if (this.coref[0][i].representative === -1) {
                                        this.selectedChain = this.coref[0][i].mentionID;
                                        break;
                                    } else {
                                        this.selectedChain = this.coref[0][i].representative;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    console.log('Watcher got new selected Chain: ' + this.selectedChain);
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
            textfeatureviewport
        }
    }
</script>
