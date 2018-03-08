<template>
    <span v-bind:name="tobejumped"
          v-on:mousedown="startSelection"
          v-on:mouseup="endSelection"
          v-on:mouseover="tohover = true"
          v-on:mouseout="stophover">
        <span class="nonPreAlt specialBracket" v-bind:class="toHighlight">{{beginBrackets}}</span><span
            class="nonPreAlt" v-bind:class="toHighlight" v-on:mouseover="hover">{{token.content}}</span><span
            class="nonPreAlt specialBracket" v-bind:class="toHighlight">{{endBrackets}}</span><span class="preAlt "
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
                mention: [],
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
                if (typeof this.token.coref !== 'undefined') {
                    //console.log('highlight: ' + this.index + ' mention:' + JSON.stringify(this.mention));
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
                    if (typeof this.token.coref !== 'undefined') {
                        if (this.classestomark.coref) {
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
            }
            ,
            getWordGap: function () {
                //console.log('Debug: Index:' + this.index + ' Tokens: ' + JSON.stringify(this.tokens));
                //console.log('word1: ' + JSON.stringify(this.tokens[this.index - 1]));
                //console.log('word2: ' + JSON.stringify(this.tokens[this.index]));
                let token = this.tokens[this.index];
                let word1OffsetEnd = this.tokens[this.index - 1].EndOffSet;
                let whitespaceInfo = this.tokens[this.index - 1].whitespaceInfo;
                let word2OffsetBegin = -1;
                try {
                    word2OffsetBegin = token.beginOffSet;
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
            //this.getMentionInfo();
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
            }
            ,
            getMentionInfo: function () {
                //Corrent Complexity: O(n³) -> TODO: Reduce Complexity
                //console.log('getMentionInfo');
                for (let i = 0; i < this.mentions[0].length; i++) {
                    // console.log('getMentionInfo: index:' + this.index
                    //     + 'startIndex: ' + this.mentions[0][i].startIndex
                    //     + 'endIndex: ' + this.mentions[0][i].endIndex
                    //    + 'erfüllt: ' + ((this.index - 1) >= this.mentions[0][i].startIndex && (this.index) <= this.mentions[0][i].endIndex));
                    if ((this.index - 1) >= this.mentions[0][i].startIndex && (this.index) <= this.mentions[0][i].endIndex) {
                        this.mention.push(this.mentions[0][i]);
                        //console.log('getMentionInfo: this Mention got set: index: ' + this.index + ' : ' + JSON.stringify(this.mention));
                        try {
                            if (this.mentions[0][i].endIndex - this.index > 0) {
                                //console.log('has next Mention');
                                this.nextmention = true;
                            }
                        } catch (err) {
                        }
                    }
                }
            }
            ,
            startSelection: function () {
                this.$emit('startselection', this.index - 1);
            }
            ,
            endSelection: function () {
                this.$emit('endselection', this.index);
            }
            ,
            stophover: function () {
                this.tohover = false;
                this.$emit('hoverchain', -1);
            }
            ,

            hover: function (event) {
                //console.log("Word id: " + this.index);
                if (this.token.semanticClass == "O") {
                    return;
                }
                //var mentionid = this.mention[0].mentionID;

                console.log();

                var offsets = event.target.getBoundingClientRect();
                if (this.token.content != "" && this.token.content != " " && this.token.content != "]" && this.token.content != "[") {
                    this.$emit('hoverlinesetoffsetstart', [offsets, [this.token.content, this.token.semanticClass]]);
                }
            }
        }
    }
</script>

<style scoped>

</style>