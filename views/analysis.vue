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
                        v-on:emitanalighter="getAnalighter"
                        v-on:emitnotes="getNotes"
                        v-on:emitresearch="getResearch"
                        v-on:changemarkermode="changeMarkerMode($event)"
                        v-on:changenotemode="changeNoteMode($event)"
                        v-on:entercorrectionmode="entercorrectionmode($event)"
                        v-bind:style="{left: columnsizetoolbarpos+ '%'}">
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
                        v-bind:style="{width: columnsize2+ '%'}">
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
                               v-bind:contentcontrol="contentcontrol"
                               v-on:movetoolbar="movetoolbar($event)"
                               v-on:hoverchain="hoverChain($event)"
                               v-on:startselection="selectText($event,0)"
                               v-on:endselection="selectText($event,1)"
                               v-on:jumpmarktext="selectText2($event)"
                               v-on:togglesemanticlass="changeMarkerMode($event)">
                    </component>
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
    import textviewcontrol from './components/analysis/toolbar/textviewcontrol.vue';
    import analighter from './components/analysis/analighter.vue';
    import markjs from './components/analysis/mark.vue';
    import tex from './components/analysis/text.vue';
    import variablehelper from './components/global/variablehelper.vue';
    import textfeatureviewport from './components/analysis/textfeatureviewport.vue';

    export default {
        data: function () {
            return {
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
                columnsize: {
                    'mdl-cell--1-col': false,
                    'mdl-cell--2-col': false,
                    'mdl-cell--3-col': false,
                    'mdl-cell--4-col': false,
                    'mdl-cell--5-col': false,
                    'mdl-cell--6-col': false,
                    'mdl-cell--7-col': false,
                    'mdl-cell--8-col': false,
                    'mdl-cell--9-col': false,
                    'mdl-cell--10-col': false,
                    'mdl-cell--11-col': false,
                    'mdl-cell--12-col': true,
                },
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
            movetoolbar: function (colIndex) {
                this.columnsizetoolbarpos = (colIndex / this.numberOfColumns)*100.0;
            },
            hoverChain: function (chain) {
                this.hoveredChain = chain;
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
            setColumnSizeFalse: function () {
                for (let theClass in this.columnsize) {
                    this.columnsize[theClass] = false;
                }
            },
            setColumnSize2: function () {
                this.columnsize2 = 100.0 / this.numberOfColumns;
                this.showTokens(this.numberOfColumns, this.numberOfColumns);

            },
            setColumnSize: function () {
                this.setColumnSizeFalse();
                switch (true) {
                    case (this.numberOfColumns >= 12):
                        this.columnsize["mdl-cell--1-col"] = true;
                        this.showTokens(12, this.numberOfColumns);
                        break;
                    case (this.numberOfColumns < 12 && this.numberOfColumns >= 6):
                        this.columnsize["mdl-cell--2-col"] = true;
                        this.showTokens(6, this.numberOfColumns);
                        break;
                    case (this.numberOfColumns < 6 && this.numberOfColumns >= 3):
                        this.columnsize["mdl-cell--4-col"] = true;
                        this.showTokens(3, this.numberOfColumns);
                        break;
                    case (this.numberOfColumns < 3 && this.numberOfColumns >= 2):
                        this.columnsize["mdl-cell--6-col"] = true;
                        this.showTokens(2, this.numberOfColumns);
                        break;
                    case (this.numberOfColumns < 2 && this.numberOfColumns >= 1):
                        this.columnsize["mdl-cell--12-col"] = true;
                        this.showTokens(1, this.numberOfColumns);
                        break;
                    default:
                        this.columnsize["mdl-cell--12-col"] = true;
                        this.showTokens(1, this.numberOfColumns);
                        break;
                }
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
                    let priorisizedFound = false;
                    let nested = false;
                    this.selectedChain = -1;
                    if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                        for (let i = 0; i < this.coref[0].length; i++) {
                            if (priorisizedFound) {
                                break;
                            }
                            //console.log(newSelectedIndexes.start + '>=' + this.coref[0][i].startIndex);
                            //console.log(newSelectedIndexes.end + '<=' + this.coref[0][i].endIndex);
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
                                            this.selectedChain = this.coref[0][i].mentionID;
                                            nested = true;
                                        } else {
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
            textviewcontrol
        }
    }
</script>
