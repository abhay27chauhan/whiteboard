let downloadBtn = document.querySelector(".download");

downloadBtn.addEventListener("click", function(){
    let url = board.toDataURL();

    if(db){
        addMediaToGallery(url, "img")
    }
})