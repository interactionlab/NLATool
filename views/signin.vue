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
            <div class="mdl-card mdl-shadow--6dp" style="margin: auto;overflow:initial">
                <component :is="signmode"
                    v-bind:errormsg="errormsg"></component>
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" style=" position: absolute;bottom: -1em;height: 56px;right: -1em;" v-on:click="switchauthentification">
                  <i class="material-icons">{{signbutn}}</i>
                </button>
            </div>
            
        
            <div class="mdl-grid">
                <div class="mdl-layout-spacer" style="text-align: center">
                    <a class="mdl-button mdl-js-button" >
                        
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
                signbutn: 'add'
            }
        },
        methods: {
            switchauthentification: function () {
                if (this.signmode === 'login') {
                    this.signmode = 'register';
                    this.signbutn = 'account_circle';
                } else {
                    this.signmode = 'login';
                    this.signbutn = 'add';
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