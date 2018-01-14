<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col graybox contentColor">
            <!-- shows the clicked word -->
            <input v-on:keydown.enter="searchGoogle(clickedword.content)" v-model="clickedword.content"/>
        </div>
        <!-- TODO remove Taylor Swift at the end. That is our default value -->
        <div class="mdl-cell mdl-cell--12-col contentColor graybox" v-on:click="searchGoogle('Taylor Swift')">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col graybox" id="resultfield">
                    <component is="researchresult"
                               v-if="resultselected"
                               v-bind:researchresult="selectedresult"
                               v-bind:index="selectedindex">
                    </component>
                    <component is="researchresult"
                               v-if="resultselected"
                               v-bind:researchresult="selectedresult"
                               v-bind:index="selectedindex">
                    </component>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import research from './mixins/analysis/research';

    export default {
        mixins: [research],
        props: {
            clickedword: Object,
            researchmode: String
        },
        data: function () {
            return {
                clickedword: this.clickedword,
                researchresults: ['Results will be displayed here.'],
                researchmode: this.researchmode,
                resultselected: false,
                selectedresult: {},
                selectedindex: -1
            }
        },
        methods: {
            searchGoogle: function (query) {
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let params = {
                    'query': query,
                    'limit': 10,
                    'indent': true,
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };

                $.getJSON(service_url + '?callback=?', params, (response) => {

                }).done((response) => {
                    console.log('Response for Research: ' + JSON.stringify(response));
                    this.researchresults.pop();
                    this.researchresults.push(response);
                });
            },
            selectResult: function (index) {
                this.resultselected = true;
                this.selectedindex = index;
                console.log('selected Result is: ' + JSON.stringify(this.researchresults[0].itemListElement[index]) + index);
                this.selectedresult = this.researchresults[0].itemListElement[index];
            }
        },
        computed: {},
        watch: {
            researchmode: function (mode) {
                //if (mode === 'Info') {
                console.log('researchmode was changed to:' + mode);
                this.searchGoogle('Taylor Swift');
                //}
            }
        },
        components: {
            researchresult
        }
    }
</script>