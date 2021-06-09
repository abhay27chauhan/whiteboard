let indexDbObj = indexedDB.open("Openboard", 1);
let db;

indexDbObj.addEventListener("success", function(){
    db = indexDbObj.result; // access it if database exits
})

indexDbObj.addEventListener("error", function(){
    console.log("error")
})

indexDbObj.addEventListener("upgradeneeded", function(){
    db = indexDbObj.result; // create database, if not exits;
    // creating table
    db.createObjectStore("gallery", {
        keyPath: "mId"
    })

})

function addMediaToGallery(data, type){
    let txAccess = db.transaction("gallery", "readwrite");
    let galleryStore = txAccess.objectStore("gallery");
    let galleryEntry = {
        mId: Date.now(),
        type,
        media: data
    }

    galleryStore.add(galleryEntry);
}

function viewMedia(){
    let mediaContainer = document.querySelector(".media-container");
    let txAccess = db.transaction("gallery", "readonly");
    let galleryStore = txAccess.objectStore("gallery");

    let request = galleryStore.openCursor()

    request.addEventListener("success", function(){
        let cursor = request.result;
        if (cursor) {
           let imageContainer = document.createElement("div");
            imageContainer.setAttribute("data-mId", cursor.value.mId);
            imageContainer.classList.add("gallery_img-container");

            let image = document.createElement("img");
            image.src = cursor.value.media;
            imageContainer.appendChild(image);

            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("gallery_delete-btn");
            deleteBtn.innerText = "Delete"

            deleteBtn.addEventListener("click", handleDelete);

            let downloadBtn = document.createElement("button");
            downloadBtn.classList.add("gallery_download-btn");
            downloadBtn.innerText = "Download";

            downloadBtn.addEventListener("click", handleDownload);

            imageContainer.appendChild(deleteBtn);
            imageContainer.appendChild(downloadBtn);

            mediaContainer.appendChild(imageContainer);

            cursor.continue();
        } else {
            console.log("No more data");
        }
    })
}

function deleteMediaFromGallery(id){
    let txAccess = db.transaction("gallery", "readwrite");
    let galleryStore = txAccess.objectStore("gallery");

    galleryStore.delete(Number(id));
}

function handleDelete(e){
    let mId = e.currentTarget.parentNode.getAttribute("data-mId");
    deleteMediaFromGallery(mId);
    e.currentTarget.parentNode.remove();
}


function handleDownload(e){
    let url = e.currentTarget.parentNode.children[0].src;

    let a = document.createElement("a");
    a.href = url;

    a.download = "image.png";

    a.click();
    a.remove();
}