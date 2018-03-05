<template>
    <div class="mdl_grid">
        <div class="mdl-cell mdl-cell--2-col scopeButton icon-arrow-left"
             v-on:click="changeScope(true)"></div>
        <div class="mdl-cell mdl-cell--2-col scopeButton icon-arrow-right"
             id="forwardScopeButton"
             v-on:click="changeScope(false)">
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                numberofcolumns: 0,
            }
        },
        methods: {
            changeScope: function (direction) {
                this.$emit('changescope', direction);
            },
        },
    }
</script>

<style scoped>

</style>