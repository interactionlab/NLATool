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
                markermode: this.markermode
            }
        },
        mounted() {
            console.log('got here: ' + this.$refs.mark + JSON.stringify(this.tokens) + this.markermode);
            this.instance = new Mark(this.$refs.mark);
            this.instance.mark(this.filterPos(this.tokens, 'FM'));
        },


        watch: {
            markermode: function (value) {
                let toMark = this.filterPos(this.tokens, String(value));
                this.instance.unmark();
                this.instance.mark(toMark);
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
            }
        }
    }
</script>

