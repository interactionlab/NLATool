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
                if ((tokens [i].semanticClass === token.semanticClass
                        || tokens[i].pos === token.pos)
                    && tokens[i].offsetBegin !== token.offsetBegin) {
                    resultingtokens.push(tokens [i]);
                }
            }
            return resultingtokens;
        },
        filtertokenwithclass: function (tokens, semanticClass) {
            let resultingtokens = [];
            for (let i = 0; i < tokens.length; i++) {
                if (tokens [i].semanticClass === semanticClass) {
                    // TODO: String match doesn't work
                    if (resultingtokens.indexOf(tokens[i].content === -1)) {
                        //merging entities of same classes e.g. first + last name
                        if (tokens[i - 1].semanticClass === tokens[i].semanticClass) {
                            resultingtokens[resultingtokens.length - 1] = tokens[i - 1].content + " " + tokens[i].content;
                        } else {
                            resultingtokens.push(tokens[i]);
                        }
                    }
                }
            }
            return resultingtokens;
        }
    }
};