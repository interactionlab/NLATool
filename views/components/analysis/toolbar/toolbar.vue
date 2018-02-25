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
                    <button v-on:click="allButton()"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">ALL</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Person')"
                            v-bind:class="{PERSON: classestomark.PERSON}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">PERSON</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Location')"
                            v-bind:class="{LOCATION: classestomark.LOCATION}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">LOCATION</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Organization')"
                            v-bind:class="{ORGANIZATION: classestomark.ORGANIZATION}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">ORGANIZATION</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Misc')"
                            v-bind:class="{MISC: classestomark.MISC}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">MISC</small>
                    </button>
                    <button v-on:click="changeMarkerMode('coref')"
                            v-bind:class="{coref: classestomark.coref}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">Coreference</small>
                    </button>
                    <button class="mdl-button mdl-js-button"
                            v-on:click="setCorrectionMode()"
                            v-bind:class="{POS: classestomark.POS}">
                        <small class="mdc-button">Correction</small>
                    </button>
                </div>

                <div class="mdl-tabs__panel " id="research-panel">
                    <button class="mdl-button mdl-js-button">
                        <small class="mdc-button">Information</small>
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
            selectedindexes: Object,
            classestomark:Object
        },
        data: function () {
            return {
                tool: 'analightertool',
                onOff: false,
                tokens: this.tokens,
                selectedindexes: this.selectedindexes,
                correctionMode: false,
                allActive: false,
                classestomark: this.classestomark,
                noteModes: {
                    wordnote: true,
                    globalnote: false
                },

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

                if (this.allActive === false) {

                    this.allActive = true;

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

                    this.classesToMark.PERSON = true;
                    this.classesToMark.LOCATION = true;
                    this.classesToMark.ORGANIZATION = true;
                    this.classesToMark.MISC = true;
                } else {
                    this.changeMarkerMode('Person');
                    this.classesToMark.PERSON = false;
                    this.changeMarkerMode('Location');
                    this.classesToMark.LOCATION = false;
                    this.changeMarkerMode('Organization');
                    this.classesToMark.ORGANIZATION = false;
                    this.changeMarkerMode('Misc');
                    this.classesToMark.MISC = false;

                    this.allActive = false;
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
                if (mode == 'POS') {
                    mode = 'POS';
                    this.classesToMark.POS = !this.classesToMark.POS;
                }
                if (mode == 'coref') {
                    mode = 'coref';
                    this.classesToMark.coref = !this.classesToMark.coref;
                }
                this.$emit('changemarkermode', [mode, this.classesToMark]);
            },

            setCorrectionMode: function () {
                //TODO: proper check if on or off, when word is selected
                this.correctionMode = !this.correctionMode;
                this.classesToMark.POS = !this.classesToMark.POS;
                console.log('Correction Mode is ' + this.correctionMode);
                this.$emit('entercorrectionmode', this.correctionMode);
                this.$emit('changemarkermode', ['POS', this.classesToMark]);
            },
            toggleNoteMode: function () {
                this.noteModes.wordnote = !this.noteModes.wordnote;
                this.noteModes.globalnote = !this.noteModes.globalnote;
                this.$emit('changenotemode', this.noteModes);
            },

        }
    }
</script>