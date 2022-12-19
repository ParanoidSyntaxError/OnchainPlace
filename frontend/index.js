document.getElementById("btn-refresh").onclick = refreshPlace;

document.getElementById("btn-resetzoom").onclick = resetZoom;
document.getElementById("btn-center").onclick = center;

const pixelX = document.getElementById("input-x");
const pixelY = document.getElementById("input-y");
const offsetX = document.getElementById("input-offsetx");
const offsetY = document.getElementById("input-offsety");

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
    let x = parseInt(offsetX.value);
    let y = parseInt(offsetY.value);

    if(isNaN(x) || isNaN(y)) {
        errorMessage(ErrorCode.NoXY);
        return;
    }

    if(x < 0) {
        errorMessage(ErrorCode.M_XTooLow);
        return;
    }
    if(x > 985) {
        errorMessage(ErrorCode.M_XTooHigh);
        return;
    }
    if(y < 0) {
        errorMessage(ErrorCode.M_YTooLow);
        return;
    }
    if (y > 985) {
        errorMessage(ErrorCode.M_YTooHigh);
        return;
    }

    mint(parseInt(x), parseInt(y));
};

document.getElementById("btn-setpixel").onclick = () => {
    let color;
    try {
        color = parseInt(document.querySelector('input[name="colors"]:checked').value);
    } catch {}
    if(color == undefined) {
        errorMessage(ErrorCode.SelectColor);
        return;
    }

    let x = parseInt(pixelX.value);
    let y = parseInt(pixelY.value);

    if(isNaN(x) || isNaN(y)) {
        errorMessage(ErrorCode.NoXY);
        return;
    }

    if(x < 0) {
        errorMessage(ErrorCode.SP_XTooLow);
        return;
    }
    if(x > 999) {
        errorMessage(ErrorCode.SP_XTooHigh);
        return;
    }
    if(y < 0) {
        errorMessage(ErrorCode.SP_YTooLow);
        return;
    }
    if (y > 999) {
        errorMessage(ErrorCode.SP_YTooHigh);
        return;
    }

    setPixel(x, y, color);
};