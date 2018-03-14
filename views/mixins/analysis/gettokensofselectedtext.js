module.exports = {
    methods: {
        hello: function (name) {
            for (let i = 0; i < name.name; i++) {
                //console.log('Hello' + name.name);
            }
            return name;
        },
        gettokensofselectedtext: function (alltokens, indexes) {
            let resultingTokens = [];
            //console.log('start: ' + indexes.start + ' end: '+ indexes.end);
            for (let i = indexes.start; i < indexes.end; i++) {
                resultingTokens.push(alltokens[i]);
            }
            //console.log(JSON.stringify(resultingTokens));
            return resultingTokens;
        },
        generateText: function (tokens) {
            let text = '';
            let gap = '';
            for (let i = 1; i <= tokens.length; i++) {
                text = text + tokens[i - 1].content;
                gap = this.getWordGap(tokens, i);
                text = text + gap;
            }
            //console.log(text);
            return text;
        },
        getWordGap: function (tokens, index) {
            //console.log('Debug: Index:' + this.index + ' Tokens: ' + JSON.stringify(this.tokens));
            //console.log('word1: ' + JSON.stringify(this.tokens[this.index - 1]));
            let token = tokens[index];
            let word1OffsetEnd = tokens[index - 1].EndOffSet;
            let whitespaceInfo = tokens[index - 1].whitespaceInfo;
            let word2OffsetBegin = -1;
            try {
                word2OffsetBegin = tokens[index].beginOffSet;
            } catch (err) {
                //console.log('offsetBegin is not defined');
            }
            //default Setting: 1 space * difference between Offsets
            let gap = '';
            if (word2OffsetBegin !== -1) {
                if (whitespaceInfo === -10) {
                    for (let i = 0; i < word2OffsetBegin - word1OffsetEnd; i++) {
                        gap = gap + ' ';
                    }
                }
            }
            return gap;
        }
    }
};