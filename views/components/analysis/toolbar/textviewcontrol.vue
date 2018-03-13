<template>
    <div class="mdl_grid" style="position: relative;">
        <div class="mdl-cell mdl-cell--5-col scopeButton"
            v-bind:class="{'icon-arrow-left': leftenabled }"
            v-on:click="changeScope(true)"></div>
        <div class="mdl-cell mdl-cell--2-col" style="display: inline-block;">Page {{currentpage}} of {{pagecount}}</div>
        <div class="mdl-cell mdl-cell--5-col scopeButton " style="text-align: right;"
            v-bind:class="{'icon-arrow-right': rightenabled }"
            v-on:click="changeScope(false)">
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            currentpage: { type: Number, default: 0 },
            pagecount: { type: Number, default: 0 },
        },
        data: function () {
            return {
                leftenabled: false,
                rightenabled: true,
            }
        },
        watch:{
            currentpage: function(){
                if (this.currentpage === 1){
                    this.leftenabled = false;
                } else {
                    this.leftenabled = true;
                }
                if (this.currentpage === this.pagecount) {
                    this.rightenabled = false;
                } else {
                    this.rightenabled = true;
                }
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