<template>
    <div>
        <!-- display the selected NER-->
        <div class="mdl-cell mdl-cell--12-col graybox">
            NER (name, place, etc) <!--<input type="submit" value="NER (name, place, etc)" /> -->
        </div>
        <div class="mdl-cell mdl-cell--12-col graybox">
            <form action="#">
                <div class="mdl-textfield mdl-js-textfield" id="textbox">
                    <label class="mdl-textfield__label" for="textbox">
                        Results will be displayed here.
                    </label>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    import research from './mixins/analysis/research';

    export default {
        mixins: [research],
        data: function () {
            return {}

        }
    }
</script>