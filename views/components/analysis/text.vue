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
            columnindex: {type: Number, default: -1},
            classestomark: {type: Object, default: null},
            selectedtextindexes: {type: Object, default: null}
        },
        data: function () {
            return {
                selected: false,
                selectedgap: false,
                entityhover: false,
                entityhovergap: false,
                iscoref: false,
                iscorefgrap: false,
                isrepresentative: false,
                corefhover: false,
                corefhovergap: false,
                bracketleft: '',
                bracketright: '',
                semanticClassSimplified: '',
            }
        },
        computed: {
            toHighlight: function () {
                let htmlclass = {};                
                if(this.iscoref) {
                    if (this.isrepresentative){
                        htmlclass['cRepresentant'] = this.classestomark.coref;
                    } else {
                        htmlclass['cReferent'] = this.classestomark.coref;
                    }
                }
                
                if (this.selected){
                    htmlclass['notemark'] = this.selected;
                } else if (this.corefhover){
                    htmlclass['cHoverReferent'] = this.classestomark.coref;
                } else if (this.entityhover && this.classestomark[this.semanticClassSimplified]){
                    htmlclass[this.semanticClassSimplified + "_strong"] = this.entityhover;
                } else {
                    htmlclass[this.semanticClassSimplified] = this.classestomark[this.semanticClassSimplified];
                }
                
                /*let posSet = ['NN', 'NE', 'NNP', 'NNS', 'NNPS', 'CD'];
                if (posSet.indexOf(this.token.pos) > -1 && this.token.semanticClass === 'O') {
                    htmlclass['POS'] = this.classestomark['POS'];
                } else {
                }*/
                return htmlclass
                
            },
            classToHighlightGap: function () {
                let htmlclass = {};
                if(this.iscoref) {
                    if (this.isrepresentative && this.iscorefgrap){
                        htmlclass['cRepresentant'] = this.classestomark.coref;
                    } /*else { // NOT NEEDED TO MAKE THE DASHED LINE MORE DESHED LIKE
                        htmlclass['cReferent'] = this.classestomark.coref;
                    }*/
                }
                
                if (this.selectedgap){
                    htmlclass['notemark'] = this.selectedgap;
                } else if (this.corefhovergap){
                    htmlclass['cHoverReferent'] = this.classestomark.coref;
                } else if (this.entityhovergap) {
                    htmlclass[this.semanticClassSimplified + "_strong"] = this.entityhovergap;
                } else if (this.token.needgap) {
                    htmlclass[this.semanticClassSimplified] = this.classestomark[this.semanticClassSimplified];
                }
                
                return htmlclass;
            }
            ,
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

            }
        },
        mounted: function(){
            this.simplifySemanticClass();
        },
        watch: {
            token: function(){
                this.simplifySemanticClass();    
            }
        },
        methods: {
            simplifySemanticClass: function(){
                if (this.token.semanticClass === 'PERSON'
                        || this.token.semanticClass === 'ORGANIZATION'
                        || this.token.semanticClass === 'LOCATION'
                        || this.token.semanticClass === 'MISC'
                        || this.token.semanticClass === 'O'){
                    this.semanticClassSimplified = this.token.semanticClass;
                } else {
                    this.semanticClassSimplified = 'OTHER';
                }
            },
            addBracketLeft: function () {
                this.bracketleft += '[';
            },
            addBracketRight: function () {
                this.bracketright += ']';
            },
            changeProperty: function (prop, value) {
                this[prop] = value;
            },
            startSelection: function () {
                this.$emit('startselection', this.token.textIndex);
            },
            endSelection: function (event) {
                let offsets = event.target.getBoundingClientRect();
                this.$emit('endselection', this.token.textIndex);
            },
            stophover: function () {
                this.$emit('hoverchain', -1);
            },
            hover: function (event) {
                if (this.selectedtextindexes.start != -1 && this.selectedtextindexes.done == false){
                    this.$emit('hoverduringselection', this.token.textIndex);
                }
            
                if (this.classestomark.coref) {
                    if (this.iscoref) {
                        this.$emit('hoverchain', this.token.textIndex);
                    }
                }
                if (this.semanticClassSimplified === "O") {
                    return;
                }
                if (this.classestomark[this.semanticClassSimplified] === true) {
                    let hoverdata = {
                        hoverstarted: "text",
                        offsetstart: this.$el.getBoundingClientRect(),
                        startword: this.token,
                        semanticClass: this.semanticClassSimplified,
                        startresearch: undefined,
                        wordtomarkonhover: [],
                        columnindex: this.columnindex
                    };
                    this.$emit('starthover', hoverdata);
                }
            }
        }
    }
</script>