<template>
    <div>
        <component :is="showMode"
                   v-bind:tokens="tokens"
                   v-bind:selectedindexes="selectedindexes"></component>
    </div>
</template>
<script>
    import nerVue from './components/analysis/ner.vue';
    import necVue from './components/analysis/nec.vue';
    import correction from './components/analysis/correction.vue';


    export default {

        props: {
            tokens: Array,
            selectedindexes: Object
            showMode: Boolean,
        },
        data: function () {
            return {
                tokens: this.tokens,
                showMode: this.showMode,
                selectedindexes: this.selectedindexes
            }
        },
        methods: {},
        components: {
            nerVue,
            necVue,
            correction,
        }
    }
</script>