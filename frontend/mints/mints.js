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

const ownedParent = document.getElementById("div-ownedparent");

initialize();

async function initialize() {
    showLoader();
    try {
        onConnected = displayOwnedMints;

        const total = await totalMints();
        await displayMint(total - 1);
    } catch {}
    hideLoader();
}

async function searchMint() {
    let id = parseInt(idSearch.value);
    
    if(isNaN(id)) {
        errorMessage(ErrorCode.NoId);
        return;
    }

    await displayMint(id);
}

async function displayMint(id) {
    showLoader();
    try {
        const mintJson = await getMint(id);
        setPlace(mintJson["place"], mintJson["totalChanges"]);
        mintId.innerHTML = "ID: " + id;
        mintChanges.innerHTML = "Changes: " + mintJson["totalChanges"];
        mintOwner.innerHTML = "Owner: " + mintJson["owner"];
    } catch {}
    hideLoader();
}

async function displayOwnedMints() {
    showLoader();
    try {
        ownedParent.style.padding = "25px 0px";
        ownedParent.innerHTML = "";
    
        mints = await ownedMints(address);
    
        let promises = [];
    
        for(let i = 0; i < mints.length; i++) {
            promises.push(contract.tokenURI(mints[i]["id"]));
        }
    
        const responses = await Promise.all(promises);
    
        for(let i = 0; i < mints.length; i++) {
            let frameParent = document.createElement("div");
            frameParent.className = "mint-frame";
            frameParent.onclick = function () {
                displayMint(mints[i]["id"]);
            };
    
            let itemId = document.createElement("div");
            itemId.innerHTML = "ID: " + mints[i]["id"];
            itemId.className = "mint-text";
            
            let itemChanges = document.createElement("div");
            itemChanges.innerHTML = "Changes: " + mints[i]["totalChanges"];
            itemChanges.className = "mint-text";
    
            let itemImage = document.createElement("img");
            let mintJson = JSON.parse(atob(responses[i].replace("data:application/json;base64,", "")));
            itemImage.src = mintJson["image"];
            itemImage.className = "mint-image";
    
            frameParent.appendChild(itemId);
            frameParent.appendChild(itemImage);
            frameParent.appendChild(itemChanges);
    
            ownedParent.appendChild(frameParent);
        }
    } catch {}
    hideLoader();
}