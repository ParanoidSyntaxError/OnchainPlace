document.getElementById("btn-refreshplace").onclick = refreshPlace;

document.getElementById("btn-resetzoom").onclick = resetZoom;
document.getElementById("btn-center").onclick = center;

var canvasData = document.getElementById("canvas-data");
var canvasView = document.getElementById("canvas-view");

var ctxData = canvasData.getContext("2d");
var ctxView = canvasView.getContext("2d");

canvasView.addEventListener('wheel', (e) => adjustScale(e.deltaY * (scrollSensitivity * scale)));
canvasView.addEventListener('mousedown', onPointerDown);
canvasView.addEventListener('mouseup', onPointerUp);
canvasView.addEventListener('mousemove', onPointerMove);

canvasView.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvasView.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
canvasView.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))

window.onresize = flexCanvasSize;

const colors = [
    "ffffff", "e4e4e4", "888888", "222222",
    "ffa7d1", "e50000", "e59500", "a06a42",
    "e5d900", "94e044", "02be01", "00d3dd",
    "0083c7", "0000ea", "cf6ee4", "820080"
];

let canvasOffset = { x: 0, y: 0 };
let scale = 1;
const maxScale = 40;
const minScale = 0.9;
const scrollSensitivity = 0.0005;

let dragging = false;
let drag = { x: 0, y: 0 };

let initialPinchDistance = null;
let lastScale = scale;

var placeImageData;
let canvasTotalChanges;

initializeCanvas();

async function initializeCanvas() {
    canvasData.width = 1000;
    canvasData.height = 1000;
    canvasView.width = 1000;
    canvasView.height = 1000;

    flexCanvasSize();

    clearPlace();

    placeImageData = ctxData.createImageData(1000, 1000);

    await fetchPlace();
    await fetchSubgraph();

    drawImageData(placeImageData);
}

async function refreshPlace() {
    await fetchSubgraph();

    drawImageData(placeImageData);
}

async function fetchSubgraph() {  
    pixels = await queryPixels(canvasTotalChanges);

    if(pixels.length > 0) {
        for (let i = 0; i < pixels.length; i++) {
            var color = colors[parseInt(pixels[i]["color"])];
            var position = pixels[i]["position"];
    
            placeImageData.data[(position * 4)] = parseInt(color.slice(0, 2), 16);
            placeImageData.data[(position * 4) + 1] = parseInt(color.slice(2, 4), 16);
            placeImageData.data[(position * 4) + 2] = parseInt(color.slice(4, 6), 16);
            placeImageData.data[(position * 4) + 3] = 255;
        }

        canvasTotalChanges = pixels[pixels.length - 1]["totalChanges"];
    }
}

async function queryPixels(lower) {
    lower = parseInt(lower);

    const query = `query response($lower:Int) {
        pixels(orderBy:totalChanges where:{totalChanges_gt:$lower}) {
            position
            color
            totalChanges
        }
    }`;

    var queryResponse;

    await fetch('https://api.thegraph.com/subgraphs/name/paranoidsyntaxerror/onchain-place', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: { lower }
        })
    })
    .then(response => response.json())
    .then(responseJson => {
        queryResponse = responseJson["data"]["pixels"];
    });

    return queryResponse;
}

async function fetchPlace() {
    var placeJson = await getPlaceFile();

    for (let i = 0; i < 1000000; i++) {
        var color = colors[parseInt(placeJson["place"][i], 16)];

        placeImageData.data[(i * 4)] = parseInt(color.slice(0, 2), 16);
        placeImageData.data[(i * 4) + 1] = parseInt(color.slice(2, 4), 16);
        placeImageData.data[(i * 4) + 2] = parseInt(color.slice(4, 6), 16);
        placeImageData.data[(i * 4) + 3] = 255;
    }

    canvasTotalChanges = placeJson["totalChanges"];
}

