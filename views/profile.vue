<template>
    <!DOCTYPE html>
    <html>
    <body>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader"
                   v-bind:title="title"
                   v-bind:preventtitleedit="true">
        </component>
        <component is="headernavbar"
                   v-bind:title_small="title_small">
        </component>
        <main class="mdl-layout__content">
            <div style="display: table">
                <form action="/profile/loadMoreDocuments"
                      method="post"
                      v-for="numberOfButton in amountOfButtons"
                      style="display: table-cell;">
                    <button name="numberOfButton"
                            v-bind:value="numberOfButton"
                            class="mdl-button mdl-js-button mdl-js-ripple-effect"
                            style="display: inline"
                    >{{numberOfButton}}
                    </button>
                </form>
            </div>
            <div class="mdl-grid">
                <component is="document"
                           v-for="document in documents"
                           v-bind:document="document"
                           v-bind:key="document.docID"
                           v-on:deleted="deleted($event)"
                           class="mdl-cell--8-col">
                </component>

            </div>
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
        methods:{
            deleted:function (docID) {
               for(let i = 0; i < this.documents.length; i++){
                   if(this.documents[i].docID === docID){
                       this.documents.splice(i, 1);
                       break;
                   }
               }
            }
        },
        components: {
            mainheader,
            headernavbar,
            document
        },
        computed: {},
    }
</script>