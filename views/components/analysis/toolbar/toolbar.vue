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
                    <button v-on:click="changeMarkerMode('NE')"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">ALL</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Person')"
                            v-bind:class="{PERSON: classesToMark.PERSON}"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">PERSONS</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Location')"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">LOCATION</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Organization')"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">ORGANIZATION</small>
                    </button>
                    <button v-on:click="changeMarkerMode('Misc')"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">MISC</small>
                    </button>
                    <button v-on:click="changeMarkerMode('FM')"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">(FM)</small>
                    </button>
                    <button v-on:click="changeMarkerMode('NN')"
                            class="mdl-button mdl-js-button">
                        <small class="mdc-button">(NN)</small>
                    </button>
                </div>

                <div class="mdl-tabs__panel " id="research-panel">
                    <button v-bind:class="{'activeButton': onOff}"
                            class="mdl-button mdl-js-button"
                            v-on:click="setResearchMode('Info')">
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
    export default {
        props: {
            lang: String
        },
        data: function () {
            return {
                tool: 'analightertool',
                onOff: false,
                lang: this.lang,
                classesToMark: {
                    PERSON: false,
                    LOCATION: false,
                    ORGANIZATION: false,
                    MISC: false,
                    'I-PER': false,
                    'I-LOC': false,
                    'I-ORG': false,
                    'I-MISC': false,
                },
                noteModes: {
                    wordnote: true,
                    globalnote: false
                }
            }
        },
        methods: {
            toggleOnOff: function () {
                console.log('toggleing');
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
            changeMarkerMode: function (mode) {
                if (this.lang == 'English') {
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

                }
                else if (this.lang == 'German') {
                    console.log("D2");
                    if (mode == 'Person') {
                        mode = 'I-PER';
                        this.classesToMark["I-PER"] = !this.classesToMark["I-PER"];
                    }
                    if (mode == 'Location') {
                        mode = 'I-LOC';
                        this.classesToMark["I-LOC"] = !this.classesToMark["I-LOC"];
                    }
                    if (mode == 'Organization') {
                        mode = 'I-ORG';
                        this.classesToMark["I-ORG"] = !this.classesToMark["I-ORG"];
                    }
                    if (mode == 'Misc') {
                        mode = 'I-MISC';
                        this.classesToMark["I-MISC"] = !this.classesToMark["I-MISC"];
                    }
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
            toggleNoteMode: function () {
                this.noteModes.wordnote = !this.noteModes.wordnote;
                this.noteModes.globalnote = !this.noteModes.globalnote;
                this.$emit('changenotemode', this.noteModes);
            }
        }
    }

</script>