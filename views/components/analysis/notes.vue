<template>
    <div>
        <input type="submit" id="commentt" value=" Comment " onclick="commentWord()"/>
        <br />
        <textarea id="textareaa"></textarea>
    </div>
</template>
<script>
    export default {
        data: function () {
            return{}

        },

        let: interpunction = [".", ",", "\"", "'", "(", ")", "[", "]", "?", "!"],

    function : commentWord() {
        let txtarea = document.getElementById("textarea");
        let start = txtarea.selectionStart;
        let finish = txtarea.selectionEnd;
        let sel = txtarea.value.substring(start, finish).trim();
        let word = sel.split(' ')[0];

        interpunction.forEach(function(sign) {
            word = word.replace(sign, "");
        });

        let allWords = textarea.value.split(' ');
        let wordCount = allWords.length;
        let index = allWords.indexOf(word) + 1;

        alert("Woerter insgesamt: " + wordCount + "\nWort Index: " + String(index) + "\nAusgewaehltes Wort: " + word);

    }
</script>
