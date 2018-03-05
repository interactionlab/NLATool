<template>
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <!-- Add spacer, to align navigation to the right -->

            <span v-if="!editingtitle"
                  class="mdl-layout-title"
                  v-on:click="editing"
            >{{title}}</span>
            <input type="text"
                   v-else-if="editingtitle && !preventtitleedit"
                   v-model="newTitle"
                   v-on:keyup.enter="editTitle"
                   v-on:keyup.esc="back"
                   class="mdl-textfield__input"/>
            <div class="mdl-layout-spacer">
            </div>
            <!-- Headerbutton (3 dots) on the right-->
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="headerbtn">
                <i class="material-icons">account_circle</i>
            </button>
            <!-- Some examples for headerbutton-->
            <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" for="headerbtn">
                <a class="mdl-navigation__link" href="profile">
                    <li class="mdl-menu__item">Profile</li>
                </a>
                <a class="mdl-navigation__link" href="signin">
                    <li class="mdl-menu__item">Sign In</li>
                </a>
                <a class="mdl-navigation__link" href="signin">
                    <li class="mdl-menu__item">Sign Out</li>
                </a>
            </ul>
            <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="settingsbutn"
                    v-if="route === 'analysis'">
                <i class="material-icons">settings</i>
            </button>
            <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" for="settingsbutn">
                <li class="mdl-menu__item"
                    v-if="route === 'analysis'">
                    <span>View Splits</span>
                    <input type="radio" id="auto" value="true" v-bind:checked="autochecked" v-model="autochecked"/>
                    <input type="number" id="numberOfcolumnsInput"
                           v-model="numberofcolumns"/>
                </li>
                <li class="mdl-menu__item"
                    v-if="route === 'analysis'"
                    v-on:click="toggleResearchContent('img')"
                >Toggle Images</li>
                <li class="mdl-menu__item"
                    v-if="route === 'analysis'"
                    v-on:click="toggleResearchContent('map')">Toggle Maps</li>
                <li class="mdl-menu__item"
                    v-if="route === 'analysis'"
                    v-on:click="toggleResearchContent('information')">Toggle Detailed Information</li>
            </ul>
        </div>
    </header>
</template>
<script>
    export default {
        props: {
            title: String,
            preventtitleedit: Boolean,
            docid: Number,
            route: String,
            numberofcolumns: Number,
            autochecked: Boolean
        },
        data: function () {
            return {
                title: this.title,
                editingtitle: false,
                preventtitleedit: this.preventtitleedit,
                docid: this.docid,
                newTitle: '',
                route: this.route,
                autochecked: this.autochecked,
            }
        },
        methods: {
            editTitle: function () {
                this.title = this.newTitle;
                let socket = io('http://localhost:8080');
                socket.emit('changeTitle', this.docid, this.newTitle);
                this.editingtitle = false;
            },
            editing: function () {
                if (!this.preventtitleedit) {
                    this.editingtitle = true;
                    this.newTitle = this.title;
                }
            },
            back: function () {
                this.editingtitle = false;
            },
            toggleResearchContent:function (toToggle) {
                
            }
        },
        watch: {
            numberofcolumns: function (newNumber) {
                if (newNumber === 0) {
                    this.$emit('newcolumnnumber', 0);
                } else {
                    this.$emit('newcolumnnumber', newNumber);
                }
            }
        },
        computed: {
        },
    }
</script>