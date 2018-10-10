<template>
    <div style="padding:0px;margin:0px;width: 100%;">
        <div style="padding:0.4em;width:100%;">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                 style="width:100%;">
                <input id="advancedsearch"
                       type="text"
                       name="advancedsearch"
                       class="mdl-textfield__input"
                       v-on:keydown.enter="searchGoogle(selectedtext,researchlimit)"
                       v-model="selectedtext"/>
                <label class="mdl-textfield__label"
                       for="advancedsearch">For an advanced search ...</label>
            </div>
        </div>

        <!--Results will be displayed here. -->
        <div class="mdl-cell mdl-cell--12-col"
             style="padding:0px;margin:0px;width: 100%"
             id="resultfield">
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
                       v-bind:columnindex="columnindex"
                       v-bind:contentcontrol="contentcontrol.PERSONS"
                       v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                       v-bind:columnlength="tokenstoshow[columnindex].length"
                       v-bind:indexcorrector="indexCorrector"
                       v-on:starthover="starthover($event)"
                       v-on:saveresult="saveresult($event)">
            </component>
        </div>
        <component is="store"></component>
    </div>
</template>

<script>
    import researchresult from './components/analysis/researchresult.vue';
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';
    import filtertoken from './mixins/analysis/filtertoken.js';
    import store from './components/analysis/globalstore.vue';
    export default {

        mixins: [getselectedtext, filtertoken],
        props: {
            serverip: {type: String, default: ""},
            columnindex: {type: Number, default: 0},
            googleapikey: {type: String, default: ""},
            selectedtextindexes: {type: Object, default: null},
            researchdatatoedit: {type: Object, default: null},
            contentcontrol: {type: Object, default: null},
            tokens: {
                type: Array, default: function () {
                    return []
                }
            },
            tokenstoshow: {
                type: Array, default: function () {
                    return []
                }
            },
            semanticclass: {type: String, default: ""},
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
                numberOfMatches = this.insertionSort(numberOfMatches);
                numberOfMatches.reverse();
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
                        if (response.error !== undefined) {
                            console.error("WARNING: Google knowledge graph result error");
                        } else {
                            let data = response.itemListElement;
                            //edit entity
                            if (this.researchdatatoedit !== null) {
                                if (this.researchdatatoedit.sourcequery !== undefined && this.researchdatatoedit.sourcequery !== null) {
                                    for (var i = 0; i < data.length; i++) {
                                        data[i]["sourcequery"] = this.researchdatatoedit.sourcequery;

                                    }
                                }
                            }
                            //add entity
                            else {
                                let textindexes = [];
                                for (let i = 0; i < this.researchedtokens.length; i++) {
                                    textindexes.push(this.researchedtokens[i].textIndex);
                                }
                                let sourcequery = {
                                    freq: 1,
                                    query: [this.selectedtext],
                                    textindexes: textindexes,
                                    docID: this.docid,
                                };
                                let semClass = this.researchedtokens[0].semanticClass;
                                for (let k = 1; k < this.researchedtokens.length; k++) {
                                    if (this.researchedtokens[k - 1].semanticClass !== this.researchedtokens[k].semanticClass) {
                                        semClass = 'OTHER';
                                        break;
                                    }
                                }
                                sourcequery['semanticClass'] = semClass;
                                sourcequery['textindexes'] = textindexes;
                                sourcequery['startIndex'] = textindexes[0];
                                sourcequery['endIndex'] = textindexes[textindexes.length - 1];
                                for (let i = 0; i < data.length; i++) {
                                    sourcequery['kgID'] = data[i].result['@id'];
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
                //console.log('Saving...' + JSON.stringify(this.researchdatatoedit));

                let socket = io(this.serverip + ':8080');

                if (this.researchdatatoedit !== undefined && this.researchdatatoedit !== null) {
                    let obj = {
                        start: this.researchdatatoedit.sourcequery.startIndex,
                        end: this.researchdatatoedit.sourcequery.endIndex
                    };
                    console.log('Saving on server multi object: ');
                    socket.emit('saveresult', this.docid, obj, researchdata.result['@id']);
                } else {
                    let sendObj = {
                        start: [this.selectedtextindexes.start],
                        end: [this.selectedtextindexes.end],
                        query: this.selectedtext,
                        semanticClass: this.semanticclass,
                    };
                    console.log('Saving on server single object: ');
                    socket.emit('saveresult', this.docid, sendObj, researchdata.result['@id']);
                }
                this.$emit('saveresult', researchdata);
            },
            starthover: function (event) {
                //this.$emit('starthover', event);
            },
            handleselectedtextindexes: function (newselectedtextindexes) {
                if (newselectedtextindexes.start !== -1 && newselectedtextindexes.end !== -1) {
                    //console.log(JSON.stringify(this.gettokensofselectedtext(this.tokens, newselectedtextindexes)));
                    this.keywords = this.limitedfiltertokens(this.tokens, this.gettokensofselectedtext(this.tokens, newselectedtextindexes)[0]);

                    //console.log('Keywords: ' + JSON.stringify(this.keywords));
                    this.researchedtokens = this.gettokensofselectedtext(this.tokens, newselectedtextindexes);
                    this.selectedtext = this.generateTextForSeach(this.researchedtokens);
                    //console.log('Looking for more Info about: ' + this.selectedtext);
                    this.searchGoogle(this.selectedtext, 10);
                }
            }
        },
        computed: {
            indexCorrector: function () {
                let tempcorrector = 0;
                for (let i = 0; i < this.columnindex; i++) {
                    tempcorrector = tempcorrector + this.tokenstoshow[i].length;
                }
                return tempcorrector;
            },
        },
        mounted: function () {
            this.handleselectedtextindexes(this.selectedtextindexes);
            this.$nextTick(() => {
                componentHandler.upgradeDom();
                componentHandler.upgradeAllRegistered();
            });
        },
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
            selectedtextindexes: {
                handler: function (newselectedtextindexes) {
                    this.handleselectedtextindexes(newselectedtextindexes)
                },
                deep: true
            },
            selectedchain: {
                handler: function (newselectedChain) {
                    //TODO: update for new coref handling
                    /*
                    for (let i = 0; i < this.mentions[0].length; i++) {
                        if (newselectedChain === this.mentions[0][i].mentionID) {
                            this.selectedtextindexes.start = this.mentions[0][i].startIndex;
                            this.selectedtextindexes.end = this.mentions[0][i].endIndex;
                        }
                    }
                    */
                },
                deep: true
            },
        },
        created() {

        },
        components: {
            researchresult,
            store
        }
    }
</script>