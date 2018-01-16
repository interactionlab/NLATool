<template> <!--editordocument in 8080-->

        <div class="mdl-grid">
            <!-- Bottons for localisation-->
            <div class="mdl-cell mdl-cell--10-col">

                <div v-if="!everythingshow">
                    <div v-bind:class="{researchresulthover: hover}"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate"
                         v-on:click="selectResult">

                        <div><img v-if="typeof researchresult.result.image !== 'undefined'"
                                  v-bind:src="researchresult.result.image.contentUrl"/>
                        </div>

                        <div v-if="typeof researchresult.result !== 'undefined'">
                            {{researchresult.result.name}}
                        </div>

                        <div v-if="typeof researchresult.result.description !== 'undefined'">
                            {{researchresult.result.description.articleBody}}
                        </div>

                        <div v-if="typeof researchresult.result.detailedDescription !== 'undefined'">
                            {{researchresult.result.detailedDescription.articleBody}}
                        </div>
                    </div>

                    <div>
                        <button v-on:click="selectResult">save</button>
                        <button v-on:click="showall">back</button>
                    </div>
                </div>

                <div v-else>
                    <div v-bind:class="{researchresulthover: hover}"
                         v-on:mouseout="accentuate"
                         v-on:mouseover="accentuate"
                         v-on:click="showall">

                        <div v-if="typeof researchresult.result !== 'undefined'">
                            {{researchresult.result.name}}
                        </div>
                        <div v-if="typeof researchresult.result.description !== 'undefined'">
                            {{researchresult.result.description}}
                        </div>
                    </div>

                    <div>
                        <button v-on:click="selectResult">save</button>
                    </div>

                </div>
            </div>
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
            showall: function () {
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