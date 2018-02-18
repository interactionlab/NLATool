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

        onlyUnique: function (value,index,self) {
          return self.indexOf(value) === index;
        },

        filtertokenwithclass: function (tokens, semanticClass) {
            let resultingtokens = [];
            for (let i = 0; i < tokens.length; i++) {
                if (tokens [i].semanticClass === semanticClass) {
                    let content = tokens[i].content;
                    //merging entities of same classes e.g. first + last name
                    if (i >= 1) {
                        if (tokens[i - 1].semanticClass === tokens[i].semanticClass) {
                            resultingtokens[resultingtokens.length - 1] = resultingtokens[resultingtokens.length - 1] + " " + content;
                        } else {
                            resultingtokens.push(content);
                        }
                    } else {
                        resultingtokens.push(content);
                    }
                }
            }
            //Uniq array
            return resultingtokens.filter((v,i,a) => a.indexOf(v) === i);
        }
    }
};