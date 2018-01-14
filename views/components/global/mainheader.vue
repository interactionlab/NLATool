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
                <a class="mdl-navigation__link" href="signout">
                    <li class="mdl-menu__item">Sign Out</li>
                </a>
            </ul>
        </div>
    </header>
</template>
<script>
    export default {
        props: {
            title: String,
            preventtitleedit: Boolean,
            docid: Number
        },
        data: function () {
            return {
                title: this.title,
                editingtitle: false,
                preventtitleedit: this.preventtitleedit,
                docid: this.docid,
                newTitle: ''
            }
        },
        methods: {
            editTitle: function () {
                this.title = this.newTitle;
                let socket = io('http://localhost:8081');
                socket.emit('changeTitle', this.docid, this.newTitle);
                this.editingtitle = false;
            },
            editing: function () {
                if (!this.preventtitleedit) {
                    this.editingtitle = true;
                    this.newTitle = this.title;
                }
            },
            back:function () {
                this.editingtitle = false;
            }
        },
        computed: {
        }
    }
</script>