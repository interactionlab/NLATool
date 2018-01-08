<template>
    <div><img v-bind:src="researchresult.image.contentUrl"/></div>

    <div>{{researchresult.result.name}}</div>
    <div> {{researchresult.description}}</div>
    <div> {{researchresult.detailedDescription.articleBody}}</div>
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