/**
 This script should highlight ever word that meets specific requirements.
 It use the package mark.js from https://markjs.io/.
 */

if (this.$refs.textWindow !== null) {
    let mark = new Mark(this.$refs.textWindow);
}else{
    console.error('Mark.js didnt find the context!');
    let mark = null;
}
let keywordInput = document.querySelector("input[name='keyword']");

function performMark(toMark) {
    // Remove previous marked elements and mark
    // the new keyword inside the context
    console.log('marking...:' + toMark);
    mark.unmark({
        done: function () {
            console.log('marking2...:' + toMark);
            mark.mark(toMark);
        }
    });
}
