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
                               v-bind:index="token.textIndex+1"
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
            wordtomarkonhoverdata: {
                type: Array, default: function () {
                    return []
                }
            },
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
                        this.manipulateword(i - this.indexCorrector, 'selected', false);
                        this.manipulateword(i - this.indexCorrector, 'selectedgap', false);
                    }
                    if (newSelectedIndexes.start > -1 && newSelectedIndexes.end > -1) {
                        for (let i = newSelectedIndexes.start; i < newSelectedIndexes.end; i++) {
                            this.manipulateword(i - this.indexCorrector, 'selected', true);
                            if (i < newSelectedIndexes.end - 1) {
                                this.manipulateword(i - this.indexCorrector, 'selectedgap', true);
                            }
                        }
                        this.selectedindexesmarked = JSON.parse(JSON.stringify(newSelectedIndexes));
                        // console.log('post-selectedindexesmarked: ' + JSON.stringify(this.selectedindexesmarked));
                    }
                }, deep: true
            },
            wordtomarkonhoverdata: function (newWordToMarkOnHover) {
                //console.log('new wordtomarkonhover is: ' + JSON.stringify(newWordToMarkOnHover));
                if (newWordToMarkOnHover.textindexes.length > 0) {
                    if (this.wortomarkonhoverold !== null) {
                        if (this.wortomarkonhoverold.textindexes.length > 0) {
                            for (let k = 0; k < this.wortomarkonhoverold.textindexes.length; k++) {
                                this.manipulateword(this.wortomarkonhoverold.textindexes[k] - this.indexCorrector, 'entityhover', false);
                                this.manipulateword(this.wortomarkonhoverold.textindexes[k] - this.indexCorrector, 'entityhovergap', false);
                            }
                        }
                    }
                    for (let k = 0; k < newWordToMarkOnHover.textindexes.length; k++) {
                        this.manipulateword(newWordToMarkOnHover.textindexes[k] - this.indexCorrector, 'entityhover', true);
                        this.manipulateword(newWordToMarkOnHover.textindexes[k] - this.indexCorrector, 'entityhovergap', true);

                    }
                    this.wortomarkonhoverold = newWordToMarkOnHover;
                    this.scrolltoword(newWordToMarkOnHover.textindexes[0] - this.indexCorrector);
                    if (this.$refs['text'][newWordToMarkOnHover.textindexes[0] - this.indexCorrector] !== undefined) {
                        let data = {
                            hoverended: "text",
                            offsetstart: this.$refs['text'][newWordToMarkOnHover.textindexes[0] - this.indexCorrector].$el.getBoundingClientRect()
                        };

                        this.$emit('endhover', data);
                    }
                }
            },
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
                                correctedIndex = this.highlightedhovered.startword.textIndex - 1 - this.indexCorrector;
                                while (text[correctedIndex].token.semanticClass
                                === text[correctedIndex + j].token.semanticClass) {
                                    this.manipulateword(correctedIndex + j, 'entityhover', false);
                                    this.manipulateword(correctedIndex + j, 'entityhovergap', false);
                                    j++;
                                }
                                j = 0;
                                while (text[correctedIndex].token.semanticClass
                                === text[correctedIndex - j].token.semanticClass) {
                                    if (correctedIndex - j > 0) {
                                        this.manipulateword(correctedIndex - j, 'entityhover', false);
                                        this.manipulateword(correctedIndex - j, 'entityhovergap', false);
                                        j++;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                        correctedIndex = newHoverData.startword.textIndex - 1 - this.indexCorrector;
                        while (text[correctedIndex].token.semanticClass === text[correctedIndex + i].token.semanticClass) {
                            this.manipulateword(correctedIndex + i, 'entityhover', true);
                            this.manipulateword(correctedIndex + i, 'entityhovergap', true);
                            i++;
                        }
                        i = 0;
                        while (text[correctedIndex].token.semanticClass === text[correctedIndex - i].token.semanticClass) {
                            if (correctedIndex - i > 0) {
                                this.manipulateword(correctedIndex - i, 'entityhover', true);
                                this.manipulateword(correctedIndex - i, 'entityhovergap', true);
                                i++;
                            } else {
                                break;
                            }
                        }
                        this.highlightedhovered = newHoverData;
                    }
                }, deep: true,
            },
            hoveredchain: function (newChain) {
                console.log('The new watched Chain: ' + JSON.stringify(newChain));
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
                        for (let i = 0; i < newChain.length; i++) {
                            if (newChain[i].start >= this.indexCorrector
                                && newChain[i].end < this.indexCorrector + this.tokenstoshow[this.columnindex].length) {
                                for (let j = newChain[i].start; j < newChain[i].end; j++) {
                                    this.manipulateword(j - this.indexCorrector, 'partofhoveredchain', true);
                                    //this.manipulateword(j - this.getIndexCorrector(), 'representative', newChain[i].representative);
                                }
                            }
                        }
                    }
                    this.oldhoveredchain = newChain;
                }
            },
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
                }, deep: true
            },
        },
        mounted() {
        },
        computed: {
            indexCorrector:function () {
                let tempcorrector = 0;
                for (let i = 0; i < this.columnindex; i++) {
                    tempcorrector = tempcorrector + this.tokenstoshow[i].length;
                }
                return tempcorrector;
            }
        },
        methods: {
            getIndexCorrector: function () {
                let tempcorrector = 0;
                for (let i = 0; i < this.columnindex; i++) {
                    tempcorrector = tempcorrector + this.tokenstoshow[i].length;
                }
                console.log('indexCorrector = ' + tempcorrector);
                return tempcorrector;
            },
            manipulateword: function (textIndex, prop, value) {
                console.log('Changing word at: ' + textIndex + ' Prop: ' + prop + ' Value:' + value);
                this.$refs['text'][textIndex].changeProperty(prop, value);
            },
            scrolltoword: function (textIndex) {
                //console.log('allowed to scroll? :' + textIndex);
                if (this.allowscroll(this.$refs['text'][textIndex])) {
                    //console.log('scrolling to :' + textIndex);
                    this.$refs['text'][textIndex].$el.scrollIntoView();
                }
            },
            allowscroll: function (element) {
                let rect = element.$el.getBoundingClientRect();
                //console.log('Position of element to scroll:' + JSON.stringify(rect));
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