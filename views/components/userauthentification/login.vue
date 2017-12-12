<template>
    <form action="/signin/login" method="post">
        Benutzername oder Email<br>
        <input type="text" name="user"><br>
        Password<br>
        <input type="text" name="pass"><br>
        <input type="submit">
    </form>
</template>

<script>
    export default {
        name: "login"
    }
</script>

<style scoped>

</style>