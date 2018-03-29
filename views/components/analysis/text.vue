<template>
    <span v-on:mousedown="startSelection"
          v-on:mouseup="endSelection"
          v-on:mouseover="hover"
          v-on:mouseout="stophover"><span
            class="nonPreAlt specialBracket"
            v-bind:class="toHighlight"
            v-if="classestomark.coref">{{bracketleft}}</span><span
            class="nonPreAlt"
            v-bind:class="toHighlight">{{token.content}}</span><span
            class="nonPreAlt specialBracket"
            v-bind:class="toHighlight"
            v-if="classestomark.coref">{{bracketright}}</span><span
            class="preAlt"
            v-bind:class="classToHighlightGap">{{getWordGap2}}</span></span>
</template>
<script>
    export default {
        props: {
            token: {type: Object, default: null},
            index: {type: Number, default: -1},
            classestomark: {type: Object, default: null},
            hoveredchain: {type: Number, default: -1},
            selectedchain: {type: Number, default: -1},
        },
        data: function () {
            return {
                htmlclass: {},
                tohover: false,
                isEntityHovered: false,
                selected: false,
                selectedgap: false,
                entityhover: false,
                entityhovergap: false,
                partofhoveredchain: false,
                partofselectedchain: false,
                partofChain: false,
                representative: false,
                bracketleft: '',
                bracketright: '',
            }
        },
        computed: {
            toHighlight: function () {
                let htmlclass = {};
                if (this.classestomark.coref) {
                    if (this.partofChain) {
                        htmlclass['cReferent'] = this.classestomark.coref;
                        if (this.representative === true) {
                            htmlclass['cReferent'] = false;
                            htmlclass['cRepresentant'] = this.classestomark.coref;
                        }
                    }
                    if (this.partofhoveredchain) {
                        if (this.representative) {
                            htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                        } else {
                            htmlclass['cHoverReferent'] = this.classestomark.coref;
                        }
                    }
                    if (this.partofselectedchain) {
                        if (this.representative) {
                            htmlclass['cSelectedRepresentant'] = this.classestomark.coref;
                        } else {
                            htmlclass['cSelectedReferent'] = this.classestomark.coref;
                        }
                    }
                }
                htmlclass[this.token.semanticClass] = this.classestomark[this.token.semanticClass];
                //TODO: Highlighting for 'OTHER'
                htmlclass[this.token.semanticClass + "_strong"] = this.entityhover;
                htmlclass['notemark'] = this.selected;
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
                    htmlclass['notemark'] = this.selectedgap;
                    if (this.classestomark.coref) {
                        if (this.partofChain) {
                            htmlclass['cReferent'] = this.classestomark.coref;
                            if (this.representative === true) {
                                htmlclass['cReferent'] = false;
                                htmlclass['cRepresentant'] = this.classestomark.coref;
                            }
                        }
                        if (this.partofhoveredchain) {
                            if (this.representative) {
                                htmlclass['cHoverRepresentant'] = this.classestomark.coref;
                            } else {
                                htmlclass['cHoverReferent'] = this.classestomark.coref;
                            }
                        }
                        if (this.partofselectedchain) {
                            if (this.representative) {
                                htmlclass['cSelectedRepresentant'] = this.classestomark.coref;
                            } else {
                                htmlclass['cSelectedReferent'] = this.classestomark.coref;
                            }
                        }
                    }
                    htmlclass[this.token.semanticClass] = this.classestomark[this.token.semanticClass];
                    htmlclass[this.token.semanticClass + "_strong"] = this.entityhovergap;
                } catch (err) {
                    //console.log('Got out of the array' + err);
                }
                return htmlclass;
            },
            getWordGap2: function () {
                if (this.token.whitespaceInfo > 0) {
                    return new Array(this.token.whitespaceInfo + 1).join(' ');
                } else if (this.token.whitespaceInfo === 0) {
                    return '';
                } else if (this.token.whitespaceInfo === -10) {
                    return ' ';
                } else {
                    return '<br>';
                }

            },

        },
        watch: {},
        methods: {
            addBracketLeft: function () {
                this.bracketleft += '[';
            },
            addBracketRight: function () {
                this.bracketright += ']';
            },
            changeProperty: function (prop, value) {
                //console.log('Changing property in: ' + this.index + ': ' + prop + ' to: ' + value);
                this[prop] = value;
            },
            startSelection: function () {
                console.log('index selecting is:' + (this.token.textIndex-1));
                this.$emit('startselection', this.token.textIndex-1);
            },
            endSelection: function (event) {
                let offsets = event.target.getBoundingClientRect();
                this.$emit('setoffsetstart', [offsets, this.token, "text"]);
                this.$emit('endselection', this.token.textIndex);
            },
            stophover: function () {
                this.tohover = false;
                this.$emit('hoverchain', -1);
            },
            hover: function (event) {
                this.tohover = true;
                if (this.classestomark.coref) {
                    //console.log('hovering: ' +this.token.textIndex + ' which is part of Chain?:' + this.partofChain);
                    if (this.partofChain) {
                        this.$emit('hoverchain', this.token.textIndex);
                    }
                }
                console.log('hovered Token:' + JSON.stringify(this.token));
                if (this.token.semanticClass === "O" || this.token.semanticClass === "NUMBER" || this.token.semanticClass === "DATE") {
                    return;
                }
                if (this.classestomark[this.token.semanticClass] === true) {
                    let hoverdata = {
                        hoverstarted: "text",
                        offsetstart: event.target.getBoundingClientRect(),
                        startword: this.token,
                        semanticClass: this.token.semanticClass,
                        startresearch: undefined,
                        wordtomarkonhover: []
                    };
                    this.$emit('starthover', hoverdata);
                }
            }
        }
    }
</script>