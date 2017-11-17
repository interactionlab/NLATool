<template>
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
        <p>Here you can Set new Connection Information for your Database.</p>
        <form action="/setup/setNewConnection" method="post">
            Host:<br>
            <input type="text" name="host"><br>
            Port:<br>
            <input type="text" name="port"><br>
            Username:<br>
            <input type="text" name="user"><br>
            Password:<br>
            <input type="text" name="pass"><br>
            <input type="submit">
        </form>
        <p>{{ResultOfSetNewConnection}}</p>
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