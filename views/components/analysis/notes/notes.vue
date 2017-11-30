<template>
    <div class="mdl-cell mdl-cell--12-col graybox">
        <div>
            <!--Switch between word notes and text notes-->
        </div>
        <component :is="noteMode">

        </component>
    </div>
</template>
<script>
    export default {
        data: function () {
            return{
                noteMode: 'wordNote'
            }
        }
    }
</script>