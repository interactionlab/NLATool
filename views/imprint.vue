<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <component is="mainheader"
                   v-bind:serverip="serverip"
                   v-bind:title="title"
                   v-bind:preventtitleedit="true">
        </component>
        <component is="headernavbar"
                   v-bind:title_small="title_small">
        </component>
        <main class="mdl-layout__content" style="padding: 1em; display: inline-block; text-align: center;">
            <div  class="mdl-grid contentColor mdl-shadow--6dp" style="max-width:2160px; overflow-y:auto;     display: inline-block; text-align: left;">
                <h1>Impressum</h1>
                <h2>Project: NLA - Natural Language Analyse Tool</h2>
                <p>This project was developed as a student project in the summer and winter term of 2017/18 at the <a href="https://www.uni-stuttgart.de/en/">University of Stuttgart</a> by Eric Hämmerle, Emine Turcan,  Florin Rheinwald, and Gustav Murawski. The project was supervised by <a href="http://sven-mayer.com">Sven Mayer</a>, <a href="http://vali.de">Valentin Schwind</a>, <a href="http://www.ims.uni-stuttgart.de/institut/mitarbeiter/gaertnms/">Markus Gärtner</a>, and <a href="http://www.ims.uni-stuttgart.de/institut/mitarbeiter/jonas/">Jonas Kuhn</a>. During the project, Markus Gärtner and Jonas Kuhn have been responsible for the computational linguistics parts. Sven Mayer and Valentin Schwind were responsible for technical implementation and user experience (UX).
                </p>
                <p>To report any issues, feature request or any other form of feedback please create at issue at <a href="https://github.com/interactionlab/NLATool/issues">github.com</a></p>
                <p>The source code of this project is under GPL-3.0 Licence avalible at: <a href="github.com/interactionlab/NLATool">github.com/interactionlab/NLATool</a></p>
            </div>
        </div>
    </div>
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
            headernavbar,
        }
    }
</script>
