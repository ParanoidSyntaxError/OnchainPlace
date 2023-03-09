let cursorData = document.getElementById("cursor-data");
let cursorView = document.getElementById("cursor-view");
let cursorDataCtx = cursorData.getContext("2d");
let cursorViewCtx = cursorView.getContext("2d");

let lastMousePosition = { x: 0, y: 0 };
let tempPixel;

placeView.addEventListener('wheel', onWheel);
placeView.addEventListener('mousedown', onCursorDown);
placeView.addEventListener('mousemove', onCursorMove);

window.onresize += flexCursor;

initializeCursor();

function initializeCursor() {  
    cursorData.width = 1000;
    cursorData.height = 1000;
    cursorView.width = 1000;
    cursorView.height = 1000;

    flexCursor();

    clearCursor();
}

function clearCursor() {
    cursorDataCtx.clearRect(0, 0, cursorData.width, cursorData.height);
    cursorDataCtx.resetTransform();
    cursorViewCtx.clearRect(0, 0, cursorView.width, cursorView.height);
    cursorViewCtx.resetTransform();
}

function flexCursor() {
    const vw = parseInt(window.innerWidth);
    const vh = parseInt(window.innerHeight);

    let canvasParent = cursorView.parentNode;

    if(vw * 0.9 > vh - 200) {
        canvasParent.style.width = vh - 200;
        canvasParent.style.height = vh - 200;
    } else {
        canvasParent.style.width = vw * 0.9;
        canvasParent.style.height = vw * 0.9;
    }

    var rect = canvasParent.getBoundingClientRect();
    
    cursorView.width = rect.width;
    cursorView.height = rect.height;

    applyCursorTransform();
}

function onWheel() {
    console.log(dragging)
    if(dragging == false) {
        applyCursorTransform();
    }
}

function onCursorDown(e) {
    pixelX.value = lastMousePosition.x;
    pixelY.value = lastMousePosition.y;
    offsetX.value = lastMousePosition.x;
    offsetY.value = lastMousePosition.y;

    try {
        let color = parseInt(document.querySelector('input[name="colors"]:checked').value);
        tempPixel = {
            color: "#" + colors[color],
            x: lastMousePosition.x,
            y: lastMousePosition.y
        };

        updateCursor();
    } catch {}
}

function onCursorMove(e) {
    const bb = cursorView.getBoundingClientRect();

    const scaleOffset = (cursorData.width / 2) - ((cursorData.width / 2) / scale);
    const dragOffset = {
        x : (cursorData.width / bb.width) * canvasOffset.x,
        y : (cursorData.height / bb.height) * canvasOffset.y
    }

    const x = Math.floor(((((e.clientX - bb.left) / bb.width) * (cursorData.width / scale)) + scaleOffset) - dragOffset.x);
    const y = Math.floor(((((e.clientY - bb.top)/ bb.height) * (cursorData.height / scale)) + scaleOffset) - dragOffset.y);

    pixelX.placeholder = x;
    pixelY.placeholder = y;
    offsetX.placeholder = x;
    offsetY.placeholder = y;
    lastMousePosition = { x: x, y: y }

    updateCursor();
}





function updateCursor() {
    cursorDataCtx.clearRect(0, 0, cursorView.width, cursorView.height);

    if(tempPixel != undefined) {
        cursorDataCtx.fillStyle = tempPixel.color;
        cursorDataCtx.fillRect(tempPixel.x, tempPixel.y, 1, 1);
    }

    if(lastMousePosition != undefined) {
        cursorDataCtx.fillStyle = "black";
        cursorDataCtx.fillRect(lastMousePosition.x, lastMousePosition.y, 1, 1);
    }

    if(lastMousePosition != undefined || tempPixel != undefined) {
        placeViewCtx.imageSmoothingEnabled = false;

        cursorViewCtx.clearRect(0, 0, cursorView.width, cursorView.height);
        cursorViewCtx.drawImage(cursorData, 0, 0, cursorView.width, cursorView.height);
    }
}

function applyCursorTransform() {
    cursorViewCtx.resetTransform();
    cursorViewCtx.clearRect(0, 0, cursorView.width, cursorView.height);
    cursorViewCtx.translate(cursorView.width / 2, cursorView.height / 2);
    cursorViewCtx.scale(scale, scale);
    cursorViewCtx.translate(-cursorView.width / 2 + canvasOffset.x, -cursorView.height / 2 + canvasOffset.y);
    cursorViewCtx.imageSmoothingEnabled = false;
    cursorViewCtx.drawImage(cursorData, 0, 0, cursorView.width, cursorView.height);
}

