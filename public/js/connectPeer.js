const videoGrid = document.getElementById('video-grid');
const micToggleBtn = document.querySelector(".mic");
const videoToggleBtn = document.querySelector(".user-video");

// setting up the connection to the peer server
// first param is undefined because i want the server to take care of generating a new id
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
})
// peer server is going to take all of the webrtc information of a user and generate a unique client id for that user, which can be used to connect with other peers on the network

let myScreen = null;
let myVideoStream;
const mypeers = {}
const myVideo = document.createElement('video');
myVideo.muted = true; // because we don't want to listen to our own video

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => { // stream -> our video and our audio
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // runs when reciever recieves call from sender
    peer.on('call', call => {
        call.answer(stream);   
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream);
    })
})

socket.on('user-disconnected', userId => {
  if (mypeers[userId]) mypeers[userId].close()
})

// as soon as we are connected to the peer server and get back an id, send that id,along with room_id to our server for setting up connection
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

function connectToNewUser(userId, stream){
    const call = peer.call(userId, stream); // calling the user with userId (in param) and sending them our audio and video stream

    const video = document.createElement('video')
    // and when user whom we have called and send our video stream to, sends their video stream we listen to that event and take in their video stream
    call.on('stream', userVideoStream => {
        // taking the stream from other users and adding it onto our own custom video element on our page
        addVideoStream(video, userVideoStream);
    })

    // removing video when someone closes the call
    call.on('close', () => {
        video.remove();
    })

    mypeers[userId] = call
}

function addVideoStream(video, stream){
    video.srcObject = stream // this will allow us to play our video
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    // adding video to our video-grid
    videoGrid.insertBefore(video, videoGrid.querySelector(".video-tool__container"));
}

function screenSharing() {
    navigator.mediaDevices.getDisplayMedia().then(stream => {
    myScreen = stream
    const keys = Object.keys(mypeers)
    keys.forEach((value) => {
        peer.call(value, myScreen)
    });
    })
}

micToggleBtn.addEventListener("click", function(){
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;

        let icon = micToggleBtn.querySelector(".fas");
        icon.classList.remove("fa-microphone-alt");
        icon.classList.add("fa-microphone-alt-slash")
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;

        let icon = micToggleBtn.querySelector(".fas");
        icon.classList.remove("fa-microphone-alt-slash")
        icon.classList.add("fa-microphone-alt");
    }
})

videoToggleBtn.addEventListener("click", function(){
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;

        let icon = videoToggleBtn.querySelector(".fas");
        icon.classList.remove("fa-video");
        icon.classList.add("fa-video-slash")
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;

        let icon = videoToggleBtn.querySelector(".fas");
        icon.classList.remove("fa-video-slash")
        icon.classList.add("fa-video");
    }
})