<template>

    <!--right grid for result stuff -->
    <div class="mdl-cell mdl-cell--6-col graybox">

        <!-- result area is closed (default)-->
        <div class="mdl-cell mdl-cell--6-col graybox" style="display: none;" id="right-column">

            <!-- display the selected NER-->
            <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                    NER (name, place, etc) <!--<input type="submit" value="NER (name, place, etc)" /> -->
                </div>
            </div>

            <!-- Buttons for modify the result-->
            <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                    <button v-on:click="quickResearch" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button">Information</b>
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button">Karte</b>
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button">Statistik</b>
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <b class="mdc-button">Korrektur</b>
                    </button>
                </div>
            </div>

            <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%">
                <form action="#">
                    <div class="mdl-textfield mdl-js-textfield" style="width: 100%">
                        <textarea class="mdl-textfield__input" type="text" rows="5" id="textbox">
                        </textarea>
                        <label class="mdl-textfield__label" for="textbox">
                            Results will be displayed here.
                        </label>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import ner from '../mixins/ner';
    export default {
        mixins: ner,
        data: function () {
            return{}
            
        }
    }
</script>