<template>
    <!DOCTYPE html>
    <html>
    <body>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader" v-bind:title="title"></component>
        <component is="headernavbar" v-bind:title_small="title_small"
        ></component>
        <main class="mdl-layout__content">
            <form action="/profile/loadMoreDocuments"
                  method="post"
                  v-for="numberOfButton in amountOfButtons"
                  class="mdl-cell--12-col">
                <button style="float: left" name="numberOfButton" v-bind:value="numberOfButton">{{numberOfButton}}</button>
            </form>
            <div class="mdl-layout-spacer"></div>
            <component is="document"
                       v-for="document in documents"
                       v-bind:document="document"
                       v-bind:key="document.docID"
                       class="mdl-cell--8-col"
            ></component>
            <div class="mdl-layout-spacer"></div>
        </main>
    </div>
    </body>
    </html>
</template>
<script>
    import headernavbar from './components/global/headernavbar.vue';
    import mainheader from './components/global/mainheader.vue';
    import document from './components/profile/document.vue';

    export default {
        data: function () {
            return {}
        },
        components: {
            mainheader,
            headernavbar,
            document
        },
        computed: {},
    }
</script>