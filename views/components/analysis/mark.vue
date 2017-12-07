<template>
    <div ref="mark">
        <slot>No Text available!</slot>
    </div>
</template>

<script>
    export default {
        props: {
            tokens: Object,
            markermode: String
        },
        data: function () {
            return {
                tokens: this.tokens,
                markermode: this.markermode,
                toMarkClass: {
                }
            }
        },
        mounted() {
            console.log('got here: ' + this.$refs.mark + JSON.stringify(this.tokens) + this.markermode);
            this.instance = new Mark(this.$refs.mark);
            // this.instance.mark(this.filterPos(this.tokens, 'FM'));
            // this.instance.mark(this.filterClass(this.tokens, 'I-PER'));
        },


        watch: {
            markermode: function (value) {
                //this.toMark[value] = this.filterClass(this.tokens, String(value));
                //this.toMark[value] = this.filterPos(this.tokens, String(value));
                console.log('VAlue'+ value);
                console.log('ToMark'+ JSON.stringify(this.toMarkClass));
                this.toMarkClass[value] = this.filterClass(this.tokens, String(value));
                console.log('ToMark2'+ JSON.stringify(this.toMarkClass));
                this.instance.unmark();
                //this.instance.mark(toMarkClass);

                this.instance.mark(this.toMarkClass[value], {
                    each: function (element) {
                        const keyword = element.textContent;
                        console.log(typeof keyword + " Type");
                        console.log(keyword);
                        for (let tag in this.toMarkClass) {
                            if (this.toMarkClass[tag].indexOf(keyword) !== -1) {
                                element.className += ' ' + tag;
                            }
                        }
                    }
                });
            }
        },
        methods: {
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
            //TODO: create a single filter function

        }
    }
</script>

