let loader = document.getElementById("div-loader");

let loadCount = 0;

function showLoader() {
    loader.hidden = false;
    loadCount += 1;
}

function hideLoader() {
    loadCount -= 1;
    if(loadCount <= 0) {
        loadCount = 0;
        loader.hidden = true;
    }
}