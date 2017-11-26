<template>
    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title">{{ title_small }}</span> <!--TODO title to big or to long-->
        <nav class="mdl-navigation">
            <a class="mdl-navigation__link" href="/">Home</a>
        <!-- TODO additional options for New -->
            <a class="mdl-navigation__link" href="loadtext">+ New</a>
            <a class="mdl-navigation__link" href="">History</a>
            <a class="mdl-navigation__link" href="">Contact</a>
            <a class="mdl-navigation__link" href="">Imprint</a>
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