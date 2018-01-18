<template> <!--editordocument in 8080-->

    <div class="mdl-layout mdl-js-layout">

        <main class="mdl-layout__content">
            <div class="mdl-grid">
                <div class="mdl-cell mdl-cell--12-col"
                     v-if="!everythingshow">
                    <div v-bind:class="{researchresulthover: hover}"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate"
                         v-on:click="selectResult">

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

                    <div>
                        <button v-on:click="selectResult">save</button>
                        <button v-on:click="showdetail">back</button>
                    </div>
                </div>

                <div class="mdl-cell mdl-cell--12-col"
                     v-else>
                    <div class="mdl-cell mdl-cell--12-col"
                         v-bind:class="{researchresulthover: hover}"
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
                        <div class="mdl-grid">
                            <div class="mdl-cell mdl-cell--10-col">
                                <button class="mdl-button mdl-js-button" v-on:click="selectResult">
                                    <b class="mdc-button">Save</b>
                                </button>

                                <button class="mdl-button mdl-js-button" v-on:click="showallresults">
                                    <b class="mdc-button">Show All</b>
                                </button>
                            </div>
                        </div>


                        <div>
                            <button v-on:click="selectResult">save</button>
                            <button v-on:click="showallresults">Show All</button>
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
            index: Number
        },
        data: function () {
            return {
                everythingshow: true,
                researchresult: this.researchresult,
                researchresults: this.researchresults,
                hover: false,
                index: this.index
            }
        },
        methods: {
            showallresults: function () {
                this.$emit('showallresults');
            },
            showdetail: function () {
                this.everythingshow = !this.everythingshow;
            },
            accentuate: function () {
                this.hover = !this.hover;
            },
            selectResult: function () {
                let soket = io('http://localhost:8080');
                // socket.$emit('selectresult',this.index);
                this.$emit('selectresult', this.index);
            }
        }
    }
</script>

<style scoped>

</style>