<template>
    <div style="padding:0;height: auto !important; max-height: 100%; overflow: hidden; display: flex;width:100%;">
        <div class="mdl-grid contentColor mdl-shadow--6dp" style="display: flex;margin: 1em;width:100%; padding:0"
             v-on:mouseover="movetoolbar">
            <!--left grid for text stuff -->
            <div class="mdl-cell mdl-cell--6-col"
                 style="border-right: 1px solid rgba(0,0,0,.1);margin: 0;padding: 8px; width: 50%">
                <div class="mdl-grid"
                     id="textWindow"
                     ref="textWindow"
                     style="overflow-y: auto; height: auto !important; display: flex; max-height: 100%;">
                    <component is="tex"
                               v-for="(token,i) in col"
                               v-bind:key="token.textIndex"
                               v-bind:token="token"
                               v-bind:tokens="tokens"
                               v-bind:mentions="mentions"
                               v-bind:index="token.textIndex"
                               v-bind:selectedindexes="selectedindexes"
                               v-bind:classestomark="classestomark"
                               v-bind:hoveredchain="hoveredchain"
                               v-bind:nestedmentions="nestedmentions"
                               v-bind:selectedchain="selectedchain"
                               v-bind:entityindextoline="entityindextoline"
                               v-bind:entitytoline="entitytoline"
                               v-on:hoverchain="hoverChain($event)"
                               v-on:startselection="startselection($event)"
                               v-on:endselection="endselection($event)"
                               v-on:setoffsetstart="setoffsetstart($event)">
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
                            v-bind:mentions="mentions"
                            v-bind:showmode="showmode"
                            v-bind:classestomark="classestomark"
                            v-bind:contentcontrol="contentcontrol"
                            v-bind:entitytoline="entitytoline"
                            v-bind:whereislinefrom="whereislinefrom"
                            v-on:togglesemanticlass="togglesemanticlass($event)"
                            v-on:hoverlinesetoffsetend="hoverlinesetoffsetend($event)"
                            v-on:jumpmarktext="selectText2($event)"
                            v-on:pickresearchresult="pickresearchresult($event)">
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
            serverip: String,
            col: Array,
            colindex: Number,
            splitted: Array,
            tokens: Array,
            notes: Array,
            mentions: Array,
            nestedmentions: Array,
            selectedindexes: Object,
            selectedchain: Number,
            hoveredchain: Number,
            classestomark: Object,
            showmode: String,
            notemodes: Object,
            researchmode: String,
            analysismode: String,
            docid: Number,
            textcolumnposition: Number,
            tokenstoshow: Array,
            contentcontrol: Object,
        },
        data: function () {
            return {
                serverip: this.serverip,
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
                docid: this.docid,
                textcolumnposition: this.textcolumnposition,
                tokenstoshow: this.tokenstoshow,
                contentcontrol: this.contentcontrol,
                entitytoline: [],
                whereislinefrom: "",
                entityindextoline: -1
            }
        },
        methods: {
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
            setoffsetstart: function (event) {
                let offsets = event[0];
                let token = event[1];
                let found = false;
                let next = token.textIndex + 1;
                let prev = token.textIndex - 1;
                let completeEntity = [];
                completeEntity.push(token);
                while (!found) {
                    if (typeof this.tokens[next] !== 'undefined' && this.tokens[next].semanticClass === token.semanticClass) {
                        completeEntity.push(this.tokens[next]);
                        found = false;
                        next++;
                    } else {
                        found = true;
                    }
                    if (typeof this.tokens[prev] !== 'undefined' && this.tokens[prev].semanticClass === token.semanticClass) {
                        completeEntity.push(this.tokens[prev]);
                        found = false;
                        prev--;
                    } else {
                        found = true;
                    }
                }
                completeEntity.sort(this.dynamicSort('textIndex'));
                
                this.entitytoline = completeEntity;
                this.whereislinefrom = event[2];                
                this.$emit('setoffsetstart', [offsets, this.entitytoline, "text"]);
            },
            hoverlinesetoffsetend: function (event) {
                this.$emit('hoverlinesetoffsetend', event);
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
            pickresearchresult:function (event) {
                this.entityindextoline = event[0];
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