<template>

    <!--right grid for result stuff -->


        <!-- result area is closed (default)-->
        <div class="mdl-cell mdl-cell--12-col graybox" id="right-column">

            <!-- display the selected NER-->
            <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                    NER (name, place, etc) <!--<input type="submit" value="NER (name, place, etc)" /> -->
                </div>
            </div>

            <!-- Buttons for modify the result-->
            <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                    <button v-on:click="quickResearch"
                            class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button">Information</b>
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button">Map</b>
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button">Statistics</b>
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button">Correction</b>
                    </button>
                </div>
            </div>

            <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                <form action="#">
                    <div class="mdl-textfield mdl-js-textfield" style="width: 100%" id="textbox">
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