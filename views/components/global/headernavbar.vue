<template>
    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title">{{ title_small }}</span> <!--TODO title to big or to long-->
        <nav class="mdl-navigation">
            <a class="mdl-navigation__link" href="signin">Sign in</a>
            <a class="mdl-navigation__link" href="signup">Sign up</a>
            <a class="mdl-navigation__link" href="">Link</a>
            <a class="mdl-navigation__link" href="">Link</a>
        </nav>
    </div>
</template>
<script>
    export default {
        props: ['title_small'],
        data: function () {
            return {
                title_small: this.title_small
            }
        }
    }
</script>