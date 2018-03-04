<template>
    <form action="/signin/login" method="post">
        <div class="mdl-card__supporting-text">
            <div class="mdl-textfield mdl-js-textfield" style="width:100%">
                <input class="mdl-textfield__input" type="text" id="username" name="user">
                <label class="mdl-textfield__label" for="username">Username</label>
            </div>
            <div class="mdl-textfield mdl-js-textfield" style="width:100%">
                <input class="mdl-textfield__input" type="password" id="userpass" name="pass">
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
        name: "login"
        
     }
</script>
    }

<style scoped>

</style>