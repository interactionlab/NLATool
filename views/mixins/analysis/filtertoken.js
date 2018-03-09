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
        uniqCount: function (arr) {
            let entity = [], frequency = [], prev;

            arr.sort();

            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== prev) {
                    entity.push(arr[i]);
                    frequency.push(1);
                } else {
                    frequency[frequency.length - 1]++;
                }
                prev = arr[i];
            }
            for (let j = 0; j < entity.length; j++) {
                entity[j] = {name: entity[j], freq: frequency[j]};
            }

            entity.sort(function (a, b) {
                return ((a.freq > b.freq) ? -1 : ((a.freq === b.freq) ? 0 : 1));
            });

            return entity;
        },
        filtertokenwithclass: function (tokens, semanticClass) {
            let resultingtokens = [];
            let filteredTokens = [];
            let fullTokens = [];
            let tokenChain = [];
            let content = '';
            let flag = false;
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].semanticClass === semanticClass) {
                    //merging entities of same classes e.g. first + last name
                    filteredTokens.push(tokens[i]);
                }
            }
            for (let i = 1; i < filteredTokens.length; i++) {
                for (let j = 0; j < fullTokens.length; j++) {
                    if (filteredTokens[i].textIndex - 1 === fullTokens[j][fullTokens[j].length - 1].textIndex) {
                        fullTokens[j].push(filteredTokens[i]);
                        flag = true;
                    }
                }
                if (!flag && filteredTokens[i].textIndex - 1 === filteredTokens[i - 1].textIndex) {
                    tokenChain = [];
                    tokenChain.push(filteredTokens[i - 1]);
                    tokenChain.push(filteredTokens[i]);
                    fullTokens.push(tokenChain);
                } else{
                    fullTokens.push([filteredTokens[i]]);
                }
                flag = false;

            }
            return fullTokens;
        }
    }
};