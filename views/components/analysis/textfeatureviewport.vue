<template>
    <div style="padding:0;height: auto !important; max-height: 100%; overflow: hidden; display: flex;width:100%;padding:1em;margin: 0;">
        <div class="mdl-grid contentColor mdl-shadow--6dp" style="display: flex;width:100%; padding:0;margin: 0; "
             v-on:mouseover="movetoolbar"
             ref="column">
            <!--left grid for text stuff -->
            <div class="mdl-cell mdl-cell--6-col"
                 style="border-right: 1px solid rgba(0,0,0,.1);margin: 0;padding: 8px; width: 50%; overflow-y: auto;"
                 v-on:scroll="onscrolltext"
                 ref="textwindow">
                <div class="mdl-grid" id="textWindow"
                     style="height: auto !important; display: block; max-height: 100%; padding:0;">

                    <component is="tex"
                               ref="text"
                               v-on:scroll="onscrolltext"
                               v-for="(token,i) in tokenstoshow[columnindex]"
                               v-bind:key="token.textIndex"
                               v-bind:token="token"
                               v-bind:columnindex="columnindex"
                               v-bind:classestomark="classestomark"
                               v-bind:selectedtextindexes="selectedtextindexes"
                               v-bind:selectedchain="selectedchain"
                               v-on:hoverchain="hoverChain($event)"
                               v-on:startselection="startselection($event)"
                               v-on:hoverduringselection="hoverduringselection($event)"
                               v-on:endselection="endselection($event)"
                               v-on:starthover="starthover($event)"
                               v-on:endhover="endhover($event)">
                    </component>
                </div>
            </div>
            <!--right grid for result stuff -->
            <div class="mdl-cell mdl-cell--6-col" style="max-height: 100%; margin:0; overflow-y: auto; width:50%"
                 ref="textviewport">
                <keep-alive>
                    <component
                            :is="analysismode"
                            v-bind:serverip="serverip"
                            v-bind:googleapikey="googleapikey"
                            v-bind:tokens="tokens"
                            v-bind:tokenstoshow="tokenstoshow"
                            v-bind:columnindex="columnindex"
                            v-bind:docid="docid"
                            v-bind:notes="notes"
                            v-bind:notemodes="notemodes"
                            v-bind:researchmode="researchmode"
                            v-bind:selectedchain="selectedchain"
                            v-bind:hoverdata="hoverdata"
                            v-bind:researchedentities="researchedentities[columnindex + tokenssplittedindextoshow]"
                            v-bind:selectedtextindexes="selectedtextindexes"
                            v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                            v-bind:classestomark="classestomark"
                            v-bind:contentcontrol="contentcontrol"
                            v-bind:parentviewport="parentviewport"
                            v-bind:analighterstatus="analighterstatus"
                            v-on:togglesemanticlass="togglesemanticlass($event)"
                            v-on:resetselectedindexes="resetselectedindexes"
                            v-on:entercorrectionmode="entercorrectionmode($event)"
                            v-on:endhover="endhover($event)"
                            v-on:jumpmarktext="selectText2($event)"
                            v-on:starthover="starthover($event)"
                            v-on:allowscroll="allowscroll"
                            v-on:removehoverline="removehoverline"
                            v-on:updateanalighterstatus="updateanalighterstatus($event)"
                            v-on:updateclassestomark="updateclassestomark($event)">
                    </component>
                </keep-alive>
            </div>
        </div>
        <component is="store"></component>
    </div>
</template>

