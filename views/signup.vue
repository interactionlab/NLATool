<!-- VUE template -->
<template lang="html">
    <!DOCTYPE html>
    <html>
    <head>
        <title>{{ title }}</title>
        <link rel='stylesheet' href='/css/style.css'/>
        <!--Script in /public/javascripts -->
        <!--Stylesheets & bootstrap in /public/javascripts -->
    </head>
    <body>
    <div class="row">
        <div class="center-block">
            <!-- <img src="/public/images/logo.png" alt="Logo">-->
        </div>
    </div>
    <div class="row">
        <h1>{{ title }}</h1>
    </div>
    <div class="row">
        <form>
            Benutzername<br>
            <input type="text" name="username"><br>
            Email-Adresse<br>
            <input type="text" name="email"><br>
            Password<br>
            <input type="text" name="pass"><br>
            <input type="submit">
        </form>
    </div>

    </body>
    </html>
</template>
<script>
    export default {
        data: function () {
            return {
            }
        }
    }
</script>

