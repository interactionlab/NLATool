<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <!-- shows the clicked word -->
            <input v-on:keydown.enter="searchGoogle(selectedtext)"
                   v-model="selectedtext"
                   class="mdl-textfield__input"/>
        </div>
        <!-- TODO remove Taylor Swift at the end. That is our default value -->
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col" id="resultfield">
                    <component is="researchresult"
                               v-if="resultselected"
                               v-bind:researchresult="selectedresult"
                               v-bind:index="selectedindex"
                               v-bind:dochid="docid"
                               v-bind:showallon="true"
                               v-on:showallresults="switchresearchselected">
                    </component>
                    <component is="researchresult"
                               v-else
                               v-for="(researchresult,index) in researchresults[0].itemListElement"
                               v-bind:researchresult="researchresult"
                               v-bind:key="index"
                               v-bind:index="index"
                               v-bind:researchresults="researchresults"
                               v-bind:dochid="docid"
                               v-bind:showallon="false"
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
                keywords: this.keywords
            }
        },
        methods: {
            rerankWithKeywords: function () {
                let tempresults = [];
                let numberOfMatches = [];
                console.log('Checkpoint 1' + JSON.stringify(this.researchresults));
                for (let i = 0; i < this.researchresults[0].itemListElement[i].length; i++) {
                    numberOfMatches.push({rank: i, matches: 0})
                    for (let j = 0; j < this.keywords.length; j++) {
                        if (this.researchresults[0].itemListElement[i].detailedDescription.articleBody.indexOf(this.keywords[j].content) > -1) {
                            numberOfMatches[i].matches = numberOfMatches + 1;
                        }
                    }
                    tempresults.push({
                        result: this.researchresults[0].itemListElement[i],
                        rank: i,
                        matches: numberOfMatches[i].matches
                    });
                }
                console.log('Sorted Results.' + this.insertionSort(tempresults));
            },
            insertionSort: function (items) {
                for (let i = 0; i < items.length; i++) {
                    let value = items[i].matches;
                    for (let j = i - 1; j > -1 && items[j].matches > value; j--) {
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
                    this.researchresults.pop();
                    this.researchresults.push(response);
                    this.rerankWithKeywords();

                });
            },
            saveResult: function (index) {
                this.resultselected = true;
                this.selectedindex = index;
                console.log('selected Result is: ' + JSON.stringify(this.researchresults[0].itemListElement[index]) + index);
                this.selectedresult = this.researchresults[0].itemListElement[index];
            }
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