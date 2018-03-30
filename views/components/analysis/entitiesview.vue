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
                   v-bind:indexcorrector="indexCorrector"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
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
                   v-bind:indexcorrector="indexCorrector"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
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
                   v-bind:indexcorrector="indexCorrector"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
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
                   v-bind:indexcorrector="indexCorrector"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
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
                   v-bind:indexcorrector="indexCorrector"
                   v-bind:columnindex="columnindex"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
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
            searchGoogleWithResearchedEntities: function () {
                let localresearchedentities = [];
                let hasID = false;
                let entityincolumn = false;
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let dataurl = 'key=' + this.googleapikey;
                //console.log('getting kg Info: ' + this.researchedentities.length);

                for (let i = 0; i < this.researchedentities.length; i++) {
                    console.log('Researched Entity: ' + JSON.stringify(this.researchedentities[i]) + ' : ' + this.indexCorrector);
                    if (!entityincolumn) {
                        localresearchedentities.pop();
                    }
                    localresearchedentities.push({
                        kgID: this.researchedentities[i].kgID,
                        entities: [],
                        freq: this.researchedentities[i].freq
                    });
                    entityincolumn = false;
                    for (let j = 0; j < this.researchedentities[i].entities.length; j++) {
                        console.log('Entity: ' + JSON.stringify(this.researchedentities[i].entities[j]) + ': ' + this.indexCorrector);
                        if (this.researchedentities[i].entities[j].startIndex >= this.indexCorrector
                            && this.researchedentities[i].entities[j].endIndex < this.tokenstoshow[this.columnindex].length + this.indexCorrector) {
                            console.log('accepted Entity: ' + JSON.stringify(this.researchedentities[i].entities[j]) + ': ' + this.indexCorrector);
                            localresearchedentities[i].entities.push(this.researchedentities[i].entities[j]);
                            dataurl += '&ids=' + this.researchedentities[i].kgID.replace("kg:", "");
                            hasID = true;
                            entityincolumn = true;
                        }

                    }
                }
                console.log('Column range: ' + this.indexCorrector + ': ' + (this.tokenstoshow[this.columnindex].length + this.indexCorrector));
                //console.log('researcheEntities in this column: '+ JSON.stringify(localresearchedentities));
                console.log('Request to' + dataurl);
                if (hasID) {
                    $.getJSON(service_url + '?callback=?', dataurl, (response) => {
                    }).done((response) => {
                        let data = response.itemListElement;
                        if (response.error !== undefined && response.error.code === 400) {
                            console.log('WARNING: Google Knowledge Graph Search API not activated.');
                        } else {
                            //console.log('Response for initial Research: ' + data.length);
                            for (let i = 0; i < data.length; i++) {
                                for (let j = 0; j < localresearchedentities.length; j++) {
                                    if (data[i].result['@id'] === localresearchedentities[j].kgID) {
                                        //console.log('Mapped entity: ' + JSON.stringify(localresearchedentities[j]));
                                        data[i]["sourcequery"] = localresearchedentities[j];
                                        for (let k = 0; k < localresearchedentities[j].entities.length; k++) {
                                            if (localresearchedentities[j].entities[k].semanticClass !== 'PERSON'
                                                && localresearchedentities[j].entities[k].semanticClass !== 'LOCATION'
                                                && localresearchedentities[j].entities[k].semanticClass !== 'ORGANIZATION'
                                                && localresearchedentities[j].entities[k].semanticClass !== 'MISC') {
                                                this['OTHER'].push(data[i]);
                                            } else {
                                                this[localresearchedentities[j].entities[k].semanticClass].push(data[i]);
                                            }
                                        }

                                    }
                                }

                            }
                        }
                        /* console.log('Merged Result PERSON: ' + JSON.stringify(this.PERSON));
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
            indexCorrector: function () {
                let tempcorrector = 0;
                for (let i = 0; i < this.columnindex; i++) {
                    tempcorrector = tempcorrector + this.tokenstoshow[i].length;
                }
                return tempcorrector;
            },
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
                    //console.log("entitiesview handler hoverdata: " + JSON.stringify(hoverdata));
                    //console.log("entitiesview handler children: " +  JSON.stringify(this.$refs.personresults[0].researchdata));

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
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes;
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
                }
                ,
                deep: true
            },
        },
        components: {
            researchresult,
        }
    }
</script>