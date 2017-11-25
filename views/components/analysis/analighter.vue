<template>
    <div>
        <ul>
            <li>
                <button v-on:click="showNer">NER</button>
            </li>
            <li>
                <button v-on:click="showNed">NED</button>
            </li>
            <li>
                <button v-on:click="showNec">NEC</button>
            </li>
        </ul>
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
        props: ['tokens'],
        data: function () {
            return {
                showMode: 'nerVue',
                tokens: this.tokens
            }
        },
        methods: {
            showNer: function () {
                console.log('The tokens we got: '+this.tokens);
                console.log(this.filterPos(this.tokens, 'FM'));

                performMark(this.filterPos(this.tokens, 'FM'));
                this.showMode = 'nerVue';
            },
            showNed: function () {
                this.showMode = 'nedVue';
            },
            showNec: function () {
                this.showMode = 'necVue';
            },
        },
        components: {
            nerVue,
            necVue,
            nedVue
        }
    }
</script>