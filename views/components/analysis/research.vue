<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <div class="mdl-textfield mdl-js-textfield graybox">
                <p>{{clickedword}}</p>
            </div>
        </div>
        <div class="mdl-cell mdl-cell--12-col contentColor graybox" v-on:click="searchGoogle('Michael Jackson')">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col graybox" id="resultfield">

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
            clickedword: String
        },
        data: function () {
            return {
                clickedword: this.clickedword,
                researchResult: 'Results will be displayed here.',
                searchoogle: {}
            }
        },
        methods: {
            searchGoogle: function () {
                let service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
                let params = {
                    'query': this.clickedword || 'Michael Jackson',
                    'limit': 1,
                    'indent': true,
                    'key': 'AIzaSyAf3z_eNF3RKsZxoy7SXEGPD3v-9bNfgfQ',
                };

                $.getJSON(service_url + '?callback=?', params, function (response) {
                    console.log('Response for Research: ' + JSON.stringify(response));
                    $.each(response.itemListElement, function (i, element) {
                        document.getElementById("resultfield").innerHTML = "<img src=\""
                            + element['result']['image']["contentUrl"] + "\"> "
                            + element['result']['name'] + "<br />"
                            + element['result']['description']
                            + "<br />" + element["result"]["detailedDescription"]["articleBody"]
                            + "<br /><a href=\"" + element["result"]["detailedDescription"]["url"]
                            + "\">Mehr info</a>";
                    });
                });
                //TODO: establish Connection -> get Response /result
                // this.googleResponse=displayedResult;
                //TODO: sent results to server
            },
            getEntries: function () {
                let textComponent = document.getElementById('textfield');
                let selectedText;
                // IE version
                if (document.selection != undefined) {
                    textComponent.focus();
                    let sel = document.selection.createRange();
                    selectedText = sel.text;
                }
                // Mozilla version
                else if (textComponent.selectionStart != undefined) {
                    let startPos = textComponent.selectionStart;
                    let endPos = textComponent.selectionEnd;
                    selectedText = textComponent.value.substring(startPos, endPos)
                }
                searchGoogle(selectedText);
            }
        }
    }
</script>