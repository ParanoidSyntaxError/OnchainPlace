document.getElementById("btn-search").onclick = searchMint;

const idSearch = document.getElementById("input-mintid");
idSearch.addEventListener("keydown", function (e) {
    if(e.code == "Enter") {
        searchMint();
    }
});

document.getElementById("btn-resetzoom").onclick = resetZoom;
document.getElementById("btn-center").onclick = center;

const mintId = document.getElementById("box-id");
const mintChanges = document.getElementById("box-changes");
const mintOwner = document.getElementById("box-owner");

initialize();

async function initialize() {
    const total = await totalMints();
    const rndId = Math.floor(Math.random() * total);
    await displayMint(rndId);
}

async function searchMint() {
    await displayMint(idSearch.value)
}

async function displayMint(id) {
    const mintJson = await getMint(id);
    setPlace(mintJson["place"], mintJson["totalChanges"]);
    mintId.innerHTML = "ID: " + id;
    mintChanges.innerHTML = "Changes: " + mintJson["totalChanges"];
    mintOwner.innerHTML = "Owner: " + mintJson["owner"];
}