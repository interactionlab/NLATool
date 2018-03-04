<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader"
                   v-bind:title="title"
                   v-bind:preventtitleedit="true">
        </component>
        <component
                is="headernavbar"
                v-bind:title_small="title_small">
        </component>
        <main class="mdl-layout__content" style="justify-content: center;align-items: center;">
            <div class="mdl-card mdl-shadow--6dp" style="margin: auto;">
                <component :is="signmode"></component>
            </div>
            <div class="mdl-grid">
                <div class="mdl-layout-spacer" style="text-align: center">
                    <a class="mdl-button mdl-js-button" v-on:click="switchauthentification">
                        {{signbutn}}
                    </a>
                </div>
            </div>
        </main>
    </div>
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
                signbutn: 'go toregister'
            }
        },
        methods: {
            switchauthentification: function () {
                if (this.signmode === 'login') {
                    this.signmode = 'register';
                    this.signbutn = 'Go to login';
                } else {
                    this.signmode = 'login';
                    this.signbutn = 'Go to register';
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