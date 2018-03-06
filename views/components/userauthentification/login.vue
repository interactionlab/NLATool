<template>
    <form action="/signin/login" method="post">
        <div class="mdl-card__supporting-text">
        
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width:100%">
                <input class="mdl-textfield__input" type="text" id="username" name="user" required>
                <label class="mdl-textfield__label" for="username">Username</label>
                <span class="mdl-textfield__error">{{errormsg}}</span>
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width:100%">
                <input class="mdl-textfield__input" type="password" id="userpass" name="pass" required>
                <label class="mdl-textfield__label" for="userpass">Password</label>
            </div>            
        </div>
        <div class="mdl-card__actions mdl-card--border">
            <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" >Sign in</button>
        </div>
    </form>
</template>

<script>
    export default {
        name: "login",
        props: {
            errormsg: Object
        },
        data: function () {
            return {}
        },
        
     }
</script>
    }

<style scoped>

</style>