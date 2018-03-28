<template>
    <div>
        <div class="semClassFormate PERSON"
             ref="personresultsparent"
             v-on:click="togglesemanticlass('PERSON')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.PERSON"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">PERSON ({{numberOfPersons}})</b>
            </button>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click="addresearch">
                <i class="material-icons">add_circle</i>
            </button>
        </div>
        <component is="researchresult"
                   ref="personresults"
                   v-if="classestomark.PERSON"
                   v-for="(researchresult,index) in PERSON"
                   v-bind:serverip="serverip"
                   v-bind:googleapikey="googleapikey"
                   v-bind:researchdata="researchresult"
                   v-bind:key="index"
                   v-bind:index="index"
                   v-bind:mapkey="index"
                   v-bind:docid="docid"
                   v-bind:viewing="true"
                   v-bind:contentcontrol="contentcontrol.PERSONS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveResult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <div class="semClassFormate LOCATION"
             ref="locationresultsparent"
             v-on:click="togglesemanticlass('LOCATION')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.LOCATION"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">LOCATION ({{numberOfLocations}})</b>
            </button>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click="addresearch">
                <i class="material-icons">add_circle</i>
            </button>
        </div>
        <component is="researchresult"
                   ref="locationresults"
                   v-if="classestomark.LOCATION"
                   v-for="(researchresult,index2) in LOCATION"
                   v-bind:serverip="serverip"
                   v-bind:googleapikey="googleapikey"
                   v-bind:researchdata="researchresult"
                   v-bind:key="index2+ PERSON.length"
                   v-bind:index="index2"
                   v-bind:mapkey="index2+ PERSON.length"
                   v-bind:docid="docid"
                   v-bind:viewing="true"
                   v-bind:contentcontrol="contentcontrol.LOCATIONS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveResult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <div class="semClassFormate ORGANIZATION"
             ref="organisazionresultsparent"
             v-on:click="togglesemanticlass('ORGANIZATION')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.ORGANIZATION"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">ORGANIZATION ({{numberOfOrganizations}})</b>
            </button>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click="addresearch">
                <i class="material-icons">add_circle</i>
            </button>
        </div>
        <component is="researchresult"
                   ref="organisazionresults"
                   v-if="classestomark.ORGANIZATION"
                   v-for="(researchresult,index3) in ORGANIZATION"
                   v-bind:serverip="serverip"
                   v-bind:googleapikey="googleapikey"
                   v-bind:researchdata="researchresult"
                   v-bind:key="index3+ PERSON.length + LOCATION.length"
                   v-bind:index="index3"
                   v-bind:mapkey="index3+ PERSON.length+ LOCATION.length"
                   v-bind:docid="docid"
                   v-bind:viewing="true"
                   v-bind:contentcontrol="contentcontrol.ORGANIZATIONS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveResult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <div class="semClassFormate MISC"
             ref="miscresultsparent"
             v-on:click="togglesemanticlass('MISC')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.MISC"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">MISC ({{numberOfMisc}})</b>
            </button>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click="addresearch">
                <i class="material-icons">add_circle</i>
            </button>
        </div>
        <component is="researchresult"
                   ref="miscresults"
                   v-if="classestomark.MISC"
                   v-for="(researchresult,index4) in MISC"
                   v-bind:index="index4"
                   v-bind:serverip="serverip"
                   v-bind:googleapikey="googleapikey"
                   v-bind:researchdata="researchresult"
                   v-bind:key="index4+ PERSON.length + LOCATION.length + ORGANIZATION.length"
                   v-bind:mapkey="index4+ PERSON.length+ LOCATION.length+ ORGANIZATION.length"
                   v-bind:docid="docid"
                   v-bind:viewing="true"
                   v-bind:contentcontrol="contentcontrol.MISCS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveResult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <div class="semClassFormate OTHER"
             ref="miscresultsparent"
             v-on:click="togglesemanticlass('OTHER')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.OTHER"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">OTHER ({{numberOfOTHER}})</b>
            </button>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click="addresearch">
                <i class="material-icons">add_circle</i>
            </button>
        </div>
        <component is="researchresult"
                   ref="miscresults"
                   v-if="classestomark.OTHER"
                   v-for="(researchresult,index5) in OTHER"
                   v-bind:index="index5"
                   v-bind:serverip="serverip"
                   v-bind:googleapikey="googleapikey"
                   v-bind:researchdata="researchresult"
                   v-bind:key="index5+ PERSON.length + LOCATION.length + ORGANIZATION.length + MISC.length"
                   v-bind:mapkey="index5+ PERSON.length+ LOCATION.length+ ORGANIZATION.length+ MISC.length"
                   v-bind:docid="docid"
                   v-bind:viewing="true"
                   v-bind:contentcontrol="contentcontrol.OTHERS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveResult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
    </div>
