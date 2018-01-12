<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <!-- shows the clicked word -->
            <input v-on:keydown.enter="searchGoogle(selectedtext)"
                   v-model="selectedtext"
                   class="mdl-textfield__input"/>
        </div>
        <!-- TODO remove Taylor Swift at the end. That is our default value -->
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col graybox" id="resultfield">

                    <component is="researchresult"
                               v-for="(researchresult,index) in researchresults[0].itemListElement"
                               v-bind:researchresult="researchresult"
                               v-bind:key="index"
                               v-bind:researchresults="researchresults">
                    </component>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import researchresult from './components/analysis/researchresult.vue';
    import getselectedtext from './mixins/analysis/gettokensofselectedtext.js';

    export default {
        mixins: [getselectedtext],
        props: {
            researchmode: String,
            selectedindexes: Object,
            tokens: Array
        },
        data: function () {
            return {
                researchresults: [''],
                researchmode: this.researchmode,
                tokens: this.tokens,
                selectedtext: '',
                selectedindexes: this.selectedindexes
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
                let tempresults = {};
                $.getJSON(service_url + '?callback=?', params, (response) => {
                    // $.each(response.itemListElement, function (i, element) {
                    //     document.getElementById("resultfield").innerHTML = "<img src=\""
                    //         + element['result']['image']["contentUrl"] + "\"> " + "<br />"
                    //         + element['result']['name'] + "<br />"
                    //         + element['result']['description'] + "<br />"
                    //         + element['result']['detailedDescription']['articleBody'] + "<br />"
                    //         + "<a href=\" + element['result']['detailedDescription']['url']\">Mehr info</a>";
                    // });
                }).done((response) => {
                    console.log('Response for Research: ' + JSON.stringify(response));
                    this.researchresults.pop();
                    this.researchresults.push(response);
                });
                console.log('Response for Research222222222222222222: ' + JSON.stringify(this.researchresults));

                //TODO: use socket emit for database handling
                //TODO: establish Connection -> get Response /result
                // this.googleResponse=displayedResult;
                //TODO: sent results to server
            },
        },
        computed: {},
        watch: {
            selectedindexes: {
                handler: function (newSelectedIndexes) {
                    console.log('Watcher activated: ' + JSON.stringify(newSelectedIndexes));
                    if (newSelectedIndexes.start !== -1 && newSelectedIndexes.end !== -1) {
                        this.selectedtext = this.generateText(this.gettokensofselectedtext(this.tokens, newSelectedIndexes));
                        this.searchGoogle(this.selectedtext);
                    }
                },
                deep: true
            },
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