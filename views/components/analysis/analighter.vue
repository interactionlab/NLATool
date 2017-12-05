<template>
    <div>
        <component :is="showMode"></component>
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
        props: ['tokens', 'markerMode'],
        data: function () {
            return {
                showMode: 'nerVue',
                tokens: this.tokens,
            }
        },
        methods: {
            showNer: function () {
                //console.log('FM Filter on the tokens: ' + this.filterPos(this.tokens, 'FM'));
                this.showMode = 'nerVue';
                this.$emit('changemarkermode', ['NE']);
            },
            showNed: function () {
                this.showMode = 'nedVue';
                this.$emit('changemarkermode', ['FM']);
            },
            showNec: function () {
                this.showMode = 'necVue';
                this.$emit('changemarkermode', ['NN']);
            },
        },
        components: {
            nerVue,
            necVue,
            nedVue
        }
    }
</script>