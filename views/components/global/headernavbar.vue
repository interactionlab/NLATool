<template>
    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title">{{ title_small }}</span> <!--TODO title to big or to long-->
        <nav class="mdl-navigation">
            <a class="mdl-navigation__link" href="/">Home</a>
            <a class="mdl-navigation__link" href="signin">Log in</a>
            <a class="mdl-navigation__link" href="imprint">Imprint</a>
        </nav>
    </div>
</template>
<script>
    export default {
        props: {
            title_small: { type: String, default: "" }
        },
        data: function () {
            return {
            }
        }
    }
</script>