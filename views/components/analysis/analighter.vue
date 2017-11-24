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
       <!--<component :is="showMode"></component>-->
    </div>
    <!--
    import ner from './mixins/analysis/ner';
    import ned from './mixins/analysis/ned';
    import nec from './mixins/analysis/nec';
    import nerVue from './components/analysis/ner.vue';
    import necVue from './components/analysis/nec.vue';
    import nedVue from './components/analysis/ned.vue';

    ,
        components: {
            nerVue,
            necVue,
            nedVue
        }
        mixins: [ner, ned, nec],
    -->
</template>
<script>

    export default {

        data: function () {
            return {
                showMode: 'nerVue'
            }
        },
        methods:{
            showNer: function () {
                performMark(this.filterPos(vueData.vueTokens, 'NE'));
                this.showMode = 'nerVue';
            },
            showNed: function () {
                this.showMode = 'nedVue';
            },
            showNec: function () {
                this.showMode = 'necVue';
            },
        }
    }
</script>