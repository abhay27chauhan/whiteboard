let zoomIn = document.querySelector(".zoomin");
let zoomOut = document.querySelector(".zoomout");
let isTranslate = true;

zoomIn.addEventListener("click", function(){
    tool.scale(1.1, 1.1);
    tool.translate(-50,-10);
    redrawAll();
})

zoomOut.addEventListener("click", function(){
    tool.scale(0.95, 0.95);
    tool.translate(30,-10);
    redrawAll();
})