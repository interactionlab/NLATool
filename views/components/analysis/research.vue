<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col contentColor">
            {{clickedword}} <!--<input type="submit" value="NER (name, place, etc)" /> -->
        </div>
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <form action="#">
                <!--Results will be displayed here. -->
                <div class="mdl-textfield mdl-js-textfield" id="resultfield">
                    {{googleResponse}}
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
            clickedword: String
        },
        data: function () {
            return {
                clickedword: this.clickedword,
                researchResult: 'Results will be displayed here.',
                googleResponse:{}
            }
        },
        methods:{
            searchGoogle:function () {
                //TODO: establish Connection -> get Response /result
                this.googleResponse=displayedResult;
                //TODO: sent results to server
            }
        }
    }
</script>