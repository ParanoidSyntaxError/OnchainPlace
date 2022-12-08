document.getElementById("btn-refresh").onclick = refreshPlace;

document.getElementById("btn-resetzoom").onclick = resetZoom;
document.getElementById("btn-center").onclick = center;

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