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
            endOfMentions: Object,
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
                endOfMentions: this.endOfMentions,
                nested: false,
                mention: {},
                nextmention: false
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
                if (typeof this.mention.mentionID !== 'undefined') {
                    console.log('highlight: ' + this.index + ' mention:' + JSON.stringify(this.mention));
                    if (this.classestomark.coref) {
                        //console.log('Check Highlight 1: ' + Object.getOwnPropertyNames(this.mention).length)
                        //is hovered
                        if (!this.tohover) {
                            //is Representant
                            if (this.mention.representative < 0) {
                                if (this.mention.mentionID === this.hoveredchain) {
                                    htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                } else if (this.mention.mentionID === this.selectedchain) {
                                    htmlclass['cSelectedRepresentant'] = this.classestomark.coref;
                                }
                                else {
                                    htmlclass['cRepresentant'] = this.classestomark.coref;
                                }
                            } else {
                                if (this.mention.representative === this.hoveredchain) {
                                    htmlclass['cHoverReferent'] = this.classestomark.coref;
                                } else if (this.mention.representative === this.selectedchain) {
                                    htmlclass['cSelectedReferent'] = this.classestomark.coref;
                                }
                                else {
                                    htmlclass['cReferent'] = this.classestomark.coref;
                                }
                            }
                        } else {
                            //is Representant
                            if (this.mention.representative < 0) {
                                htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                this.$emit('hoverchain', this.mention.mentionID);
                            } else {
                                htmlclass['cHoverReferent'] = this.classestomark.coref;
                                this.$emit('hoverchain', this.mention.representative);
                            }

                            //is nested in more than one mention
                        }
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
                    if (typeof this.mention.mentionID !== 'undefined') {
                        if (this.classestomark.coref) {
                            if (this.nextmention) {
                                if (!this.tohover) {
                                    //is Representant
                                    if (this.mention.representative < 0) {
                                        if (this.mention.mentionID === this.hoveredchain) {
                                            htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                        } else if (this.mention.mentionID === this.selectedchain) {
                                            htmlclass['cSelectedRepresentant'] = this.classestomark.coref;
                                        } else {
                                            htmlclass['cRepresentant'] = this.classestomark.coref;
                                        }
                                    } else {
                                        if (this.mention.representative === this.hoveredchain) {
                                            htmlclass['cHoverReferent'] = this.classestomark.coref;
                                        } else if (this.mention.representative === this.selectedchain) {
                                            htmlclass['cSelectedReferent'] = this.classestomark.coref;
                                        } else {
                                            htmlclass['cReferent'] = this.classestomark.coref;
                                        }
                                    }
                                } else {
                                    //is Representant
                                    if (this.mention.representative < 0) {
                                        htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                                        this.$emit('hoverchain', this.mention.mentionID);
                                    } else {
                                        htmlclass['cHoverReferent'] = this.classestomark.coref;
                                        this.$emit('hoverchain', this.mention.representative);
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
            getWordGap: function () {
                //console.log('Debug: Index:' + this.index + ' Tokens: ' + JSON.stringify(this.tokens));
                //console.log('word1: ' + JSON.stringify(this.tokens[this.index - 1]));
                let token = this.tokens[this.index];
                let word1OffsetEnd = this.tokens[this.index - 1].offsetEnd;
                let whitespaceInfo = this.tokens[this.index - 1].whitespaceInfo;
                let word2OffsetBegin = -1;
                try {
                    word2OffsetBegin = token.offsetBegin;
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
        mounted() {
            this.getMentionInfo();
        },
        methods: {
            getMentionGap: function () {
                for (let i = 0; i < this.mentions[0].length; i++) {
                    //console.log('Checkpoint 2.0: ' + (this.index - 1) + ' >=? ' + this.mentions[0][i].startIndex);
                    //console.log('Checkpoint 2.1: ' + this.index + ' <=? ' + this.mentions[0][i].endIndex);
                    if ((this.index - 1) >= this.mentions[0][i].startIndex && (this.index) < this.mentions[0][i].endIndex) {
                        this.mention = this.mentions[0][i];
                        break;
                    }
                }
            },
            getMentionInfo: function () {
                //Corrent Complexity: O(n³) -> TODO: Reduce Complexity
                console.log('getMentionInfo');
                for (let i = 0; i < this.mentions[0].length; i++) {
                    console.log('getMentionInfo: index:' + this.index
                        + 'startIndex: ' + this.mentions[0][i].startIndex
                        + 'endIndex: ' + this.mentions[0][i].endIndex
                        + 'erfüllt: ' + ((this.index - 1) >= this.mentions[0][i].startIndex && (this.index) <= this.mentions[0][i].endIndex));
                    if ((this.index - 1) >= this.mentions[0][i].startIndex && (this.index) <= this.mentions[0][i].endIndex) {
                        this.mention = this.mentions[0][i];
                        console.log('getMentionInfo: this Mention got set: ' + JSON.stringify(this.mention));
                        try {
                            if (this.mentions[0][i].endIndex - this.index > 0) {
                                console.log('has next Mention');
                                this.nextmention = true;
                            }
                        } catch (err) {
                        }
                        break;
                    }
                }
            },
            startSelection: function () {
                //console.log('mouse pressed at: ' + this.index - 1);
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