function drawImageData(imageData) {
    ctxView.imageSmoothingEnabled = false;

    ctxData.putImageData(imageData, 0, 0);
    ctxView.drawImage(canvasData, 0, 0, canvasView.width, canvasView.height);

    source = canvasData.toDataURL("image/png");
}

async function getPlaceFile() {
    var placeJson;

    await fetch('https://onchainplace.fra1.cdn.digitaloceanspaces.com/place.json', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
    .then(response => response.json())
    .then(responseJson => {
        placeJson = responseJson;
    });

    return placeJson;
}

function generatePlace() {
    var imageData = ctxData.createImageData(1000, 1000);

    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i + 0] = Math.floor(Math.random() * 255);
        imageData.data[i + 1] = Math.floor(Math.random() * 255);
        imageData.data[i + 2] = Math.floor(Math.random() * 255);

        imageData.data[i + 3] = 255;
    }

    ctxView.imageSmoothingEnabled = false;

    ctxData.putImageData(imageData, 0, 0);
    ctxView.drawImage(canvasData, 0, 0, canvasView.width, canvasView.height);

    source = canvasData.toDataURL("image/png");
}

function clearPlace() {
    canvasOffset = { x: 0, y: 0 };
    scale = 1;
    dragging = false;
    drag = { x: 0, y: 0 };

    ctxData.clearRect(0, 0, canvasData.width, canvasData.height);
    ctxData.resetTransform();
    ctxView.clearRect(0, 0, canvasView.width, canvasView.width);
    ctxView.resetTransform();
}

function center() {
    canvasOffset = { x: 0, y: 0 };

    applyTransform();
}

function resetZoom() {
    scale = 1;

    applyTransform();
}

function flexCanvasSize() {
    var rect = canvasView.parentNode.getBoundingClientRect();
    canvasView.width = rect.width;
    canvasView.height = rect.height;
    applyTransform();
}

function applyTransform() {
    ctxView.resetTransform();
    ctxView.clearRect(0, 0, canvasView.width, canvasView.height);
    ctxView.translate(canvasView.width / 2, canvasView.height / 2);
    ctxView.scale(scale, scale);
    ctxView.translate(-canvasView.width / 2 + canvasOffset.x, -canvasView.height / 2 + canvasOffset.y);

    ctxView.imageSmoothingEnabled = false;
    ctxView.drawImage(canvasData, 0, 0, canvasView.width, canvasView.height);
}

function adjustScale(amount, factor) {
    if(dragging == false) {
        if(amount) {
            scale -= amount;
        }
        else if(factor) {
            scale = factor * lastScale;
        }

        if(scale > maxScale) {
            scale = maxScale;
        }
    
        if(scale < minScale) {
            scale = minScale;
        }

        applyTransform();
    }
}

function onPointerMove(e) {
    if (dragging) {
        canvasOffset.x = getEventLocation(e).x / scale - drag.x;
        canvasOffset.y = getEventLocation(e).y / scale - drag.y;

        applyTransform();
    }
}

function onPointerDown(e) {
    dragging = true;
    drag.x = getEventLocation(e).x / scale - canvasOffset.x;
    drag.y = getEventLocation(e).y / scale - canvasOffset.y;
}

function onPointerUp(e) {
    dragging = false;
    initialPinchDistance = null;
    lastScale = scale;
}

function getEventLocation(e) {
    if (e.touches && e.touches.length == 1) {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY };
    }
    else if (e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY };
    }
}


function handleTouch(e, singleTouchHandler) {
    if (e.touches.length == 1) {
        singleTouchHandler(e);
    }
    else if (e.type == "touchmove" && e.touches.length == 2) {
        dragging = false;
        handlePinch(e);
    }
}

function handlePinch(e) {
    e.preventDefault();
    
    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;
    
    if (initialPinchDistance == null) {
        initialPinchDistance = currentDistance;
    }
    else {
        adjustScale(null, currentDistance / initialPinchDistance);
    }
}