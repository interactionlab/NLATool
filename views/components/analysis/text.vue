<template>
    <span v-bind:name="tobejumped"
          v-on:mousedown="startSelection"
          v-on:mouseup="endSelection">
        <span class="nonPreAlt"
              v-bind:class="toHighlight">{{token.content}}</span
        ><span class="preAlt"
               v-bind:class="toHighlight">{{getWordGap}}</span>
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
            selectedindexes: Object
        },
        data: function () {
            return {
                token: this.token,
                tokens: this.tokens,
                mentions:this.mentions,
                index: this.index,
                classestomark: this.classestomark,
                selectedindexes: this.selectedindexes,
                htmlclass: {}
            }
        },
        computed: {
            tobejumped:function () {
                if(this.index === this.selectedindexes.start){
                    return this.index;
                }
            },
            toHighlight: function () {
                let htmlclass = {};
                //TODO: scrollTo selectedText if not in scope
                if (this.index > this.selectedindexes.start
                    && this.index <= this.selectedindexes.end) {
                    htmlclass['notemark'] = true;
                } else {
                    htmlclass['notemark'] = false;
                }
                //console.log('Checkpoint 1: ' + JSON.stringify(this.mentions));
                for(let i = 0; i < this.mentions.length; i++){
                    //console.log('Checkpoint 2: '+ this.index + ' ==? '+this.mentions[i][0].textIndex );
                    if(this.index-1 === this.mentions[i][0].textIndex){
                        //console.log('Checkpoint 2: '+ this.classestomark.coref);
                        htmlclass['coref'] = this.classestomark.coref;
                    }
                }
                htmlclass[this.token.semanticClass] = this.classestomark[this.token.semanticClass];
                htmlclass[this.token.pos] = this.classestomark[this.token.pos];
                return htmlclass
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
            startSelection: function () {
                console.log('mouse pressed at: ' + this.index - 1);
                this.$emit('startselection', this.index - 1);
            },
            endSelection: function () {
                this.$emit('endselection', this.index);
            },
            markNoteWord: function () {
                if (this.index >= this.selectedtextindexes.start
                    && this.index <= this.selectedtextindexes.end) {
                    this.htmlclass['notemark'] = true;
                } else {
                    this.htmlclass['notemark'] = false;
                }
            },
        }
    }
</script>

<style scoped>

</style>