<template>
    <div>
        <!--TODO after one open close period the button changed font-size and make distance between icon and button smaller-->
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
        </div>
        <component is="researchresult"
                   ref="personresults"
                   v-if="classestomark.PERSON"
                   v-for="(researchresult,index) in PERSON"
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
                   v-on:saveresult="saveResult($event)">
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
        </div>
        <component is="researchresult"
                   ref="locationresults"
                   v-if="classestomark.LOCATION"
                   v-for="(researchresult,index2) in LOCATION"
                   v-bind:serverip="serverip"
                   v-bind:researchdata="researchresult"
                   v-bind:key="index2+ PERSON.length"
                   v-bind:index="index2"
                   v-bind:mapkey="index2+ PERSON.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:semclass="'LOCATION'"
                   v-bind:contentcontrol="contentcontrol.LOCATIONS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveResult($event)">
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
        </div>
        <component is="researchresult"
                   ref="organisazionresults"
                   v-if="classestomark.ORGANIZATION"
                   v-for="(researchresult,index3) in ORGANIZATION"
                   v-bind:serverip="serverip"
                   v-bind:researchdata="researchresult"
                   v-bind:key="index3+ PERSON.length + LOCATION.length"
                   v-bind:index="index3"
                   v-bind:mapkey="index3+ PERSON.length+ LOCATION.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:semclass="'ORGANIZATION'"
                   v-bind:contentcontrol="contentcontrol.ORGANIZATIONS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveResult($event)">
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
        </div>
        <component is="researchresult"
                   ref="miscresults"
                   v-if="classestomark.MISC"
                   v-for="(researchresult,index4) in MISC"
                   v-bind:index="index4"
                   v-bind:serverip="serverip"
                   v-bind:researchdata="researchresult"
                   v-bind:key="index4+ PERSON.length + LOCATION.length + ORGANIZATION.length"
                   v-bind:mapkey="index4+ PERSON.length+ LOCATION.length+ ORGANIZATION.length"
                   v-bind:docid="docid"
                   v-bind:showallon="true"
                   v-bind:semclass="'MISC'"
                   v-bind:contentcontrol="contentcontrol.MISCS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveResult($event)">
        </component>
    </div>

