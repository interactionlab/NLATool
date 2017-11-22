<template>
    <div class="mdl-cell mdl-cell--12-col">
        <span><h4>bla</h4></span>
        <!--Button that should make textTitle editable and send changes to server to update DB -->
        <span><button>Edit</button></span>
        <!--Insert a Space here:-->
        <span>
            <nav class="mdl-navigation">
                <button v-on:click="$emit('getAnalighter')"
                        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    <b class="mdc-button">Analysis</b>
                </button>
                <button v-on:click="$emit('getNotes')"
                        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    <b class="mdc-button">Notes</b>
                </button>
                <button v-on:click="$emit('getResearch')"
                        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    <b class="mdc-button">Research</b>
                </button>
            </nav>
        </span>
    </div>

</template>
<script>
    export default {
        data: function () {
            return {}

        }
    }
</script>