let chatBtn = document.querySelector(".chat-button");
let chatWindow = document.querySelector(".main__right");
let textValue = document.querySelector("#chat_message");
let chatWindowFlag = false;
const TYPING_TIMER_LENGTH = 400; // ms
let typing = false;
let lastTypingTime;
const COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
let isPrinted = false

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
        console.log("inside")
        sendMessage(textValue.value);
        textValue.value = "";
        socket.emit("stop typing")
        typing = false;
    }else{
        updateTyping()
    }
})

socket.on("create-message", function(data){
    addChatMessage(data, true);
})

socket.on("user-connected", data => {
    let message = `${data.userId} joined`
    log(message);
    socket.emit("show count", data)
    addParticipantsMessage(data);
})

socket.on("show count", data => {
    if(data.userId == uid && !isPrinted){
        isPrinted = true;
        addParticipantsMessage(data);
    }
})

socket.on("user-disconnected", data => {
    let message = `${data.userId} left`
    log(message);
    addParticipantsMessage(data);
})

socket.on('typing', (data) => {
    addChatTyping(data);
});

socket.on('stop typing', (data) => {
    removeChatTyping(data);
});

const sendMessage = (message) => {
    if (message) {
      addChatMessage({ userId: uid, message }, true);
      // tell server to execute 'new message' and send along one parameter
      socket.emit("message", message);
    }
}

const removeChatTyping = (data) => {
    let liElem = document.querySelector(`li[data-id='${data.userId}']`)
    console.log(liElem);
    liElem.remove();
}

const addChatTyping = data => {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
}

const addChatMessage = (data, option) => {
    // Don't fade the message in if there is an 'X was typing'

    let spanUserElem = document.createElement("span");
    spanUserElem.setAttribute("class", "username");
    spanUserElem.innerHTML += `${data.userId}`
    spanUserElem.style.color = `${getUserColor()}`

    let spanMessageElem = document.createElement("span");
    spanMessageElem.setAttribute("class", "messageBody");
    spanMessageElem.innerHTML += `${data.message}`

    const typingClass = data.typing ? 'typing' : 'text-message';
    const messageDiv =document.createElement("li");
    messageDiv.setAttribute("class", "message")
    if(!option){
        messageDiv.setAttribute("data-id", data.userId)
    }
    messageDiv.classList.add(typingClass);
    messageDiv.appendChild(spanUserElem)
    messageDiv.appendChild(spanMessageElem);

    addMessageElement(messageDiv);
}

const addMessageElement = (messageElem) => {
    document.querySelector("ul").appendChild(messageElem);
}

// Gets the color 
const getUserColor = () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    return randomColor;
}

const updateTyping = () => {
    if (!typing) {
        typing = true;
        socket.emit('typing');
    }
    lastTypingTime = (new Date()).getTime();

    setTimeout(() => {
        const typingTimer = (new Date()).getTime();
        const timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
            socket.emit('stop typing');
            typing = false;
        }
    }, TYPING_TIMER_LENGTH);
  }

const addParticipantsMessage = (data) => {
    let message = '';
    if (data.numusers === 1) {
      message += `there's 1 participant`;
    } else {
      message += `there are ${data.numusers} participants`;
    }
    log(message);
}

const log = (message) => {
    document.querySelector("ul").innerHTML += `<li class="log" style="display: list-item;">${message}</li>`;
}