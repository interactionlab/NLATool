<template>
    <div style="padding:0;height: auto !important; max-height: 100%; overflow: hidden; display: flex;width:100%;">
        <div class="mdl-grid contentColor mdl-shadow--6dp" style="display: flex;margin: 1em;width:100%; padding:0"
             v-on:mouseover="movetoolbar"
             ref="column">
            <!--left grid for text stuff -->
            <div class="mdl-cell mdl-cell--6-col"
                 style="border-right: 1px solid rgba(0,0,0,.1);margin: 0;padding: 8px; width: 50%; overflow-y: auto;" v-on:scroll="onscrolltext">
                <div class="mdl-grid" id="textWindow" ref="textWindow"
                    
                     style="height: auto !important; display: flex; max-height: 100%; padding:0;">

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
                            v-bind:researchedentities="researchedentities"
                            v-bind:selectedtextindexes="selectedtextindexes"
                            v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                            v-bind:classestomark="classestomark"
                            v-bind:contentcontrol="contentcontrol"
                            v-bind:parentviewport="parentviewport"
                            v-on:togglesemanticlass="togglesemanticlass($event)"
                            v-on:entercorrectionmode="entercorrectionmode($event)"
                            v-on:endhover="endhover($event)"
                            v-on:jumpmarktext="selectText2($event)"
                            v-on:starthover="starthover($event)"
                            v-on:removehoverline="removehoverline($event)"
                            v-on:updateclassestomark="updateclassestomark($event)">
                    </component>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
    import notes from './components/analysis/notes/notes.vue';
    import analighter from './components/analysis/analighter.vue';
    import tex from './components/analysis/text.vue';

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
            coref: {
                type: Array, default: function () {
                    return []
                }
            },
            contentcontrol: {type: Object, default: null},
        },
        data: function () {
            return {
                entitytoline: [],
                parentviewport: {},
                selectedindexesmarked: {start: -1, end: -1},
                highlightedhovered: null,
                isRemoveLineOnScrollActive: true,
                wortomarkonhoverold: null,
                oldhoveredchain: null,
                corefset: false,

            }
        },
        watch: {
            selectedtextindexes: {
                handler: function (newSelectedIndexes) {
                    //unhover old words
                    if (this.selectedindexesmarked.hover !== -1 || this.selectedindexesmarked.end !== -1){
                        let start =  this.selectedindexesmarked.start;
                        let end = this.selectedindexesmarked.hover;
                        if (this.selectedindexesmarked.end !== -1){
                            let end = this.selectedindexesmarked.end;
                        }
                        
                        if (start > end){
                            let dummy = end;
                            end = start;
                            start = dummy;
                        }
                        for (let i = start; i <= end; i++) {
                            if (i - this.indexCorrector >= 0) {
                                this.manipulateword(i - this.indexCorrector, 'selected', false);
                                this.manipulateword(i - this.indexCorrector, 'selectedgap', false);
                            }
                        }
                    }
                    //hover new words
                    if (newSelectedIndexes.hover !== -1 || newSelectedIndexes.end !== -1){
                        let start =  newSelectedIndexes.start;
                        let end = newSelectedIndexes.hover;
                        if (newSelectedIndexes.end !== -1){
                            let end = newSelectedIndexes.end;
                        }
                        if (start > end){
                            let dummy = end;
                            end = start;
                            start = dummy;
                        }
                        for (let i = start; i <= end; i++) {
                            if (i - this.indexCorrector >= 0) {
                                this.manipulateword(i - this.indexCorrector, 'selected', true);
                                this.manipulateword(i - this.indexCorrector, 'selectedgap', true);
                            }
                        }
                    }
                    this.selectedindexesmarked = JSON.parse(JSON.stringify(newSelectedIndexes));
                }, deep: true
            },
            wordtomarkonhoverdata: function (newWordToMarkOnHover) {
                //console.log('new wordtomarkonhover is: ' + JSON.stringify(newWordToMarkOnHover));
                if (newWordToMarkOnHover.textindexes.length > 0) {
                    if (this.wortomarkonhoverold !== null && this.wortomarkonhoverold !== undefined) {

                        if (this.wortomarkonhoverold.textindexes.length > 0) {
                            for (let k = 0; k < this.wortomarkonhoverold.textindexes.length; k++) {
                                if (this.wortomarkonhoverold.textindexes[k] - this.indexCorrector >= 0
                                    && this.wortomarkonhoverold.textindexes[k] - this.indexCorrector < this.tokenstoshow[this.columnindex].length) {
                                    this.manipulateword(this.wortomarkonhoverold.textindexes[k] - this.indexCorrector, 'entityhover', false);
                                    this.manipulateword(this.wortomarkonhoverold.textindexes[k] - this.indexCorrector, 'entityhovergap', false);
                                }
                            }
                        }
                    }
                    for (let k = 0; k < newWordToMarkOnHover.textindexes.length; k++) { if (newWordToMarkOnHover.textindexes[k] - this.indexCorrector >= 0
                            && newWordToMarkOnHover.textindexes[k] - this.indexCorrector < this.tokenstoshow[this.columnindex].length) {
                            this.manipulateword(newWordToMarkOnHover.textindexes[k] - this.indexCorrector, 'entityhover', true);
                            this.manipulateword(newWordToMarkOnHover.textindexes[k] - this.indexCorrector, 'entityhovergap', true);
                        }
                    }
                    
                    
                    
                    this.wortomarkonhoverold = newWordToMarkOnHover;
                    if (newWordToMarkOnHover.columnindex === this.columnindex) {
                        //console.log("newWordToMarkOnHover" + newWordToMarkOnHover.textindexes);
                        let index = -1;
                        if (this.numberofcolumns == 1){
                            for (let k = 0; k < newWordToMarkOnHover.textindexes.length; k++) {
                                let textIndex = newWordToMarkOnHover.textindexes[k];
                                if(this.isElementInViewport(this.$refs['text'][textIndex].$el)){
                                    index = k;
                                    break;
                                }
                            }
                            if (index == -1){
                                index = 0;
                                this.scrolltoword(newWordToMarkOnHover.textindexes[index]);
                            }
                        } else {
                            for (let k = 0; k < newWordToMarkOnHover.textindexes.length; k++) {
                                let dis = newWordToMarkOnHover.textindexes[k] - this.indexCorrector;
                                if (dis >= 0) {
                                    index = k;
                                    break;
                                }
                            }
                        }

                        if (index !== -1) {
                            let bb = this.$refs['text'][newWordToMarkOnHover.textindexes[index] - this.indexCorrector].$el.getBoundingClientRect()
                        
                            if (this.$refs['text'][newWordToMarkOnHover.textindexes[index] - this.indexCorrector] !== undefined) {
                                let data = {
                                    hoverended: "text",
                                    offsetstart: bb
                                };
                                this.$emit('endhover', data);
                            }

                        }
                    }
                }
            }
            ,
            hoverdata: {
                handler: function (newHoverData) {
                    //console.log('new Hover Data is: ' + JSON.stringify(newHoverData));
                    let text = this.$refs['text'];
                    let i = 0;
                    let j = 0;
                    let correctedIndex = 0;
                    if (newHoverData.startword !== undefined && newHoverData.startword !== null) {
                        if (this.highlightedhovered !== null) {
                            if (this.highlightedhovered.startword !== null) {
                                correctedIndex = this.highlightedhovered.startword.textIndex - this.indexCorrector;
                                if (correctedIndex >= 0) {
                                    if (text[correctedIndex] === undefined) {
                                        console.log('The word at index:' + correctedIndex + 'in column:' + this.columnindex + ' is undefined');
                                    }
                                    while (text[correctedIndex].token.semanticClass
                                    === text[correctedIndex + j].token.semanticClass) {
                                        if (text[correctedIndex + j] === undefined) {
                                            console.log('The word at index+j:' + (correctedIndex + j) + 'in column:' + this.columnindex + ' is undefined');
                                        }
                                        this.manipulateword(correctedIndex + j, 'entityhover', false);
                                        this.manipulateword(correctedIndex + j, 'entityhovergap', false);
                                        j++;
                                    }
                                    j = 0;
                                    while (text[correctedIndex].token.semanticClass
                                    === text[correctedIndex - j].token.semanticClass) {
                                        if (correctedIndex - j > 0) {
                                            if (text[correctedIndex - j] === undefined) {
                                                console.log('The word at index-j:' + (correctedIndex - j) + 'in column:' + this.columnindex + ' is undefined');
                                            }
                                            this.manipulateword(correctedIndex - j, 'entityhover', false);
                                            this.manipulateword(correctedIndex - j, 'entityhovergap', false);
                                            j++;
                                        } else {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        correctedIndex = newHoverData.startword.textIndex - this.indexCorrector;
                        if (correctedIndex >= 0) {
                            if (text[correctedIndex] === undefined) {
                                console.log('The word at index:' + correctedIndex + 'in column:' + this.columnindex + ' is undefined');
                            }
                            while (text[correctedIndex].token.semanticClass === text[correctedIndex + i].token.semanticClass) {
                                if (text[correctedIndex + i] === undefined) {
                                    console.log('The word at index + i:' + (correctedIndex + i) + 'in column:' + this.columnindex + ' is undefined');
                                }
                                this.manipulateword(correctedIndex + i, 'entityhover', true);
                                this.manipulateword(correctedIndex + i, 'entityhovergap', true);
                                i++;
                            }
                            i = 0;
                            while (text[correctedIndex].token.semanticClass === text[correctedIndex - i].token.semanticClass) {
                                if (correctedIndex - i > 0) {
                                    if (text[correctedIndex - i] === undefined) {
                                        console.log('The word at index -i:' + (correctedIndex - i) + 'in column:' + this.columnindex + ' is undefined');
                                    }
                                    this.manipulateword(correctedIndex - i, 'entityhover', true);
                                    this.manipulateword(correctedIndex - i, 'entityhovergap', true);
                                    i++;
                                } else {
                                    break;
                                }
                            }
                            this.highlightedhovered = newHoverData;
                        }
                    }
                }
                ,
                deep: true,
            }
            ,
            hoveredchain: function (newChain) {
                //console.log('The new watched Chain: ' + JSON.stringify(newChain));
                if (this.classestomark.coref) {
                    if (this.oldhoveredchain !== null) {
                        for (let i = 0; i < this.oldhoveredchain.length; i++) {
                            if (this.oldhoveredchain[i].start >= this.indexCorrector
                                && this.oldhoveredchain[i].end < this.indexCorrector + this.tokenstoshow[this.columnindex].length) {
                                for (let j = this.oldhoveredchain[i].start; j < this.oldhoveredchain[i].end; j++) {
                                    this.manipulateword(j - this.indexCorrector, 'partofhoveredchain', false);
                                }
                            }
                        }
                    }
                    if (newChain !== null && newChain.length !== 0) {
                        let last = 0;
                        for (let i = 0; i < newChain.length; i++) {
                            if (newChain[i].start >= this.indexCorrector
                                && newChain[i].end < this.indexCorrector + this.tokenstoshow[this.columnindex].length) {
                                for (let j = newChain[i].start; j < newChain[i].end; j++) {
                                    last++;
                                    this.manipulateword(j - this.indexCorrector, 'partofhoveredchain', true);
                                    //this.manipulateword(j - this.getIndexCorrector(), 'representative', newChain[i].representative);
                                }
                                this.manipulateword(last - 1 - this.indexCorrector, 'isLastTokenToHighlight', true);
                                last = 0;
                            }
                        }
                    }
                    this.oldhoveredchain = newChain;
                }
            }
            ,
            classestomark: {
                handler: function (corefmode) {
                    if (!this.corefset) {
                        if (corefmode.coref) {
                            for (let i = 0; i < this.coref.length; i++) {
                                //console.log('coref ' + i + ' is: ' + JSON.stringify(this.coref[i]));
                                if (this.coref[i].startIndex >= this.indexCorrector && this.coref[i].endIndex < this.indexCorrector + this.tokenstoshow[this.columnindex].length) {
                                    for (let j = this.coref[i].startIndex; j < this.coref[i].endIndex; j++) {
                                        this.manipulateword(j - this.indexCorrector, 'partofChain', true);
                                        if (this.coref[i].representative === -1) {
                                            this.manipulateword(j - this.indexCorrector, 'representative', true);
                                        }
                                    }
                                    this.$refs['text'][this.coref[i].startIndex - this.indexCorrector].addBracketLeft();
                                    this.$refs['text'][this.coref[i].endIndex - 1 - this.indexCorrector].addBracketRight();
                                }
                            }
                            this.corefset = true;
                        }
                    }
                }
                ,
                deep: true
            }
            ,
        },
        mounted() {
            this.calcparentviewport();
        },
        computed: {
            indexCorrector: function () {
                let tempcorrector = 0;
                for (let i = 0; i < this.columnindex; i++) {
                    tempcorrector = tempcorrector + this.tokenstoshow[i].length;
                }
                return tempcorrector;
            }
        },
        methods: {
            calcparentviewport: function(){
                this.parentviewport = this.$refs['column'].getBoundingClientRect();
            },
            onscrolltext: function(event) {
                if (this.isRemoveLineOnScrollActive){
                    this.removehoverline([]);
                }
            },
            removehoverline: function(data) {
                this.$emit('removehoverline', data);
            },
            manipulateword: function (textIndex, prop, value) {
                //console.log('Changing word at: ' + textIndex + ' Prop: ' + prop + ' Value:' + value);
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
            scrolltoword: function (textIndex) {
                if (textIndex  - this.indexCorrector < 0 || textIndex - this.indexCorrector > this.tokenstoshow[this.columnindex].length) {
                    return;
                }
                this.isRemoveLineOnScrollActive = false;
                this.$refs['text'][textIndex].$el.scrollIntoView();
                this.isRemoveLineOnScrollActive = true;
            },
            allowscroll: function (element) {                
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
            endhover: function (event) {
                //correct bb
                if (event.hoverended == "research"){
                    let bb = event.offsetend;
                    let rect = this.$refs['column'].getBoundingClientRect();
                    if (bb.top < rect.top){
                        bb = JSON.parse(JSON.stringify(event.offsetend));
                        console.log("cap top");
                        bb.top = rect.top;
                        bb.height = bb.bottom - bb.top;
                    }
                    if (bb.bottom > rect.bottom){
                        bb = JSON.parse(JSON.stringify(event.offsetend));
                        console.log("cap bottom");
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
            starthover: function (event) {
                //correct bb
                if (event.hoverstarted == "research"){
                    let bb = event.offsetend;
                    let rect = this.$refs['column'].getBoundingClientRect();
                    if (bb.top < rect.top){
                        bb = JSON.parse(JSON.stringify(event.offsetend));
                        console.log("cap top");
                        bb.top = rect.top;
                        bb.height = bb.bottom - bb.top;
                    }
                    if (bb.bottom > rect.bottom){
                        bb = JSON.parse(JSON.stringify(event.offsetend));
                        console.log("cap bottom");
                        bb.bottom = rect.bottom;
                        bb.height = bb.bottom - bb.top;
                    }
                    event.offsetend = bb;
                }                
                this.$emit('starthover', event);
            },
        },
        components: {
            tex,
            analighter,
            notes
        }
    }
</script>

<style scoped>

</style>