<template>
    <div>
        <div style="height: 2px;background-color: orange;position: absolute; z-index: 11;"
        v-bind:style="{top : offsetstart.top + offsetstart.height +3 +'px', left : offsetstart.left + offsetstart.width/2.0 +'px', width: offsetend.left - 12 - offsetstart.left -offsetstart.width/2.0+'px'}"></div>
        
        <div style="width: 2px;height: 5px;background-color: orange;position: absolute;z-index: 11;" v-bind:style="{top : offsetstart.top + offsetstart.height -2 +'px', left : offsetstart.left + offsetstart.width/2.0 +'px'}"></div>
        
        <div style="width: 2px;background-color: orange;position: absolute;z-index:  11;" v-bind:style="{top : Math.min(offsetend.top + offsetend.height/2.0, offsetstart.top + offsetstart.height +3) +'px', left : offsetend.left - 14 +'px', height: Math.max(offsetend.top + offsetend.height/2.0, offsetstart.top + offsetstart.height +3) - Math.min(offsetend.top + offsetend.height/2.0, offsetstart.top + offsetstart.height +3)+'px' }"></div>
        
        <div style="width: 14px;height: 2px;background-color: orange;position: absolute;z-index: 11" v-bind:style="{top : offsetend.top + offsetend.height/2.0 +'px', left : offsetend.left - 14 +'px'}"></div>
    
    </div>
</template>

<script>
    export default {
        props: {
            offsetstart: Object,
            offsetend: Object,
        },
        data: function () {
            return {
                offsetstart: this.offsetstart,
                offsetend: this.offsetend,
            }
        },
    }
</script>