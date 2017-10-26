<html>
    <head></head>
        <body>
        <div id="modal" style="display:none;top:100px;width:500px;position:absolute;margin:auto;">
            <h1 id="word"></h1>
           <textarea id="comment"></textarea>
           <input type="button" onclick="saveComment();">
    </div>
    <textarea id="input"></textarea>
    <input type="button" value="parse" onclick="parseInput();">
    <div id="output"></div>
    <script>
var words;
var comments = {};
var openid;
function parseInput() {
    var text = document.getElementById('input').value;
    words = text.split(' ');
    var html = '';

    for (var i=0; i< words.length;i++) {
        html += '<span style="padding: 0 5px;" onclick="addComment(' + i + ')" id="' + i + '">' + words[i] + '</span>';
    }
    document.getElementById('output').innerHTML = html;
}
function addComment(id) {
    //$('#modal').css('display', 'block');
    document.getElementById('modal').style.display = 'block';
    //$('#word').html(words[id]);
    document.getElementById('word').innerHTML = words[id];
    document.getElementById('comment').value = comments[id];
    openid = id;
}
function saveComment() {
    comments[openid] = document.getElementById('comment').value;
    document.getElementById('modal').style.display = 'none';
}
</script>
</body>
</html>
