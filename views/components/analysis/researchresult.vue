<template> <!--editordocument in 8080-->
    <main class="mdl-layout__content">
        <div class="mdl-grid">
            <!-- Bottons for localisation-->
            <div class="mdl-cell mdl-cell--10-col">
                <div v-bind:class="{researchresulthover: hover}"
                     v-on:mouseout="accentuate"
                     v-on:mouseover="accentuate"
                     v-on:click="selectResult">

                    <div><img v-if="typeof researchresult.result.image !== 'undefined'"
                              v-bind:src="researchresult.result.image.contentUrl"
                              id="imageid"/>
                    </div>

                    <div v-if="typeof researchresult.result !== 'undefined'"
                         id="nameid">
                        {{researchresult.result.name}}
                    </div>

                    <div v-if="typeof researchresult.result.description !== 'undefined'"
                         id="shortdescrid">
                    </div>

                    <div v-if="typeof researchresult.result.detailedDescription !== 'undefined'"
                         id="longdescrid">
                        {{researchresult.result.detailedDescription.articleBody}}
                    </div>
                </div>
            </div>
        </div>
    </main>
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
                researchresult: this.researchresult,
                researchresults: this.researchresults,
                hover: false,
                index: this.index
            }
        },
        methods: {
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