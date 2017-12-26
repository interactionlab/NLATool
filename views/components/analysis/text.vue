<template>
    <span>
        <span class="nonPreAlt"
              v-bind:class="vueSemanticClass"
              v-on:click="setClickedWord">{{token.content}}</span
        ><span class="preAlt">{{getWordGap}}</span>
    </span>
</template>


<script>
    export default {
        props: {
            token: Object,
            tokens: Array,
            index: Number,
            classestomark: Object
        },
        data: function () {
            return {
                token: this.token,
                tokens: this.tokens,
                index: this.index,
                classestomark: this.classestomark
            }
        },
        computed: {
            vueSemanticClass: function () {
                //console.log('Debug token: ' + JSON.stringify(this.token));
                let htmlclass = {};
                htmlclass[this.token.semanticClass] = this.classestomark[this.token.semanticClass];
                htmlclass[this.token.pos] = this.classestomark[this.token.pos];
                return htmlclass;
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
        methods:{
            setClickedWord:function(){
                this.$emit('clickword', this.token);
            }
        }
    }
</script>

<style scoped>

</style>