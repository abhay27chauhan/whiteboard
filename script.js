let allTools = document.querySelectorAll(".tool");
let pencilOptions = document.querySelector(".pencil-options");
let pslider = document.querySelector(".pencil-slider input");
let pColorOptions = document.querySelectorAll(".pencil-color div");
let eraserOptions = document.querySelector(".eraser-options");
let eslider = document.querySelector(".eraser-slider input");

let activeTool = "pencil";

tool.lineWidth = 2;

let pencilToolSpecs = {
    lineWidth: 2,
    color: "black"
};

let eraserToolSpecs = {
    lineWidth: 5,
    color: "black"
};

toolPanel.addEventListener("mousedown", function(e){
    if(e.target.parentNode.classList[0] == "tool"){
        allTools.forEach(tool => tool.classList.remove("active"));
        e.target.parentNode.classList.add("active");
    }

    let toolOption = e.target.getAttribute("alt")
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
    }else if(toolOption == "upload"){
        pencilOptions.style.display = "none";
        eraserOptions.style.display = "none";
        activeTool = "upload"
    }else if(toolOption == "download"){
        pencilOptions.style.display = "none";
        eraserOptions.style.display = "none"; 
        activeTool = "download"       
    }else if(toolOption == "redo"){
        pencilOptions.style.display = "none";
        eraserOptions.style.display = "none";
        activeTool = "redo" 
    }else if(toolOption == "undo"){
        pencilOptions.style.display = "none";
        eraserOptions.style.display = "none";
        activeTool = "undo" 
    }else if(toolOption == "zoomin"){
        pencilOptions.style.display = "none";
        eraserOptions.style.display = "none";
        activeTool = "zoomin" 
    }else if(toolOption == "zoomout"){
        pencilOptions.style.display = "none";
        eraserOptions.style.display = "none";
        activeTool = "zoomout" 
    }
})