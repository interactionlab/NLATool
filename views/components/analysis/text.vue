<template>
    <span v-bind:name="tobejumped"
          v-on:mousedown="startSelection"
          v-on:mouseup="endSelection"
          v-on:mouseover="tohover = true"
          v-on:mouseout="stophover">
        <span class="nonPreAlt specialBracket" v-bind:class="toHighlight" v-if="token.coref !== undefined">{{beginBrackets}}</span><span
            class="nonPreAlt" v-bind:class="toHighlight" v-on:mouseover="hover">{{token.content}}</span><span
            class="nonPreAlt specialBracket" v-bind:class="toHighlight"
            v-if="token.coref !== undefined">{{endBrackets}}</span><span class="preAlt"
                                                                         v-bind:class="classToHighlightGap">{{getWordGap}}</span></span>
</template>
<script>
    export default {
        props: {
            token: {type: Object, default: null},
            nexttoken: {type: Object, default: null},
            index: {type: Number, default: -1},
            classestomark: {type: Object, default: null},
            selectedindexes: {type: Object, default: null},
            hoveredchain: {type: Number, default: -1},
            selectedchain: {type: Number, default: -1},
            wordtomarkonhoverdata: {
                type: Array, default: function () {
                    return []
                }
            },
        },
        data: function () {
            return {
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
                if (this.isEntityHovered === true) {
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
                            //console.log(this.token.coref.length);
                            for (let i = 0; i < this.token.coref.length; i++) {
                                if (this.token.coref[i].endIndex - 1 > this.token.textIndex) {
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
                    if (this.nexttoken !== null && this.nexttoken.semanticClass === this.token.semanticClass) {
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
                if (this.nexttoken === null) {
                    return '';
                }

                let word2OffsetEnd = -1;
                try {
                    word2OffsetEnd = this.token.EndOffSet;
                } catch (err) {
                }
                //default Setting: 1 space * difference between Offsets
                let gap = '';
                if (word2OffsetEnd !== -1) {
                    if (this.nexttoken.whitespaceInfo === -10) {
                        gap = Array(this.nexttoken.beginOffSet - word2OffsetEnd + 1).join(" ");
                    }
                }
                return gap;
            }
        },
        watch: {
            wordtomarkonhoverdata: function (event) {
                if (typeof event === 'undefined') {
                    console.log("WARNING: text vue event in wordtomarkonhover undefined");
                    return;
                }
                if (this.token.semanticClass === event.semanticClass) {
                    let index = event.wordids.indexOf(this.token.wordID)
                    if (index > -1) {
                        this.isEntityHovered = true;
                        if (index == 0 && event.hoverstarted === "research") {
                            this.$el.scrollIntoView();
                            let data = {hoverended: "text", offsetstart: this.$el.getBoundingClientRect()};
                            this.$emit('endhover', data);
                        }
                    } else if (this.isEntityHovered === true) {
                        this.isEntityHovered = false;
                    }
                } else {
                    if (this.isEntityHovered === true) {
                        this.isEntityHovered = false;
                    }
                }
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
                if (this.token.semanticClass === "O" || this.token.semanticClass === "NUMBER" || this.token.semanticClass === "DATE") {
                    return;
                }

                let hoverdata = {
                    hoverstarted: "text",
                    offsetstart: event.target.getBoundingClientRect(),
                    startword: this.token,
                    semanticClass: this.token.semanticClass,
                    startresearch: undefined,
                    wordtomarkonhover: []
                }
                this.$emit('starthover', hoverdata);
            }
        }
    }
</script>