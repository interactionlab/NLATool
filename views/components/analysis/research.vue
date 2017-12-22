<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col graybox contentColor">
            <p>{{clickedword.word}}</p>
        </div>
        <!-- TODO remove Michael Jackson at the end. That is our default value -->
        <div class="mdl-cell mdl-cell--12-col contentColor graybox" v-on:click="searchGoogle('Taylor Swift')">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col graybox" id="resultfield">
                    <!-- {{searchGoogle.clickedword}} -->
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import research from './mixins/analysis/research';

    export default {
        mixins: [research],
        props:{
            clickedword: Object
        },
        data: function () {
            return {
                clickedword: this.clickedword,
                researchResult: 'Results will be displayed here.'
            }
        },
        methods: {
            searchGoogle: function () {
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let params = {
                    'query': this.clickedword.word || 'Taylor Swift',
                    'limit': 1,
                    'indent': true,
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };

                $.getJSON(service_url + '?callback=?', params, function (response) {
                    console.log('Response for Research: ' + JSON.stringify(response));
                    $.each(response.itemListElement, function (i, element) {
                        document.getElementById("resultfield").innerHTML = "<img src=\""
                            + element['result']['image']["contentUrl"] + "\"> "+ "<br />"
                            + element['result']['name'] + "<br />"
                            + element['result']['description'] + "<br />"
                            + element['result']['detailedDescription']['articleBody']+"<br />"
                            +"<a href=\" + element['result']['detailedDescription']['url']\">Mehr info</a>";
                    });
                });
                //TODO: establish Connection -> get Response /result
                // this.googleResponse=displayedResult;
                //TODO: sent results to server
            }
        }
    }
</script>