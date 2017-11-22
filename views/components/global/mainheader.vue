<template>
        <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">
                <!-- Add spacer, to align navigation to the right -->
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
        </header>
        <!-- Sidebar content-->
</template>
<script>
    export default {
        props: ['title'],
        data: function () {
            return {
                title: this.title,
            }
        }
    }
</script>