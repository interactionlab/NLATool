<template>
    <textarea
              v-model="inputtext"
              v-on:keyup.enter="submitIt"
              id="textbox"
              rows="1"></textarea>
</template>

<script>
    export default {
        props:{
            inputtext: { type: String, default: "" },
            submitit: { type: Boolean, default: false }
        },
        data:function () {
            return{
            }
        },
        mounted: function () {
            this.$nextTick(() => {
                autosize(this.$el)
            })
        },
        methods:{
            submitIt:function () {
                this.$emit('submitit', this.inputtext);
            }
        },
        watch:{
            submitit:function (newvalue) {
                if(newvalue){
                    this.submitIt();
                }
            }
        }
    }
</script>

<style scoped>

</style>