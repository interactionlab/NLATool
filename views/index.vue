<template>
    <!DOCTYPE html>
    <html>
    <body>
    <title>{{ title }}</title>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <component is="mainheader2" v-bind:title="title" ></component>
        <component is="headernavbar" v-bind:title_small="title_small"></component>
        <!--<header class="mdl-layout__header">
                <div class="mdl-layout__header-row">
                    &lt;!&ndash; Add spacer, to align navigation to the right &ndash;&gt;
                    <div class="mdl-layout-spacer"></div>
                    &lt;!&ndash; Headerbutton (3 dots) on the right&ndash;&gt;
                    <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button&#45;&#45;icon" id="headerbtn">
                        <i class="material-icons">more_vert</i>
                    </button>
                    &lt;!&ndash; Some examples for headerbutton&ndash;&gt;
                    <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu&#45;&#45;bottom-right" for="headerbtn">
                        &lt;!&ndash;They could/should be linked&ndash;&gt;
                        <li class="mdl-menu__item">About</li>
                        <li class="mdl-menu__item">Contact</li>
                        <li class="mdl-menu__item">Legal information</li>
                    </ul>
                </div>
            </header>
            &lt;!&ndash; Sidebar content&ndash;&gt;
            <div class="mdl-layout__drawer">
                <span class="mdl-layout-title">{{ title_small }}</span> &lt;!&ndash;TODO title to big or to long&ndash;&gt;
                <nav class="mdl-navigation">
                    <a class="mdl-navigation__link" href="signin">Sign in</a>
                    <a class="mdl-navigation__link" href="signup">Sign up</a>
                    <a class="mdl-navigation__link" href="">Link</a>
                    <a class="mdl-navigation__link" href="">Link</a>
                </nav>
            </div>
-->
        <!-- page content-->
        <main class="mdl-grid graybox" style="text-align: center">
            <div style=" width: 100%; text-align: center">
                <img src="/images/logo.jpg" alt="Logo" class="graybox" style="text-align: center">
            </div>
            <div style=" width: 100%;text-align: center">
                <div>
                    <form action="/loadText" method="POST">
                        <div>
                            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                <i class="material-icons">send</i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
    </body>
    </html>
</template>
<script>
    import mainheader2 from './components/global/mainheader.vue';
    import headernavbar from './components/global/headernavbar.vue';

    export default {
        data: function () {
            return {}
        },
        components: {
            mainheader2,
            headernavbar
        }
    }
</script>