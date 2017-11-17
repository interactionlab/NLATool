<template>
    <!DOCTYPE html>
    <html>
    <body>
    <title>{{ title }}</title>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">
                <!-- Add spacer, to align navigation to the right -->
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
        <div class="mdl-layout__drawer">
            <span class="mdl-layout-title">{{ title }}</span> <!--TODO title to big or to long-->
            <nav class="mdl-navigation">
                <a class="mdl-navigation__link" href="signin">Sign in</a>
                <a class="mdl-navigation__link" href="signup">Sign up</a>
                <a class="mdl-navigation__link" href="">Link</a>
                <a class="mdl-navigation__link" href="">Link</a>
            </nav>
        </div>

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
    export default {
        data: function () {
            return {
            }
        }
    }
</script>