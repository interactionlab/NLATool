<template>
    <div>
        <!--Switch between word notes and text notes-->
        <component :is="noteMode"></component>
    </div>
</template>

<script>
    export default {
        name: "notestool"
    }
</script>

<style scoped>

</style>