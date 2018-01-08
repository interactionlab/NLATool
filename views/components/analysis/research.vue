<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col graybox contentColor">
            <!-- shows the clicked word -->
            <input v-on:keydown.enter="searchGoogle(clickedword.word)" v-model="clickedword.word"/>
        </div>
        <!-- TODO remove Taylor Swift at the end. That is our default value -->
        <div class="mdl-cell mdl-cell--12-col contentColor graybox" v-on:click="searchGoogle('Taylor Swift')">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col graybox" id="resultfield">
                    <!-- {{searchGoogle.clickedword}} -->
                    <component is="researchresult"
                               v-for="(researchresult,index) in researchresults.itemListElement"
                               v-bind:researchresult="researchresult"
                               v-bind:key="index"
                               v-bind:research="researchresults"
                    ></component>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import researchresult from './components/analysis/researchresult.vue';

    export default {
        props: {
            clickedword: Object,
            researchmode: String
        },
        data: function () {
            return {
                clickedword: this.clickedword,
                researchresults: [],
                researchmode: this.researchmode
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
                $.getJSON(service_url + '?callback=?', params, function (response) {
                    console.log('Response for Research: ' + JSON.stringify(response));
                    this.researchresults.push(response);
                    console.log('Response for Research222222222222222222: ' + JSON.stringify(this.researchresults));
                    // $.each(response.itemListElement, function (i, element) {
                    //     document.getElementById("resultfield").innerHTML = "<img src=\""
                    //         + element['result']['image']["contentUrl"] + "\"> " + "<br />"
                    //         + element['result']['name'] + "<br />"
                    //         + element['result']['description'] + "<br />"
                    //         + element['result']['detailedDescription']['articleBody'] + "<br />"
                    //         + "<a href=\" + element['result']['detailedDescription']['url']\">Mehr info</a>";
                    // });
                });


                //TODO: use socket emit for database handling
                //TODO: establish Connection -> get Response /result
                // this.googleResponse=displayedResult;
                //TODO: sent results to server
            },
        },
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