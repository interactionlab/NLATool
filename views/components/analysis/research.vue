<template>
    <div>
        <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col contentColor">
            <!-- shows the clicked word -->
            <input v-on:keydown.enter="searchGoogle(selectedtext)"
                   v-model="selectedtext"
                   class="mdl-textfield__input"/>
        </div>
        <!-- TODO remove Taylor Swift at the end. That is our default value -->
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-cell mdl-cell--12-col" id="resultfield">
                    <component is="researchresult"
                               v-if="resultselected"
                               v-bind:researchresult="selectedresult"
                               v-bind:index="selectedindex"
                               v-bind:dochid="docid"
                               v-bind:showallon="resultselected"
                               v-on:showallresults="switchresearchselected">
                    </component>
                    <component is="researchresult"
                               v-else
                               v-for="(researchresult,index) in researchresults"
                               v-bind:researchresult="researchresult"
                               v-bind:key="index"
                               v-bind:index="index"
                               v-bind:researchresults="researchresults"
                               v-bind:dochid="docid"
                               v-bind:showallon="resultselected"
                               v-on:saveresult="saveResult($event)">
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
            researchmode: String,
            selectedindexes: Object,
            tokens: Array,
            docid: Number,
            selectedchain: Number,
            mentions: Array
        },
        data: function () {
            return {
                researchresults: [''],
                researchmode: this.researchmode,
                tokens: this.tokens,
                selectedtext: '',
                selectedindexes: this.selectedindexes,
                resultselected: false,
                selectedresult: {},
                selectedindex: -1,
                docid: this.docid,
                keywords: this.keywords,
                selectedchain: this.selectedchain,
                mentions: this.mentions,
            }
        },
        methods: {
            rerankWithKeywords: function (response) {
                let tempresults = [];
                let numberOfMatches = [];
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
                tempresults = this.insertionSort(tempresults);
                this.researchresults = [];
                for (let i = 1; i < tempresults.length; i++) {
                    this.researchresults.push(tempresults[i].result);
                }
                console.log('Sorted Results Alpha: ' + JSON.stringify(this.researchresults) + this.researchresults.length);
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
                console.log('Show the Selection: ' + this.resultselected)
                this.resultselected = !this.resultselected
            },
            searchGoogle: function (query) {
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let params = {
                    'query': query,
                    'limit': 10,
                    'indent': true,
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };
                $.getJSON(service_url + '?callback=?', params, (response) => {
                }).done((response) => {
                    //console.log('Response for Research: ' + JSON.stringify(response));
                    this.rerankWithKeywords(response);
                    console.log('Results: ' + JSON.stringify(this.researchresults));
                });
            },
            saveResult: function (index) {
                this.resultselected = true;
                this.selectedindex = index;
                console.log('selected Result is: ' + JSON.stringify(this.researchresults[index]) + index);
                this.selectedresult = this.researchresults[index];
            },
        },
        computed: {},
        watch: {
            selectedindexes: {
                handler: function (newSelectedIndexes) {
                    console.log('Watcher activated: ' + JSON.stringify(newSelectedIndexes));
                    if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                        this.keywords = this.limitedfiltertokens(this.tokens, this.gettokensofselectedtext(this.tokens, newSelectedIndexes)[0]);
                        console.log('Keywords: ' + JSON.stringify(this.keywords));
                        this.resultselected = false;
                        this.selectedtext = this.generateText(this.gettokensofselectedtext(this.tokens, newSelectedIndexes));
                        this.searchGoogle(this.selectedtext);
                    }
                },
                deep: true
            },
            selectedchain: {
                handler: function (newselectedChain) {
                    //console.log('Selected Chain1: '+newselectedChain);
                    for (let i = 0; i < this.mentions[0].length; i++) {
                        if (newselectedChain === this.mentions[0][i].mentionID) {
                            this.selectedindexes.start = this.mentions[0][i].startIndex;
                            this.selectedindexes.end = this.mentions[0][i].endIndex;
                        }
                    }
                    //console.log('Selected Chain2: ' + JSON.stringify(this.selectedindexes));
                },
                deep: true
            },

            researchmode: function (mode) {
                //if (mode === 'Info') {
                console.log('researchmode was changed to:' + mode);
                this.searchGoogle('Taylor Swift');
                //}
            }
        },
        components: {
            researchresult
        }
    }
</script>