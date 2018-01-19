<template>
    <div>
        <component :is="showmode"
                   v-bind:tokens="tokens"
                   v-bind:selectedindexes="selectedindexes"></component>
    </div>
</template>
<script>
    import nerVue from './components/analysis/ner.vue';
    import necVue from './components/analysis/nec.vue';
    import correction from './components/analysis/correction.vue';
    import entitiesview from './components/analysis/entitiesview.vue';


    export default {

        props: {
            tokens: Array,
            selectedindexes: Object,
            showmode: String,
        },
        data: function () {
            return {
                tokens: this.tokens,
                showmode: this.showmode,
                selectedindexes: this.selectedindexes
            }
        },
        methods: {},
        components: {
            nerVue,
            necVue,
            correction,
            entitiesview
        }
    }
</script>