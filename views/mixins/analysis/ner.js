module.exports = {
    methods: {
        filterPos: function (tokens, pos) {
            let toMark = [];
            for (let word in tokens) {
                if (tokens.pos = pos) {
                    toMark.push(tokens.word);
                }
            }
            return toMark;
        }
    }
};