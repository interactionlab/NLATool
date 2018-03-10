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
                    v-if="route === 'analysis'">
                    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="toggleImg">
                        <input type="checkbox"
                               id="toggleImg"
                               class="mdl-switch__input"
                               v-on:click="toggleResearchContent(img)"
                               checked>
                        <span class="mdl-switch__label">Toggle Images</span>
                    </label>
                </li>
                <li class="mdl-menu__item"
                    v-if="route === 'analysis'">
                    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="toggleMap">
                        <input type="checkbox"
                               id="toggleMap"
                               class="mdl-switch__input"
                               v-on:click="toggleResearchContent(map)"
                               checked>
                        <span class="mdl-switch__label">Toggle Maps</span>
                    </label>
                </li>
                <li class="mdl-menu__item"
                    v-if="route === 'analysis'"
                    v-on:click="toggleResearchContent(information)">
                    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="toogleInfo">
                        <input type="checkbox"
                               id="toogleInfo"
                               class="mdl-switch__input"
                               v-on:click="toggleResearchContent(information)"
                               checked>
                        <span class="mdl-switch__label">Toggle Detailed Information</span>
                    </label>
                </li>
            </ul>
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

        </div>
    </header>
</template>
<script>
    export default {
        props: {
            title: { type: String, default: "" },
            preventtitleedit: { type: Boolean, default: false},
            docid: { type: Number, default: -1 },
            route: { type: String, default: "" },
            numberofcolumns: Number,
            autochecked: Boolean,
            serverip: { type: String, default: "" }
        },
        data: function () {
            return {
                editingtitle: false,
                newTitle: '',
                autochecked: this.autochecked,
                img: 'img',
                map: 'map',
                information: 'information',
            }
        },
        methods: {
            editTitle: function () {
                this.title = this.newTitle;
                let socket = io(this.serverip +':8080');
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
            toggleResearchContent: function (toToggle) {
                this.$emit('contenttoggle', toToggle);
            },
            toggleSortingMode: function (mode) {
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
        computed: {},
    }
</script>