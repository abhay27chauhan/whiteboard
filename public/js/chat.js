let chatBtn = document.querySelector(".chat-button");
let chatWindow = document.querySelector(".main__right");
let textValue = document.querySelector("#chat_message");
let chatWindowFlag = false;

chatBtn.addEventListener("click", function(){
    if(chatWindowFlag == false){
        chatWindow.style.display = "block";
    }else{
        chatWindow.style.display = "none";
    }

    chatWindowFlag = !chatWindowFlag;
})

chatWindow.addEventListener("mousedown", handleMouseDown);

textValue.addEventListener("keydown", function(e){
    if(e.key == "Enter" && textValue.value.trim() !== ""){
        socket.emit("message", textValue.value);
        textValue.value = "";
    }
})

socket.on("create-message", function(value){
    document.querySelector("ul").innerHTML += `<li class="message"><b>user</b><br/>${value}</li>`;
})
