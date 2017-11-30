var openid, uid;
function parseInput() {
    var text = document.getElementById('input').value;
    var words = text.split(' ');
    var html = '';
    var url = '/comment/init';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById('uid').value = JSON.parse(this.responseText).uuid;
            //uid = JSON.parse(this.responseText).uid;
            //document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(JSON.stringify({"words": words}));
    for (let i=0; i< words.length;i++) {
        html += '<span style="padding: 0 5px;" onclick="addComment(' + i + ')" id="' + i + '">' + words[i] + '</span>';
    }
    document.getElementById('output').innerHTML = html;
}
function addComment(id) {
    var url = "/comment";
    let uid = document.getElementById('uid').value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            //$('#modal').css('display', 'block');
            let res = JSON.parse(this.responseText);
            document.getElementById('modal').style.display = 'block';
            //$('#word').html(words[id]);
            document.getElementById('word').innerHTML = res.word;
            document.getElementById('comment').value = res.comment;
            openid = id;
        }
    };
    xhttp.open("GET", url + "/" + id + "?uid=" + encodeURIComponent(uid), true);
    xhttp.send();
}
function saveComment() {
    let url = "/comment/save";
    let xhttp = new XMLHttpRequest();
    let uid = document.getElementById('uid').value;
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            //document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(JSON.stringify({"uid": uid, "id": openid, "comment": document.getElementById('comment').value}));
    document.getElementById('modal').style.display = 'none';
}
