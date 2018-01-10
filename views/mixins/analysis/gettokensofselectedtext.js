module.exports = {
    methods: {
        gettokensofselectedtext: function (alltokens, indexes) {
            let resultingTokens = []
            for(let i = indexes.start; i < indexes.end; i++ ){
                resultingTokens.push(alltokens[i]);
            }
        }
    }
};