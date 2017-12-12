<template>
    <!DOCTYPE html>
    <html>
    <body>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader" v-bind:title="title"></component>
        <component is="headernavbar" v-bind:title_small="title_small"></component>
        <main class="mdl-layout__content">
            <div class="mdl-grid">
                <div class="mdl-layout-spacer"></div>
                <div class="mdl-cell mdl-cell--6-col contentColor">
                    <component :is="signmode"></component>
                </div>
                <div class="mdl-layout-spacer"></div>
            </div>
            <div class="mdl-grid">
                <button class="mdl-button mdl-js-button" v-on:click="switchauthentification">
                    <b class="mdc-button">{{signbutn}}</b>
                </button>

            </div>
        </main>
    </div>
    </body>
    </html>
</template>
<script>
    import headernavbar from './components/global/headernavbar.vue';
    import mainheader from './components/global/mainheader.vue';
    import login from './components/userauthentification/login.vue';
    import register from './components/userauthentification/register.vue';

    export default {
        data: function () {
            return {
                signmode: 'login',
                signbutn: 'register'
            }
        },
        methods: {
            switchauthentification: function () {
                if (this.signmode === 'login') {
                    this.signmode = 'register';
                    this.signbutn = 'login';
                } else {
                    this.signmode = 'login';
                    this.signbutn = 'register';
                }

            }
        },
        components: {
            mainheader,
            headernavbar,
            login,
            register
        }
    }
</script>