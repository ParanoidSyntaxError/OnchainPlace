let placeData = document.getElementById("place-data");
let placeView = document.getElementById("place-view");
let placeDataCtx = placeData.getContext("2d");
let placeViewCtx = placeView.getContext("2d");

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

let canvasImage;
let placeTotalChanges;

placeView.addEventListener('wheel', (e) => adjustScale(e.deltaY * (scrollSensitivity * scale)));
placeView.addEventListener('mousedown', onPointerDown);
placeView.addEventListener('mouseup', onPointerUp);
placeView.addEventListener('mousemove', onPointerMove);

placeView.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
placeView.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
placeView.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))

window.addEventListener('resize', function(event) {
    flexCanvas();
}, true);

initializePlace();

function initializePlace() {  
    placeData.width = 1000;
    placeData.height = 1000;
    placeView.width = 1000;
    placeView.height = 1000;

    flexCanvas();

    clearCanvas();
}

function setPlace(place, totalChanges) {
    let image = placeDataCtx.createImageData(1000, 1000);
    for (let i = 0; i < 1000000; i++) {
        var color = colors[parseInt(place[i], 16)];

        image.data[(i * 4)] = parseInt(color.slice(0, 2), 16);
        image.data[(i * 4) + 1] = parseInt(color.slice(2, 4), 16);
        image.data[(i * 4) + 2] = parseInt(color.slice(4, 6), 16);
        image.data[(i * 4) + 3] = 255;
    }

    setCanvasImage(image);
    placeTotalChanges = totalChanges;
}

function addPixels(pixels) {
    let image = canvasImage;
    if(pixels.length > 0) {
        for (let i = 0; i < pixels.length; i++) {
            var color = colors[parseInt(pixels[i]["color"])];
            var position = pixels[i]["position"];
    
            image.data[(position * 4)] = parseInt(color.slice(0, 2), 16);
            image.data[(position * 4) + 1] = parseInt(color.slice(2, 4), 16);
            image.data[(position * 4) + 2] = parseInt(color.slice(4, 6), 16);
            image.data[(position * 4) + 3] = 255;
        }

        setCanvasImage(image);
        placeTotalChanges = pixels[pixels.length - 1]["totalChanges"];
    }
}

function setCanvasImage(image) {
    placeViewCtx.imageSmoothingEnabled = false;

    placeDataCtx.putImageData(image, 0, 0);
    placeViewCtx.drawImage(placeData, 0, 0, placeView.width, placeView.height);

    canvasImage = image;
}

function clearCanvas() {
    canvasOffset = { x: 0, y: 0 };
    scale = 1;
    dragging = false;
    drag = { x: 0, y: 0 };

    placeDataCtx.clearRect(0, 0, 1000, 1000);
    placeDataCtx.resetTransform();
    placeViewCtx.clearRect(0, 0, 1000, 1000);
    placeViewCtx.resetTransform();
}

function center() {
    canvasOffset = { x: 0, y: 0 };
    applyCanvasTransform();
}

function resetZoom() {
    scale = 1;
    applyCanvasTransform();
}

function flexCanvas() {
    const vw = parseInt(window.innerWidth);
    const vh = parseInt(window.innerHeight);

    let canvasParent = placeView.parentNode;

    if(vw * 0.9 > vh - 200) {
        canvasParent.style.width = vh - 200;
        canvasParent.style.height = vh - 200;
    } else {
        canvasParent.style.width = vw * 0.9;
        canvasParent.style.height = vw * 0.9;
    }

    var rect = canvasParent.getBoundingClientRect();
    
    placeView.width = rect.width;
    placeView.height = rect.height;

    applyCanvasTransform();
}

function applyCanvasTransform() {
    placeViewCtx.resetTransform();
    placeViewCtx.clearRect(0, 0, placeView.width, placeView.height);
    placeViewCtx.translate(placeView.width / 2, placeView.height / 2);
    placeViewCtx.scale(scale, scale);
    placeViewCtx.translate(-placeView.width / 2 + canvasOffset.x, -placeView.height / 2 + canvasOffset.y);
    placeViewCtx.imageSmoothingEnabled = false;
    placeViewCtx.drawImage(placeData, 0, 0, placeView.width, placeView.height);
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

        applyCanvasTransform();
    }
}

function onPointerMove(e) {
    if (dragging) {
        canvasOffset.x = getEventLocation(e).x / scale - drag.x;
        canvasOffset.y = getEventLocation(e).y / scale - drag.y;

        applyCanvasTransform();
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