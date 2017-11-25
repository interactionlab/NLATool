/**
 This script should highlight ever word that meets specific requirements.
 It use the package mark.js from https://markjs.io/.
 */

let mark = new Mark(document.getElementById('textWindow'));

let keywordInput = document.querySelector("input[name='keyword']");

function performMark(toMark) {
    // Remove previous marked elements and mark
    // the new keyword inside the context
    console.log('marking...:'+ toMark);
    mark.unmark({
        done: function(){
            console.log('marking2...:'+ toMark);
            mark.mark(toMark);
        }
    });
}
