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
        <div v-if="showMode === 'NER'">
            <nerVue></nerVue>
        </div>
        <div v-else-if="showMode === 'NED'">
            <nedVue></nedVue>
        </div>
        <div v-else-if="showMode === 'NEC'">
            <necVue></necVue>
        </div>
    </div>
</template>
<script>
    import ner from './mixins/analysis/ner';
    import ned from './mixins/analysis/ned';
    import nec from './mixins/analysis/nec';

    import nerVue from './components/analysis/ner.vue';

    let showMode = 'NER';
    export default {
        mixins: [ner, ned, nec],
        showNer: function () {
            showMode = 'NER';
        },
        showNed: function () {
            showMode = 'NED';
        },
        showNec: function () {
            showMode = 'NEC';
        },
        data: function () {
            return {}
        },
        components: {
            nerVue
        }
    }
</script>