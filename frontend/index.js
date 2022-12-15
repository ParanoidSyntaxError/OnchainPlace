document.getElementById("btn-refresh").onclick = refreshPlace;

document.getElementById("btn-resetzoom").onclick = resetZoom;
document.getElementById("btn-center").onclick = center;

const pixelX = document.getElementById("input-x");
const pixelY = document.getElementById("input-y");
const offsetX = document.getElementById("input-offsetx");
const offsetY = document.getElementById("input-offsety");

initialize();

async function initialize() {
    const placeJson = await getPlace();
    setPlace(placeJson["place"], placeJson["totalChanges"]);
    await refreshPlace();
}

async function refreshPlace() {
    const latestPixels = await getLatestPixels(placeTotalChanges);
    addPixels(latestPixels);
}

document.getElementById("btn-mint").onclick = () => {
    mint(parseInt(offsetX.value), parseInt(offsetY.value));
};

document.getElementById("btn-setpixel").onclick = () => {
    let color = 9999;
    try {
        color = parseInt(document.querySelector('input[name="colors"]:checked').value);
    } catch {}
    setPixel(parseInt(pixelX.value), parseInt(pixelY.value), color);
};