document.getElementById("btn-refresh").onclick = refreshPlace;

document.getElementById("btn-resetzoom").onclick = resetZoom;
document.getElementById("btn-center").onclick = center;

let pixelX = document.getElementById("input-x");
let pixelY = document.getElementById("input-y");
let offsetX = document.getElementById("input-offsetx");
let offsetY = document.getElementById("input-offsety");

initialize();

async function initialize() {
    showLoader();
    try {
        const placeJson = await getPlace();
        setPlace(placeJson["place"], placeJson["totalChanges"]);
        await refreshPlace();
    } catch {}
    hideLoader();
}

async function refreshPlace() {
    showLoader();
    try {
        const latestPixels = await getLatestPixels(placeTotalChanges);
        addPixels(latestPixels);
    } catch{}
    hideLoader();
}

document.getElementById("btn-mint").onclick = async function() {
    showLoader();
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
    
        await mint(parseInt(x), parseInt(y));
    } catch {}
    hideLoader();
};

document.getElementById("btn-setpixel").onclick = async() => {
    showLoader();
    trysetpixel: try {
        let color;
        try {
            color = parseInt(document.querySelector('input[name="colors"]:checked').value);
        } catch {}
        if(color == undefined) {
            errorMessage(ErrorCode.SelectColor);
            break trysetpixel;
        }
    
        let x = parseInt(pixelX.value);
        let y = parseInt(pixelY.value);
    
        if(isNaN(x) || isNaN(y)) {
            errorMessage(ErrorCode.NoXY);
            break trysetpixel;
        }
    
        if(x < 0) {
            errorMessage(ErrorCode.SP_XTooLow);
            break trysetpixel;
        }
        if(x > 999) {
            errorMessage(ErrorCode.SP_XTooHigh);
            break trysetpixel;
        }
        if(y < 0) {
            errorMessage(ErrorCode.SP_YTooLow);
            break trysetpixel;
        }
        if (y > 999) {
            errorMessage(ErrorCode.SP_YTooHigh);
            break trysetpixel;
        }
    
        await setPixel(x, y, color);
        refreshPlace();
    } catch {}
    hideLoader();
};