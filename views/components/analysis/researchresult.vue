<template> <!--editordocument in 8080-->
    <div v-bind:class="{researchresulthover: hover}"
         v-on:mouseout="accentuate"
         v-on:mouseover="accentuate"
         v-on:click="selectResult">

        <div><img v-if="typeof researchresult.result.image !== 'undefined'"
                  v-bind:src="researchresult.result.image.contentUrl"/></div>
        <div v-if="typeof researchresult.result !== 'undefined'">{{researchresult.result.name}}</div>
        <div v-if="typeof researchresult.result.description !== 'undefined'">{{researchresult.result.description}}</div>
        <div v-if="typeof researchresult.result.detailedDescription !== 'undefined'">
            {{researchresult.result.detailedDescription.articleBody}}
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