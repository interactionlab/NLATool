<template>
    <!DOCTYPE html>
    <html>
    <!-- <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width = device-width, initial-scale = 1">
         <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-orange.min.css">
         <link rel="stylesheet"
               href="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.indigo-orange.min.css">
         <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
         <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
         <script src="https://storage.googleapis.com/code.getmdl.io/1.0.6/material.min.js"></script>
     </head>-->
    <body>
    <!-- Uses a header that contracts as the page scrolls down. -->
    <style>
        .demo-layout-waterfall .mdl-layout__header-row .mdl-navigation__link:last-of-type {
            padding-right: 0;
        }
    </style>
    <div class="demo-layout-waterfall mdl-layout mdl-js-layout">
        <header class="mdl-layout__header mdl-layout__header--waterfall">
            <!-- Top row, always visible -->
            <div class="mdl-layout__header-row">
                <!-- Title -->
                <span class="mdl-layout-title">{{title}}</span>
                <div class="mdl-layout-spacer"></div>

                <!-- Headerbutton (3 dots) on the right-->
                <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="headerbtn">
                    <i class="material-icons">more_vert</i>
                </button>
                <!-- Some examples for headerbutton-->
                <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" for="headerbtn">
                    <!--They could/should be linked-->
                    <li class="mdl-menu__item">About</li>
                    <li class="mdl-menu__item">Contact</li>
                    <li class="mdl-menu__item">Legal information</li>
                </ul>

            </div>
            <!-- Bottom row, not visible on scroll -->
            <div class="mdl-layout__header-row">
                <div class="mdl-layout-spacer"></div>
            </div>
        </header>
        <div class="mdl-layout__drawer">
            <span class="mdl-layout-title">{{title_small}}</span>
            <nav class="mdl-navigation">
                <a class="mdl-navigation__link" href="">Home</a>
                <a class="mdl-navigation__link" href="">Load a Text</a>
                <a class="mdl-navigation__link" href="">Contact</a>
            </nav>
        </div>
        <main class="mdl-layout__content">
            <div class="page-content">
                <div class="mdl-grid">
                    <!-- old Featrue field-->
                </div>

                <div class="mdl-grid"> <!-- separate window in two-->
                    <!--left grid for text stuff -->
                    <div class="mdl-cell mdl-cell--6-col graybox">
                        <div class="mdl-grid"> <!-- clear button -->
                            <div>
                                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                    <i class="material-icons">delete</i>
                                </button>
                            </div>
                        </div>

                        <div class="mdl-grid"> <!-- Resizable Textfield-->
                            <div style="width: 100%">
                                <p>{{ result }}</p>
                            </div>
                        </div>
                    </div>

                    <!--right grid for result stuff -->
                    <div class="mdl-cell mdl-cell--6-col graybox">
                        <!-- Features -->
                        <nav class="mdl-navigation">
                            <button v-on:click="getAnalighter"
                                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                <b class="mdc-button">Analysis</b>
                            </button>
                            <button v-on:click="getNotes"
                                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                <b class="mdc-button">Notes</b>
                            </button>
                            <button v-on:click="getResearch"
                                     class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                 <b class="mdc-button">Research</b>
                             </button>
                        </nav>
                        <!-- onclick for show the results-->
                        <!--
                        <div class="mdl-cell mdl-cell&#45;&#45;6-col graybox" style="width: 98%; text-align: right;">
                            <input type="submit" id="switch" value="v" onclick="expand();"/>
                        </div>-->
                        <component :is="analysisMode"></component>
                        <!--<component is="research"></component>
                        <component is="analighter"></component>-->
                    </div>
                </div>
            </div>
        </main>
    </div>
    </body>
    </html>

</template>
<script>
    import research from './components/analysis/research.vue';
    import analighter from './components/analysis/analighter.vue';

    //let analysisMode = 'research';
    export default {
        data: function () {
            return {
                analysisMode: 'research',
            }
        },
        methods: {
            getAnalighter: function () {
                console.log('Got clicked1');
                this.analysisMode = 'analighter'
            },
            getNotes: function () {
                console.log('got Clicked2');
                this.analysisMode = 'notes';

            },
            getResearch: function () {
                console.log('Got clicked3');
                this.analysisMode = 'research';
            }
        },
        components: {
            research,
            analighter
        }
    }
</script>
