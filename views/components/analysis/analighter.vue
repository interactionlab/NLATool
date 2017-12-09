<template>
    <div>
        <component :is="showMode" v-bind:persons="persons"></component>
    </div>
</template>
<script>
    import ner from './mixins/analysis/ner';
    import ned from './mixins/analysis/ned';
    import nec from './mixins/analysis/nec';
    import nerVue from './components/analysis/ner.vue';
    import necVue from './components/analysis/nec.vue';
    import nedVue from './components/analysis/ned.vue';


    export default {
        mixins: [ner, ned, nec],
        props: ['tokens', 'markerMode', 'persons'],
        data: function () {
            return {
                showMode: 'nerVue',
                tokens: this.tokens,
                persons: this.persons
            }
        },
        methods: {},
        components: {
            nerVue,
            necVue,
            nedVue,
        }
    }
</script>