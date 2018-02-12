<template>
    <div class="mdl-grid">
        <!--left grid for text stuff -->
        <div class="mdl-cell mdl-cell--6-col contentColor">
            <div class="mdl-grid"
                 id="textWindow"
                 ref="textWindow"
                 style="width: 100%">

                <component is="tex"
                           v-for="(token,i) in col"
                           v-bind:key="token.wordID"
                           v-bind:token="token"
                           v-bind:tokens="tokens"
                           v-bind:mentions="mentions"
                           v-bind:index="i+1"
                           v-bind:selectedindexes="selectedindexes"
                           v-bind:classestomark="classestomark"
                           v-bind:hoveredchain="hoveredchain"
                           v-bind:nestedmentions="nestedmentions"
                           v-bind:selectedchain="selectedchain"
                           v-on:hoverchain="hoverChain($event)"
                           v-on:startselection="selectText($event)"
                           v-on:endselection="selectText($event)">
                </component>
            </div>
        </div>
        <!--right grid for result stuff -->
        <div class="mdl-cell mdl-cell--6-col contentColor" v-on:click="test">
            <component
                    :is="analysisMode"
                    v-bind:tokens="tokens"
                    v-bind:docid="docid"
                    v-bind:notes="notes"
                    v-bind:notemodes="notemodes"
                    v-bind:researchmode="researchmode"
                    v-bind:selectedindexes="selectedindexes"
                    v-bind:selectedchain="selectedChain"
                    v-bind:mentions="mentions"
                    v-bind:showmode="showmode"
                    v-bind:classestomark="classestomark"
                    v-on:jumpmarktext="selectText2($event)">
            </component>
        </div>
    </div>
</template>

<script>
    import research from './components/analysis/research.vue';
    import notes from './components/analysis/notes/notes.vue';
    import analighter from './components/analysis/analighter.vue';
    import tex from './components/analysis/text.vue';
    export default {
        props:{
            col: Array,
            colindex: Number,
            splitted: Array,
            tokens:Array,
            notes: Array,
            mentions: Array,
            nestedmentions: Array,
            selectedindexes:Object,
            selectedchain: Number,
            hoveredchain: Number,
            classestomark: Object,
            showmode: String,
            notemodes:Object,
            researchmode: String,
            analysismode: String,
            docid: Number,
        },
        data:function () {
            return {
                col: this.col,
                colindex: this.colindex,
                splitted: this.splitted,
                tokens: this.tokens,
                notes: this.notes,
                mentions: this.mentions,
                nestedmentions: this.nestedmentions,
                selectedindexes: this.selectedindexes,
                selectedchain: this.selectedchain,
                hoveredchain: this.hoveredchain,
                classestomark: this.classestomark,
                showmode: this.showmode,
                notemodes: this.notemodes,
                researchmode: this.researchmode,
                analysismode: this.analysismode,
                docid: this.docid
            }
        },
        methods:{
            hoverChain: function (chain) {
                this.hoveredChain = chain;
                this.$emit('hoverchain', chain);
            },
            startselection:function(index){
               this.$emit('startselection', index);
            },
            endselection:function(index){
                this.$emit('endselection', index);
            }
        },

        components:{
            tex,
            research,
            analighter,
            notes
        }
    }
</script>

<style scoped>

</style>