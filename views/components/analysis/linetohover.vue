<template>
    <div>
        <div style="height: 2px;position: absolute; z-index: 11;"
        v-bind:style="{top : offsetstart.top + offsetstart.height +'px', left : offsetstart.left + offsetstart.width/2.0 +'px', width: offsetend.left - 12 - offsetstart.left -offsetstart.width/2.0+'px'}" v-bind:class="semanticclass"></div>
        
        <div style="width: 2px;height: 5px;position: absolute;z-index: 11;" v-bind:style="{top : offsetstart.top + offsetstart.height -5 +'px', left : offsetstart.left + offsetstart.width/2.0 +'px'}" v-bind:class="semanticclass"></div>
        
        <div style="width: 2px;position: absolute;z-index:  11;" v-bind:style="{top : Math.min(offsetend.top + offsetend.height/2.0, offsetstart.top + offsetstart.height) +'px', left : offsetend.left - 14 +'px', height: Math.max(offsetend.top + offsetend.height/2.0, offsetstart.top + offsetstart.height) - Math.min(offsetend.top + offsetend.height/2.0, offsetstart.top + offsetstart.height)+'px'}" v-bind:class="semanticclass"></div>
        
        <div style="width: 14px;height: 2px;position: absolute;z-index: 11" v-bind:style="{top : offsetend.top + offsetend.height/2.0 +'px', left : offsetend.left - 14 +'px'}" v-bind:class="semanticclass"></div>
    
    </div>
</template>

<script>
    export default {
        props: {
            offsetstart: { type: Object, default: null },
            offsetend: { type: Object, default: null },
            semanticclass: { type: Object, default: null },
        },
        data: function () {
            return {
            }
        },
    }
</script>