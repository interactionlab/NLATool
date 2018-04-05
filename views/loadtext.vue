<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <!-- Uses a mainHeader that contracts as the page scrolls down. -->
        <component is="mainheader"
                   v-bind:title="title"
                   v-bind:preventtitleedit="true"
                   v-bind:serverip="serverip">
        </component>
        <component is="headernavbar"
                   v-bind:title_small="title_small">
        </component>
        <div style="background-color: black; opacity: 0.6; z-index: 10; position: fixed; width: 100%; height: 100%; max-height: 100%;"
             v-bind:style="{ display: displayloading}">
            <div style=" margin: 0% auto; z-index: 10;  left: 0; top: 50%; width: auto !important; max-width: 100%; color: gray; max-width:1000px; position: relative; opacity: 1;">
                Loading...
                <div id="progressbar2" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"
                     style="width: auto !important; max-width: 100%;"></div>
            </div>
        </div>
        <main class="mdl-layout__content" style="display: flex;flex-flow: row wrap;padding: 1em;">
            <form v-on:submit.prevent="onSubmit"
                  class="mdl-grid contentColor mdl-shadow--6dp"
                  style="max-width:2160px; overflow-y:auto; flex-direction:column; width:100%; max-height: 2160px;"
                  action="/loadWrittenText" method="post">
                <!-- Textfield for title-->
                <div class="mdl-cell mdl-cell--12-col contentColor" style="flex:0;">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width:100%;">
                        <input class="mdl-textfield__input" type="text" id="titlebox" name="title" v-model="inputtitle"
                               required>
                        <label class="mdl-textfield__label" for="titlebox">Enter title here ...</label>
                    </div>
                </div>
                <!-- Textfield for textinput -->
                <div class="mdl-cell mdl-cell--12-col contentColor"
                     style="flex:2 0px;max-height: 100%; height:auto !important; display:flex;">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
                         style="width:100%;max-height: 100%; height:auto !important; display:flex;">
                        <textarea class="mdl-textfield__input"
                                  type="text"
                                  id="textbox"
                                  name="textInput"
                                  autocomplete="off" autocorrect="off"
                                  autocapitalize="off" spellcheck="false"
                                  data-gramm="false"
                                  v-model="inputtext"></textarea>
                        <label class="mdl-textfield__label" for="textbox">
                            Enter text here ...
                        </label>
                    </div>
                </div>
                <!-- Analyze Button -->
                <div class="mdl-cell mdl-cell--12-col" style="flex:0; text-align: center">
                    <!-- extra div needed to make button in center -->
                    <button class="mdl-button mdl-js-button mdl-button--raised  mdl-button--accent mdc-button--stroked"
                            v-on:click="handleClick">
                        <b class="mdc-button">Analyze</b>
                    </button>
                </div>
            </form>

        </main>
    </div>
</template>
<script>
    import headernavbar from './components/global/headernavbar.vue';
    import mainheader from './components/global/mainheader.vue';

    export default {

        data: function () {
            return {
                tag: 'Client: ',
                inputtitle: '',
                inputtext: '',
                onOff: true,
                displayloading: 'none',
                socket: null,
                docid: -1,
                redirecturl: '',
            }
        },
        components: {
            mainheader,
            headernavbar,

        },
        methods: {
            onSubmit: function () {

            },
            handleClick: function () {
                this.loadingClick();
                this.initUploadToServer();
            },
            initUploadToServer() {
                var self = this;
                console.log(this.tag + 'Check if there is text to upload.');
                if (/\S/.test(this.inputtext)) {
                    console.log(this.tag + 'Requesting Upload');
                    this.socket = io(this.serverip + ':8091');
                    this.socket.emit('initupload', this.inputtitle);
                    this.socket.on('resinitupload', function (docid) {
                        console.log(this.tag + 'Uploadrequest was accepted with the docID:' + docid);
                        self.storeSocketResult('docid', docid);
                    });
                }
            },
            uploadToServer: function () {
                console.log(this.tag + 'Uploading Text of ' + this.docid + ' : '+ this.inputtext);
                let text = this.inputtext;
                let texttosend = '';
                let start = 0;
                let amount = 500;
                let self = this;
                while (text.length > start) {
                    texttosend = text.slice(start, start + amount);
                    console.log(this.tag + 'Uploading: ' + texttosend);
                    this.socket.emit('uploadtextparts', this.docid, start, texttosend);
                    start += amount;
                }
                console.log(this.tag + 'Text is uploaded.');
                this.socket.emit('endupload', this.docid);
                this.socket.on('redirectToAnalysis', function (url) {
                    self.storeSocketResult('redirecturl', url);
                });
            },
            storeSocketResult: function (storage, value) {
                this[storage] = value;
            },
            toggleOnOff: function () {
                this.onOff = !this.onOff;
            },
            loadingClick: function () {
                this.displayloading = "block";
            },
        },
        watch: {
            docid: function () {
                this.uploadToServer();
            },
            redirecturl: function (newurl) {
                if (newurl !== '') {
                    console.log(this.tag + 'Redirecting to: ' + newurl);
                    window.location.replace(newurl);
                }
            }
        }
    }
</script>