let canvas = document.getElementById("canvas-view");
let modal = document.getElementById("modal-saveas");
let closeModal = document.getElementById("modal-close");

canvas.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    modal.style.display = "block";
    return false;
}, false);
    
closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}