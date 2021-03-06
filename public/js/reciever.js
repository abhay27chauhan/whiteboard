socket.on("onPencilSpecs", function(pencilSpecsObj) {
    pencilToolSpecs = pencilSpecsObj
    tool.lineWidth = pencilSpecsObj.lineWidth;
    tool.strokeStyle = pencilSpecsObj.color
    pslider.value = pencilSpecsObj.lineWidth;
});

socket.on("onEraserSpecs", function(eraserSpecsObj) {
    eraserToolSpecs = eraserSpecsObj
    tool.lineWidth = eraserSpecsObj.lineWidth;
    tool.strokeStyle = eraserSpecsObj.color
    eslider.value = eraserSpecsObj.lineWidth;
});

socket.on("onToolChange", function(toolOption){
    let toolName = document.querySelector(`.${toolOption}`);
    let parentclass = toolName.parentNode.classList[0];
    let allTools = document.querySelectorAll(`.${parentclass}`)
    allTools.forEach(tool => tool.classList.remove("active"));
    toolName.parentNode.classList.add("active");
    handleToolChange(toolOption)
})

socket.on("onhamburger", function(){
    handleHamburger();
})

socket.on("onmousedown", function(pointObj){
    let {x, y, effect, width, color} = pointObj;
    tool.lineWidth = width
    tool.strokeStyle = color
    tool.globalCompositeOperation = effect
    tool.beginPath()
    tool.moveTo(x,y)

    drawObject.undoStack.push(pointObj);
    localStorage.setItem("sheetDB", JSON.stringify(sheetDB));
})

socket.on("onmouseup", function(pointObj){
    let {x, y, effect, width, color} = pointObj;
    tool.lineWidth = width
    tool.strokeStyle = color
    tool.globalCompositeOperation = effect
    tool.lineTo(x,y)
    tool.stroke()

    drawObject.undoStack.push(pointObj);
    localStorage.setItem("sheetDB", JSON.stringify(sheetDB));
})

socket.on("onundo", function(){
    undoMaker();
})

socket.on("onredo", function(){
    redoMaker();
})