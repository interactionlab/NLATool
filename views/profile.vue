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
        
        <main class="mdl-layout__content" style="justify-content: center; align-items: center;">
            <div style="background-color: black; opacity: 0.6; z-index: 10; position: fixed; width: 100%; height: 100%; max-height: 100%;" v-bind:style="{ display: displayladoing}">
            </div>
            <div class="mdl-card mdl-shadow--6dp" style="margin: auto; overflow: initial; max-width: 500px;width: 100%;">
       
                <ul class="mdl-list">
                    <form action="/profile/loadMoreDocuments"
                          method="post"
                          v-for="numberOfButton in amountOfButtons"
                          style="display: table-cell;">
                        <button name="numberOfButton"
                                v-bind:value="numberOfButton"
                                class="mdl-list__item mdl-button mdl-js-button mdl-js-ripple-effect"
                                style="display: inline"
                        >{{numberOfButton}}
                        </button>
                    </form>
                </ul>
                <ul class="mdl-list" style="max-width:2160px;">
                    <component is="document"
                               v-for="document in documents"
                               v-bind:document="document"
                               v-bind:displayladoing="this.displayladoing"
                               v-bind:key="document.docID"
                               v-on:deleted="deleted($event)">
                    </component>
                </ul>
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
            return {
                displayladoing: 'none'
            }
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