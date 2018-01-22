<template>
    <main class="mdl-layout__content headerRowLight">
        <div class="mdl-tabs mdl-js-tabs">
            <div class="mdl-grid" style="width: 100%; text-align: left">
                <!--Main Navigation:-->
                <div class="mdl-tabs__tab-bar">
                    <a href="#analysis-panel" class="mdl-tabs__tab is-active" v-on:click="changetool('analightertool')">Analysis</a>
                    <a href="#research-panel" class="mdl-tabs__tab" v-on:click="changetool('researchtool')">Research</a>
                    <a href="#notes-panel" class="mdl-tabs__tab" v-on:click="changetool('notestool')">Notes</a>
                </div>
            </div>
            <!--Tab values-->
            <div class="mdl-grid">
                <div class="mdl-tabs__panel is-active " id="analysis-panel">
                    <button v-on:click="allButton"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">ALL</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Person')"
                            v-bind:class="{PERSON: classesToMark.PERSON}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">PERSONS</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Location')"
                            v-bind:class="{LOCATION: classesToMark.LOCATION}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">LOCATION</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Organization')"
                            v-bind:class="{ORGANIZATION: classesToMark.ORGANIZATION}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">ORGANIZATION</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Misc')"
                            v-bind:class="{MISC: classesToMark.MISC}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">MISC</small>
                    </button>
                    <button class="mdl-button mdl-js-button"
                            v-on:click="setCorrectionMode()"
                            v-bind:class="{POS: classesToMark.POS}">
                        <small class="mdc-button">Correction</small>
                    </button>
                </div>

                <div class="mdl-tabs__panel " id="research-panel">
                    <button v-bind:class="{'activeButton': onOff}"
                            class="mdl-button mdl-js-button"
                            v-on:click="setResearchMode('Info')">
                        <small class="mdc-button">Information</small>
                    </button>

                    <button class="mdl-button mdl-js-button">
                        <small class="mdc-button">Map</small>
                    </button>
                    <button class="mdl-button mdl-js-button">
                        <small class="mdc-button">Statistics</small>
                    </button>
                </div>

                <div class="mdl-tabs__panel " id="notes-panel">
                    <!--No Tab Value needed-->
                    <button class="mdl-button mdl-js-button"
                            v-on:click="toggleNoteMode">
                        <small class="mdc-button">Word Notes</small>
                    </button>
                    <button class="mdl-button mdl-js-button"
                            v-on:click="toggleNoteMode">
                        <small class="mdc-button">Global Notes</small>
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';
    export default {
        mixins: [getselectedtext],
        props: {
            tokens: Array,
            selectedindexes: Object
        },
        data: function () {
            return {
                tool: 'analightertool',
                onOff: false,
                tokens: this.tokens,
                selectedindexes: this.selectedindexes,
                correctionMode: false,
                classesToMark: {
                    PERSON: false,
                    LOCATION: false,
                    ORGANIZATION: false,
                    MISC: false,
                    POS: false,
                },
                noteModes: {
                    wordnote: true,
                    globalnote: false
                }
            }
        },
        methods: {
            toggleOnOff: function () {
                console.log('toggling');
                this.onOff = !this.onOff;
            },
            changetool: function (tool) {
                if (tool === 'analightertool') {
                    this.$emit('emitanalighter');
                } else if (tool === 'notestool') {
                    this.$emit('emitnotes');
                } else if (tool === 'researchtool') {
                    this.$emit('emitresearch');
                }
                this.tool = tool;
            },

            allButton: function () {

                if (this.classesToMark.PERSON === false) {
                    this.changeMarkerMode('Person');
                }
                if (this.classesToMark.LOCATION === false) {
                    this.changeMarkerMode('Location');
                }
                if (this.classesToMark.ORGANIZATION === false) {
                    this.changeMarkerMode('Organization');
                }
                if (this.classesToMark.MISC === false) {
                    this.changeMarkerMode('Misc');
                }
                for (let key in this.classesToMark) {
                    this.classesToMark[key] = true;
                }
            },

            changeMarkerMode: function (mode) {

                if (mode == 'Person') {
                    mode = 'PERSON';
                    this.classesToMark.PERSON = !this.classesToMark.PERSON;
                }
                if (mode == 'Location') {
                    mode = 'LOCATION';
                    this.classesToMark.LOCATION = !this.classesToMark.LOCATION;
                }
                if (mode == 'Organization') {
                    mode = 'ORGANIZATION';
                    this.classesToMark.ORGANIZATION = !this.classesToMark.ORGANIZATION;
                }
                if (mode == 'Misc') {
                    mode = 'MISC';
                    this.classesToMark.MISC = !this.classesToMark.MISC;
                }
                if(mode == 'POS'){
                    mode = 'POS';
                    this.classesToMark.POS = !this.classesToMark.POS;
                }
                this.$emit('changemarkermode', [mode, this.classesToMark]);
            },
            changeReseachButton: function (mode) {
                if (mode == 'Info') {
                    mode = 'activeButton';
                    this.onOff.Info = !this.onOff.Map;
                }
                if (mode == 'Map') {
                    mode = 'activeButton';
                    this.onOff.Map = !this.onOff.Info;
                }
                else {
                    if (mode == 'Info') {
                        mode = !onOff;
                    }
                    if (mode == 'Map') {
                        mode = !onOff;
                    }
                }
            },
            setResearchMode: function (mode) {
                this.onOff = !this.onOff;
                console.log('got the Event:' + mode);
                this.$emit('changeresearchrode', [mode]);
            },
            setCorrectionMode: function () {
                //TODO: check if on or off
                this.correctionMode = !this.correctionMode;
                this.classesToMark.POS = !this.classesToMark.POS;
                console.log('Correction Mode is ' + this.correctionMode);
                this.$emit('entercorrectionmode', this.correctionMode);
            },
            toggleNoteMode: function () {
                this.noteModes.wordnote = !this.noteModes.wordnote;
                this.noteModes.globalnote = !this.noteModes.globalnote;
                this.$emit('changenotemode', this.noteModes);
            }
        }
    }

</script>