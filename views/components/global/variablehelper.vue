<template>
    <span></span>
</template>

<script>
    export default {
        props:{
            tokens: Array
        },
        data:function () {
            return{
                tokens: this.tokens
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