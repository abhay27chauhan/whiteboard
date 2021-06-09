let fileSelector = document.querySelector("#fileSelector");
let fileInput = document.querySelector("#fileInput");

fileSelector.addEventListener("click", function(e){
    e.preventDefault();
    fileInput.click();
})

fileInput.addEventListener("change", function(){
    let fileList = fileInput.files;
    let fileObj = fileList[0];
    
    let img = document.createElement("img");
    img.src = window.URL.createObjectURL(fileObj);
    img.setAttribute("class", "upload-img")

    img.addEventListener("load", function(){
        window.URL.revokeObjectURL(this.src);
    })

    let stickyPad = document.createElement("div");
    stickyPad.setAttribute("class", "sticky-pad");
    stickyPad.innerHTML = `<div class="nav">
            <div class="min"></div>
            <div class="close"></div>
        </div>
        <div class="writing-pad">
        </div>`

    let writingPad = stickyPad.querySelector(".writing-pad");
    writingPad.appendChild(img);

    document.body.insertBefore(stickyPad, board);

    let flag = false;

    let minimize = stickyPad.querySelector(".min");
    writingPad = stickyPad.querySelector(".writing-pad");
    let closeBtn = stickyPad.querySelector(".close");

    minimize.addEventListener("click", function(){
        if(flag == false){
            writingPad.style.display = "none";
        }else{
            writingPad.style.display = "block";
        }
        flag = !flag
    })

    closeBtn.addEventListener("click", function(){
        fileInput.files = null;
        stickyPad.remove();
    })

    stickyPad.addEventListener("mousedown", mouseDown);
})

function mouseDown(event){

    let stickyPad = event.currentTarget;
    
    let shiftX = event.clientX - stickyPad.getBoundingClientRect().left;
    let shiftY = event.clientY - stickyPad.getBoundingClientRect().top;

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        stickyPad.style.left = pageX - shiftX + 'px';
        stickyPad.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the pad on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the pad, remove unneeded handlers
    stickyPad.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        stickyPad.onmouseup = null;
    };
}