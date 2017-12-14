<template>
    <div>
        <div class="mdl-cell mdl-cell--12-col contentColor">
            {{clickedword}} <!--<input type="submit" value="NER (name, place, etc)" /> -->
        </div>
        <div class="mdl-cell mdl-cell--12-col contentColor">
            <form action="#">
                <div class="mdl-textfield mdl-js-textfield" id="resultfield">
                    <label class="mdl-textfield__label" for="resultfield">
                        Results will be displayed here.
                    </label>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    import research from './mixins/analysis/research';
    import analysis from './components/analysis';
    export default {
        mixins: [research],
        props:{
            clickedword: String
        },
        data: function () {
            return {
                clickedword: this.clickedword,
                researchResult: 'Results will be displayed here.'
            }

        }
    }
</script>