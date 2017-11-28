<template>
    <div ref="mark">
        <slot>No Text available!</slot>
    </div>
</template>

<script>
    //import Mark from 'mark.js';

    export default {
        //name: 'mark-js',

        props: [
            'tokens'
        ],
        data: function () {
            return {
                tokens: this.tokens,
            }
        },
        mounted() {
            console.log('got here: '+ this.$refs.mark + JSON.stringify(this.tokens));
            this.instance = new Mark(this.$refs.mark);
            this.instance.mark(this.filterPos(this.tokens, 'FM'));
        },


        watch: {
            mark(value) {
                console.log('Parameter watched: '+value);
                let toMark = this.filterPos(this.tokens, value);
                this.instance.unmark();
                this.instance.mark(toMark);
            }
        },
        methods: {
            filterPos: function (tokens, pos) {
                let toMark = [];
                console.log('Parameters: '+JSON.stringify(tokens) + pos);
                for (let i = 0; i < tokens.length; i++) {
                    if (tokens[i].pos === pos) {
                        console.log('pushing a word to Mark: ' + pos);
                        toMark.push(tokens[i].content);
                    }
                }
                console.log('Tokens to mark: '+toMark);
                return toMark;
            }
        }

    }
</script>

