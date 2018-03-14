<template>
    <div>
        <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col contentColor">
            <!-- shows the clicked word -->
            <input v-on:keydown.enter="searchGoogle(selectedtext,researchlimit)"
                   v-model="selectedtext"
                   class="mdl-textfield__input"/>
        </div>
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-cell mdl-cell--12-col" id="resultfield">
                    <component is="researchresult"
                               ref="personresults"
                               v-for="(researchresult,index) in researchresults"
                               v-bind:serverip="serverip"
                               v-bind:researchdata="researchresult"
                               v-bind:key="index"
                               v-bind:index="index"
                               v-bind:mapkey="index"
                               v-bind:docid="docid"
                               v-bind:showallon="true"
                               v-bind:semclass="'PERSON'"
                               v-bind:contentcontrol="contentcontrol.PERSONS"
                               v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                               v-on:starthover="starthover($event)"
                               v-on:saveresult="saveResult($event)"
                               v-on:editresearch="editresearch($event)">
                    </component>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import researchresult from './components/analysis/researchresult.vue';
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';
    import filtertoken from './mixins/analysis/filtertoken.js';

    export default {

        mixins: [getselectedtext, filtertoken],
        props: {
            serverip: { type: String, default: "" },
            selectedindexes: {type: Object, default: null},
            researchdatatoedit:{type: Object, default: null},
            contentcontrol: {type: Object, default: null},
            tokens: {
                type: Array, default: function () {
                    return []
                }
            },
            docid: {type: Number, default: -1},
            selectedchain: {type: Number, default: -1},
        },
        data: function () {
            return {
                researchresults: [''],
                selectedtext: '',
                resultselected: false,
                selectedresult: {},
                selectedindex: -1,
                keywords: this.keywords,
                mapcoordinates: [],
                sourceQuery: '',
                researchlimit: 10,
            }
        },
        methods: {
            rerankWithKeywords: function (response) {
                let tempresults = [];
                let numberOfMatches = [];
                //console.log('Checkpoint 1' + JSON.stringify(response.itemListElement));
                for (let i = 0; i < response.itemListElement.length; i++) {
                    numberOfMatches.push(0);
                    for (let j = 0; j < this.keywords.length; j++) {
                        try {
                            if (response.itemListElement[i].result.detailedDescription.articleBody.indexOf(this.keywords[j].content) > -1) {
                                numberOfMatches[i] = numberOfMatches[i] + 1;
                            }
                        } catch (err) {
                            console.log('ERROR: research vue Detailed Description: ' + err + i)
                        }
                    }
                    tempresults.push({
                        result: response.itemListElement[i],
                        matches: numberOfMatches[i]
                    });
                }
                //console.log('tempresults to sort Alpha: ' + JSON.stringify(tempresults));
                //console.log('NumberOfMatches to sort Alpha: ' + numberOfMatches);
                numberOfMatches = this.insertionSort(numberOfMatches);
                numberOfMatches.reverse();
                //console.log('NumberOfMatches to sort after Alpha: ' + numberOfMatches);
                for (let i = 0; i < numberOfMatches.length; i++) {
                    for (let j = 0; j < tempresults.length; j++) {
                        if (numberOfMatches[i] === tempresults[j].matches) {
                            this.researchresults.push(tempresults[j].result);
                        }
                    }
                }
                //console.log('Sorted Results Alpha: ' + JSON.stringify(this.researchresults) + this.researchresults.length);
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
            switchresearchselected: function () {
                //console.log('Show the Selection: ' + this.resultselected)
                this.resultselected = !this.resultselected
            },
            searchGoogle: function (query, limit,sourcequery) {

                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let params = {
                    'query': query,
                    'limit': limit,
                    'indent': true,
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };
                $.getJSON(service_url + '?callback=?', params, (response) => {
                }).done((response) => {
                    //console.log('Response for Research: ' + JSON.stringify(response));
                    //this.rerankWithKeywords(response);
                    //this.getMapCoordinates();
                    this.researchresults = response.itemListElement;
                    let data = response.itemListElement;
                    let found = false;
                    /*
                    for (let i = 0; i < this[semClass].length; i++) {
                        if (this[semClass][i].result["@id"] === data.result["@id"]) {
                            found = true;
                            for (let k = 0; k < sourcequery.source.length; k++) {
                                this[semClass][i].sourcequery.wordids.push(sourcequery.source[k].wordID);
                            }
                            this[semClass][i].sourcequery.wordids.sort();
                            this[semClass][i].sourcequery.querys.push.apply(this[semClass][i].sourcequery.querys, sourcequery.querys);
                            this[semClass][i].sourcequery.freq += sourcequery.freq;
                            this[semClass][i].sourcequery.source.push.apply(this[semClass][i].sourcequery.source, sourcequery.source);
                            //console.log(JSON.stringify(this[semClass][i]));
                        }
                    }*/
                    if (found === false) {
                        data["sourcequery"] = sourcequery;
                        this[semClass].push(data);
                    }
                    //console.log('Results: ' + JSON.stringify(this.researchresults));

                });
            },
            makeCORSSecureRequest: function (url, success) {
                let connectionParams = {
                    type: 'GET',
                    url: url,
                    success: success,
                    dataType: 'JSON',
                };
                let sth = new XMLHttpRequest();
                return $.ajax(connectionParams);
            },
            saveResult: function (index) {
                //TODO: make new variable that has the meaning of selectedIndex if there are multiple results.
                this.resultselected = true;
                this.selectedindex = index;
                //console.log('selected Result is: ' + JSON.stringify(this.researchresults[index]) + index);
                this.selectedresult = this.researchresults[index];
            },
            getMapCoordinates: function () {
                let service_url = 'https://www.gps-coordinates.net/api/';

                for (let i = 0; i < this.researchresults.length; i++) {
                    service_url = service_url + this.researchresults[i].name;
                    xhttp.open("GET", service_url, true);
                    xhttp.send();
                    xhttp.responseText;
                    console.log("Get MapURL respinse: " + xhttp.responseText);
                    this.mapcoordinates.push({x: response.latitude, y: response.longitude});
                }
            }
        },
        computed: {},
        watch: {
            selectedindexes: {
                handler: function (newSelectedIndexes) {
                    if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                        this.keywords = this.limitedfiltertokens(this.tokens, this.gettokensofselectedtext(this.tokens, newSelectedIndexes)[0]);
                        //console.log('Keywords: ' + JSON.stringify(this.keywords));
                        this.resultselected = false;
                        this.selectedtext = this.generateText(this.gettokensofselectedtext(this.tokens, newSelectedIndexes));
                        this.searchGoogle(this.selectedtext);
                    }
                },
                deep: true
            },
            selectedchain: {
                handler: function (newselectedChain) {
                    //TODO: update for new coref handling
                    /*
                    for (let i = 0; i < this.mentions[0].length; i++) {
                        if (newselectedChain === this.mentions[0][i].mentionID) {
                            this.selectedindexes.start = this.mentions[0][i].startIndex;
                            this.selectedindexes.end = this.mentions[0][i].endIndex;
                        }
                    }
                    */
                },
                deep: true
            },
        },
        components: {
            researchresult
        }
    }
</script>