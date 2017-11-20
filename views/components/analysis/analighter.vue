<template>
    <ul>
        <li><button v-on:click="showNer">NER</button></li>
        <li><button v-on:click="showNed">NED</button></li>
        <li><button v-on:click="showNec">NEC</button></li>
    </ul>
    <div v-if="">
        <nerVue/>
    </div>

</template>
<script>
    import ner from '../../mixins/analysis/ner';
    import ned from '../../mixins/analysis/ned';
    import nec from '../../mixins/analysis/nec';

    import nerVue from './ner.vue';
    export default {
        mixins: [ner, ned, nec],
        data: function () {
            return{}
        },
        components:{
            nerVue
        }
    }
</script>