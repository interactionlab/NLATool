<template>
    <span v-bind:name="tobejumped"
          v-on:mousedown="startSelection"
          v-on:mouseup="endSelection"
          v-on:mouseover="tohover = true"
          v-on:mouseout="stophover">
        <span class="nonPreAlt specialBracket" v-bind:class="toHighlight" v-if="token.coref !== undefined">{{beginBrackets}}</span><span
            class="nonPreAlt" v-bind:class="toHighlight" v-on:mouseover="hover">{{token.content}}</span><span class="nonPreAlt specialBracket" v-bind:class="toHighlight" v-if="token.coref !== undefined">{{endBrackets}}</span><span class="preAlt" v-bind:class="classToHighlightGap">{{getWordGap}}</span></span>
</template>
<script>
    export default {
        props: {
            token: Object,
            tokens: Array,
            index: Number,
            classestomark: Object,
            selectedindexes: Object,
            hoveredchain: Number,
            selectedchain: Number,
            entityindextoline: Number,
            entitytoline: Array,
        },
        data: function () {
            return {
                token: this.token,
                tokens: this.tokens,
                index: this.index,
                classestomark: this.classestomark,
                selectedindexes: this.selectedindexes,                
                hoveredchain: this.hoveredchain,
                selectedchain: this.selectedchain,
                entitytoline: this.entitytoline,
                htmlclass: {},
                tohover: false,
                isEntityHovered: false,
            }
        },
        computed: {
            tobejumped: function () {
                if (this.index === this.selectedindexes.start) {
                    return this.index;
                }
            },
            toHighlight: function () {
                let htmlclass = {};
                if (this.index > this.selectedindexes.start
                    && this.index <= this.selectedindexes.end) {
                    htmlclass['notemark'] = true;
                } else {
                    htmlclass['notemark'] = false;
                }
                if (typeof this.token.coref !== 'undefined') {
                    if (this.classestomark.coref) {
                        for (let i = 0; i < this.token.coref.length; i++) {
                            if (!this.tohover) {
                                //is Representant
                                if (this.token.coref[i].representative < 0) {
                                    if (this.token.coref[i].mentionID === this.hoveredchain) {
                                        htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                    } else if (this.token.coref[i].mentionID === this.selectedchain) {
                                        htmlclass['cSelectedRepresentant'] = this.classestomark.coref;
                                    }
                                    else {
                                        htmlclass['cRepresentant'] = this.classestomark.coref;
                                    }
                                } else {
                                    if (this.token.coref[i].representative === this.hoveredchain) {
                                        htmlclass['cHoverReferent'] = this.classestomark.coref;
                                    } else if (this.token.coref[i].representative === this.selectedchain) {
                                        htmlclass['cSelectedReferent'] = this.classestomark.coref;
                                    }
                                    else {
                                        htmlclass['cReferent'] = this.classestomark.coref;
                                    }
                                }
                            } else {
                                //is Representant
                                if (this.token.coref[i].representative < 0) {
                                    htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                    this.$emit('hoverchain', this.token.coref[i].mentionID);
                                } else {
                                    htmlclass['cHoverReferent'] = this.classestomark.coref;
                                    this.$emit('hoverchain', this.token.coref[i].representative);
                                }

                                //is nested in more than one mention
                            }
                        }
                    }
                }
                if (this.isEntityHovered == true){
                    htmlclass[this.token.semanticClass + "_strong"] = true;
                    htmlclass[this.token.semanticClass] = false;
                }
                else {
                    htmlclass[this.token.semanticClass + "_strong"] = false;
                    htmlclass[this.token.semanticClass] = this.classestomark[this.token.semanticClass]; 
                }                

                let posSet = ['NN', 'NE', 'NNP', 'NNS', 'NNPS', 'CD'];

                if (posSet.indexOf(this.token.pos) > -1 && this.token.semanticClass === 'O') {
                    htmlclass['POS'] = this.classestomark['POS'];
                } else {
                }
                return htmlclass
            },
            classToHighlightGap: function () {
                let htmlclass = {};
                //Z1: Standard: no highlight: (highlight semanticClass, no coref)
                //Z2: no highlight semanticClass, highlight Coref, but not this gap
                //Z3: highlight coref and this gab bc next word not part of coref mention
                //Z4: highlight gab if next word part of coref mention
                //Z5: highlight if user marks next word too
                try {
                    if ((this.index) > this.selectedindexes.start
                        && (this.index) < this.selectedindexes.end) {
                        htmlclass['notemark'] = true;
                    } else {
                        htmlclass['notemark'] = false;
                    }
                    if (typeof this.token.coref !== 'undefined') {
                        if (this.classestomark.coref) {
                            console.log(this.token.coref.length);
                            for (let i = 0; i < this.token.coref.length; i++) {
                                if (this.token.coref[i].endIndex-1 > this.token.textIndex) {
                                    if (!this.tohover) {
                                        //is Representant
                                        if (this.token.coref[i].representative < 0) {
                                            if (this.token.coref[i].mentionID === this.hoveredchain) {
                                                htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                            } else if (this.token.coref[i].mentionID === this.selectedchain) {
                                                htmlclass['cSelectedRepresentant'] = this.classestomark.coref;
                                            } else {
                                                htmlclass['cRepresentant'] = this.classestomark.coref;
                                            }
                                        } else {
                                            if (this.token.coref[i].representative === this.hoveredchain) {
                                                htmlclass['cHoverReferent'] = this.classestomark.coref;
                                            } else if (this.token.coref[i].representative === this.selectedchain) {
                                                htmlclass['cSelectedReferent'] = this.classestomark.coref;
                                            } else {
                                                htmlclass['cReferent'] = this.classestomark.coref;
                                            }
                                        }
                                    } else {
                                        //is Representant
                                        if (this.token.coref[i].representative < 0) {
                                            htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                            this.$emit('hoverchain', this.token.coref[i].mentionID);
                                        } else {
                                            htmlclass['cHoverReferent'] = this.classestomark.coref;
                                            this.$emit('hoverchain', this.token.coref[i].representative);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //TODO: check for consistency
                    if (this.tokens[this.index - 1].semanticClass === this.tokens[this.index].semanticClass) {
                        htmlclass[this.token.semanticClass] = this.classestomark[this.token.semanticClass];
                    }
                } catch (err) {
                    //console.log('Got out of the array' + err);
                }
                return htmlclass;
            },
            beginBrackets: function () {
                let resultingBrackets = '';
                let bracket = '[';
                if (this.classestomark.coref && typeof this.token.coref !== 'undefined') {
                    for (let i = 0; i < this.token.coref.length; i++) {
                        if (this.token.coref[i].startIndex === this.token.textIndex) {
                            resultingBrackets = resultingBrackets + bracket;
                        }
                    }
                }
                return resultingBrackets;
            },
            endBrackets: function () {
                let resultingBrackets = '';
                let bracket = ']';
                if (this.classestomark.coref && typeof this.token.coref !== 'undefined') {
                    for (let i = 0; i < this.token.coref.length; i++) {
                        if (this.token.coref[i].endIndex - 1 === this.token.textIndex) {
                            resultingBrackets = resultingBrackets + bracket;
                        }
                    }
                }
                return resultingBrackets;
            },
            getWordGap: function () {
                let token = this.tokens[this.index];
                let word1OffsetEnd = this.tokens[this.index - 1].EndOffSet;
                let whitespaceInfo = this.tokens[this.index - 1].whitespaceInfo;
                let word2OffsetBegin = -1;
                try {
                    word2OffsetBegin = token.beginOffSet;
                } catch (err) {
                }
                //default Setting: 1 space * difference between Offsets
                let gap = '';
                if (word2OffsetBegin !== -1) {
                    if (whitespaceInfo === -10) {
                        gap = Array(word2OffsetBegin - word1OffsetEnd +1).join(" ");
                    }
                }
                return gap;
            }
        },
        watch:{
            entityindextoline:function (newIndex) {
                if(newIndex === this.token.textIndex){
                    this.$el.scrollIntoView();
                    let offsets =  this.$el.getBoundingClientRect();
                    this.$emit('setoffsetstart', [offsets, this.token, "research"]);
                }
            },
            entitytoline:{
                handler: function(newEntitytoline)
                {
                    let found = false
                    for (let i = 0; i < newEntitytoline.length; i++){
                        if (newEntitytoline[i].textIndex == this.token.textIndex){
                            this.isEntityHovered = true;
                            found = true;
                        }
                    }  
                    if (found == false) {
                        this.isEntityHovered = false;
                    }
                    
                }, deep:true
            }
        },
        methods: {
            startSelection: function () {
                this.$emit('startselection', this.index - 1);
            },
            endSelection: function (event) {
                let offsets = event.target.getBoundingClientRect();
                this.$emit('setoffsetstart', [offsets, this.token, "text"]);
                this.$emit('endselection', this.index);
            },
            stophover: function () {
                this.tohover = false;
                this.$emit('hoverchain', -1);
            },
            hover: function (event) {
                this.tohover = true;
                if (this.token.semanticClass === "O") {
                    return;
                }
                let offsets = event.target.getBoundingClientRect();
                this.$emit('setoffsetstart', [offsets, this.token, "text"]);
            }
        }
    }
</script>