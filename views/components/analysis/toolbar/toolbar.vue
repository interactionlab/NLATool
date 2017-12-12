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
                    <button class="mdl-button mdl-js-button">
                        <small class="mdc-button">Information</small>
                    </button>
                    <button class="mdl-button mdl-js-button">
                        <small class="mdc-button">Map</small>
                    </button>
                    <button class="mdl-button mdl-js-button">
                        <small class="mdc-button">Statistics</small>
                    </button>
                    <button class="mdl-button mdl-js-button">
                        <small class="mdc-button">Correction</small>
                    </button>
                </div>

                <div class="mdl-tabs__panel " id="notes-panel">
                    <!--No Tab Value needed-->
                    <button class="mdl-button mdl-js-button">
                        <small class="mdc-button"></small>
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
                lang: this.lang
            }
        },
        methods: {
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
                if(this.lang == 'English'){

                    console.log("English classes selected!");

                    if(mode == 'Person'){
                        mode = 'PERSON';
                    }
                    if(mode == 'Location'){
                        mode = 'LOCATION';
                    }
                    if(mode == 'Organization'){
                        mode = 'ORGANIZATION';
                    }
                    if(mode == 'Misc'){
                        mode = 'MISC';
                    }
                }else if(this.lang == 'German'){
                    if(mode == 'Person'){
                        mode = 'I-PER';
                    }
                    if(mode == 'Location'){
                        mode = 'I-LOC';
                    }
                    if(mode == 'Organization'){
                        mode = 'I-ORG';
                    }
                    if(mode == 'Misc'){
                        mode = 'I-MISC';
                    }
                }
                this.$emit('changemarkermode', [mode]);
            },
        },
        components: {
        }
    }
</script>