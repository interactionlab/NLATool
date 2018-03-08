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
            <div style="background-color: black; opacity: 0.6; z-index: 10; position: fixed; width: 100%; height: 100%; max-height: 100%;" v-bind:style="{ display: displayloading}">
                <div style=" margin: 0% auto; 5em; z-index: 10;  left: 0; top: 50%; width: auto !important; max-width: 100%; color: gray; max-width:1000px; position: relative; opacity: 1;">
                    Loading...
                    <div id="progressbar2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: auto !important; max-width: 100%;"></div>
                </div>
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
                               v-bind:displayloading="this.displayloading"
                               v-bind:key="document.docID"
                               v-on:deleted="deleted($event)"
                               v-on:displayloading="displayloadingClicked($event)">
                    </component>
                </ul>
            </div>
            <a href="./" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" style="height: 56px; position: fixed; right: 0; bottom: 0; margin-bottom: 2em; margin-right: 2em;"><i class="material-icons">add</i></button>
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
                displayloading: 'none'
            }
        },
        methods:{
            displayloadingClicked: function (displayloading) {
                this.displayloading = displayloading;
            },
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