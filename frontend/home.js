let refreshButton = document.getElementById("btn-refresh");
refreshButton.addEventListener("click", refreshPlace);

let resetZoomButton = document.getElementById("btn-resetzoom");
resetZoomButton.addEventListener("click", resetZoom);

let centerButton = document.getElementById("btn-center");
centerButton.addEventListener("click", center);

let pixelX = document.getElementById("input-x");
let pixelY = document.getElementById("input-y");
let offsetX = document.getElementById("input-offsetx");
let offsetY = document.getElementById("input-offsety");

let mintButton = document.getElementById("btn-mint");
let setPixelButton = document.getElementById("btn-setpixel");

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

setPixelButton.addEventListener("click", async() => {
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
});