// ButtonFunction (used in analyse.ejs) for open and close the result field
function expand() {
    var button = document.getElementById('switch');
    var rightDiv = document.getElementById('right-column');
    if (button.value === 'v') {
        button.value = '^';
        rightDiv.style.display = 'inline';
    } else {
        button.value = 'v';
        rightDiv.style.display = 'none';
    }

    function showMessage(value) {
        document.getElementById("message").innerHTML = value;
    }
}