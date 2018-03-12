<template>
    <span></span>
</template>

<script>
    export default {
        props:{
            tokens: { type: Array, default: function () { return [] }},
        },
        data:function () {
            return{
            }
        },
        watch: {
            tokens: {
                handler: function () {
                    this.$emit('resize', this.tokens);
                },
                deep: true,
                immediate: true
            }
        },
    }
</script>

<style scoped>

</style>