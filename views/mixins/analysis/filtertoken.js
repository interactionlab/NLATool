module.exports = {
    methods: {
        limitedfiltertokens: function (tokens, token, index) {
            let resultingtokens = [];
            let i = 0;
            let j = 0;
            if (index - 20 > 0) {
                i = index - 20;
            }
            if (index + 20 < tokens.length) {
                j = index + 20;
            } else {
                j = tokens.length;
            }
            for (i; i < j; i++) {
                if (tokens [i].semanticClass === token.semanticClass) {
                    resultingtokens.push(tokens [i]);
                }
            }
            return resultingtokens;
        },
        filtertokenwithclass: function (tokens, semanticClass) {
            let resultingtokens = [];
            for (let i = 0; i < tokens.length; i++) {
                if (tokens [i].semanticClass === semanticClass) {
                    resultingtokens.push(tokens [i]);
                }
            }
            return resultingtokens;
        }
    }
};