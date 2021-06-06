let hamburgerBtn = document.querySelector(".btn-container");
let bars = document.querySelectorAll(".btn-container .bar");
let toolPanel = document.querySelector(".tool-panel");

let btnFlag = false;

hamburgerBtn.addEventListener("click", function(){
    if(btnFlag == false){
        bars[0].classList.add("top");
        bars[1].classList.add("middle");
        bars[2].classList.add("bottom");

        hamburgerBtn.style.paddingLeft = "10px";

        toolPanel.style.display = "flex";
    }else{
        hamburgerBtn.style.paddingLeft = "";
        bars.forEach(bar => bar.setAttribute("class", "bar"));

        toolPanel.style.display = "none";
    }

    btnFlag = !btnFlag;
})