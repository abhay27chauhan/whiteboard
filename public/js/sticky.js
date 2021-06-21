function createSticky(){
    let stickyPad = document.createElement("div");
    stickyPad.setAttribute("class", "sticky-pad");
    stickyPad.innerHTML = `<div class="nav">
            <div class="min"></div>
            <div class="close"></div>
        </div>
        <div class="writing-pad">
            <textarea name="" id="" cols="30" rows="10" class="desc-box"></textarea>
        </div>`
    
    document.body.insertBefore(stickyPad, board);

    let flag = false;

    let minimize = stickyPad.querySelector(".min");
    let writingPad = stickyPad.querySelector(".writing-pad");
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
        stickyPad.remove();
    })

    stickyPad.addEventListener("mousedown", handleMouseDown);
    // stickyPad.addEventListener("mousemove", handleMouseMove);
    // stickyPad.addEventListener("mouseup", handleMouseUp);
}

function handleMouseDown(event){
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





// let x = null;
// let y = null;
// function handleMouseDown(e){
//     x = e.clientX;
//     y = e.clientY;

//     isDown = true;
// }

// function handleMouseMove(e){
//     if(isDown == true){

//         let stickyPad = e.currentTarget;
//         let xf = e.clientX;
//         let yf = e.clientY;
//         let distX = xf - x;
//         let distY = yf - y;

//         let {top, left} = stickyPad.getBoundingClientRect();
//         stickyPad.style.top = top + distY + "px";
//         stickyPad.style.left = left + distX + "px";

//         x = xf;
//         y = yf;
//     }
// }

// function handleMouseUp(){
//     isDown = false;
// }