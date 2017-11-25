module.exports = {
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
};