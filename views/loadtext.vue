<template>
    <!DOCTYPE html>
    <html>
    <body>

    <div class="mdl-grid"> <!-- Resizable Textfield full size for testing-->
        <div style="width: 100%">
            <form action="#">

            </form>

            <form action="/loadtext/loadWrittenText" method="post">
                <!-- Textfield for title-->
                <div class="mdl-textfield mdl-js-textfield graybox">
                    <input class="mdl-textfield__input" type="text" id="titlebox" name="title">
                    <label class="mdl-textfield__label" for="titlebox">Title</label>
                </div>
                <!-- Textfield for textinput -->
                <div class="mdl-textfield mdl-js-textfield graybox" style="width: 100%">
                    <textarea class="mdl-textfield__input" type="text" rows="6" id="textbox" name="textInput">
                    </textarea>
                    <label class="mdl-textfield__label" for="textbox">
                        Enter text here ...
                    </label>
                </div>
                <div>
                    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                        <i class="material-icons mdl-navigation__link" href="analyse">send</i>
                    </button>
                </div>
            </form>
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