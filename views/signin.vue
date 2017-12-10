<template>
    <!DOCTYPE html>
    <html>
    <body>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader" v-bind:title="title"></component>
        <component is="headernavbar" v-bind:title_small="title_small"></component>
        <main class="mdl-layout__content">
            <div class="mdl-cell mdl-cell--12-col contentColor">
                <form action="/signin/login" method="post">
                    Benutzername oder Email<br>
                    <input type="text" name="username"><br>
                    Password<br>
                    <input type="text" name="pass"><br>
                    <input type="submit">
                </form>
            </div>
        </main>
    </div>
    </body>
    </html>
</template>
<script>
    import headernavbar from './components/global/headernavbar.vue';
    import mainheader from './components/global/mainheader.vue';

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