<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <component is="mainheader" v-bind:title="title"></component>
        <component is="headernavbar" v-bind:title_small="title_small"></component>

        <!-- page content-->
        <main class="mdl-grid contentColor" style="text-align: center">
            <div style=" width: 100%; text-align: center">
                <img src="/images/logo.jpg" alt="Logo" class="contentColor" style="text-align: center">
            </div>
            <div style=" width: 100%;text-align: center">
                <div>
                    <form action="/loadText" method="POST">
                        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                            <i class="material-icons">send</i>
                        </button>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
    import mainheader from './components/global/mainheader.vue';
    import headernavbar from './components/global/headernavbar.vue';

    export default {
        data: function () {
            return {}
        },
        components: {
            mainheader,
            headernavbar
        }
    }
</script>