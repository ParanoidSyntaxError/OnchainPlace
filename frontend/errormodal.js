let errorModal = document.getElementById("modal-error");

const ErrorCode = {
    NotConnected : "ERROR: Connect a wallet!",
    InvalidSetPixel : "ERROR: Invalid set pixel input!",
    InvalidMint : "ERROR: Invalid mint input!"
}

errorModal.addEventListener('animationend', (event) => {
    errorModal.style.display = "none";
});

function errorMessage(message) {
    errorModal.style.display = "none";

    setTimeout(function(){   
        errorModal.children[0].innerHTML = message.toString();
        errorModal.style.display = "block";
    }, 10);
}