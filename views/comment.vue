<template>
    <main>
        <div id="modal" style="display:none;top:100px;width:500px;position:absolute;margin:auto;">
            <form action="/comment/save" method="POST">
                <input type="hidden" v-bind:uid="uid">
                <h1 id="word">{{word}}</h1>
                <textarea id="comment" name="comment">{{comment}}</textarea>
                <input type="hidden" name="id" :value="id">
                <input type="button">
            </form>
        </div>
        <form action="/comment/init" method="POST">
            <input type="hidden" v-bind:uid="uid">
            <textarea id="input" name="text">{{words.join(' ')}}</textarea>
            <input type="submit" value="parse">
        </form>
        <div id="output">
            <a v-for="(word, index) in words" :href="'/comment/' + index + '?uid' + uid">{{word}}</a>
        </div>
    </main>
</template>
<script>
    export default {
        data: function () {
            return {
            }
        }
    }
</script>