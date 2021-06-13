let allTools = document.querySelectorAll(".tool");
let pencilOptions = document.querySelector(".pencil-options");
let pslider = document.querySelector(".pencil-slider input");
let pColorOptions = document.querySelectorAll(".pencil-color div");
let eraserOptions = document.querySelector(".eraser-options");
let eslider = document.querySelector(".eraser-slider input");

let activeTool = "pencil";

tool.lineWidth = 2;
tool.lineCap = "round"
tool.lineJoin = "round";

let pencilToolSpecs = {
    lineWidth: 2,
    color: "black"
};

let eraserToolSpecs = {
    lineWidth: 5,
    color: "black"
};

toolPanel.addEventListener("mousedown", function(e){
    let parentElem = e.target.parentNode;
    if(parentElem.classList[0] == "tool" && (e.target.classList[1] == "pencil" || e.target.classList[1] == "eraser" || e.target.classList[1] == "sticky")){
        allTools.forEach(tool => tool.classList.remove("active"));
        parentElem.classList.add("active");
    }

    let toolOption = e.target.classList[1]
    if(toolOption == "pencil" || toolOption == "eraser" || toolOption == "sticky"){
        handleToolChange(toolOption)
        socket.emit("handleToolChange", toolOption);
    }
})

function handleToolChange(toolOption){
    if(toolOption == "pencil"){
        if(activeTool == "pencil"){
            pencilOptions.style.display = "flex";
        }else{
            tool.globalCompositeOperation = "source-over" // important for drawing
            eraserOptions.style.display = "none";
            activeTool = "pencil";
            tool.lineWidth = pencilToolSpecs.lineWidth;
            tool.strokeStyle = pencilToolSpecs.color;
            pslider.value = pencilToolSpecs.lineWidth;
        }
    }else if(toolOption == "eraser"){
        if(activeTool == "eraser"){
            eraserOptions.style.display = "flex";
        }else{
            tool.globalCompositeOperation = 'destination-out' // important for eraser
            pencilOptions.style.display = "none";
            activeTool = "eraser"
            tool.lineWidth = eraserToolSpecs.lineWidth;
            tool.strokeStyle = eraserToolSpecs.color;
            eslider.value = eraserToolSpecs.lineWidth;
        }
    }else if(toolOption == "sticky"){
        pencilOptions.style.display = "none";
        eraserOptions.style.display = "none";
        activeTool = "sticky"
        createSticky();
    }
}