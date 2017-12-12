<template>
    <form action="/signin/register" method="post">
        Email<br>
        <input type="text" name="email"><br>
        Benutzername<br>
        <input type="text" name="username"><br>
        Password<br>
        <input type="text" name="pass"><br>
        <input type="submit">
    </form>
</template>

<script>
    export default {
        name: "register"
    }
</script>

<style scoped>

</style>