import io from 'socket.io-client';

let socket = io(8080);

/**
 * Emits sends a text and a related word to the server.
 * @param note
 * @param word
 */
function savewordnote(note, word){
    socket.emit('savewordnote', note, word);
}

function updatewordnote(id, note, word){
    socket.emit('updatewordnote', id, note, word);
}

function bignote(id, note){
    socket.emit('bignote', id, note);
}
