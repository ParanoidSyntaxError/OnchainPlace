let saveasModal = document.getElementById("modal-saveas");
let closeSaveasModal = document.getElementById("modal-saveas-close");

placeView.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    saveasModal.style.display = "block";
    return false;
}, false);
    
closeSaveasModal.onclick = function() {
    saveasModal.style.display = "none";
}

window.addEventListener("click", function(e) {
    if (e.target == saveasModal) {
        saveasModal.style.display = "none";
    }
});