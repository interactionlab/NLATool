<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header" style="overflow:hidden">
        <component
                is="mainheader"
                v-bind:serverip="serverip"
                v-bind:title="title"
                v-bind:docid="docID"
                v-bind:route="'analysis'"
                v-bind:preventtitleedit="false"
                v-bind:autochecked="resizing"
                v-on:newwordnumberinonecolumn="setnewwordnumberinonecolumn($event)"
                v-on:newcolumnnumber="setnumberofcolumns($event)"
                v-on:contenttoggle="toogleResearchContent($event)">
        </component>
        <component
                is="headernavbar"
                v-bind:title_small="title_small">
        </component>

        <div style="background-color: black; opacity: 0.6; z-index: 10; position: fixed; width: 100%; height: 100%; max-height: 100%;"
             v-if="displayloading === true">
            <div style=" margin: 0% auto;  z-index: 10;  left: 0; top: 50%; width: auto !important; max-width: 100%; color: gray; max-width:1000px; position: relative; opacity: 1;">
                Loading...
                <div id="progressbar2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"
                     style="width: auto !important; max-width: 100%;"></div>
            </div>
        </div>

        <main class="mdl-layout__content"
              style="display: flex; flex-flow: row wrap; width: 100%; flex-direction: column;">
            <!-- Toolbar-->
            <div class="headerRowLight" style="flex: 0;width: 100%;">
                <component
                        is="toolbar"
                        v-bind:tokens="vueTokens"
                        v-bind:classestomark="classesToMark"
                        v-bind:style="{left: columnsizetoolbarpos+ '%'}"
                        v-on:emitanalighter="getAnalighter"
                        v-on:emitnotes="getNotes"
                        v-on:updateclassestomark="updateclassestomark($event)"
                        v-on:changenotemode="changeNoteMode($event)">
                </component>
            </div>
            <div v-if="numberofcolumns !== 1" style="flex: 0;width: 100%; position: relative">
                <component is="textviewcontrol"
                           v-bind:currentpage="currentpage"
                           v-bind:pagecount="pagecount"
                           v-bind:style="{left: columnsizetoolbarpos + '%', width : columnsize2 + '%'}"
                           v-on:changescope="changeScope($event)">
                </component>
            </div>
            <div class="mdl-grid"
                 style="width:100%;overflow: hidden;height: auto !important;max-height: 100%;flex: 2 1 0px;padding:0em">
                <div style="height: auto !important;max-height: 100%;display: flex;overflow: hidden;width:100%;"
                     v-for="columnindex in numberofcolumns"
                     v-bind:style="{width : columnsize2 + '%'}">
                    <component is="textfeatureviewport"
                               ref="reftextfeatureviewport"
                               v-bind:setcoref="setcoref"
                               v-bind:columnindex="columnindex-1"
                               v-bind:numberofcolumns="numberofcolumns"
                               v-bind:serverip="serverip"
                               v-bind:googleapikey="googleapikey"
                               v-bind:docid="docID"
                               v-bind:tokens="vueTokens"
                               v-bind:tokenstoshow="tokenstoshow"
                               v-bind:tokenssplitted="tokenssplitted"
                               v-bind:coref="coref"
                               v-bind:selectedtextindexes="selectedtextindexes"
                               v-bind:classestomark="classesToMark"
                               v-bind:hoveredchain="hoveredChain"
                               v-bind:analysismode="analysisMode"
                               v-bind:notes="notes"
                               v-bind:notemodes="notemodes"
                               v-bind:researchmode="researchmode"
                               v-bind:selectedchain="selectedChain"
                               v-bind:contentcontrol="contentcontrol"
                               v-bind:hoverdata="hoverdata"
                               v-bind:researchedentities="entitiessplitted"
                               v-bind:tokenssplittedindextoshow="tokenssplittedindextoshow"
                               v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                               v-bind:corefstatus="corefstatus"
                               v-on:updatecorefstatus="updatecorefstatus($event)"
                               v-on:setcoref="setCoref($event)"
                               v-on:movetoolbar="movetoolbar($event)"
                               v-on:hoverchain="hoverChain($event)"
                               v-on:startselection="selectText3($event,0)"
                               v-on:hoverduringselection="selectText3($event,1)"
                               v-on:endselection="selectText3($event,2)"
                               v-on:jumpmarktext="selectText2($event)"
                               v-on:starthover="starthover($event)"
                               v-on:endhover="endhover($event)"
                               v-on:removehoverline="removehoverline"
                               v-on:updateclassestomark="updateclassestomark($event)"
                               v-on:scrolling="handlescrolling($event)">
                    </component>
                </div>
            </div>
        </main>
        <component is="variablehelper"
                   v-bind:tokens="vueTokens"
                   v-on:resize="setTokens($event)">
        </component>
        <component is="linetohover" id="line"
                   v-if="offsetstart != null && offsetend != null"
                   v-bind:offsetstart="offsetstart"
                   v-bind:offsetend="offsetend"
                   v-bind:semanticclass="semanticclass">
        </component>
        <component is="store"></component>
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
    import store from './components/analysis/globalstore.vue';

    export default {
        data: function () {
            return {
                moreData: null,
                displayloading: true,
                hoverdata: {},
                lineddata: {},
                wordtomarkonhoverdata: {},
                offsetstart: null,
                offsetend: null,
                tempoffsetstart: null,
                tempoffsetend: null,
                tempscrolltoptext: 0,
                tempscrolltopentity: 0,
                semanticclass: {},
                analysisMode: 'analighter',
                researchmode: '',
                classesToMark: {
                    coref: false,
                    PERSON: false,
                    LOCATION: false,
                    ORGANIZATION: false,
                    MISC: false,
                    POS: false,
                    OTHER: false,
                },
                selectedtextindexes: {
                    start: -1,
                    active: -1,
                    end: -1,
                    done: true
                },
                clickedmode: false,
                notemodes: {
                    wordnote: true,
                    globalnote: false
                },
                hoveredChain: [],
                selectedChain: -1,
                screenOptions: {
                    screenWidth: -1,
                    screenHeight: -1,
                    minimumColumnWidth: 400,
                    minimColumnHeight: 500,
                    maxColumnWidth: 800,
                    maxColumnHeight: -1
                },
                numberofcolumns: 1,
                tokens: [],
                tokenssplitted: [],
                tokenstoshow: [],
                tokenssplittedindextoshow: 0,
                columnindexoflasthover: 1,
                currentpage: 1,
                pagecount: 1,
                columnsize2: 100,
                columnsizetoolbarpos: 0,
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
                    },
                    OTHERS: {
                        img: true,
                        map: true,
                        information: true
                    }
                },
                wordnumberinonecolumn: 500,
                entitiessplitted: [],
                setcoref: true,
                researchedentitiesResults: [],
                researchedallentities: false,
                preparedEntities: 0,
                scrollTimeout: 0,
                scrollingacolumn: false,
            }
        },
        methods: {
            handlescrolling: function (scrollinfo) {
                if (scrollinfo.scrollingacolumn) {
                    if (this.offsetstart !== null && this.offsetend !== null) {
                        this.tempoffsetend = this.offsetend;
                        this.tempoffsetstart = this.offsetstart;
                        this.offsetstart = null;
                        this.offsetend = null;
                        if (scrollinfo.source !== null && scrollinfo.source == 'textwindow') {
                            this.tempscrolltoptext = scrollinfo.scrollTop
                        }else if(scrollinfo.source !== null && scrollinfo.source == 'textviewport'){
                            this.tempscrolltopentity = scrollinfo.scrollTop
                        }
                    }
                    //this.removehoverline();
                } else {
                    let tempoffset = {};
                    let deltatop = 0;
                    let columnindex = this.lineddata.columnindex;
                    //Check if still in viewport & get new boundingrects:
                    if (scrollinfo.source !== null && scrollinfo.source == 'textwindow') {
                        this.offsetend = this.tempoffsetend;
                        if (this.lineddata.wordtomarkonhover.length !== 0) {
                            //Scroll in text && select origin entitiesview
                            // -> check if words in wordtomarkonhover are still in view
                            // -> draw a new line
                           for (let i = 0; i < this.lineddata.wordtomarkonhover.length; i++) {
                                if (this.$refs['reftextfeatureviewport'][columnindex].isElementInViewport(
                                    this.$refs['reftextfeatureviewport'][columnindex].$refs['text']
                                        [this.lineddata.wordtomarkonhover[i] - this.$refs['reftextfeatureviewport']
                                        [columnindex].indexCorrector2].$el)) {
                                    this.offsetstart =
                                        this.$refs['reftextfeatureviewport'][columnindex]
                                            .$refs['text'][this.lineddata.wordtomarkonhover[i]].$el.getBoundingClientRect();
                                    //this.drawline(this.lineddata);
                                    break;
                                }
                            }
                        } else {
                            //Scroll in text && select origin text
                            // update offsetstart
                            // -> draw a new line
                            deltatop = scrollinfo.scrollTop - this.tempscrolltoptext;
                            tempoffset = {
                                "x": this.tempoffsetstart.x,
                                "y": this.tempoffsetstart.y - deltatop,
                                "width": this.tempoffsetstart.width,
                                "height": this.tempoffsetstart.height,
                                "top": this.tempoffsetstart.top - deltatop,
                                "right": this.tempoffsetstart.right,
                                "bottom": this.tempoffsetstart.bottom - deltatop,
                                "left": this.tempoffsetstart.left
                            };
                            this.tempscrolltoptext = scrollinfo.scrollTop;
                            this.tempoffsetstart = tempoffset;
                            if (this.$refs['reftextfeatureviewport'][columnindex].isElementInViewport2(this.tempoffsetstart)) {
                                this.offsetstart = this.tempoffsetstart;
                                //this.drawline(this.lineddata);
                            }

                        }
                    } else if (scrollinfo.source !== null && scrollinfo.source == 'textviewport') {
                        this.offsetstart = this.tempoffsetstart;
                        //Scroll in entitiesview && select origin in text
                        // -> no offsetend -> find corresponding entity to word
                        // -> draw new line
                        deltatop = scrollinfo.scrollTop - this.tempscrolltopentity;
                       tempoffset = {
                            "x": this.tempoffsetend.x,
                            "y": this.tempoffsetend.y - deltatop,
                            "width": this.tempoffsetend.width,
                            "height": this.tempoffsetend.height,
                            "top": this.tempoffsetend.top - deltatop,
                            "right": this.tempoffsetend.right,
                            "bottom": this.tempoffsetend.bottom - deltatop,
                            "left": this.tempoffsetend.left
                        };
                        this.tempscrolltopentity = scrollinfo.scrollTop;
                        this.tempoffsetend = tempoffset;
                        if (this.$refs['reftextfeatureviewport'][columnindex].isElementInViewport2(this.tempoffsetend)) {
                            this.offsetend = this.tempoffsetend;
                            //this.drawline(this.lineddata);
                        }
                    }
                }
            },
            setCoref: function (value) {
                this.setcoref = value;
            },
            updatecorefstatus: function (columnindex) {
                this.corefstatus[columnindex] = true;
            },
            resetcorefstatus: function () {
                //console.log('resetted corefstatus: ' + JSON.stringify(this.corefstatus));
                for (let i = 0; i < this.corefstatus.length; i++) {
                    this.corefstatus[i] = false;
                }
            },
            setnewwordnumberinonecolumn: function (newwordnumberinonecolumn) {
                //console.log('set new Word limit for columns: ' + newwordnumberinonecolumn + ': ' + this.numberofcolumns);
                this.wordnumberinonecolumn = parseInt(newwordnumberinonecolumn);
                this.splitTokens();
                this.showTokens();
            },
            updateclassestomark: function (newClassesToMark) {
                this.classesToMark = newClassesToMark;
                if (this.hoverdata !== null
                    && this.hoverdata.semanticClass !== undefined
                    && this.classesToMark[this.hoverdata.semanticClass] === false) {
                    this.removehoverline();
                    this.wordtomarkonhoverdata = {
                        textindexes: [],
                        hoverstarted: "text",
                        semanticClass: 'ERROR',
                        columnindex: -1
                    };
                }
            },
            toogleResearchContent: function (toToggle) {
                this.contentcontrol.PERSONS[toToggle] = !this.contentcontrol.PERSONS[toToggle];
                this.contentcontrol.LOCATIONS[toToggle] = !this.contentcontrol.LOCATIONS[toToggle];
                this.contentcontrol.ORGANIZATIONS[toToggle] = !this.contentcontrol.ORGANIZATIONS[toToggle];
                this.contentcontrol.MISCS[toToggle] = !this.contentcontrol.MISCS[toToggle];
                this.contentcontrol.OTHERS[toToggle] = !this.contentcontrol.OTHERS[toToggle];
                this.contentcontrol.PERSONS['map'] = false;

            },
            setTokens: function (newTokens) {
                this.tokens = newTokens;
            },
            movetoolbar: function (columnindex) {
                if (this.columnindexoflasthover === columnindex)
                    return;
                this.columnindexoflasthover = columnindex;
                this.columnsizetoolbarpos = (this.columnindexoflasthover / this.numberofcolumns) * 100.0;
                this.currentpage = this.columnindexoflasthover + this.tokenssplittedindextoshow + 1;
            },
            getAnalighter: function () {
                this.analysisMode = 'analighter';
            },
            getNotes: function () {
                this.removehoverline();
                this.analysisMode = 'notes';
            },
            selectText: function (index, modus) {
                //Start Selection
                //console.log('Filling selectedIndexes with: '+index);
                if (modus === 0) {
                    this.selectedtextindexes = {
                        start: index,
                        active: index,
                        end: -1,
                        done: false
                    };
                }
                //Hover During Selection
                else if (modus === 1) {
                    this.selectedtextindexes = {
                        start: this.selectedtextindexes.start,
                        active: index,
                        end: -1,
                        done: false
                    };
                }
                //End Selection
                else if (modus === 2) {
                    let start = this.selectedtextindexes.start;
                    let end = index;
                    if (start > end) {
                        let dummy = end;
                        end = start;
                        start = dummy;
                    }
                    this.selectedtextindexes = {
                        start: start,
                        active: end,
                        end: end,
                        done: true
                    };
                }
            },
            selectText2: function (newSelectedIndexes) {
                //console.log('selectText2: ' + JSON.stringify(newSelectedIndexes));
                this.selectedtextindexes = newSelectedIndexes;
            },
            selectText3: function (selectiondata, modus) {
                //console.log('Hallo ' + JSON.stringify(selectiondata));
                //console.log('Hallo ' + JSON.stringify(selectiondata));
                if (typeof selectiondata === 'number') {
                    this.selectText(selectiondata, modus);
                    return;
                }
                this.selectText(selectiondata.startword.textIndex, modus);
                if (modus === 2) {
                    //Check if Entity -> prepare highlight entity & drawline
                    if (this[selectiondata.startword.semanticClass] !== undefined && this[selectiondata.startword.semanticClass]) {
                        this.drawline(selectiondata);
                    }
                    //Check if Mention of a coref Chain -> prepare highlight chain
                    //TODO: Refactor hoverChain in general on analysis to sth like getChain
                    //this.hoverChain(index);
                    //Case of one Word is already done by this.selectText
                }
            },
            changeNoteMode: function (newNoteModes) {
                this.notemodes = newNoteModes;
            },
            setColumnSize2: function () {
                this.columnsize2 = 100.0 / this.numberofcolumns;
                this.showTokens();
            },
            showTokens: function () {
                if (this.numberofcolumns === 1) {
                    this.tokenstoshow = this.tokenssplitted;
                    this.resetcorefstatus();
                } else {
                    let end = this.tokenssplittedindextoshow + this.numberofcolumns;
                    this.tokenstoshow = this.tokenssplitted.slice(this.tokenssplittedindextoshow, end);
                    this.resetcorefstatus();
                }
            },

            changeScope: function (direction) {
                if (direction) {
                    if (this.tokenssplittedindextoshow - 1 >= 0) {
                        this.tokenssplittedindextoshow--;
                        this.showTokens();
                        this.offsetstart = null;
                        this.currentpage = this.columnindexoflasthover + this.tokenssplittedindextoshow + 1;
                    }
                } else if (!direction) {
                    if (this.tokenssplittedindextoshow + this.numberofcolumns < this.tokenssplitted.length) {
                        this.tokenssplittedindextoshow++;
                        this.showTokens();
                        this.offsetstart = null;
                        this.currentpage = this.columnindexoflasthover + this.tokenssplittedindextoshow + 1;
                    }
                }
                //let ref = 'textfeatureviewports';
                this.setcoref = true;
                /*console.log('check00' +this.$refs['textfeatureviewports0'].length);
                for (let k = 0; k < this.numberofcolumns; k++) {
                    console.log('checkingXXX ' + k + ': ' + this.$refs[ref + k]);
                    this.$refs['textfeatureviewports0'].setrerendercoref();
                    console.log("this.classesToMark.coref" + this.classesToMark.coref);
                    this.$refs[ref + k].rendercoref(this.classesToMark);

                }*/
            },
            splitNotes: function () {
                /*for (let i = 0; i < this.tokenssplitted; i++) {
                    for (let j = 0; j < this.notes; j++) {
                        if (this.tokenssplitted[i][this.tokenssplitted[i].length - 1] === 0) {
                        }
                    }
                }*/
            },
            splitTokens: function () {
                let entitiessplittedDUMMY = [];
                let partofentitiessplittedDUMMY = [];
                let tokenssplittedDUMMY = [];
                //console.log('researchedentitiesResults start: ' + JSON.stringify(this.researchedentitiesResults));
                if (this.researchedentitiesResults !== undefined && this.researchedallentities) {
                    if (this.numberofcolumns === 1) {
                        entitiessplittedDUMMY.push(this.researchedentitiesResults);
                        tokenssplittedDUMMY.push(this.tokens);
                    } else {
                        let startSlice = 0;
                        //console.log('Number of pages:' + Math.ceil(this.tokens.length / this.wordnumberinonecolumn));
                        for (let i = 0; i < Math.ceil(this.tokens.length / this.wordnumberinonecolumn); i++) {
                            tokenssplittedDUMMY.push(this.tokens.slice(startSlice, startSlice + this.wordnumberinonecolumn));
                            console.log('preparing tokens to show2:' + this.researchedentitiesResults.length);

                            for (let j = 0; j < this.researchedentitiesResults.length; j++) {
                                for (let k = 0; k < this.researchedentitiesResults[j].sourcequery.textindexes.length; k++) {
                                    if (this.researchedentitiesResults[j].sourcequery.textindexes[k] >= startSlice
                                        && this.researchedentitiesResults[j].sourcequery.textindexes[k] < startSlice + this.wordnumberinonecolumn) {
                                        partofentitiessplittedDUMMY.push(this.researchedentitiesResults[j]);
                                        //console.log('added entities ' + i + ': ' + this.researchedEntities[j].textindexes);
                                        break;
                                    }
                                }
                            }
                            if (partofentitiessplittedDUMMY !== []) {
                                entitiessplittedDUMMY.push(partofentitiessplittedDUMMY);
                                //console.log('Added entity list to entitiessplittedDUMMY:' + entitiessplittedDUMMY.length);
                                partofentitiessplittedDUMMY = [];
                            }
                            startSlice = startSlice + this.wordnumberinonecolumn;

                        }
                    }
                    this.entitiessplitted = entitiessplittedDUMMY;
                    //console.log(JSON.stringify('Got here: ' + JSON.stringify(this.entitiessplitted[0])));
                    //console.log('preparing entities to show3:' + entitiessplittedDUMMY.length);
                    this.tokenssplitted = tokenssplittedDUMMY;
                    this.pagecount = this.tokenssplitted.length;
                } else {
                    console.log('researchedentitiesResults not ready yet: ');
                    this.searchGoogleWithResearchedEntities();
                }
            },
            computenumberofcolumns: function () {
                this.numberofcolumns = Math.trunc(this.screenOptions.screenWidth / this.screenOptions.maxColumnWidth);
                if (this.numberofcolumns === 0) {
                    this.numberofcolumns++;
                }
            },
            setnumberofcolumns: function (number) {
                if (number > 0) {
                    if (number !== this.numberofcolumns) {
                        this.numberofcolumns = parseInt(number);
                        this.splitTokens();
                        this.setColumnSize2();
                        this.resizing = false;
                    }
                } else {
                    this.resizing = true;
                    this.resize();
                }
            },
            setScreenOptions: function () {
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
                    this.computenumberofcolumns();
                    this.splitTokens();
                    this.setColumnSize2();
                }
            },
            hoverChain: function (chain) {
                /* Given an Index of a Word which represents a coref Mention,
                this method should find that word in the coref object (list)
                and all the other mentions in that chain and add them to
                a new object list that represents all the mentions that should be hovered,
                aka highlighted.
                */
                let represantativeFound = false;
                if (chain !== -1) {
                    let temphoveredChain = [];
                    let mentionID = -2;
                    //Looking for Chain in corefInformation package
                    for (let i = 0; i < this.coref.length; i++) {
                        // When hovered  Chain found...
                        if (this.coref[i].startIndex <= chain && this.coref[i].endIndex >= chain) {
                            //Representative or Relative...
                            if (this.coref[i].representative === -1) {
                                mentionID = this.coref[i].mentionID;
                            } else {
                                mentionID = this.coref[i].representative;
                            }
                            //preparing hoveredChain Object, adding start & end Index
                            temphoveredChain.push({
                                start: this.coref[i].startIndex,
                                end: this.coref[i].endIndex,
                            });
                            break;
                        }
                    }
                    // if a coref Mention was found...
                    if (mentionID !== -2) {
                        // find all other Mentions in the Chain...
                        for (let i = 0; i < this.coref.length; i++) {
                            if (this.coref[i].mentionID === mentionID || this.coref[i].representative === mentionID) {
                                // ...and add the Indexes to the hoveredChain
                                temphoveredChain.push({
                                    start: this.coref[i].startIndex,
                                    end: this.coref[i].endIndex,
                                });
                            }
                        }
                    } else {
                        console.log('WARNING: could not match a corefmention to the hovered word');
                    }
                    this.hoveredChain = temphoveredChain;
                } else {
                    this.hoveredChain = null;
                }
            },
            drawline: function (event) {
                //Issue 142:
                //DELETE OLD LINE
                if (event.hoverended === "research") {
                    this.wordtomarkonhoverdata = {
                        textindexes: event.wordtomarkonhover,
                        hoverstarted: "text",
                        semanticClass: this.hoverdata.semanticClass,
                        columnindex: event.columnindex
                    };
                    this.offsetend = event.offsetend;
                    this.tempoffsetend = this.offsetend;
                } else if (event.hoverended === "text") {
                    this.offsetstart = event.offsetstart;
                    this.tempoffsetstart = this.offsetstart;
                }
                //If the startpoint of old line = startpoint of the new line and...
                if (this.lineddata.hoverstarted === event.hoverstarted) {
                    // the active started from hovering over text and the new line is the same
                    // or from research entity respectivly -> do nothing
                    if ((event.hoverstarted === "text"
                        && this.lineddata.offsetstart !== null && this.lineddata.offsetstart.x === event.offsetstart.x
                        && this.lineddata.offsetstart.y === event.offsetstart.y) ||
                        (event.hoverstarted === "research"
                            && this.lineddata.offsetend.x === event.offsetend.x
                            && this.lineddata.offsetend.y === event.offsetend.y)) {
                        return;
                    }
                }
                //DRAW NEW LINE:
                //prepare control Objects for view (semanticClass, data for creating lines
                //console.log('Getting here ' + JSON.stringify(event));
                this.lineddata = event;
                let classofcolor = event.semanticClass + "_strong";

                this.semanticclass = {};
                this.semanticclass[classofcolor] = true;
                //if active started from text the remaining words of the entity are easy to find
                // -> only start offset is needed
                if (event.hoverstarted === "text") {
                    this.offsetstart = event.offsetstart;
                    this.tempoffsetstart = this.offsetstart;
                } else if (event.hoverstarted === "research") {
                    // if it started from a researchentity we need to find it later and prepare for that
                    this.wordtomarkonhoverdata = {
                        textindexes: event.wordtomarkonhover,
                        hoverstarted: "research",
                        semanticClass: this.hoverdata.semanticClass,
                        columnindex: event.columnindex
                    };
                    this.offsetend = event.offsetend;
                    this.tempoffsetend = this.offsetend;
                }
                //Redundancy ?
            },
            starthover: function (event) {
                this.drawline(event);
                this.hoverdata = event;
            },
            endhover: function (event) {
                if (event.hoverended === "research") {
                    this.wordtomarkonhoverdata = {
                        textindexes: event.wordtomarkonhover,
                        hoverstarted: "text",
                        semanticClass: this.hoverdata.semanticClass,
                        columnindex: event.columnindex
                    };
                    this.offsetend = event.offsetend;
                    this.tempoffsetend = this.offsetend;
                } else if (event.hoverended === "text") {
                    this.offsetstart = event.offsetstart;
                    this.tempoffsetstart = this.offsetstart;
                }
            },
            removehoverline: function () {
                console.log('Getting here');
                this.offsetstart = null;
            },
            setMoreDataFromServer: function (value) {
                this.moreData = value;
            },
            getMoreText: function (docID, pagesize) {
                var self = this;
                let endIndex = this.tokens[this.tokens.length - 1].textIndex + 1;
                let socket = io(this.serverip + ':8080');
                socket.emit('getMoreText', docID, endIndex, pagesize);
                socket.on('sendMoreText', function (tokens, setMoreDataFromServer) {
                    self.setMoreDataFromServer(tokens);
                });
            },
            searchGoogleWithResearchedEntities: function () {
                if (this.researchedEntities.length === 0) {
                    console.log('WARNING: searchGoogleWithResearchedEntities is aborting');
                    return;
                }
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let researched = [];

                if (this.researchedEntities !== undefined && !this.researchedallentities) {
                    for (let i = 0; i < this.researchedEntities.length; i++) {
                        if (this.researchedEntities[i] !== undefined) {
                            if (researched.indexOf(this.researchedEntities[i].kgID) > -1) {
                                this.preparedEntities++;
                            } else {
                                researched.push(this.researchedEntities[i].kgID);
                                let dataurl = {
                                    key: this.googleapikey,
                                    ids: this.researchedEntities[i].kgID.replace("kg:", "")
                                };
                                //console.log('Got here0!!!!:' +i +this.researchedEntities[i].kgID );
                                $.getJSON(service_url + '?callback=?', dataurl, (response) => {
                                }).done((response) => {
                                    this.preparedEntities++;
                                    //console.log("response: " + JSON.stringify(response));
                                    if (response.error !== undefined && response.error.code === 400) {
                                        console.log('WARNING: Google Knowledge Graph Search API not activated.');
                                    } else {
                                        //console.log('Got here1!!!!:' + i);
                                        let data = response.itemListElement[0];
                                        if (data !== undefined) {
                                            for (let j = 0; j < this.researchedEntities.length; j++) {
                                                if (this.researchedEntities[j] !== undefined) {
                                                    if (data.result['@id'] === this.researchedEntities[j].kgID) {
                                                        let d = JSON.parse(JSON.stringify(data));
                                                        d["sourcequery"] = JSON.parse(JSON.stringify(this.researchedEntities[j]));
                                                        this.researchedentitiesResults.push(d);
                                                    }
                                                } else {
                                                    console.log('A researched Entity was undefined: ' + j);
                                                }
                                            }
                                        } else {
                                            console.log('WARNING: Google Knowledge Graph results is empty.' + i);
                                        }
                                    }
                                }).fail(err => {
                                    this.preparedEntities++;
                                    console.log('ERROR: Google initial search failed: ' + JSON.stringify(err));
                                });
                            }
                        } else {
                            console.log('A researched Entity was undefined: ' + i);
                            this.preparedEntities++;
                            //console.log(JSON.stringify(this.researchedEntities));
                        }
                    }
                }
                //this.splitTokens();
            },
        },
        mounted() {
            window.addEventListener('resize', this.resize);
            this.getMoreText(this.tokens[0].docID, 500);
        },
        beforeDestroy() {
            window.removeAllListeners();
        },
        computed: {
            corefstatus: function () {
                let corefstatus = [];
                // console.log('numberofcolumns: ' +this.numberofcolumns);
                for (let i = 0; i < this.numberofcolumns; i++) {
                    corefstatus.push(false);
                }
                //console.log('computing corefstatus: ' + JSON.stringify(corefstatus));
                return corefstatus;
            }
        },
        watch: {
            preparedEntities: {
                handler: function (newpreparedEntities) {
                    //console.log('checking: newpreparedEntities ' + newpreparedEntities + '===?' + this.researchedEntities.length);
                    if (newpreparedEntities === this.researchedEntities.length - 1) {
                        //console.log('got here:');
                        this.researchedallentities = true;
                        this.resize();
                    }
                }
            },
            researchedentitiesResults: {
                handler: function (newData) {
                    //this.splitTokens();
                },
                deep: true
            },
            moreData: {
                handler: function (newData) {
                    if (newData.length > 0) {
                        this.tokens.push.apply(this.tokens, newData);
                        this.getMoreText(this.tokens[0].docID, 500);
                    } else {
                        this.searchGoogleWithResearchedEntities();
                        this.displayloading = false;
                    }
                },
                deep: true
            },
            selectedtextindexes: {
                handler: function (newSelectedIndexes) {
                    this.selectedChain = -1;
                    if (this.classesToMark.coref) {
                        if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                            for (let i = newSelectedIndexes.start; i <= newSelectedIndexes.end; i++) {
                                if (typeof this.tokens[i].coref !== 'undefined') {
                                    if (this.tokens[i].coref[0].representative === -1) {
                                        this.selectedChain = this.tokens[i].coref[0].mentionID;
                                    } else {
                                        this.selectedChain = this.tokens[i].coref[0].representative;
                                    }
                                    for (let j = 0; j < this.tokens[i].coref.length; j++) {
                                        if (this.tokens[i].coref[j].kind === 'outer') {
                                            if (this.tokens[i].coref[0].representative === -1) {
                                                this.selectedChain = this.tokens[i].coref[0].mentionID;
                                            } else {
                                                this.selectedChain = this.tokens[i].coref[0].representative;
                                            }
                                            break;
                                        } else if (this.tokens[i].coref[j].kind === 'inner') {
                                            if (this.tokens[i].coref[j].endIndex >= newSelectedIndexes.end) {
                                                if (this.tokens[i].coref[0].representative === -1) {
                                                    this.selectedChain = this.tokens[i].coref[0].mentionID;
                                                } else {
                                                    this.selectedChain = this.tokens[i].coref[0].representative;
                                                }
                                                break;
                                            }
                                        } else if (this.tokens[i].coref[j].kind === 'first') {
                                            if (this.tokens[i].coref[0].representative === -1) {
                                                this.selectedChain = this.tokens[i].coref[0].mentionID;
                                            } else {
                                                this.selectedChain = this.tokens[i].coref[0].representative;
                                            }
                                        } else if (this.tokens[i].coref[j].kind === 'second') {
                                            if (this.tokens[i].coref[0].representative === -1) {
                                                this.selectedChain = this.tokens[i].coref[0].mentionID;
                                            } else {
                                                this.selectedChain = this.tokens[i].coref[0].representative;
                                            }
                                            break;
                                        }
                                    }
                                }

                            }
                        }
                    }
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
            linetohover,
            store
        }
    }
</script>