<script>
    import notes from './components/analysis/notes/notes.vue';
    import analighter from './components/analysis/analighter.vue';
    import tex from './components/analysis/text.vue';
    import store from './components/analysis/globalstore.vue';

    export default {
        props: {
            serverip: {type: String, default: ""},
            googleapikey: {type: String, default: ""},
            columnindex: {type: Number, default: 0},
            numberofcolumns: {type: Number, default: 0},
            researchedentities: {
                type: Array, default: function () {
                    return []
                },
            },
            tokens: {
                type: Array, default: function () {
                    return []
                }
            },
            notes: {
                type: Array, default: function () {
                    return []
                }
            },
            selectedtextindexes: {type: Object, default: null},
            selectedchain: {type: Number, default: -1},
            hoveredchain: {type: Number, default: -1},
            hoverdata: {
                type: Array, default: function () {
                    return []
                }
            },
            wordtomarkonhoverdata: {type: Object, default: null},
            classestomark: {type: Object, default: null},
            notemodes: {type: Object, default: null},
            researchmode: {type: String, default: ""},
            analysismode: {type: String, default: ""},
            docid: {type: Number, default: -1},
            tokenstoshow: {
                type: Array, default: function () {
                    return []
                }
            },
            tokenssplitted: {
                type: Array, default: function () {
                    return []
                }
            },
            coref: {
                type: Array, default: function () {
                    return []
                }
            },
            corefstatus: {
                type: Array, default: function () {
                    return []
                }
            },
            contentcontrol: {type: Object, default: null},
            tokenssplittedindextoshow: {type: Number, default: 0},
            setcoref: {type: Boolean, default: false},
            scrolling: false,
        },
        data: function () {
            return {
                entitytoline: [],
                parentviewport: {},
                selectedindexesmarked: {start: -1, end: -1},
                isRemoveLineOnScrollActive: true,
                wortomarkonhoverold: null,
                oldhoveredchain: null,
                addedtextscrolllistener: false,
                scrolltimeout: null,
                scrollinfo: {
                    scrollingacolumn: false,
                    scrollTop: 0,
                    source: null
                },
                analighterstatustoupdate: {column: -1, status: 'entitiesview'}
            }
        },
        watch: {
            tokenssplittedindextoshow: function () {
                //debug?
                //console.log('researched Entities index: '+ (this.columnindex + this.tokenssplittedindextoshow));
                //console.log('sent Entities: '+ this.researchedentities[this.columnindex + this.tokenssplittedindextoshow].length);
            },
            selectedtextindexes: {
                /*
                 * SELECTION OF TEXT WITH THE MOUSE WHILE HOLDING THE MOUSE BUTTON
                 */
                handler: function (newSelectedIndexes) {
                    //console.log(' seleceted words: ' + JSON.stringify(this.selectedindexesmarked));
                    //console.log(' seleceted words: ' + JSON.stringify(newSelectedIndexes));
                    //unhover old words
                    if (this.selectedindexesmarked.active !== -1 || this.selectedindexesmarked.end !== -1) {
                        let start = this.selectedindexesmarked.start;
                        let end = this.selectedindexesmarked.active;
                        if (this.selectedindexesmarked.end !== -1) {
                            let end = this.selectedindexesmarked.end;
                        }
                        //console.log(start);
                        if (start > end) {
                            let dummy = end;
                            end = start;
                            start = dummy;
                        }
                        for (let i = start; i <= end; i++) {
                            let index = i - this.indexCorrector2;
                            if (index >= 0 && index < this.tokenstoshow[this.columnindex].length) {
                                this.manipulateword(index, 'selected', false);
                                this.manipulateword(index, 'selectedgap', false);
                            }
                        }
                    }
                    //active new words
                    if (newSelectedIndexes.active !== -1 || newSelectedIndexes.end !== -1) {
                        let start = newSelectedIndexes.start;
                        let end = newSelectedIndexes.active;
                        if (newSelectedIndexes.end !== -1) {
                            let end = newSelectedIndexes.end;
                        }
                        if (start > end) {
                            let dummy = end;
                            end = start;
                            start = dummy;
                        }
                        //console.log('highlighting seleceted words: ' + JSON.stringify(newSelectedIndexes));
                        for (let i = start; i <= end; i++) {
                            let index = i - this.indexCorrector2;
                            //Assumes that the length of each column is the same.
                            if (index >= 0 && index < this.tokenstoshow[this.columnindex].length) {

                                this.manipulateword(index, 'selected', true);
                                if (i !== end) {
                                    this.manipulateword(index, 'selectedgap', true);
                                }
                            }
                        }
                    }
                    this.selectedindexesmarked = JSON.parse(JSON.stringify(newSelectedIndexes));
                }, deep: true
            },
            wordtomarkonhoverdata: function (newWordToMarkOnHover) {
                /*
                 * HOVER START BY A RESEARCH ELEMENT AND STARTED BY A TEXT ELEMENT
                 */
                //Revert visual changes to words on hover
                if (this.wortomarkonhoverold !== null && this.wortomarkonhoverold !== undefined) {
                    if (this.wortomarkonhoverold.textindexes.length > 0) {
                        for (let k = 0; k < this.wortomarkonhoverold.textindexes.length; k++) {
                            let index = this.wortomarkonhoverold.textindexes[k] - this.indexCorrector2;
                            if (index >= 0 && index < this.tokenstoshow[this.columnindex].length) {
                                this.manipulateword(index, 'entityhover', false);
                                this.manipulateword(index, 'entityhovergap', false);
                            }
                        }
                    }
                }
                //if there are words in textindexes
                if (newWordToMarkOnHover.textindexes.length > 0) {
                    //for every textindex correct the index and highlight the word
                    for (let k = 0; k < newWordToMarkOnHover.textindexes.length; k++) {
                        let index = newWordToMarkOnHover.textindexes[k] - this.indexCorrector2;
                        if (index >= 0 && index < this.tokenstoshow[this.columnindex].length) {
                            this.manipulateword(index, 'entityhover', true);

                            if (k + 1 < newWordToMarkOnHover.textindexes.length
                                && newWordToMarkOnHover.textindexes[k + 1] - this.indexCorrector2 - 1 === index) {
                                this.manipulateword(index, 'entityhovergap', true);
                            }
                        }
                    }
                    //update wortomarkonhoverold
                    this.wortomarkonhoverold = newWordToMarkOnHover;
                    //preparing resources to draw line
                    //work with the word in the right column
                    if (newWordToMarkOnHover.columnindex === this.columnindex) {
                        let index = -1;
                        if (this.numberofcolumns === 1) {
                            //check if one of the words is in the viewport otherwise scroll to it.
                            for (let k = 0; k < newWordToMarkOnHover.textindexes.length; k++) {
                                let textIndex = newWordToMarkOnHover.textindexes[k];
                                if (this.isElementInViewport(this.$refs['text'][textIndex].$el)) {
                                    index = k;
                                    break;
                                }
                            }
                            if (index === -1) {
                                index = 0;
                                this.scrolltoword(newWordToMarkOnHover.textindexes[index]);
                            }
                        } else {
                            for (let k = 0; k < newWordToMarkOnHover.textindexes.length; k++) {
                                let dis = newWordToMarkOnHover.textindexes[k] - this.indexCorrector2;
                                if (dis >= 0) {
                                    index = k;
                                    break;
                                }
                            }
                        }

                        if (index !== -1) {
                            if (!this.isElementInViewport(this.$refs['text'][newWordToMarkOnHover.textindexes[index] - this.indexCorrector2].$el)) {
                                this.scrolltoword(newWordToMarkOnHover.textindexes[index] - this.indexCorrector2);
                            }
                            let bb = this.$refs['text'][newWordToMarkOnHover.textindexes[index] - this.indexCorrector2].$el.getBoundingClientRect();

                            if (this.$refs['text'][newWordToMarkOnHover.textindexes[index] - this.indexCorrector2] !== undefined) {
                                let data = {
                                    hoverended: "text",
                                    offsetstart: bb
                                };
                                this.$emit('endhover', data);
                            }
                        }
                    }
                }
            },
            hoveredchain: function (newChain) {
                /*
                 * HOVER FOR COREF WHEN COREF IS ON
                 */
                if (this.classestomark.coref) {
                    if (this.oldhoveredchain !== null) {  //check for NullPointer
                        //find all hovered Mentions in (each?) column ...
                        for (let i = 0; i < this.oldhoveredchain.length; i++) {
                            if (this.oldhoveredchain[i].start >= this.indexCorrector2
                                && this.oldhoveredchain[i].end < this.indexCorrector2 + this.tokenstoshow[this.columnindex].length) {
                                //...and set variables for active to false for each mention in chain
                                for (let j = this.oldhoveredchain[i].start; j < this.oldhoveredchain[i].end; j++) {
                                    this.manipulateword(j - this.indexCorrector2, 'corefhover', false);
                                    this.manipulateword(j - this.indexCorrector2, 'corefhovergap', false);
                                }
                            }
                        }
                    }
                    //Hover new Chain if there is a new one to active based on the same principle like above
                    //could maybe export that as a new method for the style in the future
                    if (newChain !== null && newChain.length !== 0) {
                        for (let i = 0; i < newChain.length; i++) {
                            if (newChain[i].start >= this.indexCorrector2
                                && newChain[i].end < this.indexCorrector2 + this.tokenstoshow[this.columnindex].length) {
                                for (let j = newChain[i].start; j < newChain[i].end; j++) {
                                    this.manipulateword(j - this.indexCorrector2, 'corefhover', true);
                                    if (j !== newChain[i].end - 1) {
                                        this.manipulateword(j - this.indexCorrector2, 'corefhovergap', true);
                                    }
                                }
                            }
                        }
                    }
                    //the now hovered Chain is now the old one so that it can be unhovered,
                    // if it becomes unhovered by the user or a new chain is hovered
                    this.oldhoveredchain = newChain;
                }
            },
            classestomark: {
                /*
                 * ADD COREF BRACKETS
                 --MARK ALL WORD OF ALL CLASSES WHICH ARE TURNED ON
                 */
                handler: function (corefmode) {
                    //console.log('Checkpoint coref0:'+ this.setcoref);
                    this.rendercoref(corefmode);
                },
                deep: true
            },
        },
        mounted() {
            this.calcparentviewport();
            this.$refs['textwindow'].addEventListener('scroll', (event) => {
                // Clear our timeout throughout the scroll
                //console.log('ref textwindow is here?: ' + JSON.stringify(this.$refs['textwindow']));
                clearTimeout(this.scrollTimeout);
                this.scrollinfo.scrollingacolumn = true;

                this.$emit('scrolling', this.scrollinfo);
                // Set a timeout to run after scrolling ends
                this.scrollTimeout = setTimeout(() => {
                    this.scrollinfo.scrollingacolumn = false;
                    this.scrollinfo.scrollTop = this.$refs['textwindow'].scrollTop;
                    this.scrollinfo.source = 'textwindow';
                    this.$emit('scrolling', this.scrollinfo);
                }, 66);
            }, false);

            this.$refs['textviewport'].addEventListener('scroll', (event) => {
                // Clear our timeout throughout the scroll
                clearTimeout(this.scrolltimeout);
                this.scrollinfo.scrollingacolumn = true;
                this.$emit('scrolling', this.scrollinfo);
                // Set a timeout to run after scrolling ends
                this.scrollTimeout = setTimeout(() => {
                    this.scrollinfo.scrollingacolumn = false;
                    this.scrollinfo.scrollTop = this.$refs['textviewport'].scrollTop;
                    this.scrollinfo.source = 'textviewport';
                    this.$emit('scrolling', this.scrollinfo);
                }, 66);
            }, false);
        },
        computed: {
            indexCorrector: function () {
                let tempcorrector = 0;
                for (let i = 0; i < this.columnindex; i++) {
                    tempcorrector = tempcorrector + this.tokenstoshow[i].length;
                }
                return tempcorrector;
            },
            indexCorrector2: function () {
                let tempcorrector = 0;
                for (let i = 0; i < this.columnindex + this.tokenssplittedindextoshow; i++) {
                    tempcorrector = tempcorrector + this.tokenssplitted[i].length;
                }
                return tempcorrector;
            },
            analighterstatus: function () {
                let status = [];
                for (let i = 0; i < this.tokenssplitted.length; i++) {
                    status[i] = {column: i, status: 'entitiesview'};
                }
               if (this.analighterstatustoupdate.column > -1) {
                    status[this.analighterstatustoupdate.column] = {
                        column: this.analighterstatustoupdate.column,
                        status: this.analighterstatustoupdate.status
                    };
                    this.analighterstatustoupdate.column = -1;
                }
                return status;
            }
        },
        methods: {
            resetselectedindexes:function(){
                this.$emit('resetselectedindexes');
            },
            updateanalighterstatus: function (newStatus) {
                this.analighterstatustoupdate = newStatus;
            },
            setrerendercoref: function () {
                this.setcoref = true;
            },
            rendercoref: function (corefmode) {
                if (this.setcoref) {
                    //console.log("corefstatus: " + JSON.stringify(this.corefstatus));
                    //console.log('Checkpoint coref4567:');
                    if (corefmode.coref) {
                        //  console.log('Checkpoint coref1:');
                        for (let i = 0; i < this.coref.length; i++) {
                            if (this.coref[i].startIndex >= this.indexCorrector2 &&
                                this.coref[i].endIndex < this.indexCorrector2 + this.tokenstoshow[this.columnindex].length) {
                                for (let j = this.coref[i].startIndex; j < this.coref[i].endIndex; j++) {
                                    this.manipulateword(j - this.indexCorrector2, 'iscoref', true);
                                    if (j !== this.coref[i].endIndex - 1) {
                                        this.manipulateword(j - this.indexCorrector2, 'iscorefgrap', true);
                                    }
                                    if (this.coref[i].representative === -1) {
                                        this.manipulateword(j - this.indexCorrector2, 'isrepresentative', true);
                                    }
                                }
                                if (!this.corefstatus[this.columnindex]) {
                                    this.$refs['text'][this.coref[i].startIndex - this.indexCorrector2].addBracketLeft();
                                    this.$refs['text'][this.coref[i].endIndex - 1 - this.indexCorrector2].addBracketRight();
                                }
                            }
                            this.setcoref = false;
                        }
                        //this.corefstatus[this.columnindex] = true;
                        this.$emit('updatecorefstatus', this.columnindex);
                    }
                }
            },
            calcparentviewport: function () {
                this.parentviewport = this.$refs['column'].getBoundingClientRect();
            },
            onscrolltext: function () {
                //if (!this.addedtextscrolllistener) {
                /*console.log('ref textWindow is here?: ' + JSON.stringify(this.$refs['textWindow']));
                this.$refs['textWindow'].addEventListener('scroll', (event) => {
                    // Clear our timeout throughout the scroll
                    console.log('ref textWindow is here?: ' + JSON.stringify(this.$refs['textWindow']));
                    console.log('capturing scroll');
                    clearTimeout(this.scrollTimeout);
                    this.scrollingacolumn = true;
                    this.$emit('scrolling', this.scrollingacolumn);
                    // Set a timeout to run after scrolling ends
                    this.scrollTimeout = setTimeout(() => {
                        console.log('capturing scroll end');
                        this.scrollingacolumn = false;
                        this.$emit('scrolling', this.scrollingacolumn);
                    }, 66);
                }, false);*/
                this.addedtextscrolllistener = true;
                //}
                //console.log('ref textWindow is here?: ' + JSON.stringify(this.$refs['textwindow']));
                /*if (this.isRemoveLineOnScrollActive) {
                    this.removehoverline([]);
                }*/
            },
            removehoverline: function () {
                this.$emit('removehoverline');
            },
            manipulateword: function (textIndex, prop, value) {
                this.$refs['text'][textIndex].changeProperty(prop, value);
            },
            isElementInViewport: function (el) {
                let rect = el.getBoundingClientRect();
                let rect2 = this.$el.getBoundingClientRect();
                return (
                    rect.top >= rect2.top &&
                    rect.left >= rect2.left &&
                    rect.bottom <= rect2.bottom &&
                    rect.right <= rect2.right
                );
            },
            isElementInViewport2: function (rect) {
                let rect2 = this.$el.getBoundingClientRect();
                return (
                    rect.top >= rect2.top &&
                    rect.left >= rect2.left &&
                    rect.bottom <= rect2.bottom &&
                    rect.right <= rect2.right
                );
            },
            scrolltoword: function (textIndex) {
                if (textIndex - this.indexCorrector < 0 || textIndex - this.indexCorrector > this.tokenstoshow[this.columnindex].length) {
                    return;
                }
                //this.isRemoveLineOnScrollActive = false;
                this.$refs['text'][textIndex].$el.scrollIntoView();
            },
            allowscroll: function () {
                //this.isRemoveLineOnScrollActive = true;
            },
            allowscrollold: function (element) {
                let rect = element.$el.getBoundingClientRect();
                const windowHeight = (window.innerHeight || element.$el.parentElement.parentElement.clientHeight);
                const windowWidth = (window.innerWidth || element.$el.parentElement.parentElement.clientWidth);
                const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
                const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
                return (!vertInView && !horInView);
            },
            updateclassestomark: function (newClassesToMark) {
                this.$emit('updateclassestomark', newClassesToMark);
            },
            movetoolbar: function () {
                this.$emit('movetoolbar', this.columnindex);
            },
            hoverChain: function (chain) {
                this.$emit('hoverchain', chain);
            },
            startselection: function (index) {
                this.$emit('startselection', index);
            },
            hoverduringselection: function (index) {
                this.$emit('hoverduringselection', index);
            },
            endselection: function (index) {
                this.$emit('endselection', index);
            },
            selectText2: function (newSelectedIndexes) {
                this.$emit('jumpmarktext', newSelectedIndexes);
                this.scrolltoword(newSelectedIndexes.start);
            },
            togglesemanticlass: function (newClassesToMark) {
                this.$emit('togglesemanticlass', newClassesToMark);
            },
            starthover: function (event) {
                if (this.analysismode === "analighter") {
                    //only if the active event comes from a research entity otherwise just forward hoverdata
                    //correct bb
                    if (event.hoverstarted === "research") {
                        let bb = event.offsetend;
                        let rect = this.$refs['column'].getBoundingClientRect();
                        if (bb.top < rect.top) {
                            bb = JSON.parse(JSON.stringify(event.offsetend));
                            bb.top = rect.top;
                            bb.height = bb.bottom - bb.top;
                        }
                        if (bb.bottom > rect.bottom) {
                            bb = JSON.parse(JSON.stringify(event.offsetend));
                            bb.bottom = rect.bottom;
                            bb.height = bb.bottom - bb.top;
                        }
                        event.offsetend = bb;
                    }
                    this.$emit('starthover', event);
                }
            },
            endhover: function (event) {
                //correct bb
                if (event.hoverended === "research") {
                    let bb = event.offsetend;
                    let rect = this.$refs['column'].getBoundingClientRect();
                    if (bb.top < rect.top) {
                        bb = JSON.parse(JSON.stringify(event.offsetend));
                        bb.top = rect.top;
                        bb.height = bb.bottom - bb.top;
                    }
                    if (bb.bottom > rect.bottom) {
                        bb = JSON.parse(JSON.stringify(event.offsetend));
                        bb.bottom = rect.bottom;
                        bb.height = bb.bottom - bb.top;
                    }
                    event.offsetend = bb;
                }
                this.$emit('endhover', event);
            },
            dynamicSort: function (property) {
                let sortOrder = 1;
                if (property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a, b) {
                    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
            },
        },
        components: {
            tex,
            analighter,
            notes,
            store
        }
    }
</script>

<style scoped>

</style>