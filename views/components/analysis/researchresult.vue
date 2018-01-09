<template>
<<<<<<< HEAD
    <!-- Shows the image-->
    <div><img v-bind:src="researchresult.image.contentUrl"/></div>
    <!-- Shows a Name -->
    <div>{{researchresult.result.name}}</div>
    <!-- Shows a short description -->
    <div> {{researchresult.description}}</div>
    <!-- Shows a longer description -->
    <div> {{researchresult.detailedDescription.articleBody}}</div>
    <!-- Shows the source -->
    <div>{{research}}</div>
=======
    <div>
        <div><img v-if="typeof researchresult.result.image !== 'undefined'"
                  v-bind:src="researchresult.result.image.contentUrl"/></div>

        <div v-if="typeof researchresult.result !== 'undefined'">{{researchresult.result.name}}</div>
        <div v-if="typeof researchresult.result.description !== 'undefined'"> {{researchresult.result.description}}</div>
        <div v-if="typeof researchresult.result.detailedDescription !== 'undefined'"> {{researchresult.result.detailedDescription.articleBody}}</div>
    </div>
>>>>>>> 7042b261b310ebf506e3b132556f84e791e3ed8a
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