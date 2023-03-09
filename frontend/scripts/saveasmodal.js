let canvas = document.getElementById("place-view");
let saveasModal = document.getElementById("modal-saveas");
let closeModal = document.getElementById("modal-close");

canvas.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    saveasModal.style.display = "block";
    return false;
}, false);
    
closeModal.onclick = function() {
    saveasModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == saveasModal) {
        saveasModal.style.display = "none";
    }
}