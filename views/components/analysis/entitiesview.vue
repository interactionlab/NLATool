<template>
    <div>
        <div class="mdl-grid semClassFormate PERSON"
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
            <div class="mdl-layout-spacer"></div>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click.stop="addresearch">
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
                   v-bind:columnindex="columnindex"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
                   v-bind:contentcontrol="contentcontrol.PERSONS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:activating="handleactivating($event)"
                   v-on:deactivating="handledeactivating"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveresult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <div class="mdl-grid semClassFormate LOCATION"
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
            <div class="mdl-layout-spacer"></div>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click.stop="addresearch">
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
                   v-bind:columnindex="columnindex"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
                   v-bind:contentcontrol="contentcontrol.LOCATIONS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:deactivating="handledeactivating"
                   v-on:activating="handleactivating($event)"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveresult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <div class="mdl-grid semClassFormate ORGANIZATION"
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
            <div class="mdl-layout-spacer"></div>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click.stop="addresearch">
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
                   v-bind:columnindex="columnindex"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
                   v-bind:contentcontrol="contentcontrol.ORGANIZATIONS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:activating="handleactivating($event)"
                   v-on:deactivating="handledeactivating"
                   v-on:starthover="starthover($event)"
                   v-on:saveresult="saveresult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <div class="mdl-grid semClassFormate MISC"
             ref="miscresultsparent"
             v-on:click.stop="togglesemanticlass('MISC')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.MISC"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">MISC ({{numberOfMisc}})</b>
            </button>
            <div class="mdl-layout-spacer"></div>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click.stop="addresearch">
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
                   v-bind:columnindex="columnindex"
                   v-bind:columnlength="tokenstoshow[columnindex].length"
                   v-bind:contentcontrol="contentcontrol.MISCS"
                   v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                   v-on:starthover="starthover($event)"
                   v-on:activating="handleactivating($event)"
                   v-on:deactivating="handledeactivating"
                   v-on:saveresult="saveresult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <div class="mdl-grid semClassFormate OTHER"
             ref="otherresultsparent"
             v-on:click="togglesemanticlass('OTHER')">
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces snapbtn">
                <i v-if="classestomark.OTHER"
                   class="material-icons snapbtn">keyboard_arrow_down</i>
                <i v-else class="material-icons snapbtn">keyboard_arrow_right</i>
            </button>
            <button class="mdl-cell mdl-cell--10-col mdl-button mdl-js-button mdl-js-ripple-effect deleteSpaces snapbtn">
                <b class="mdc-button snapbtn">OTHER ({{numberOfOTHER}})</b>
            </button>
            <div class="mdl-layout-spacer"></div>
            <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces"
                    v-on:click.stop="addresearch">
                <i class="material-icons">add_circle</i>
            </button>
        </div>
        <component is="researchresult"
                   ref="otherresults"
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
                   v-on:activating="handleactivating($event)"
                   v-on:deactivating="handledeactivating"
                   v-on:allowscroll="allowscroll"
                   v-on:saveresult="saveresult($event)"
                   v-on:editresearch="editresearch($event)">
        </component>
        <component is="store"></component>
    </div>
