<template>
    <div style="padding:0;height: auto !important; max-height: 100%; overflow: hidden; display: flex;width:100%;">
        <div class="mdl-grid contentColor mdl-shadow--6dp" style="display: flex;margin: 1em;width:100%; padding:0"
             v-on:mouseover="movetoolbar">
            <!--left grid for text stuff -->
            <div class="mdl-cell mdl-cell--6-col"
                 style="border-right: 1px solid rgba(0,0,0,.1);margin: 0;padding: 8px; width: 50%; overflow-y: auto;">
                <div class="mdl-grid" id="textWindow" ref="textWindow"
                     style="height: auto !important; display: flex; max-height: 100%; padding:0; font-family: 'Roboto Mono', monospace;">

                    <component is="tex"
                               ref="text"
                               v-for="(token,i) in tokenstoshow[columnindex]"
                               v-bind:key="token.textIndex"
                               v-bind:token="token"
                               v-bind:columnindex="columnindex"
                               v-bind:selectedindexes="selectedindexes"
                               v-bind:classestomark="classestomark"
                               v-bind:selectedchain="selectedchain"
                               v-on:hoverchain="hoverChain($event)"
                               v-on:startselection="startselection($event)"
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
                            v-bind:selectedindexes="selectedindexes"
                            v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                            v-bind:classestomark="classestomark"
                            v-bind:contentcontrol="contentcontrol"
                            v-on:togglesemanticlass="togglesemanticlass($event)"
                            v-on:entercorrectionmode="entercorrectionmode($event)"
                            v-on:endhover="endhover($event)"
                            v-on:jumpmarktext="selectText2($event)"
                            v-on:starthover="starthover($event)"
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
            selectedindexes: {type: Object, default: null},
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
                selectedindexesmarked: {start: -1, end: -1},
                highlightedhovered: null,
                wortomarkonhoverold: null,
                oldhoveredchain: null,
                corefset: false,

            }
        },
        watch: {
            selectedindexes: {
                handler: function (newSelectedIndexes) {
                    //console.log('pre-selectedindexesmarked: ' + JSON.stringify(this.newSelectedIndexes));
                    for (let i = this.selectedindexesmarked.start; i < this.selectedindexesmarked.end; i++) {
                        if (i - this.indexCorrector >= 0) {
                            this.manipulateword(i - this.indexCorrector, 'selected', false);
                            this.manipulateword(i - this.indexCorrector, 'selectedgap', false);
                        }
                    }
                    if (newSelectedIndexes.start > -1 && newSelectedIndexes.end > -1) {
                        for (let i = newSelectedIndexes.start; i < newSelectedIndexes.end; i++) {
                            if (i - this.indexCorrector >= 0) {
                                this.manipulateword(i - this.indexCorrector, 'selected', true);
                                if (i < newSelectedIndexes.end - 1) {
                                    this.manipulateword(i - this.indexCorrector, 'selectedgap', true);
                                }
                            }
                        }
                        this.selectedindexesmarked = JSON.parse(JSON.stringify(newSelectedIndexes));
                        // console.log('post-selectedindexesmarked: ' + JSON.stringify(this.selectedindexesmarked));
                    }
                }, deep: true
            },
            wordtomarkonhoverdata: function (newWordToMarkOnHover) {
                console.log('new wordtomarkonhover is: ' + JSON.stringify(newWordToMarkOnHover));
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
                            console.log("TEST" + k);
                            this.manipulateword(newWordToMarkOnHover.textindexes[k] - this.indexCorrector, 'entityhover', true);
                            this.manipulateword(newWordToMarkOnHover.textindexes[k] - this.indexCorrector, 'entityhovergap', true);
                        }
                    }

                    this.wortomarkonhoverold = newWordToMarkOnHover;
                    console.log(newWordToMarkOnHover.columnindex);
                    if (newWordToMarkOnHover.columnindex === this.columnindex) {
                        console.log(newWordToMarkOnHover.textindexes);
                        let index = -1;
                        for (let k = 0; k < newWordToMarkOnHover.textindexes.length; k++) {
                            console.log(newWordToMarkOnHover.textindexes[k]);
                            let dis = newWordToMarkOnHover.textindexes[k] - this.indexCorrector;
                            if (dis >= 0) {
                                index = k;
                                break;
                            }
                        }

                        if (index !== -1) {
                            this.scrolltoword(newWordToMarkOnHover.textindexes[index]);

                            if (this.$refs['text'][newWordToMarkOnHover.textindexes[index] - this.indexCorrector] !== undefined) {
                                let data = {
                                    hoverended: "text",
                                    offsetstart: this.$refs['text'][newWordToMarkOnHover.textindexes[index] - this.indexCorrector].$el.getBoundingClientRect()
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
                            console.log('corefs all set!');
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
            manipulateword: function (textIndex, prop, value) {
                console.log('Changing word at: ' + textIndex + ' Prop: ' + prop + ' Value:' + value);
                this.$refs['text'][textIndex].changeProperty(prop, value);
            },
            scrolltoword: function (textIndex) {
                console.log('allowed to scroll? :' + textIndex);
                if (textIndex  - this.indexCorrector < 0 || textIndex - this.indexCorrector > this.tokenstoshow[this.columnindex].length) {
                    return;
                }
                else if (this.allowscroll(this.$refs['text'][textIndex  - this.indexCorrector])) {
                    console.log('scrolling to :' + textIndex);
                    this.$refs['text'][textIndex].$el.scrollIntoView();
                }
            },
            allowscroll: function (element) {
                let rect = element.$el.getBoundingClientRect();
                console.log('Position of element to scroll:' + JSON.stringify(rect));
                const windowHeight = (window.innerHeight || element.$el.parentElement.parentElement.clientHeight);
                const windowWidth = (window.innerWidth || element.$el.parentElement.parentElement.clientWidth);
                const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
                const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
                console.log('height:' + windowHeight + ' width: ' + windowWidth);
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