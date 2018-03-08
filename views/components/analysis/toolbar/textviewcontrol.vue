<template>
    <div class="mdl_grid" style="position: relative;">
        <div class="mdl-cell mdl-cell--6-col scopeButton icon-arrow-left" v-on:click="changeScope(true)"></div>
        <div class="mdl-cell mdl-cell--6-col scopeButton icon-arrow-right" style="text-align: right;" id="forwardScopeButton" v-on:click="changeScope(false)">
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