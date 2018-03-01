<template>
    <span v-bind:name="tobejumped"
          v-on:mousedown="startSelection"
          v-on:mouseup="endSelection"
          v-on:mouseover="tohover = true"
          v-on:mouseout="stophover">
        <span class="nonPreAlt specialBracket"
              v-bind:class="toHighlight">{{beginBrackets}}</span
        ><span class="nonPreAlt"
               v-bind:class="toHighlight">{{token.content}}</span
    ><span class="nonPreAlt specialBracket"
           v-bind:class="toHighlight">{{endBrackets}}</span
    ><span class="preAlt "
           v-bind:class="classToHighlightGap">{{getWordGap}}</span>
    </span>
</template>


<script>
    export default {
        props: {
            token: Object,
            tokens: Array,
            mentions: Array,
            index: Number,
            classestomark: Object,
            selectedindexes: Object,
            hoveredchain: Number,
            selectedchain: Number,
            nestedmentions: Object,
            endOfMentions: Object
        },
        data: function () {
            return {
                token: this.token,
                tokens: this.tokens,
                mentions: this.mentions,
                index: this.index,
                classestomark: this.classestomark,
                selectedindexes: this.selectedindexes,
                htmlclass: {},
                markgap: false,
                tohover: false,
                hoveredchain: this.hoveredchain,
                selectedchain: this.selectedchain,
                nestedmentions: this.nestedmentions,
                color: this.color,
                endOfMentions: this.endOfMentions
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
                //console.log('Checkpoint 1: ' + JSON.stringify(this.mentions));
                for (let i = 0; i < this.mentions[0].length; i++) {
                    //console.log('Checkpoint 2.0: ' + this.index - 1 + ' >=? ' + this.mentions[0][i].startIndex);
                    //console.log('Checkpoint 2.1: ' + this.index + ' <=? ' + this.mentions[0][i].endIndex);
                    //isPart of a Mention:
                    if ((this.index - 1) >= this.mentions[0][i].startIndex && this.index <= this.mentions[0][i].endIndex) {
                        //is hovered
                        if (!this.tohover) {
                            //is Representant
                            if (this.mentions[0][i].representative < 0) {
                                if (this.mentions[0][i].mentionID === this.hoveredchain) {
                                    htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                } else if (this.mentions[0][i].mentionID === this.selectedchain) {
                                    htmlclass['cSelectedRepresentant'] = this.classestomark.coref;
                                }
                                else {
                                    htmlclass['cRepresentant'] = this.classestomark.coref;
                                }
                            } else {
                                if (this.mentions[0][i].representative === this.hoveredchain) {
                                    htmlclass['cHoverReferent'] = this.classestomark.coref;
                                } else if (this.mentions[0][i].representative === this.selectedchain) {
                                    htmlclass['cSelectedReferent'] = this.classestomark.coref;
                                }
                                else {
                                    htmlclass['cReferent'] = this.classestomark.coref;
                                }
                            }
                        } else {
                            //is Representant
                            if (this.mentions[0][i].representative < 0) {
                                htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                this.$emit('hoverchain', this.mentions[0][i].mentionID);
                            } else {
                                htmlclass['cHoverReferent'] = this.classestomark.coref;
                                this.$emit('hoverchain', this.mentions[0][i].representative);
                            }
                        }
                        //is nested in more than one mention
                    }
                }
                htmlclass[this.token.semanticClass] = this.classestomark[this.token.semanticClass];

                let posSet = ['NN', 'NE', 'NNP', 'NNS', 'NNPS', 'CD'];

                if (posSet.indexOf(this.token.pos) > -1 && this.token.semanticClass === 'O') {

                    htmlclass['POS'] = this.classestomark['POS'];
                    //console.log(JSON.stringify(this.classestomark));
                } else {
                    //console.log("else" + JSON.stringify(this.classestomark));
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
                    for (let i = 0; i < this.mentions[0].length; i++) {
                        //console.log('Checkpoint 2.0: ' + (this.index - 1) + ' >=? ' + this.mentions[0][i].startIndex);
                        //console.log('Checkpoint 2.1: ' + this.index + ' <=? ' + this.mentions[0][i].endIndex);
                        if ((this.index - 1) >= this.mentions[0][i].startIndex && (this.index) < this.mentions[0][i].endIndex) {
                            if (!this.tohover) {
                                //is Representant
                                if (this.mentions[0][i].representative < 0) {
                                    if (this.mentions[0][i].mentionID === this.hoveredchain) {
                                        htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                    } else if (this.mentions[0][i].mentionID === this.selectedchain) {
                                        htmlclass['cSelectedRepresentant'] = this.classestomark.coref;
                                    } else {
                                        htmlclass['cRepresentant'] = this.classestomark.coref;
                                    }
                                } else {
                                    if (this.mentions[0][i].representative === this.hoveredchain) {
                                        htmlclass['cHoverReferent'] = this.classestomark.coref;
                                    } else if (this.mentions[0][i].representative === this.selectedchain) {
                                        htmlclass['cSelectedReferent'] = this.classestomark.coref;
                                    } else {
                                        htmlclass['cReferent'] = this.classestomark.coref;
                                    }
                                }
                                if (this.checkIfNested()) {
                                    htmlclass['nested'] = this.classestomark.coref;
                                }
                            } else {
                                //is Representant
                                if (this.mentions[0][i].representative < 0) {
                                    htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                    this.$emit('hoverchain', this.mentions[0][i].mentionID);
                                } else {
                                    htmlclass['cHoverReferent'] = this.classestomark.coref;
                                    this.$emit('hoverchain', this.mentions[0][i].representative);
                                }
                            }
                        }
                    }

                    //TODO: check for consistency

                        if (this.tokens[this.index - 1].semanticClass === this.tokens[this.index].semanticClass) {
                            htmlclass[this.token.semanticClass] = this.classestomark[this.token.semanticClass];
                        }


                } catch (err) {
                    console.log('Got out of the array' + err);
                }
                return htmlclass;
            },
            beginBrackets: function () {
                let resultingBrackets = '';
                let bracket = '[';
                let nested = false;
                if (this.classestomark.coref) {
                    for (let i = 0; i < this.mentions[0].length; i++) {
                        if (this.index === this.mentions[0][i].startIndex + 1) {
                            for (let j = 0; j < this.nestedmentions.fullyNested.length; j++) {
                                if (this.nestedmentions.fullyNested[j].inner === this.mentions[0][i].mentionID) {
                                    resultingBrackets = resultingBrackets + bracket;
                                    nested = true;
                                } else if (this.nestedmentions.fullyNested[j].outer === this.mentions[0][i].mentionID) {
                                    resultingBrackets = resultingBrackets + bracket;
                                    nested = true;
                                }
                            }
                            for (let j = 0; j < this.nestedmentions.nested.length; j++) {
                                if (this.nestedmentions.nested[j].second === this.mentions[0][i].mentionID) {
                                    resultingBrackets = resultingBrackets + bracket;
                                    nested = true;
                                } else if (this.nestedmentions.nested[j].first === this.mentions[0][i].mentionID) {
                                    resultingBrackets = resultingBrackets + bracket;
                                    nested = true;
                                }
                            }
                            if (!nested) {
                                resultingBrackets = resultingBrackets + bracket;
                                nested = false;
                            }
                        }
                    }
                }
                return resultingBrackets;
            },
            endBrackets: function () {
                let resultingBrackets = '';
                let bracket = ']';
                let nested = false;
                if (this.classestomark.coref) {
                    for (let i = 0; i < this.mentions[0].length; i++) {
                        if (this.index === this.mentions[0][i].endIndex) {
                            for (let j = 0; j < this.nestedmentions.fullyNested.length; j++) {
                                if (this.nestedmentions.fullyNested[j].inner === this.mentions[0][i].mentionID) {
                                    resultingBrackets = resultingBrackets + bracket;
                                    nested = true;
                                } else if (this.nestedmentions.fullyNested[j].outer === this.mentions[0][i].mentionID) {
                                    resultingBrackets = resultingBrackets + bracket;
                                    nested = true;
                                }
                            }
                            for (let j = 0; j < this.nestedmentions.nested.length; j++) {
                                if (this.nestedmentions.nested[j].second === this.mentions[0][i].mentionID) {
                                    resultingBrackets = resultingBrackets + bracket;
                                    nested = true;
                                } else if (this.nestedmentions.nested[j].first === this.mentions[0][i].mentionID) {
                                    resultingBrackets = resultingBrackets + bracket;
                                    nested = true;
                                }
                            }
                            if (!nested) {
                                resultingBrackets = resultingBrackets + bracket;
                                nested = false;
                            }
                        }
                    }
                }
                return resultingBrackets;
            },
            mentionBoundaries: function () {
                let color = ['red', 'blue', 'green', 'yellow', 'violet', 'lightPink', 'grey', 'orange', 'Chocolate'];
                let style = [];

                let nested = false;
                let shadowLeft = [];
                let shadowRight = [];
                for (let i = 0; i < this.mentions[0].length; i++) {
                    if (this.index === this.mentions[0][i].startIndex) {
                        for (let j = 0; j < this.nestedmentions.fullyNested.length; j++) {
                            if (this.nestedmentions.fullyNested[j].inner === this.mentions[0][i].mentionID) {
                                shadowLeft.push('0 0 0 1px black');
                                shadowLeft.push('0 0 0 1px white');
                                nested = true;
                            } else if (this.nestedmentions.fullyNested[j].outer === this.mentions[0][i].mentionID) {
                                shadowLeft.push('0 0 0 1px black');
                                nested = true;
                            }
                        }
                        for (let j = 0; j < this.nestedmentions.nested.length; j++) {
                            if (this.nestedmentions.nested[j].second === this.mentions[0][i].mentionID) {
                                shadowLeft.push('0 0 0 1px black');
                                nested = true;
                            } else if (this.nestedmentions.nested[j].first === this.mentions[0][i].mentionID) {
                                shadowLeft.push('0 0 0 1px black');
                                nested = true;
                            }
                        }
                        if (!nested) {
                            shadowLeft.push('0 0 0 1px black');
                            nested = false;
                        }
                    } else if (this.index === this.mentions[0][i].endIndex) {
                        for (let j = 0; j < this.nestedmentions.fullyNested.length; j++) {
                            if (this.nestedmentions.fullyNested[j].inner === this.mentions[0][i].mentionID) {
                                shadowRight.push('0 0 0 1px black');
                                shadowRight.push('0 0 0 1px white');
                                nested = true;
                            } else if (this.nestedmentions.fullyNested[j].outer === this.mentions[0][i].mentionID) {
                                shadowRight.push('0 0 0 1px black');
                                nested = true;
                            }
                        }
                        for (let j = 0; j < this.nestedmentions.nested.length; j++) {
                            if (this.nestedmentions.nested[j].second === this.mentions[0][i].mentionID) {
                                shadowRight.push('0 0 0 1px black');
                                nested = true;
                            } else if (this.nestedmentions.nested[j].first === this.mentions[0][i].mentionID) {
                                shadowRight.push('0 0 0 1px black');
                                nested = true;
                            }
                        }
                        if (!nested) {
                            shadowRight.push('0 0 0 1px black');
                            nested = false;
                        }
                    }
                }
                style.push({'border-bottom-left-radius': '2px'});
                style.push({'border-top-left-radius': '2px'});
                style.push({'border-bottom-right-radius': '2px'});
                style.push({'border-top-right-radius': '2px'});
                //console.log('Joined shadows'+shadowLeft.join(', '));
                style.push({'box-shadow': shadowLeft.join(', ')});
                style.push({'box-shadow': shadowRight.join(', ')});
                console.log('style for borders: ' + JSON.stringify(style));
                return style;

            },
            getWordGap: function () {
                //console.log('Debug: Index:' + this.index + ' Tokens: ' + JSON.stringify(this.tokens));
                //console.log('word1: ' + JSON.stringify(this.tokens[this.index - 1]));
                let token = this.tokens[this.index];
                let word1OffsetEnd = this.tokens[this.index - 1].offsetEnd;
                let whitespaceInfo = this.tokens[this.index - 1].whitespaceInfo;
                let word2OffsetBegin = -1;
                try {
                    word2OffsetBegin = this.tokens[this.index].offsetBegin;
                } catch (err) {
                    //console.log('offsetBegin is not defined');
                }
                //default Setting: 1 space * difference between Offsets
                let gap = '';
                if (word2OffsetBegin !== -1) {
                    if (whitespaceInfo === -10) {
                        //console.log('offsets: ' + word1OffsetEnd + ' ' + word2OffsetBegin);
                        for (let i = 0; i < word2OffsetBegin - word1OffsetEnd; i++) {
                            gap = gap + ' ';
                        }
                    }
                }
                return gap;
            }
        },
        methods: {

            checkIfNested: function () {
                for (let i = 0; i < this.nestedmentions.fullyNested.length; i++) {
                    for (let j = 0; j < this.mentions[0].length; j++) {
                        if (this.index === this.mentions[0][j].mentionID
                            && this.index === this.nestedmentions.fullyNested[i].inner) {
                            return true;
                        }
                    }
                }
                return false;

            },
            startSelection: function () {
                console.log('mouse pressed at: ' + this.index - 1);
                this.$emit('startselection', this.index - 1);
            },
            endSelection: function () {
                this.$emit('endselection', this.index);
            },
            stophover: function () {
                this.tohover = false;
                this.$emit('hoverchain', -1);
            }
        }
    }
</script>

<style scoped>

</style>