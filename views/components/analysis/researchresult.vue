<template> <!--editordocument in 8080-->

    <div class="mdl-layout mdl-js-layout">
        <main class="mdl-layout__content contentColor separate">
            <div class="mdl-grid deleteSpaces">
                <div class="mdl-cell mdl-cell--12-col"
                     v-if="!everythingshow">

                    <div v-bind:class="{researchresulthover: hover}"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate"
                         v-on:click="showdetail">
                        <div class="mdl-grid deleteSpaces"
                             v-if="typeof researchresult.result !== 'undefined' ">
                            <div v-if="showimage" class="mdl-cell mdl-cell--4-col graybox">
                                <img v-if="typeof researchresult.result.image !== 'undefined'"
                                     v-bind:src="researchresult.result.image.contentUrl"/>
                            </div>

                            <div v-else class="mdl-cell mdl-cell--4-col">
                                <component is="googlemap"
                                           v-bind:mapcoordinates="mapcoordinates"
                                           v-bind:index="index"></component>
                            </div>

                            <div class="mdl-grid mdl-cell mdl-cell--8-col deleteSpaces">
                                <div class="mdl-cell mdl-cell--10-col deleteSpaces"
                                     v-if="typeof researchresult.result !== 'undefined'">
                                    {{researchresult.result.name}}
                                </div>
                                <div class="mdl-layout-spacer"></div>
                                <button class="mdl-cell mdl-cell--1-col mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon deleteSpaces">
                                    <i class="material-icons">edit</i>
                                </button>
                            </div>

                            <div v-if="typeof researchresult.result.description !== 'undefined'">
                                {{researchresult.result.description.articleBody}}
                            </div>

                            <div v-if="typeof researchresult.result.detailedDescription !== 'undefined'">
                                {{researchresult.result.detailedDescription.articleBody}}
                            </div>
                        </div>
                    </div>

                    <div class="mdl-grid deleteSpaces">
                        <div class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button"
                                    v-on:click="saveResult">
                                <i class="mdc-button">Save</i>
                            </button>
                        </div>
                        <div class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button"
                                    v-on:click="showdetail">
                                <i class="mdc-button">Back</i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mdl-cell mdl-cell--12-col"
                     v-else>
                    <div v-bind:class="{researchresulthover: hover}"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate"
                         v-on:click="showdetail">
                        <div class="mdl-cell mdl-cell--12-col"
                             v-if="typeof researchresult.result !== 'undefined'">
                            {{researchresult.result.name}}
                        </div>
                        <div class="mdl-cell mdl-cell--12-col"
                             v-if="typeof researchresult.result.description !== 'undefined'">
                            {{researchresult.result.description.articleBody}}
                        </div>
                    </div>
                    <div class="mdl-grid deleteSpaces">
                        <div class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button"
                                    v-on:click="saveResult">
                                <i class="mdc-button">Save</i>
                            </button>
                        </div>
                        <div v-if="showallon" class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button"
                                    v-on:click="showallresults">
                                <i class="mdc-button">Show All</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import googlemap from './components/analysis/googlemap.vue';

    export default {
        props: {
            researchresult: Object,
            researchresults: Object,
            index: Number,
            docid: Number,
            showallon: Boolean,
            mapcoordinates: Array
        },
        data: function () {
            return {
                showimage: false,
                everythingshow: true,
                researchresult: this.researchresult,
                researchresults: this.researchresults,
                hover: false,
                index: this.index,
                docid: this.docid,
                showallon: this.showallon,
                mapcoordinates: this.mapcoordinates
            }
        },
        methods: {
            showallresults: function () {
                this.$emit('showallresults');
                this.showallon = false;
            },
            showdetail: function () {
                console.log('Show the detailed List: ' + this.everythingshow);
                this.everythingshow = !this.everythingshow;
            },
            accentuate: function () {
                this.hover = !this.hover;
            },
            saveResult: function () {
                let socket = io('http://localhost:8080');
                socket.emit('saveresult', this.index, this.researchresult, this.docid);
                this.$emit('saveresult', this.index);
                this.showallon = true;
            }
        },
        components: {
            googlemap
        }
    }
</script>

<style scoped>

</style>