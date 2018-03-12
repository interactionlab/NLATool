<template>
    <div ref="mark" v-on:click="clickWord">
        <slot>No Text available!</slot>
    </div>
</template>

<script>

    export default {
        props: {
            tokens: { type: Array, default: function () { return [] }},
            markermode: { type: String, default: "" },
            lang: { type: String, default: "" }
        },
        data: function () {
            return {
                toMarkClass: {},
            }
        },
        mounted() {
            console.log('got here: ' + this.$refs.mark + JSON.stringify(this.tokens) + "current mode: " + this.markermode);
            this.instance = new Mark(this.$refs.mark);
            // this.instance.mark(this.filterPos(this.tokens, 'FM'));
            // this.instance.mark(this.filterClass(this.tokens, 'I-PER'));
        },
        watch: {
            markermode: function (value) {
                let classes = [value];

                //language selector
                if(this.lang == 'German') {
                    //unmark content when changing tabs
                    if (value != 'NE') {
                        this.instance.unmark();
                        console.log("unmark check");
                    }
                    //ALL view
                    if (value == 'NE') {
                        classes = ['I-PER', 'I-LOC', 'I-ORG', 'I-MISC'];
                        //correction view
                    } else if (value == 'POS') {
                        classes = ['FM', 'NE', 'NN','NNP','NNS','NNPS','CD'];
                    }
                }else if(this.lang == 'English'){
                    //unmark content when changing tabs
                    if (value != 'NE') {
                        this.instance.unmark();
                        console.log("unmark check");
                    }
                    //ALL view
                    if (value == 'NE') {
                        classes = ['PERSON', 'LOCATION', 'ORGANIZATION', 'MISC'];
                        //correction view
                    } else if (value == 'POS') {
                        classes = ['FM', 'NE', 'NN','NNP','NNS','NNPS','CD'];
                    }
                }

                for (let i = 0; i <= classes.length; i++) {
                    this.toMarkClass[classes[i]] = this.filterClass(this.tokens, String(classes[i]));
                    let fillToMarkClass = this.toMarkClass;
                    this.instance.mark(fillToMarkClass[classes[i]], {
                        each: function (element) {
                            const keyword = element.textContent;
                            for (let tag in fillToMarkClass) {
                                if (fillToMarkClass[tag].indexOf(keyword) !== -1) {
                                    element.className += ' ' + tag;
                                    console.log(keyword + ' now has className ' + element.className);
                                }
                            }
                        }
                    });
                }
            }
        },
        methods: {
            //TODO: create a combined filter function
            filterPos: function (tokens, pos) {
                let toMark = [];
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i].pos === pos) {
                        toMark.push(tokens[i].content);
                    }
                }
                return toMark;
            },
            filterClass: function (tokens, semClass) {
                let toMark = [];
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i].semanticClass === semClass) {
                        toMark.push(tokens[i].content);
                    }
                }
                //this.$emit('perEvent', [toMark]);
                return toMark;
            },
            clickWord: function () {
                let pos = window.getSelection().anchorOffset;
                let clickedword = {
                    word:'',
                    wordID:''
                };
                for(let i = 0; i < this.tokens.length; i++){
                    if(pos <= this.tokens[i].offsetEnd){
                        console.log('Word that was clicked: ' + this.tokens[i].content);
                        clickedword.word = this.tokens[i].content;
                        clickedword.wordID = this.tokens[i].wordID;
                        break;
                    }
                }
                this.$emit('clickedword', clickedword);
            },
        }
    }
</script>