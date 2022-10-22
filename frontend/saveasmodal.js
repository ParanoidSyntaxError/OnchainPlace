var canvasView = document.getElementById("canvas-view");
var modal = document.getElementById("modal-saveas");
var closeModal = document.getElementById("modal-close");

canvasView.addEventListener('contextmenu', function(ev) {
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