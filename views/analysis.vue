<template>
    <!DOCTYPE html>
    <html>

    <!-- <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width = device-width, initial-scale = 1">
         <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-orange.min.css">
         <link rel="stylesheet"
               href="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-orange.min.css">
         <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
         <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
         <script src="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js"></script>
     </head>-->

    <body>
    <div class="mdl-grid"> <!--Row 1 for features -->
        <div class="mdl-cell mdl-cell--12-col graybox">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">NER</b>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">NEC</b>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">NED</b>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">Highlighting</b>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                <b class="mdc-button">Kommentar</b>
            </button>
        </div>
    </div>

    <div class="mdl-grid"> <!-- separate window in two-->
        <!--left grid for text stuff -->
        <div class="mdl-cell mdl-cell--6-col graybox">
            <div class="mdl-grid"> <!-- clear button -->
                <div>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <i class="material-icons">delete</i>
                    </button>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <!-- TODO why do this link not work?-->
                        <i class="material-icons mdl-navigation__link" href="signin">save</i>
                    </button>
                </div>
            </div>

            <div class="mdl-grid"> <!-- Resizable Textfield-->
                <div style="width: 100%">
                    <p>{{ result }}</p>
                </div>
            </div>
        </div>

        <!--right grid for result stuff -->
        <div class="mdl-cell mdl-cell--6-col graybox">
            <!-- onclick for show the results-->
            <div class="mdl-cell mdl-cell--6-col graybox" style="width: 98%; text-align: right;">
                <input type="submit" id="switch" value="v" onclick="expand();"/>
            </div>

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
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
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
    </div>
    </body>
    </html>

</template>
<script>
    export default {
        data: function () {
            return {}
        }
    }
</script>