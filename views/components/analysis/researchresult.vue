<template> <!--editordocument in 8080-->

    <div class="mdl-layout mdl-js-layout">

        <main class="mdl-layout__content contentColor">
            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--12-col separate"
                     v-if="!everythingshow">
                    <div v-bind:class="{researchresulthover: hover}"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate"
                         v-on:click="showdetail">

                        <div cass="mdl-cell mdl-cell--12-col">
                            <img v-if="typeof researchresult.result.image !== 'undefined'"
                                 v-bind:src="researchresult.result.image.contentUrl"/>
                        </div>

                        <div class="mdl-cell mdl-cell--12-col"
                             v-if="typeof researchresult.result !== 'undefined'">
                            {{researchresult.result.name}}
                        </div>

                        <div class="mdl-cell mdl-cell--12-col"
                             v-if="typeof researchresult.result.description !== 'undefined'">
                            {{researchresult.result.description.articleBody}}
                        </div>

                        <div class="mdl-cell mdl-cell--12-col"
                             v-if="typeof researchresult.result.detailedDescription !== 'undefined'">
                            {{researchresult.result.detailedDescription.articleBody}}
                        </div>
                    </div>

                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button"
                                    v-on:click="saveResult">
                                <b class="mdc-button">Save</b>
                            </button>
                        </div>
                        <div class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button"
                                    v-on:click="showdetail">
                                <b class="mdc-button">Back</b>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="mdl-cell mdl-cell--12-col separate"
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
                            {{researchresult.result.description}}
                        </div>
                    </div>
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button" v-on:click="saveResult">
                                <b class="mdc-button">Save</b>
                            </button>
                        </div>
                        <div v-if="showallon" class="mdl-cell mdl-cell--2-col">
                            <button class="mdl-button mdl-js-button" v-on:click="showallresults">
                                <b class="mdc-button">Show All</b>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    export default {
        props: {
            researchresult: Object,
            researchresults: Object,
            index: Number,
            docid: Number,
            showallon: Boolean
        },
        data: function () {
            return {
                everythingshow: true,
                researchresult: this.researchresult,
                researchresults: this.researchresults,
                hover: false,
                index: this.index,
                docid: this.docid,
                showallon: false
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
        }
    }
</script>

<style scoped>

</style>