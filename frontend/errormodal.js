let errorModal = document.getElementById("modal-error");

const ErrorCode = {
    NotConnected        : "Connect a wallet!",
    InvalidChainId      : "Switch to the Polygon Matic network!",
    NonexistentPlace    : "Cannot fetch place!",

    NoXY                : "Enter an X and Y value!",
    NoId                : "Enter a mint ID!",

    NonexistentMintId   : "Mint ID does not exist!",

    MintReverted        : "Mint reverted!",
    M_XTooHigh          : "Mint X is greater than 985!",
    M_XTooLow           : "Mint X is less than 0!",
    M_YTooHigh          : "Mint Y is greater than 985!",
    M_YTooLow           : "Mint Y is less than 0!",
    M_NoChanges         : "Current place has already been minted!",
    InsufficientMatic   : "1 MATIC required to mint!",

    SetPixelReverted    : "Set pixel reverted!",
    SP_XTooHigh         : "Set pixel X is greater than 999!",
    SP_XTooLow          : "Set pixel X is less than 0!",
    SP_YTooHigh         : "Set pixel Y is greater than 999!",
    SP_YTooLow          : "Set pixel Y is less than 0!",
    SelectColor         : "Select a color!"
};

const WarningCode = {

};

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