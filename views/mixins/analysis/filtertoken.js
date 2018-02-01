module.exports = {
    methods: {
        limitedfiltertokens: function (tokens, token) {
            let resultingtokens = [];
            let i = 0;
            let j = 0;
            if (token.textIndex - 20 > 0) {
                i = token.textIndex - 20;
            }
            if (token.textIndex + 20 < tokens.length) {
                j = token.textIndex + 20;
            } else {
                j = tokens.length;
            }
            for (i; i < j; i++) {
                if (tokens [i].semanticClass === token.semanticClass || tokens[i].pos === token.pos) {
                    resultingtokens.push(tokens [i]);
                }
            }
            return resultingtokens;
        },
        filtertokenwithclass: function (tokens, semanticClass) {
            let resultingtokens = [];
            for (let i = 0; i < tokens.length; i++) {
                if (tokens [i].semanticClass === semanticClass) {
                    if(resultingtokens.indexOf(tokens[i].content === -1)){
                    resultingtokens.push(tokens [i]);
                }
                }
            }
            return resultingtokens;
        }
    }
};