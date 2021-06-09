let addBtn = document.querySelector(".add-sheet_btn-container");
let sheetList = document.querySelector(".sheet-list");
let firstSheet = document.querySelector(".sheet");

let redoBtn = document.querySelector(".redo");
let undoBtn = document.querySelector(".undo");

let isDown = false;
let sheetDB = [];
let drawObject;
let interval = null;

if(localStorage.getItem("sheetDB")){
    sheetDB = JSON.parse(localStorage.getItem("sheetDB"));
}

firstSheet.addEventListener("click", makeSheetActive)

firstSheet.click();

for(let i=1; i<sheetDB.length; i++){
    let newSheet = document.createElement("div");
    newSheet.setAttribute("class", "sheet");
    newSheet.setAttribute("idx", `${i}`);
    newSheet.innerText = `Sheet ${i + 1}`;
    sheetList.appendChild(newSheet);

    newSheet.addEventListener("click", makeSheetActive);
}

addBtn.addEventListener("click", function(){
    let allSheets = document.querySelectorAll(".sheet");
    let lastSheet = allSheets[allSheets.length-1];
    let lastIndex = lastSheet.getAttribute("idx");
    lastIndex = Number(lastIndex);
    
    let newSheet = document.createElement("div");
    newSheet.setAttribute("class", "sheet");
    newSheet.setAttribute("idx", `${lastIndex + 1}`);
    newSheet.innerText = `Sheet ${lastIndex + 2}`;
    sheetList.appendChild(newSheet);

    for(let i=0; i<allSheets.length; i++){
        allSheets[i].classList.remove("active");
    }
    newSheet.classList.add("active");

    let newIdx = lastIndex + 1;
    createSheet(newIdx);
    localStorage.setItem("sheetDB", JSON.stringify(sheetDB));
    drawObject = sheetDB[newIdx];
    redrawAll();

    newSheet.addEventListener("click", makeSheetActive);
})

function makeSheetActive(e){
    let cSheet = e.currentTarget;
    let allSheets = document.querySelectorAll(".sheet");
    for(let i=0; i<allSheets.length; i++){
        allSheets[i].classList.remove("active");
    }
    cSheet.classList.add("active");

    let idx = cSheet.getAttribute("idx");
    if(!sheetDB[idx]){
        createSheet(idx);
        localStorage.setItem("sheetDB", JSON.stringify(sheetDB));
    }
    drawObject = sheetDB[idx];
    redrawAll();
}

function createSheet(idx){
    let sheetObj = {
        undoStack: [],
        redoStack: []
    }
    sheetDB[idx] = sheetObj;
}

pslider.addEventListener("change", function(){
    let value = pslider.value;
    pencilToolSpecs.lineWidth = value;
    tool.lineWidth = value;
    socket.emit("pencilSpecs", pencilToolSpecs)
})

eslider.addEventListener("change", function(){
    let value = eslider.value;
    eraserToolSpecs.lineWidth = value;
    tool.lineWidth = value;
    socket.emit("eraserSpecs", eraserToolSpecs)
})

for(let i=0; i<pColorOptions.length; i++){
    pColorOptions[i].addEventListener("click", function(){
        let color = pColorOptions[i].getAttribute("class");
        pencilToolSpecs.color = color;
        tool.strokeStyle = color;
        socket.emit("pencilSpecs", pencilToolSpecs)
    })
}

board.addEventListener("mousedown", function(e){
    if(activeTool == "pencil" || activeTool == "eraser"){
        let x = e.clientX;
        let y = e.clientY;

        tool.beginPath();
        tool.moveTo(x, y);
        isDown = true;

        let point = {
            x, y,
            effect: tool.globalCompositeOperation,
            width: tool.lineWidth,
            color: tool.strokeStyle,
            type: "begin"
        }

        socket.emit("mousedown", point);
        drawObject.undoStack.push(point);
        localStorage.setItem("sheetDB", JSON.stringify(sheetDB));
    }
})

board.addEventListener("mousemove", function(e){
    if(activeTool == "pencil" || activeTool == "eraser"){
        if(isDown == true){
            let xf = e.clientX;
            let yf = e.clientY;

            tool.lineTo(xf, yf);
            tool.stroke();

            let point = {
                x: xf, 
                y: yf,
                effect: tool.globalCompositeOperation,
                width: tool.lineWidth,
                color: tool.strokeStyle,
                type: "end"
            }

            socket.emit("mouseup", point);
            drawObject.undoStack.push(point);
            localStorage.setItem("sheetDB", JSON.stringify(sheetDB));
        }   
    }
})

board.addEventListener("mouseup", function(){
    isDown = false;
})

undoBtn.addEventListener("mousedown", function(){
    interval = window.setInterval(function(){
        if(undoMaker()) socket.emit("undo");
    }, 50)
})

undoBtn.addEventListener("mouseup", function(){
    clearInterval(interval);
    interval = null;
})

redoBtn.addEventListener("mousedown", function(){
    interval = window.setInterval(function(){
        if(redoMaker()) socket.emit("redo");
    }, 50)
})

redoBtn.addEventListener("mouseup", function(){
    clearInterval(interval);
    interval = null;
})

function redrawAll(){
    localStorage.setItem("sheetDB", JSON.stringify(sheetDB));
    tool.clearRect(0,0,board.width,board.height)
    for(let i=0; i<drawObject.undoStack.length; i++){
        let {x, y, effect, width, color, type} = drawObject.undoStack[i];
        if(type === "begin"){
            tool.lineWidth = width
            tool.strokeStyle = color
            tool.globalCompositeOperation = effect
            tool.beginPath()
            tool.moveTo(x,y)

        }else if(type === "end"){
            tool.lineWidth = width;
            tool.strokeStyle = color;
            tool.globalCompositeOperation = effect;
            tool.lineTo(x,y)
            tool.stroke()
        }
    }
}

function undoMaker(){
    if(drawObject.undoStack.length !== 0){
        drawObject.redoStack.push(drawObject.undoStack.pop());
        redrawAll();

        return true;
    }

    return false;
}

function redoMaker(){
    if(drawObject.redoStack.length !== 0){
        drawObject.undoStack.push(drawObject.redoStack.pop());
        redrawAll();

        return true;
    }

    return false;
}