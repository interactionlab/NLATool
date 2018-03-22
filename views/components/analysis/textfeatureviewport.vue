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
                               v-bind:hoveredchain="hoveredchain"
                               v-bind:selectedchain="selectedchain"
                               v-bind:hoverdata="hoverdata"
                               v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
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
            hoverdata: {type: Object, default: null},
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
            contentcontrol: {type: Object, default: null},
        },
        data: function () {
            return {
                entitytoline: [],
                selectedindexesmarked: {start: -1, end: -1},
                highlightedhovered: null,
            }
        },
        watch: {
            selectedindexes: {
                handler: function (newSelectedIndexes) {
                    //console.log('pre-selectedindexesmarked: ' + JSON.stringify(this.selectedindexesmarked));
                    for (let i = this.selectedindexesmarked.start; i < this.selectedindexesmarked.end; i++) {
                        this.manipulateword(i, 'selected', false);
                        this.manipulateword(i, 'selectedgap', false);
                    }
                    if (newSelectedIndexes.start > -1 && newSelectedIndexes.end > -1) {
                        for (let i = newSelectedIndexes.start; i < newSelectedIndexes.end; i++) {
                            this.manipulateword(i, 'selected', true);
                            if (i < newSelectedIndexes.end - 1) {
                                this.manipulateword(i, 'selectedgap', true);
                            }
                        }
                        this.selectedindexesmarked = JSON.parse(JSON.stringify(newSelectedIndexes));
                        //console.log('post-selectedindexesmarked: ' + JSON.stringify(this.selectedindexesmarked));
                    }
                }, deep: true
            },
            hoverdata: {
                handler: function (newHoverData) {
                    let text = this.$refs['text'];
                    let i = 0;
                    let j = 0;
                    if (newHoverData.startword !== undefined && newHoverData.startword !== null) {
                        if (this.highlightedhovered !== null) {
                            if (this.highlightedhovered.startword !== null) {
                                while (text[this.highlightedhovered.startword.textIndex].token.semanticClass
                                === text[this.highlightedhovered.startword.textIndex + j].token.semanticClass) {
                                    this.manipulateword(this.highlightedhovered.startword.textIndex + j, 'entityhover', false);
                                    this.manipulateword(this.highlightedhovered.startword.textIndex + j, 'entityhovergap', false);
                                    j++;
                                }
                                j = 0;
                                while (text[this.highlightedhovered.startword.textIndex].token.semanticClass
                                === text[this.highlightedhovered.startword.textIndex - j].token.semanticClass) {
                                    if (this.highlightedhovered.startword.textIndex - j > 0) {
                                        this.manipulateword(this.highlightedhovered.startword.textIndex - j, 'entityhover', false);
                                        this.manipulateword(this.highlightedhovered.startword.textIndex - j, 'entityhovergap', false);
                                        j++;
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                        while (text[newHoverData.startword.textIndex].token.semanticClass === text[newHoverData.startword.textIndex + i].token.semanticClass) {
                            this.manipulateword(newHoverData.startword.textIndex + i, 'entityhover', true);
                            this.manipulateword(newHoverData.startword.textIndex + i, 'entityhovergap', true);
                            i++;
                        }
                        i = 0;
                        while (text[newHoverData.startword.textIndex].token.semanticClass === text[newHoverData.startword.textIndex - i].token.semanticClass) {
                            if (newHoverData.startword.textIndex - i > 0) {
                                this.manipulateword(newHoverData.startword.textIndex - i, 'entityhover', true);
                                this.manipulateword(newHoverData.startword.textIndex - i, 'entityhovergap', true);
                                i++;
                            } else {
                                break;
                            }
                        }
                        this.highlightedhovered = newHoverData;
                    }
                }, deep: true,
            }
        },
        computed: {},
        methods: {
            manipulateword: function (textIndex, prop, value) {
                this.$refs['text'][textIndex].changeProperty(prop, value);
            },
            scrolltoword: function (textIndex) {
                this.$refs['text'][textIndex].scrollIntoView();
            },
            updateclassestomark: function (newClassesToMark) {
                this.$emit('updateclassestomark', newClassesToMark);
            },
            movetoolbar: function () {
                this.$emit('movetoolbar', this.columnindex);
            },
            hoverChain: function (chain) {
                this.hoveredChain = chain;
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