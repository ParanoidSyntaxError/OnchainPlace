let modal = document.getElementById("modal-message");

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

const SuccessCode = {
    SetPixelSuccess : "Set pixel transaction succeeded!",
    MintSuccess     : "Mint transaction succeeded!"
};

modal.addEventListener('animationend', (event) => {
    modal.style.display = "none";
});

function errorMessage(message, url) {
    modal.style.display = "none";

    modal.children[0].style.backgroundColor = "red";

    if(url == "" || url == undefined) {
        modal.children[0].removeAttribute("href");
    } else {
        modal.children[0].setAttribute("href", url);
    }
    setTimeout(function(){   
        modal.children[0].innerHTML = message.toString();
        modal.style.display = "block";
    }, 10);
}

function successMessage(message, url) {
    modal.style.display = "none";

    modal.children[0].style.backgroundColor = "green";

    if(url == "" || url == undefined) {
        modal.children[0].removeAttribute("href");
    } else {
        modal.children[0].setAttribute("href", url);
    }

    setTimeout(function(){   
        modal.children[0].innerHTML = message.toString();
        modal.style.display = "block";
    }, 10);
}