</template>
<script>
    import filtertokenwithclass from './mixins/analysis/filtertoken.js';
    import researchresult from './components/analysis/researchresult.vue';

    export default {
        mixins: [filtertokenwithclass],
        props: {
            serverip: {type: String, default: ""},
            googleapikey: {type: String, default: ""},
            researchedentities: {
                type: Array, default: function () {
                    return []
                },
            },
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
            wordtomarkonhoverdata: {
                type: Array, default: function () {
                    return []
                }
            },
            docid: {type: Number, default: -1},
            selectedchain: {type: Number, default: -1},
            columnindex: {type: Number, default: 0},
            classestomark: {type: Object, default: null},
            contentcontrol: {type: Object, default: null},
            hoverdata: {type: Object, default: null},
            selectedindexes: {type: Object, default: null},
            researchdatatoupdate: {type: Object, default: null},
        },
        data: function () {
            return {
                PERSON: [],
                LOCATION: [],
                ORGANIZATION: [],
                MISC: [],
                OTHER: [],
                researchresults: [],
                sourcequery: [],
            }
        },
        methods: {
            addresearch: function () {
                this.$emit('editresearch');
            },
            editresearch: function (researchData) {
                this.$emit('editresearch', researchData);
            },
            starthover: function (event) {
                this.$emit('starthover', event);
            },
            initializeEntitiesView: function () {
                let researchedtokens = [];
                let tempsourcequery = {};
                let researchedentities = [];
                let lastersearchedtoken = -1;
                let lastentity = -1;
                for (let i = 0; i < this.tokenstoshow[this.columnindex].length; i++) {
                    //console.log('Checkpoint 0' + JSON.stringify(this.tokenstoshow[this.columnindex][i]));
                    if (this.tokenstoshow[this.columnindex][i].researchedentities !== undefined) {
                        for (let j = 0; j < this.tokenstoshow[this.columnindex][i].researchedentities.length; j++) {
                            if (this.tokenstoshow[this.columnindex][i].researchedentities[j].kgID !== '0'
                                && this.tokenstoshow[this.columnindex][i].researchedentities[j].kgID !== 0
                                && this.tokenstoshow[this.columnindex][i].researchedentities[j].kgID !== 'null'
                                && this.tokenstoshow[this.columnindex][i].researchedentities[j].kgID !== null) {
                                researchedtokens.push(this.tokenstoshow[this.columnindex][i]);
                                lastersearchedtoken = researchedtokens.length - 1;
                                if (researchedentities.length === 0) {
                                    tempsourcequery = {
                                        freq: 1,
                                        textindexes: [researchedtokens[lastersearchedtoken].textIndex],
                                        querys: [researchedtokens[lastersearchedtoken].content],
                                        source: [researchedtokens[lastersearchedtoken]]
                                    };
                                    researchedentities.push(tempsourcequery);
                                    tempsourcequery = {};
                                }
                                lastentity = researchedentities.length - 1;
                                //if researched token is not part of an entity then put it in researchedentities else add to source to existing entity
                                if (researchedtokens[lastersearchedtoken].kgID === researchedentities[lastentity].source[0].kgID) {
                                    // console.log('Checkpoint 2.1: '
                                    //     + researchedtokens[lastersearchedtoken].textIndex + '-1 =?'
                                    //     + researchedentities[lastentity].source[researchedentities[lastentity].source.length - 1].textIndex);
                                    if (researchedtokens[lastersearchedtoken].textIndex - 1
                                        === researchedentities[lastentity].source[researchedentities[lastentity].source.length - 1].textIndex) {
                                        //console.log('Checkpoint 2.2:  Adding to existing entity');
                                        researchedentities[lastentity].freq++;
                                        researchedentities[lastentity].source.push(researchedtokens[lastersearchedtoken]);
                                        researchedentities[lastentity].textindexes.push(researchedtokens[lastersearchedtoken].textIndex);
                                        researchedentities[lastentity].querys[0] += ' ' + researchedtokens[lastersearchedtoken].content;
                                    }
                                } else {
                                    //console.log('Checkpoint 2.3: new entity');
                                    tempsourcequery = {
                                        freq: 1,
                                        textindexes: [researchedtokens[lastersearchedtoken].textIndex],
                                        querys: [researchedtokens[lastersearchedtoken].content],
                                        source: [researchedtokens[lastersearchedtoken]]
                                    };
                                    researchedentities.push(tempsourcequery);
                                    tempsourcequery = {};
                                }
                            }
                        }
                    }
                }
                this.searchGoogleWithResearchedEntities(researchedentities);
            },
            researchTokensOfClass: function (semClass, index) {
                this[semClass] = [];
                let query = '';
                let frequency = 0;
                let searched = false;
                let sortedtokens = this.filtertokenwithclass(this.tokenstoshow[this.columnindex], semClass);
                this.sourcequery.push([]);
                for (let i = 0; i < sortedtokens.length; i++) {
                    for (let j = 0; j < sortedtokens[i].length; j++) {
                        for (let k = 0; k < this.sourcequery[index].length; k++) {
                            if (this.sourcequery[index][k].query.indexOf(sortedtokens[i][j].content) !== -1) {
                                searched = true;
                            }
                        }
                        if (searched === false) {
                            frequency++;
                            query = query + ' ' + sortedtokens[i][j].content;
                        }
                        searched = false;
                    }
                    if (query !== '') {
                        let textindexes = [];
                        for (let k = 0; k < sortedtokens[i].length; k++) {
                            textindexes.push(sortedtokens[i][k].textIndex);
                        }
                        this.searchGoogle(query, 1, semClass, {
                            freq: frequency,
                            textindexes: textindexes,
                            querys: [query],
                            source: sortedtokens[i]
                        });
                    }
                    query = '';
                    frequency = 0;
                }
            },
            searchGoogleWithResearchedEntities: function () {
                let hasID = false;
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let dataurl = 'key=' + this.googleapikey;
                for (let i = 0; i < this.researchedentities.length; i++) {
                    //console.log('Researched Entity: ' + JSON.stringify(this.researchedentities[i]));
                    dataurl += '&ids='+ this.researchedentities[i].kgID.replace("kg:","");
                    hasID = true;
                }
                console.log('Requesting: '+dataurl);
                if (hasID) {
                    $.getJSON(service_url + '?callback=?', dataurl, (response) => {
                    }).done((response) => {
                        let data = response.itemListElement;
                        if (response.error !== undefined && response.error.code === 400) {
                            console.log('WARNING: Google Knowledge Graph Search API not activated.');
                        } else {
                            //console.log('Response for initial Research: ' + data.length);
                            for (let i = 0; i < data.length; i++) {
                                for (let j = 0; j < this.researchedentities.length; j++) {
                                    if (data[i].result['@id'] === this.researchedentities[j].kgID) {
                                        data[i]["sourcequery"] = this.researchedentities[j];
                                        if (this.researchedentities[j].entities[0].semanticClass !== 'PERSON'
                                            && this.researchedentities[j].entities[0].semanticClass !== 'LOCATION'
                                            && this.researchedentities[j].entities[0].semanticClass !== 'ORGANIZATION'
                                            && this.researchedentities[j].entities[0].semanticClass !== 'MISC') {
                                            this['OTHER'].push(data[i]);
                                        } else {
                                            this[this.researchedentities[j].entities[0].semanticClass].push(data[i]);
                                        }
                                    }
                                }

                            }
                        }
                        /*console.log('Merged Result PERSON: ' + JSON.stringify(this.PERSON));
                        console.log('Merged Result LOCATION: ' + JSON.stringify(this.LOCATION));
                        console.log('Merged Result: ORGANIZATION' + JSON.stringify(this.ORGANIZATION));
                        console.log('Merged Result: MISC' + JSON.stringify(this.MISC));
                        console.log('Merged Result: OTHER' + JSON.stringify(this.OTHER));*/
                    }).fail(err => {
                        console.log('Google initial search failed: ' + err);
                    });
                } else {
                    console.log('There was a token with a SemanticClass to Research but has no research on the DB');
                }
            },
            searchGoogle: function (query, limit, semClass, sourcequery) {
                if (limit < 1) {
                    return null;
                }
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let params = {
                    'query': query,
                    'limit': limit,
                    'indent': true,
                    'key': this.googleapikey,
                };
                $.getJSON(service_url + '?callback=?', params, (response) => {
                }).done((response) => {
                    let tempResult = {};
                    if (limit > 1) {
                        // this[semClass].push(this.rerankWithKeywords());
                    } else {
                        if (response !== undefined && response.itemListElement.length > 0) {
                            let data = response.itemListElement[0];
                            let found = false;
                            if (sourcequery !== undefined) {
                                if (sourcequery.source !== undefined) {
                                    if (sourcequery.source.length > 0) {
                                        for (let i = 0; i < this[semClass].length; i++) {
                                            for (let k = 0; k < sourcequery.source.length; k++) {
                                                if (sourcequery.source[i].kgID === '0') {
                                                    tempResult = data;
                                                    tempResult["sourcequery"] = sourcequery;
                                                    this.saveResult2(tempResult);
                                                }
                                            }
                                            if (this[semClass][i].result["@id"] === data.result["@id"]) {
                                                found = true;
                                                for (let k = 0; k < sourcequery.source.length; k++) {
                                                    this[semClass][i].sourcequery.textindexes.push(sourcequery.source[k].textIndex);
                                                }
                                                this[semClass][i].sourcequery.textindexes.sort();
                                                this[semClass][i].sourcequery.querys.push.apply(this[semClass][i].sourcequery.querys, sourcequery.querys);
                                                this[semClass][i].sourcequery.freq += sourcequery.freq;
                                                this[semClass][i].sourcequery.source.push.apply(this[semClass][i].sourcequery.source, sourcequery.source);
                                                //console.log(JSON.stringify(this[semClass][i]));
                                            }
                                        }
                                        if (found === false) {
                                            data["sourcequery"] = sourcequery;
                                            this[semClass].push(data);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            },
            togglesemanticlass: function (semClass) {
                this.classestomark[semClass] = !this.classestomark[semClass];
                this.$emit('updateclassestomark', this.classestomark);
            },
            saveResult2: function (researchdata) {
                let indexes = {
                    start: researchdata.sourcequery.source[0].textIndex,
                    end: researchdata.sourcequery.source[researchdata.sourcequery.source.length - 1].textIndex + 1
                };
                let socket = io(this.serverip + ':8080');
                socket.emit('saveresult', this.docid, indexes, researchdata.result['@id']);
                this.$emit('saveresult', researchdata);
            },
            saveResult: function (researchdata) {
                let socket = io(this.serverip + ':8080');
                socket.emit('saveresult', this.docid, this.selectedindexes, researchdata.result['@id']);
                this.$emit('saveresult', researchdata);
            },
            isElementInViewport: function (el) {
                let rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
                );
            },
        },
        computed: {
            numberOfPersons: function () {
                if (typeof this["PERSON"] !== 'undefined') {
                    return this["PERSON"].length;
                } else {
                    return '';
                }
            },
            numberOfLocations: function () {
                if (typeof this["LOCATION"] !== 'undefined') {
                    return this["LOCATION"].length;
                } else {
                    return '';
                }
            },
            numberOfOrganizations: function () {
                if (typeof this['ORGANIZATION'] !== 'undefined') {
                    return this['ORGANIZATION'].length;
                } else {
                    return '';
                }
            },
            numberOfMisc: function () {
                if (typeof this['MISC'] !== 'undefined') {
                    return this['MISC'].length;
                } else {
                    return '';
                }
            },
            numberOfOTHER: function () {
                if (typeof this['OTHER'] !== 'undefined') {
                    return this['OTHER'].length;
                } else {
                    return '';
                }
            },
        },
        mounted() {
            if (this.tokenstoshow.length === 0)
                return;
            this.searchGoogleWithResearchedEntities();
            /* this.researchTokensOfClass('PERSON', 0);
             this.researchTokensOfClass('LOCATION', 1);
             this.researchTokensOfClass('ORGANIZATION', 2);
             this.researchTokensOfClass('MISC', 3);*/

        },
        watch: {
            researchdatatoupdate: {
                handler: function (newresearchdatatoupdate) {
                    let semClass = '';
                    if (newresearchdatatoupdate !== null) {
                        if (newresearchdatatoupdate.sourcequery !== undefined) {
                            semClass = newresearchdatatoupdate.sourcequery.source[0].semanticClass;
                            if (semClass !== undefined) {
                                if (semClass !== 'PERSON' && semClass !== 'LOCATION' && semClass !== 'ORGANIZATION' && semClass !== 'MISC') {
                                    console.log('Adding new result to OTHER');
                                    this['OTHER'].push(newresearchdatatoupdate);
                                } else {
                                    console.log('Adding new result to ' + semClass);
                                    this[semClass].push(newresearchdatatoupdate);
                                }
                            }
                        }
                    }
                },
                deep: true,
                immediate:
                    true
            },
            tokenstoshow: function (value) {
                this.searchGoogleWithResearchedEntities();
                /*this.researchTokensOfClass('PERSON', 0);
                this.researchTokensOfClass('LOCATION', 1);
                this.researchTokensOfClass('ORGANIZATION', 2);
                this.researchTokensOfClass('MISC', 3);*/
            },
            hoverdata: {
                handler: function (hoverdata) {
                    if (hoverdata === 'undefined') {
                        console.log("WARNING: entitiesview vue hover data undefined");
                    }
                    // console.log("entitiesview handler hoverdata: " + JSON.stringify(hoverdata));
                    // console.log("entitiesview handler children: " +  JSON.stringify(this.$refs.personresults[0].researchdata));

                    if (hoverdata.hoverstarted === "research") {
                        return;
                    }

                    let wordtomarkonhoverDUMMY = [];
                    let newwordid = -1;
                    if (hoverdata !== 'undefined' && hoverdata.hoverstarted === "text") {
                        newwordid = hoverdata.startword.textIndex;
                    } else {
                        newwordid = hoverdata.textindexes[0];
                    }
                    let bb = null;
                    if (hoverdata.semanticClass === 'PERSON') {
                        if (typeof this.$refs["personresults"] !== 'undefined' && this.$refs["personresults"].length > 0) {
                            for (let i = 0; i < this.$refs["personresults"].length; i++) {
                                let refElement = this.$refs.personresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (hoverdata.hoverstarted === "text" && !this.isElementInViewport(refElement.$el)) {
                                        refElement.$el.scrollIntoView();
                                    }

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes
                                }
                            }
                        } else {
                            bb = this.$refs["personresultsparent"].getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === 'LOCATION') {
                        if (typeof this.$refs["locationresults"] !== 'undefined' && this.$refs["locationresults"].length > 0) {
                            for (let i = 0; i < this.$refs["locationresults"].length; i++) {
                                let refElement = this.$refs.locationresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (hoverdata.hoverstarted === "text" && !this.isElementInViewport(refElement.$el))
                                        refElement.$el.scrollIntoView();

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes
                                }
                            }
                        } else {
                            bb = this.$refs["locationresultsparent"].getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === "ORGANIZATION") {
                        if (typeof this.$refs["organisazionresults"] !== 'undefined' && this.$refs["organisazionresults"].length > 0) {
                            for (let i = 0; i < this.$refs["organisazionresults"].length; i++) {
                                let refElement = this.$refs.organisazionresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (hoverdata.hoverstarted === "text" && !this.isElementInViewport(refElement.$el))
                                        refElement.$el.scrollIntoView();

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes
                                }
                            }
                        } else {
                            bb = this.$refs["organisazionresultsparent"].getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === "MISC") {
                        if (typeof this.$refs["miscresults"] !== 'undefined' && this.$refs["miscresults"].length > 0) {
                            for (let i = 0; i < this.$refs["miscresults"].length; i++) {
                                let refElement = this.$refs.miscresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (hoverdata.hoverstarted === "text" && !this.isElementInViewport(refElement.$el))
                                        refElement.$el.scrollIntoView();

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes
                                }
                            }
                        } else {
                            bb = this.$refs["miscresultsparent"].getBoundingClientRect();
                        }
                    }
                    let data = {hoverended: "research", offsetend: bb, wordtomarkonhover: wordtomarkonhoverDUMMY};
                    this.$emit('endhover', data);
                },
                deep: true
            },
        },
        components: {
            researchresult,
        }
    }
</script>