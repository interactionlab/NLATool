<template>
    <div style="padding:0;height: auto !important; max-height: 100%; overflow: hidden; display: flex;width:100%;">
        <div class="mdl-grid contentColor mdl-shadow--6dp" style="display: flex;margin: 1em;width:100%; padding:0"
             v-on:mouseover="movetoolbar">
            <!--left grid for text stuff -->
            <div class="mdl-cell mdl-cell--6-col"
                 style="border-right: 1px solid rgba(0,0,0,.1);margin: 0;padding: 8px; width: 50%; overflow-y: auto;">
                <div class="mdl-grid" id="textWindow" ref="textWindow"
                     style="height: auto !important; display: flex; max-height: 100%;">
                    <component is="tex"
                               v-for="(token,i) in col"
                               v-bind:key="token.textIndex"
                               v-bind:token="token"
                               v-bind:prevtoken="prevtoken(token.textIndex)"
                               v-bind:index="token.textIndex"
                               v-bind:selectedindexes="selectedindexes"
                               v-bind:classestomark="classestomark"
                               v-bind:hoveredchain="hoveredchain"
                               v-bind:selectedchain="selectedchain"
                               v-bind:hoverdata="hoverdata"
                               v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                               v-on:hoverchain="hoverChain($event)"
                               v-on:startselection="startselection($event)"
                               v-on:endselection="endselection($event)"
                               v-on:starthover="starthover($event)"
                               v-on:endhover="endhover($event)">
                    </component>
                </div>
            </div>
            <!--right grid for result stuff -->
            <div class="mdl-cell mdl-cell--6-col" style="max-height: 100%; margin:0; overflow-y: auto; width:50%">
                <keep-alive>
                    <component
                            :is="analysismode"
                            v-bind:serverip="serverip"
                            v-bind:tokens="tokens"
                            v-bind:tokenstoshow="tokenstoshow"
                            v-bind:colindex="colindex"
                            v-bind:docid="docid"
                            v-bind:notes="notes"
                            v-bind:notemodes="notemodes"
                            v-bind:researchmode="researchmode"
                            v-bind:selectedindexes="selectedindexes"
                            v-bind:selectedchain="selectedchain"
                            v-bind:hoverdata="hoverdata"
                            v-bind:wordtomarkonhoverdata="wordtomarkonhoverdata"
                            v-bind:mentions="mentions"
                            v-bind:showmode="showmode"
                            v-bind:classestomark="classestomark"
                            v-bind:contentcontrol="contentcontrol"
                            v-on:togglesemanticlass="togglesemanticlass($event)"
                            v-on:endhover="endhover($event)"
                            v-on:jumpmarktext="selectText2($event)"
                            v-on:starthover="starthover($event)">
                    </component>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
    import research from './components/analysis/research.vue';
    import notes from './components/analysis/notes/notes.vue';
    import analighter from './components/analysis/analighter.vue';
    import tex from './components/analysis/text.vue';

    export default {
        props: {
            serverip: { type: String, default: "" },
            col: { type: Array, default: function () { return [] }},
            colindex: { type: Number, default: -1 },
            tokens: { type: Array, default: function () { return [] }},
            notes: { type: Array, default: function () { return [] }},
            mentions: { type: Array, default: function () { return [] }},
            selectedindexes: { type: Object, default: null },
            selectedchain: { type: Number, default: -1 },
            hoveredchain: { type: Number, default: -1 },
            hoverdata: { type: Object, default: null },
            wordtomarkonhoverdata: { type: Array, default: function () { return [] }},
            classestomark: { type: Object, default: null },
            showmode: { type: String, default: "" },
            notemodes: { type: Object, default: null },
            researchmode: { type: String, default: "" },
            analysismode: { type: String, default: "" },
            docid: { type: Number, default: -1 },
            textcolumnposition: { type: Number, default: -1 },
            tokenstoshow: { type: Array, default: function () { return [] }},
            contentcontrol: { type: Object, default: null }, 
        },
        data: function () {
            return {
                entitytoline: []
            }
        },
        computed:{
        },
        methods: {
            prevtoken:function (index) {
                if(index === 0){
                    return null;
                } else {
                    return this.tokens[index-1];
                }
            },
            movetoolbar: function () {
                this.$emit('movetoolbar', this.colindex);
            },
            hoverChain: function (chain) {
                this.hoveredChain = chain;
                this.$emit('hoverchain', chain);
            },
            startselection: function (index) {
                this.$emit('startselection', index);
            },
            endselection: function (index) {
                this.$emit('endselection', index);
            },
            selectText2: function (newSelectedIndexes) {
                this.$emit('jumpmarktext', newSelectedIndexes)
            },
            togglesemanticlass: function (newClassesToMark) {
                this.$emit('togglesemanticlass', newClassesToMark);
            },
            endhover: function (event) {
                this.$emit('endhover', event);
            },
            dynamicSort: function (property) {
                let sortOrder = 1;
                if (property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a, b) {
                    let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
            },
            starthover:function (event) {
                this.$emit('starthover', event);
            },
        },
        components: {
            tex,
            research,
            analighter,
            notes
        }
    }
</script>

<style scoped>

</style>