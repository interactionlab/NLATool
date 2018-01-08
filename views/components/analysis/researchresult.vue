<template>
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
</template>

<script>
    export default {
        props:{
            researchresult:Object,
            research: Object
        },
        data:function(){
            return{
                researchresult:this.researchresult,
                research: this.research
            }
        }
    }
</script>

<style scoped>

</style>