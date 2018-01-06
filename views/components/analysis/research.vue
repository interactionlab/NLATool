<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col graybox contentColor">
            <!-- shows the clicked word -->
            <input v-on:keydown.enter="searchGoogle(clickedword.word)" v-model="clickedword.word"/>
        </div>
        <!-- TODO remove Michael Jackson at the end. That is our default value -->
        <div class="mdl-cell mdl-cell--12-col contentColor graybox" v-on:click="searchGoogle('Taylor Swift')">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col graybox" id="resultfield">
                    <!-- {{searchGoogle.clickedword}} -->
                    <component is = "results" v-bind:researchResult="researchResult"></component>
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
                researchResult: 'Results will be displayed here.',
                researchmode: this.researchmode
            }
        },
        methods: {
            searchGoogle: function (query) {
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let params = {
                    'query': query,
                    'limit': 1,
                    'indent': true,
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };

                $.getJSON(service_url + '?callback=?', params, function (response) {
                    console.log('Response for Research: ' + JSON.stringify(response));
                    this.researchResult = response;
                    $.each(response.itemListElement, function (i, element) {
                        document.getElementById("resultfield").innerHTML = "<img src=\""
                            + element['result']['image']["contentUrl"] + "\"> " + "<br />"
                            + element['result']['name'] + "<br />"
                            + element['result']['description'] + "<br />"
                            + element['result']['detailedDescription']['articleBody'] + "<br />"
                            + "<a href=\" + element['result']['detailedDescription']['url']\">Mehr info</a>";
                    });
                });
                //TODO: establish Connection -> get Response /result
                // this.googleResponse=displayedResult;
                //TODO: sent results to server
            }
        },
        watch: {
            researchmode: function (mode) {
                //if (mode === 'Info') {
                console.log('researchmode was changed to:'+ mode);
                    this.searchGoogle('Taylor Swift');
                //}
            }
        }
    }
</script>