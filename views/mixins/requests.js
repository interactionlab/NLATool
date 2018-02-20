module.exports = {
    data: function() {
        return{
            searchGoogleResults: []
        }
    },
    methods: {
        searchGoogle: function (querys, limit) {
            if (limit < 1) {
                return null;
            }
            let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
            this.searchGoogleResults = [];
            for (let i = 0; i < querys; i++) {
                let params = {
                    'query': querys[i],
                    'limit': limit,
                    'indent': true,
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };
                $.getJSON(service_url + '?callback=?', params, (response) => {
                }).done((response) => {
                    if (limit > 1) {
                        this.searchGoogleResults.push(this.rerankWithKeywords(response));
                    } else {
                        //console.log('Response for Research: ' + JSON.stringify(response));
                        this.searchGoogleResults.push(response);
                    }
                });
            }
        },
        rerankWithKeywords: function (response) {
            let tempresults = [];
            let numberOfMatches = [];
            let researchresults = [];
            console.log('Checkpoint 1' + JSON.stringify(response.itemListElement));
            for (let i = 0; i < response.itemListElement.length; i++) {
                numberOfMatches.push(0);
                for (let j = 0; j < this.keywords.length; j++) {
                    try {
                        if (response.itemListElement[i].result.detailedDescription.articleBody.indexOf(this.keywords[j].content) > -1) {
                            numberOfMatches[i] = numberOfMatches[i] + 1;
                        }
                    } catch (err) {
                        console.log('Detailed Description: ' + err + i)
                    }
                }
                tempresults.push({
                    result: response.itemListElement[i],
                    matches: numberOfMatches[i]
                });
            }
            console.log('tempresults to sort Alpha: ' + JSON.stringify(tempresults));
            console.log('NumberOfMatches to sort Alpha: ' + numberOfMatches);
            numberOfMatches = this.insertionSort(numberOfMatches);
            numberOfMatches.reverse();
            console.log('NumberOfMatches to sort after Alpha: ' + numberOfMatches);
            for (let i = 0; i < numberOfMatches.length; i++) {
                for (let j = 0; j < tempresults.length; j++) {
                    if (numberOfMatches[i] === tempresults[j].matches) {
                        researchresults.push(tempresults[j].result);
                    }
                }
            }
            console.log('Sorted Results Alpha: ' + JSON.stringify(this.researchresults) + this.researchresults.length);
            return researchresults;
        },
        insertionSort: function (items) {
            for (let i = 0; i < items.length; i++) {
                let value = items[i];
                for (var j = i - 1; j > -1 && items[j] > value; j--) {
                    items[j + 1] = items[j];
                }
                items[j + 1] = value;
            }
            return items;
        },
    }
};