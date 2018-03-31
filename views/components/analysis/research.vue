<template>
    <div>
        <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col contentColor">
            <!-- shows the clicked word -->
            <input v-on:keydown.enter="searchGoogle(selectedtext,researchlimit)"
                   v-model="selectedtext"
                   class="mdl-textfield__input"/>
        </div>
        <div class="mdl-cell mdl-cell--12-col contentColor">

            <!--Results will be displayed here. -->
            <div class="mdl-cell mdl-cell--12-col" id="resultfield">
                <component is="researchresult"
                           ref="personresults"
                           v-for="(researchresult,index) in researchresults[0]"
                           v-bind:serverip="serverip"
                           v-bind:researchdata="researchresult"
                           v-bind:googleapikey="googleapikey"
                           v-bind:key="index"
                           v-bind:index="index"
                           v-bind:mapkey="index"
                           v-bind:docid="docid"
                           v-bind:viewing="false"
                           v-bind:contentcontrol="contentcontrol.PERSONS"
                           v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                           v-on:starthover="starthover($event)"
                           v-on:saveresult="saveresult($event)">
                </component>
            </div>

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
            serverip: {type: String, default: ""},
            googleapikey: {type: String, default: ""},
            selectedindexes: {type: Object, default: null},
            researchdatatoedit: {type: Object, default: null},
            contentcontrol: {type: Object, default: null},
            tokens: {
                type: Array, default: function () {
                    return []
                }
            },
            wordtomarkonhoverdata: {type: Object, default: null},
            docid: {type: Number, default: -1},
            selectedchain: {type: Number, default: -1},
        },
        data: function () {
            return {
                researchresults: [],
                selectedtext: '',
                selectedindex: -1,
                keywords: this.keywords,
                mapcoordinates: [],
                sourceQuery: '',
                researchlimit: 10,
                researchedtokens: []
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
            searchGoogle: function (query, limit) {
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search?callback=?';
                let params = {
                    'query': query,
                    'limit': limit,
                    'indent': true,
                    'key': this.googleapikey,
                };
                $.getJSON(service_url, params, (response) => {
                }).done((response) => {
                        if (response.error !== undefined){
                            console.error("WARNING: Google knowledge graph result error"); 
                        } else {
                            //this.rerankWithKeywords(response);
                            //this.getMapCoordinates();
                            console.log('got here');
                            let data = response.itemListElement;
                            if (this.researchdatatoedit !== null) {
                                if (this.researchdatatoedit.sourcequery !== undefined && this.researchdatatoedit.sourcequery !== null) {
                                    for (let i = 0; i < data.length; i++) {
                                        data[i]["sourcequery"] = this.researchdatatoedit.sourcequery;
                                    }
                                }
                            } else {
                                let textindexes = [];
                                for (let i = 0; i < this.researchedtokens; i++) {
                                    textindexes.push(this.researchedtokens[i].textIndex);
                                }
                                let sourcequery = {
                                    freq: 1,
                                    querys: [this.selectedtext],
                                    source: this.researchedtokens,
                                    textindexes: textindexes
                                };
                                for (let i = 0; i < data.length; i++) {
                                    data[i]["sourcequery"] = sourcequery;
                                }
                            }
                            this.researchresults = [];
                            this.researchresults.push(data);
                        }
                    }
                );
            },
            saveresult: function (researchdata) {
                let socket = io(this.serverip + ':8080');
                
                console.log('Saving on server1: ' + JSON.stringify(this.researchdatatoedit));
                if (this.researchdatatoedit !== undefined){
                    let obj = {
                        start: this.researchdatatoedit.sourcequery.startIndex,
                        end: this.researchdatatoedit.sourcequery.endIndex
                    };
                    console.log('Saving on server1: ' + JSON.stringify(obj));
                    socket.emit('saveresult', this.docid, obj, researchdata.result['@id']);
                } else {
                    console.log('Saving on server2: ' + JSON.stringify(this.selectedindexes));
                    socket.emit('saveresult', this.docid, this.selectedindexes, researchdata.result['@id']);
                }
                
                this.$emit('saveresult', researchdata);
            },
            starthover: function (event) {
                //this.$emit('starthover', event);
            },
        },
        computed: {},
        watch: {
            researchdatatoedit: {
                handler: function (newData) {
                    if (newData !== undefined && newData !== null) {
                        this.selectedtext = newData.sourcequery.query[0];
                        //console.log('Looking for more Info about: ' + this.selectedtext);
                        this.searchGoogle(this.selectedtext, 10);
                    }
                }, deep: true,
                immediate: true
            },
            selectedindexes: {
                handler: function (newSelectedIndexes) {
                    if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                        this.keywords = this.limitedfiltertokens(this.tokens, this.gettokensofselectedtext(this.tokens, newSelectedIndexes)[0]);
                        //console.log('Keywords: ' + JSON.stringify(this.keywords));
                        this.researchedtokens = this.gettokensofselectedtext(this.tokens, newSelectedIndexes);
                        this.selectedtext = this.generateText(this.researchedtokens);
                        console.log('Looking for more Info about: ' + this.selectedtext);
                        this.searchGoogle(this.selectedtext, 10);
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