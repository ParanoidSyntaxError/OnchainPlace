let mintConfirm = document.getElementById("btn-mint-confirm");
let mintCancel = document.getElementById("btn-mint-cancel");

let mintModal = document.getElementById("modal-mint");
let closeMintModal = document.getElementById("modal-mint-close");

let mintView = document.getElementById("mint-view");
let mintViewCtx = mintView.getContext("2d");

initializeMint();

function initializeMint() {
    mintView.width = 1000;
    mintView.height = 1000;
}

mintConfirm.addEventListener("click", async function() {
    showLoader();
    let x = parseInt(offsetX.value);
    let y = parseInt(offsetY.value);
    await mint(x, y);
    mintModal.style.display = "none";
    hideLoader();
});

mintCancel.addEventListener("click", function() {
    mintModal.style.display = "none";
});

mintButton.addEventListener("click", function() {
    trymint: try {
        let x = parseInt(offsetX.value);
        let y = parseInt(offsetY.value);
    
        if(isNaN(x) || isNaN(y)) {
            errorMessage(ErrorCode.NoXY);
            break trymint;
        }
    
        if(x < 0) {
            errorMessage(ErrorCode.M_XTooLow);
            break trymint;
        }
        if(x > 985) {
            errorMessage(ErrorCode.M_XTooHigh);
             break trymint;
        }
        if(y < 0) {
            errorMessage(ErrorCode.M_YTooLow);
            break trymint;
        }
        if (y > 985) {
            errorMessage(ErrorCode.M_YTooHigh);
            break trymint;
        }
    
        mintModal.style.display = "block";

        mintViewCtx.imageSmoothingEnabled = false;
        mintViewCtx.drawImage(placeData, parseInt(offsetX.value), parseInt(offsetY.value), 16, 16, 0, 0, mintView.width, mintView.height);
    } catch {}
});
    
closeMintModal.onclick = function() {
    mintModal.style.display = "none";
}

window.addEventListener("click", function(e) {
    if (e.target == mintModal) {
        mintModal.style.display = "none";
    }
});