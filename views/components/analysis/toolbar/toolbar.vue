<template>
    <main class="mdl-layout__content headerRowLight">
        <div class="mdl-tabs mdl-js-tabs">
            <div class="mdl-grid" style="width: 100%; text-align: left">
                <!--Main Navigation:-->
                <div class="mdl-tabs__tab-bar">
                    <a href="#analysis-panel" class="mdl-tabs__tab is-active" v-on:click="changetool('analightertool')">Analysis</a>
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
                    <button v-on:click="changeMarkerMode('PERSON')"
                            v-bind:class="{PERSON_strong: classestomark.PERSON}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">PERSON</small>
                    </button>
                    <button v-on:click="changeMarkerMode('LOCATION')"
                            v-bind:class="{LOCATION_strong: classestomark.LOCATION}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">LOCATION</small>
                    </button>
                    <button v-on:click="changeMarkerMode('ORGANIZATION')"
                            v-bind:class="{ORGANIZATION_strong: classestomark.ORGANIZATION}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">ORGANIZATION</small>
                    </button>
                    <button v-on:click="changeMarkerMode('MISC')"
                            v-bind:class="{MISC_strong: classestomark.MISC}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">MISC</small>
                    </button>
                    <button v-on:click="changeMarkerMode('OTHER')"
                            v-bind:class="{OTHER_strong: classestomark.OTHER}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">OTHER</small>
                    </button>
                    <button v-on:click="changeMarkerMode('coref')"
                            v-bind:class="{coref: classestomark.coref}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">Coreference</small>
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
            classestomark:{ type: Object, default: null }
        },
        data: function () {
            return {
                tool: 'analightertool',
                onOff: false,
                correctionMode: false,
                allActive: false,
                noteModes: {
                    wordnote: true,
                    globalnote: false
                },

            }
        },
        methods: {
            toggleOnOff: function () {
                this.onOff = !this.onOff;
            },
            changetool: function (tool) {
                if (tool === 'analightertool') {
                    this.$emit('emitanalighter');
                } else if (tool === 'notestool') {
                    this.$emit('emitnotes');
                }
                this.tool = tool;
            },

            allButton: function () {
                if (this.allActive === false) {
                    this.allActive = true;
                    if (this.classestomark.PERSON === false) {
                        this.changeMarkerMode('PERSON');
                    }
                    if (this.classestomark.LOCATION === false) {
                        this.changeMarkerMode('LOCATION');
                    }
                    if (this.classestomark.ORGANIZATION === false) {
                        this.changeMarkerMode('ORGANIZATION');
                    }
                    if (this.classestomark.MISC === false) {
                        this.changeMarkerMode('MISC');
                    }
                    if (this.classestomark.OTHER === false) {
                        this.changeMarkerMode('OTHER');
                    }
                    this.classestomark.PERSON = true;
                    this.classestomark.LOCATION = true;
                    this.classestomark.ORGANIZATION = true;
                    this.classestomark.MISC = true;
                    this.classestomark.OTHER = true;
                } else {
                    this.changeMarkerMode('PERSON');
                    this.classestomark.PERSON = false;
                    this.changeMarkerMode('LOCATION');
                    this.classestomark.LOCATION = false;
                    this.changeMarkerMode('ORGANIZATION');
                    this.classestomark.ORGANIZATION = false;
                    this.changeMarkerMode('MISC');
                    this.classestomark.MISC = false;
                    this.changeMarkerMode('OTHER');
                    this.classestomark.OTHER = false;
                    this.allActive = false;
                }
            },
            changeMarkerMode: function (mode) {
                this.classestomark[mode] = !this.classestomark[mode];
                this.$emit('updateclassestomark', this.classestomark);
            },
            setCorrectionMode: function () {
                //TODO: proper check if on or off, when word is selected
                this.correctionMode = !this.correctionMode;
                this.classestomark.POS = !this.classestomark.POS;
                this.$emit('entercorrectionmode', this.correctionMode);
                this.$emit('updateclassestomark', this.classestomark);
            },
            toggleNoteMode: function () {
                this.noteModes.wordnote = !this.noteModes.wordnote;
                this.noteModes.globalnote = !this.noteModes.globalnote;
                this.$emit('changenotemode', this.noteModes);
            },
        }
    }
</script>