<template>
    <div>
        <div><img v-if="typeof researchresult.result.image !== 'undefined'"
                  v-bind:src="researchresult.result.image.contentUrl"/></div>

        <div v-if="typeof researchresult.result !== 'undefined'">{{researchresult.result.name}}</div>
        <div v-if="typeof researchresult.result.description !== 'undefined'"> {{researchresult.result.description}}</div>
        <div v-if="typeof researchresult.result.detailedDescription !== 'undefined'"> {{researchresult.result.detailedDescription.articleBody}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            researchresult: Object,
            researchresults: Object
        },
        data: function () {
            return {
                researchresult: this.researchresult,
                researchresults: this.researchresults
            }
        }
    }
</script>

<style scoped>

</style>