</template>
<script>
    import filtertokenwithclass from './mixins/analysis/filtertoken.js';
    import researchresult from './components/analysis/researchresult.vue';

    export default {
        mixins: [filtertokenwithclass],
        props: {
            serverip: { type: String, default: "" },
            tokens: { type: Array, default: function () { return [] }},
            classestomark: { type: Object, default: null },
            docid: { type: Number, default: -1 },
            tokenstoshow: { type: Array, default: function () { return [] }},
            wordtomarkonhoverdata: { type: Array, default: function () { return [] }},
            columnindex: { type: Number, default: 0 },
            contentcontrol: { type: Object, default: null },
            hoverdata: { type: Object, default: null},
        },
        data: function () {
            return {
                PERSON: [],
                LOCATION: [],
                ORGANIZATION: [],
                MISC: [],
                researchresults: [],
                sourcequery:[],
            }
        },
        methods: {
            starthover: function (event) {
                this.$emit('starthover', event);
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
                        let wordids = []
                        for (let k = 0; k < sortedtokens[i].length; k++){
                            wordids.push(sortedtokens[i][k].wordID);
                        } 
                        this.searchGoogle(query, 1, semClass, {
                            freq: frequency,
                            wordids: wordids,
                            querys: [query],                            
                            source: sortedtokens[i]
                        });
                    }
                    query = '';
                    frequency = 0;
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
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };
                $.getJSON(service_url + '?callback=?', params, (response) => {
                }).done((response) => {
                    if (limit > 1) {
                        // this[semClass].push(this.rerankWithKeywords());
                    } else {
                        
                        let data = response.itemListElement[0];
                                               
                        let found = false;
                        for(let i = 0; i < this[semClass].length; i++)
                        {
                            if (this[semClass][i].result["@id"] === data.result["@id"]){
                                found = true;
                                for (let k = 0; k < sourcequery.source.length; k++){
                                    this[semClass][i].sourcequery.wordids.push(sourcequery.source[k].wordID);
                                }                                
                                this[semClass][i].sourcequery.wordids.sort();
                                this[semClass][i].sourcequery.querys.push.apply(this[semClass][i].sourcequery.querys, sourcequery.querys);
                                this[semClass][i].sourcequery.freq += sourcequery.freq;
                                this[semClass][i].sourcequery.source.push.apply(this[semClass][i].sourcequery.source, sourcequery.source);
                                //console.log(JSON.stringify(this[semClass][i]));
                            }
                        }
                        if (found === false){
                            data["sourcequery"] = sourcequery;
                            this[semClass].push(data);
                        }
                        
                    }
                });
            },
            togglesemanticlass: function (semClass) {
                this.classestomark[semClass] = !this.classestomark[semClass];
                this.$emit('togglesemanticlass', this.classestomark);
            },
            saveResults: function () {
                //console.log('TODO: Trying to save but not implemented.');
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
        },
        mounted() {
            if (this.tokenstoshow.length === 0)
                return;
            this.researchTokensOfClass('PERSON', 0);
            this.researchTokensOfClass('LOCATION', 1);
            this.researchTokensOfClass('ORGANIZATION', 2);
            this.researchTokensOfClass('MISC', 3);
        },
        watch: {
            tokenstoshow: function (value){
                this.researchTokensOfClass('PERSON', 0);
                this.researchTokensOfClass('LOCATION', 1);
                this.researchTokensOfClass('ORGANIZATION', 2);
                this.researchTokensOfClass('MISC', 3);
            },
            hoverdata: {
                handler: function (hoverdata) {
                    if (hoverdata === 'undefined'){
                        console.log("WARNING: entitiesview vue hover data undefined");
                    }
                    // console.log("entitiesview handler hoverdata: " + JSON.stringify(hoverdata));
                    // console.log("entitiesview handler children: " +  JSON.stringify(this.$refs.personresults[0].researchdata));
                    
                    if(hoverdata.hoverstarted == "research")
                    {
                        return;
                    }
                    
                    let wordtomarkonhoverDUMMY = [];
                    let newwordid = -1;
                    if (hoverdata !== 'undefined' && hoverdata.hoverstarted === "text"){
                        newwordid = hoverdata.startword.wordID;
                    } else {
                        newwordid = hoverdata.wordids[0];
                    }
                    let bb = null;
                    if (hoverdata.semanticClass === 'PERSON') {
                        if (typeof this.$refs["personresults"] !== 'undefined' && this.$refs["personresults"].length > 0) {
                            for (let i = 0; i < this.$refs["personresults"].length; i++) {
                                let refElement = this.$refs.personresults[i]
                                if (refElement.researchdata.sourcequery.wordids.indexOf(newwordid) > -1) {
                                    if (hoverdata.hoverstarted == "text")
                                        refElement.$el.scrollIntoView();
                                    
                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.wordids
                                }
                            }
                        } else {
                            bb = this.$refs["personresultsparent"].getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === 'LOCATION') {
                        if (typeof this.$refs["locationresults"] !== 'undefined' && this.$refs["locationresults"].length > 0) {
                            for (let i = 0; i < this.$refs["locationresults"].length; i++) {
                                let refElement = this.$refs.locationresults[i]
                                if (refElement.researchdata.sourcequery.wordids.indexOf(newwordid) > -1) {
                                    if (hoverdata.hoverstarted == "text")
                                        refElement.$el.scrollIntoView();
                                    
                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.wordids
                                }
                            }
                        } else {
                            bb = this.$refs["locationresultsparent"].getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === "ORGANIZATION") {
                        if (typeof this.$refs["organisazionresults"] !== 'undefined' && this.$refs["organisazionresults"].length > 0) {
                            for (let i = 0; i < this.$refs["organisazionresults"].length; i++) {
                                let refElement = this.$refs.organisazionresults[i]
                                if (refElement.researchdata.sourcequery.wordids.indexOf(newwordid) > -1) {
                                    if (hoverdata.hoverstarted == "text")
                                        refElement.$el.scrollIntoView();
                                    
                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.wordids
                                }
                            }
                        } else {
                            bb = this.$refs["organisazionresultsparent"].getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === "MISC") {
                        if (typeof this.$refs["miscresults"] !== 'undefined' && this.$refs["miscresults"].length > 0) {
                            for (let i = 0; i < this.$refs["miscresults"].length; i++) {
                                let refElement = this.$refs.miscresults[i]
                                if (refElement.researchdata.sourcequery.wordids.indexOf(newwordid) > -1) {
                                    if (hoverdata.hoverstarted == "text")
                                        refElement.$el.scrollIntoView();
                                    
                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.wordids
                                }
                            }
                        } else {
                            bb = this.$refs["miscresultsparent"].getBoundingClientRect();
                        }
                    }
                    let data = {hoverended: "research", offsetend: bb, wordtomarkonhover: wordtomarkonhoverDUMMY}
                    this.$emit('endhover', data);
                }, deep: true
            },
        },
        components: {
            researchresult
        }
    }
</script>