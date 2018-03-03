<template>
    <div class="mdl_grid">
        <div class="mdl-cell mdl-cell--2-col scopeButton icon-arrow-left"
             v-on:click="changeScope(true)"></div>
        <div class="mdl-cell mdl-cell--2-col scopeButton icon-arrow-right"
             id="forwardScopeButton"
             v-on:click="changeScope(false)">
        </div>
        <input type="range"
               min="0"
               max="12"
               value="1"
               class="slider"
               id="myRange"
               v-model="numberofcolumns"
               v-on:change="setNumberOfColumns">
        <span v-if="numberofcolumns > 0">{{numberofcolumns}}</span>
        <span v-else>auto</span>
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
            setNumberOfColumns: function () {
                console.log('New Number of Columns: ' + this.numberofcolumns);
                this.$emit('setnumberofcolumns', this.numberofcolumns);
            }
        },
    }
</script>

<style scoped>

</style>