</template>
<script>
    import filtertokenwithclass from './mixins/analysis/filtertoken.js';
    import researchresult from './components/analysis/researchresult.vue';
    import store from './components/analysis/globalstore.vue';

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
            parentviewport: {type: Object, default: null},
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
                offsetfromactiveentity: 0,
                active: null,

            }
        },
        methods: {
            handledeactivating: function(){
                this.active = null;
                this.$emit('removehoverline');
            },
            handleactivating: function (key) {
                //deactivate the old entity
                //active = Other > Misc > Organization > ... > person
                if (this.active !== null) {
                    if (this.active - (this.PERSON.length + this.LOCATION.length + this.ORGANIZATION.length + this.MISC.length) >= 0) {
                        this.active -= (this.PERSON.length + this.LOCATION.length + this.ORGANIZATION.length + this.MISC.length);
                        this.manipulateentity('otherresults', this.active, 'active', false);
                    } else if (this.active - (this.PERSON.length + this.LOCATION.length + this.ORGANIZATION.length) >= 0) {
                        this.active -= (this.PERSON.length + this.LOCATION.length + this.ORGANIZATION.length);
                        this.manipulateentity('miscresults', this.active, 'active', false);
                    } else if (this.active - (this.PERSON.length + this.LOCATION.length) >= 0) {
                        this.active -= (this.PERSON.length + this.LOCATION.length);
                        this.manipulateentity('organisazionresults', this.active, 'active', false);
                    } else if (this.active - (this.PERSON.length) >= 0) {
                        this.active -= (this.PERSON.length);
                        this.manipulateentity('locationresults', this.active, 'active', false);
                    } else if (this.active >= 0) {
                        this.manipulateentity('personresults', this.active, 'active', false);
                    }
                }
                this.active = key;
            },
            manipulateentity: function (semclass, index, prop, value) {
                this.$refs[semclass][index].changeProperty(prop, value);
            },
            allowscroll: function () {
                this.$emit('allowscroll');
            },
            addresearch: function () {
                this.$emit('editresearch');
            },
            editresearch: function (researchData) {
                this.$emit('editresearch', researchData);
            },
            starthover: function (event) {
                this.hoverdatafromentity = event;
                this.$emit('starthover', event);
            },
            otherentityactive(offset) {
                if (this.offsetend === offset) {
                    return true;
                }
                return false;
            },
            searchGoogleWithResearchedEntities: function () {
                if (this.researchedentities.length === 0 || this.tokenstoshow === undefined || this.tokenstoshow.length === 0)
                    return;

                //console.log(JSON.stringify(this.researchedentities[0]));
                this['PERSON'].splice(0, this['PERSON'].length);
                this['LOCATION'].splice(0, this['LOCATION'].length);
                this['ORGANIZATION'].splice(0, this['ORGANIZATION'].length);
                this['MISC'].splice(0, this['MISC'].length);
                this['OTHER'].splice(0, this['OTHER'].length);
                if (this.researchedentities !== undefined) {
                    for (let j = 0; j < this.researchedentities.length; j++) {
                        let data = this.researchedentities[j];
                        if (this.researchedentities[j] !== undefined) {
                            if (this.researchedentities[j].sourcequery === undefined) {
                                console.log('this.researchedentities ' + j + ' is wrong:' + JSON.stringify(this.researchedentities[j]))
                            }
                            if (this.researchedentities[j].sourcequery.semanticClass !== 'PERSON'
                                && this.researchedentities[j].sourcequery.semanticClass !== 'LOCATION'
                                && this.researchedentities[j].sourcequery.semanticClass !== 'ORGANIZATION'
                                && this.researchedentities[j].sourcequery.semanticClass !== 'MISC') {
                                this['OTHER'].push(data);
                            } else {
                                this[this.researchedentities[j].sourcequery.semanticClass].push(data);
                            }
                        } else {
                            console.log('A researched Entity was undefined: ' + j);
                        }
                    }
                }
            },
            togglesemanticlass: function (semClass) {
                this.classestomark[semClass] = !this.classestomark[semClass];
                this.$emit('updateclassestomark', this.classestomark);
            },
            saveResult2: function (researchdata) {
                let indexes = {
                    start: [researchdata.sourcequery.source[0].textIndex],
                    end: [researchdata.sourcequery.source[researchdata.sourcequery.source.length - 1].textIndex + 1]
                };
                let socket = io(this.serverip + ':8080');
                socket.emit('saveresult', this.docid, indexes, researchdata.result['@id']);
                this.$emit('saveresult', researchdata);
            },
            saveresult: function (researchdata) {
                let socket = io(this.serverip + ':8080');
                socket.emit('saveresult', this.docid, this.selectedindexes, researchdata.result['@id']);
                this.$emit('saveresult', researchdata);
            },
            isElementInViewport: function (el) {
                let rect = el.getBoundingClientRect();
                return (
                    rect.top >= this.parentviewport.top &&
                    rect.bottom <= this.parentviewport.bottom
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
            try {
                this.searchGoogleWithResearchedEntities();
            } catch (err) {
                console.log('ERROR: ' + err);
            }
        },
        watch: {
            offsetfromactiveentity: {
                handler: function (newoffset) {

                }
            },
            researchdatatoupdate: {
                handler: function (newresearchdatatoupdate) {
                    let semClass = '';
                    if (newresearchdatatoupdate !== null) {
                        if (newresearchdatatoupdate.sourcequery !== undefined) {
                            semClass = newresearchdatatoupdate.sourcequery.semanticClass;
                            if (semClass !== undefined) {
                                if (semClass !== 'PERSON' && semClass !== 'LOCATION' && semClass !== 'ORGANIZATION' && semClass !== 'MISC') {
                                    let add = true;

                                    for (let i = 0; i < this['OTHER'].length; i++) {
                                        for (let k = 0; k < this['OTHER'][i].sourcequery.entityID.length; k++) {
                                            if (newresearchdatatoupdate.sourcequery.entityID === this['OTHER'][i].sourcequery.entityID[k]) {
                                                this['OTHER'][i].result = newresearchdatatoupdate.result;
                                                this['OTHER'][i].resultScore = newresearchdatatoupdate.resultScore;
                                                add = false;
                                                break;
                                            }
                                        }
                                    }
                                    if (add) {
                                        this['OTHER'].push(newresearchdatatoupdate);
                                    }
                                } else {
                                    let add = true;
                                    for (let i = 0; i < this[semClass].length; i++) {
                                        for (let k = 0; k < this[semClass][i].sourcequery.entityID.length; k++) {
                                            //DONT correct to '==='!!! it will fail.
                                            if (newresearchdatatoupdate.sourcequery.entityID == this[semClass][i].sourcequery.entityID[k]) {
                                                this[semClass][i].result = newresearchdatatoupdate.result;
                                                this[semClass][i].resultScore = newresearchdatatoupdate.resultScore;
                                                add = false;
                                                break;
                                            }
                                        }
                                    }
                                    if (add) {
                                        this[semClass].push(newresearchdatatoupdate);
                                    }
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
                try {
                    this.searchGoogleWithResearchedEntities();
                } catch (err) {
                    console.log('ERROR2: ' + err);
                }
            },
            hoverdata: {
                handler: function (hoverdata) {
                    if (hoverdata === 'undefined') {
                        console.log("WARNING: entitiesview vue active data undefined");
                        //return;?
                    }
                    if (hoverdata.hoverstarted === "research") {
                        return;
                    }
                    if (this.columnindex !== hoverdata.columnindex) {
                        return;
                    }

                    let wordtomarkonhoverDUMMY = [];
                    let newwordid = hoverdata.startword.textIndex;
                    let bb = null;
                    //For each semanticClass, scroll the entity into the view if it is not in the view of the user
                    if (hoverdata.semanticClass === 'PERSON') {
                        if (typeof this.$refs["personresults"] !== 'undefined' && this.$refs["personresults"].length > 0) {
                            for (let i = 0; i < this.$refs["personresults"].length; i++) {
                                let refElement = this.$refs.personresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (!this.isElementInViewport(refElement.$el)) {
                                        refElement.$el.scrollIntoView();
                                    }

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes;
                                }
                            }
                        }
                        if (bb == null) {
                            let el = this.$refs["personresultsparent"]
                            if (!this.isElementInViewport(el))
                                el.scrollIntoView();
                            bb = el.getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === 'LOCATION') {
                        if (typeof this.$refs["locationresults"] !== 'undefined' && this.$refs["locationresults"].length > 0) {
                            for (let i = 0; i < this.$refs["locationresults"].length; i++) {
                                let refElement = this.$refs.locationresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (!this.isElementInViewport(refElement.$el))
                                        refElement.$el.scrollIntoView();

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes
                                }
                            }
                        }
                        if (bb == null) {
                            let el = this.$refs["locationresultsparent"]
                            if (!this.isElementInViewport(el))
                                el.scrollIntoView();
                            bb = el.getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === "ORGANIZATION") {
                        if (typeof this.$refs["organisazionresults"] !== 'undefined' && this.$refs["organisazionresults"].length > 0) {
                            for (let i = 0; i < this.$refs["organisazionresults"].length; i++) {
                                let refElement = this.$refs.organisazionresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (!this.isElementInViewport(refElement.$el))
                                        refElement.$el.scrollIntoView();

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes
                                }
                            }
                        }
                        if (bb == null) {
                            let el = this.$refs["organisazionresultsparent"]
                            if (!this.isElementInViewport(el))
                                el.scrollIntoView();
                            bb = el.getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === "MISC") {
                        if (typeof this.$refs["miscresults"] !== 'undefined' && this.$refs["miscresults"].length > 0) {
                            for (let i = 0; i < this.$refs["miscresults"].length; i++) {
                                let refElement = this.$refs.miscresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (!this.isElementInViewport(refElement.$el))
                                        refElement.$el.scrollIntoView();

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes
                                }
                            }
                        }
                        if (bb == null) {
                            let el = this.$refs["miscresultsparent"]
                            if (!this.isElementInViewport(el))
                                el.scrollIntoView();
                            bb = el.getBoundingClientRect();
                        }
                    } else if (hoverdata.semanticClass === "OTHER") {
                        if (typeof this.$refs["otherresults"] !== 'undefined' && this.$refs["otherresults"].length > 0) {
                            for (let i = 0; i < this.$refs["otherresults"].length; i++) {
                                let refElement = this.$refs.otherresults[i];
                                if (refElement.researchdata.sourcequery.textindexes.indexOf(newwordid) > -1) {
                                    if (!this.isElementInViewport(refElement.$el))
                                        refElement.$el.scrollIntoView();

                                    bb = refElement.$el.getBoundingClientRect();
                                    wordtomarkonhoverDUMMY = refElement.researchdata.sourcequery.textindexes
                                }
                            }
                        }
                        if (bb == null) {
                            let el = this.$refs["otherresultsparent"]
                            if (!this.isElementInViewport(el))
                                el.scrollIntoView();
                            bb = el.getBoundingClientRect();
                        }
                    }
                    //Reset active because of changed positions aka renew the line.
                    let data = {hoverended: "research", offsetend: bb, wordtomarkonhover: wordtomarkonhoverDUMMY};
                    this.$emit('endhover', data);
                }
                ,
                deep: true
            },
        },
        components: {
            researchresult,
            store
        }
    }
</script>