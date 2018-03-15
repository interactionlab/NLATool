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
                        v-bind:selectedindexes="selectedtextindexes"
                        v-bind:classestomark="classesToMark"
                        v-bind:style="{left: columnsizetoolbarpos+ '%'}"
                        v-on:emitanalighter="getAnalighter"
                        v-on:emitnotes="getNotes"
                        v-on:updateclassestomark="updateclassestomark($event)"
                        v-on:changenotemode="changeNoteMode($event)">
                </component>
            </div>
            <div v-if="numberofcolumns !== 1" style="flex: 0;width: 100%; position: relative" >
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
                    <component id="textfeatureviewport"
                               is="textfeatureviewport"
                               v-bind:columnindex="columnindex-1"
                               v-bind:serverip="serverip"
                               v-bind:docid="docID"
                               v-bind:tokens="vueTokens"
                               v-bind:tokenstoshow="tokenstoshow"
                               v-bind:mentions="coref"
                               v-bind:selectedindexes="selectedtextindexes"
                               v-bind:classestomark="classesToMark"
                               v-bind:hoveredchain="hoveredChain"
                               v-bind:analysismode="analysisMode"                               
                               v-bind:notes="notes"
                               v-bind:notemodes="notemodes"
                               v-bind:researchmode="researchmode"
                               v-bind:selectedchain="selectedChain"
                               v-bind:contentcontrol="contentcontrol"
                               v-bind:hoverdata="hoverdata"
                               v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                               v-on:movetoolbar="movetoolbar($event)"
                               v-on:hoverchain="hoverChain($event)"
                               v-on:startselection="selectText($event,0)"
                               v-on:endselection="selectText($event,1)"
                               v-on:jumpmarktext="selectText2($event)"
                               v-on:starthover="starthover($event)"
                               v-on:endhover="endhover($event)"
                               v-on:updateclassestomark="updateclassestomark($event)">
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
                moreData: null,
                displayloading: true,
                hoverdata: {},
                wordtomarkonhoverdata: [],
                offsetstart: null,
                offsetend: null,
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
                numberofcolumns: 1,
                tokens: [],
                tokenssplitted: [],
                tokenstoshow: [],
                tokenssplittedindextoshow: 0,
                columnindexoflasthover:1,
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
                    OTHERS:{
                        img: true,
                        map: true,
                        information: true
                    }
                }
            }
        },
        methods: {
            updateclassestomark:function (newClassesToMark) {
              this.classesToMark = newClassesToMark;
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
            hoverChain: function (chain) {
                this.hoveredChain = chain;
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
                this.analysisMode = 'notes';
            },
            getResearch: function () {
                this.analysisMode = 'research';
            },
            changeMarkerMode: function (newClassesToMark) {
                this.classesToMark = newClassesToMark;
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
            },
            selectText2: function (newSelectedIndexes) {
                this.selectedindexes = newSelectedIndexes;
            },
            changeNoteMode: function (newNoteModes) {
                this.notemodes = newNoteModes;
            },
            setColumnSize2: function () {
                this.columnsize2 = 100.0 / this.numberofcolumns;
                this.showTokens();

            },
            showTokens: function () {
                if (this.numberofcolumns === 1){
                    this.tokenstoshow = this.tokenssplitted;
                } else {
                    let end = this.tokenssplittedindextoshow + this.numberofcolumns;
                    this.tokenstoshow = this.tokenssplitted.slice(this.tokenssplittedindextoshow, end);
                }
            },
            changeScope: function (direction) {
                
                if (direction) {
                    if (this.tokenssplittedindextoshow -1 >=0){
                        this.tokenssplittedindextoshow--;
                        this.showTokens();
                        this.offsetstart = null;
                        this.currentpage = this.columnindexoflasthover + this.tokenssplittedindextoshow + 1;
                    }
                } else if (!direction) {
                    if (this.tokenssplittedindextoshow + this.numberofcolumns < this.tokenssplitted.length){
                        this.tokenssplittedindextoshow++;
                        this.showTokens();
                        this.offsetstart = null;
                        this.currentpage = this.columnindexoflasthover + this.tokenssplittedindextoshow + 1;
                    }
                }
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
                
                let tokenssplittedDUMMY = [];
                if (this.numberofcolumns === 1){
                    tokenssplittedDUMMY.push(this.tokens);
                } else {
                    
                    
                    let wordnumbertofitinonecolumn = 200;
                    let startSlice = 0;
                    for (let i = 0; i < Math.ceil(this.tokens.length / wordnumbertofitinonecolumn); i++) {
                        tokenssplittedDUMMY.push(this.tokens.slice(startSlice, startSlice + wordnumbertofitinonecolumn));
                        startSlice = startSlice + wordnumbertofitinonecolumn;
                    }
                }
                this.tokenssplitted = tokenssplittedDUMMY;
                this.pagecount = this.tokenssplitted.length;
            },
            computenumberofcolumns: function () {
                this.numberofcolumns = Math.trunc(this.screenOptions.screenWidth / this.screenOptions.maxColumnWidth);
                if (this.numberofcolumns === 0) {
                    this.numberofcolumns++;
                }
            },
            setnumberofcolumns: function (number) {
                if (number > 0) {
                    if (number !== this.numberofcolumns){
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
            starthover: function (event) {       
                //console.log("Analysis vue starthover: " + JSON.stringify(event));            
                //console.log("Analysis vue hoverdata: " + JSON.stringify(this.hoverdata));            
                
                if (this.hoverdata.hoverstarted === event.hoverstarted){
                    if ((event.hoverstarted === "text"
                            && this.hoverdata.offsetstart !== null && this.hoverdata.offsetstart.x === event.offsetstart.x
                            && this.hoverdata.offsetstart.y === event.offsetstart.y) || 
                        (event.hoverstarted === "research"
                            && this.hoverdata.offsetend.x === event.offsetend.x
                            && this.hoverdata.offsetend.y === event.offsetend.y)){
                    //console.log("Same hover");
                    return;
                    }
                }
                this.hoverdata = event;
                let classofcolor = event.semanticClass + "_strong";
                let whereFrom = event.hoverstarted;
                
                this.semanticclass = {};
                this.semanticclass[classofcolor]= true;
                
                if(event.hoverstarted === "text"){
                    this.offsetstart = event.offsetstart;
                } else if(event.hoverstarted === "research") {
                    this.wordtomarkonhoverdata = {wordids: event.wordtomarkonhover, hoverstarted: "research", semanticClass: this.hoverdata.semanticClass};
                    this.offsetend = event.offsetend;
                }

            },
            endhover: function (event) {
                //console.log("analysis vue endhover:" + JSON.stringify(event));
                if (event.hoverended === "research"){
                    this.wordtomarkonhoverdata = {wordids: event.wordtomarkonhover, hoverstarted: "text", semanticClass: this.hoverdata.semanticClass};
                    this.offsetend = event.offsetend;
                } else if (event.hoverended === "text"){
                    this.offsetstart = event.offsetstart;
                }
            },
            setMoreDataFromServer: function (value) {
                this.moreData = value;
            },
            getMoreText: function (docID, pagesize) {
                var self = this;
                let endIndex = this.tokens[this.tokens.length - 1].textIndex + 1;
                let socket = io(this.serverip + ':8080');
                socket.emit('getMoreText', docID, endIndex, pagesize);
                console.log('requesting next part of text of ' + docID + ' at ' + endIndex);
                socket.on('sendMoreText', function (tokens, setMoreDataFromServer) {
                    self.setMoreDataFromServer(tokens);
                });
            }
        },
        mounted() {
            window.addEventListener('resize', this.resize);
            this.getMoreText(this.tokens[0].docID, 500);
        },
        beforeDestroy() {
            window.removeAllListeners();
        },
        watch: {
            moreData: {
                handler: function (newData) {
                    if (newData.length > 0){
                        
                        this.tokens.push.apply(this.tokens, newData);
                        this.getMoreText(this.tokens[0].docID, 500);
                    } else {
                        this.resize();
                        this.displayloading = false;
                    }
                    //console.log('after ' + this.tokens.length);
                }, deep: true
            },
            selectedtextindexes: {
                handler: function (newSelectedIndexes) {
                    this.selectedChain = -1;
                    if (this.classesToMark.coref) {
                        if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                            for (let i = newSelectedIndexes.start; i < newSelectedIndexes.end; i++) {
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
