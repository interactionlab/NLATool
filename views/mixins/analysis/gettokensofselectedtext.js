module.exports = {
    methods: {
        gettokensofselectedtext: function (alltokens, indexes) {
            let resultingTokens = [];
            //console.log('start: ' + indexes.start + ' end: '+ indexes.end);
            if (indexes.start !== -1 && indexes.end !== -1) {
                for (let i = indexes.start; i <= indexes.end; i++) {
                    resultingTokens.push(alltokens[i]);
                }
            }
            //console.log(JSON.stringify(resultingTokens));
            return resultingTokens;
        },
        generateText: function (tokens) {
            let text = '';
            for (let i = 0; i < tokens.length; i++) {
                text += tokens[i].content + tokens[i].afterspace;
            }
            return text;
        },
        generateTextForSeach: function (tokens) {
            let text = '';
            for (let i = 0; i < tokens.length; i++) {
                text += tokens[i].content;
                if (i < tokens.length - 1) {
                    text += ' '
                }
            }
            return text;
        },
    }
};