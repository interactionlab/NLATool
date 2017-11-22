<template>
    <div>

        <header class="mdl-layout__header mdl-layout__header--waterfall">
            <!-- Top row, always visible -->
            <div class="mdl-layout__header-row">
                <!-- Title -->
                <span class="mdl-layout-title">{{title}}</span>
                <div class="mdl-layout-spacer"></div>

                <!-- Headerbutton (3 dots) on the right-->
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="headerbtn">
                    <i class="material-icons">more_vert</i>
                </button>
                <!-- Some examples for headerbutton-->
                <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" for="headerbtn">
                    <!--They could/should be linked-->
                    <li class="mdl-menu__item">About</li>
                    <li class="mdl-menu__item">Contact</li>
                    <li class="mdl-menu__item">Legal information</li>
                </ul>

            </div>
            <!-- Bottom row, not visible on scroll -->
            <div class="mdl-layout__header-row">
                <div class="mdl-layout-spacer"></div>
            </div>
        </header>
        <div class="mdl-layout__drawer">
            <span class="mdl-layout-title">{{title_small}}</span>
            <nav class="mdl-navigation">
                <a class="mdl-navigation__link" href="">Home</a>
                <a class="mdl-navigation__link" href="">Load a Text</a>
                <a class="mdl-navigation__link" href="">Contact</a>
            </nav>
        </div>
    </div>
</template>
<script>
    export default {
        props:['title', 'title_small'],
        data: function () {
            return {
                title: this.title,
                title_small: this.title_small
            }
        }
    }
</script>