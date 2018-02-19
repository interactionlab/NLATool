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

        uniqCount: function (arr){

                let a = [], b = [], prev;

                arr.sort();
                for ( let i = 0; i < arr.length; i++ ) {
                    if ( arr[i] !== prev ) {
                        a.push(arr[i]);
                        b.push(1);
                    } else {
                        b[b.length-1]++;
                    }
                    prev = arr[i];
                }

                for(let j = 0; j < a.length; j++ ){
                    a[j] = a[j] + " (" + b[j] + "x)";
                }

                return a;
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
            //return resultingtokens.filter((v,i,a) => a.indexOf(v) === i);
            return this.uniqCount(resultingtokens);
        }
    }
};