<template>
<html>
<head>
    <script src="/javascripts/comment.js"></script>
</head>
<body>
    <div id="modal" style="display:none;top:100px;width:500px;position:absolute;margin:auto;">
      <h1 id="word"></h1>
      <textarea id="comment"></textarea>
      <input type="button" onclick="saveComment();">
    </div>
<textarea id="input"></textarea>
<input type="button" value="parse" onclick="parseInput();">
<div id="output"></div>
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