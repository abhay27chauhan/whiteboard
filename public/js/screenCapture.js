let recordBtn = document.querySelector(".record");
let captureBtn = document.querySelector(".capture");

let mediarecordingObjectForCurrStream;
let isRecording = false;
let recording = [];
let stream;
let audioTracks, videoTracks;

let constraint = {
    video: true
}

captureBtn.addEventListener("click", function(){
    // promise 
    let displaymediaPromise = navigator.mediaDevices.getDisplayMedia(constraint);

    displaymediaPromise.
        then(async function (displayStream) {
            [videoTracks] = displayStream.getVideoTracks();

            const audioStream = await navigator.mediaDevices.getUserMedia({audio: true}).catch(e => {throw e});
            [audioTracks] = audioStream.getAudioTracks();

            stream = new MediaStream([videoTracks, audioTracks]);

            mediarecordingObjectForCurrStream = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8,opus' });

            mediarecordingObjectForCurrStream.ondataavailable = function (e) {
                recording.push(e.data);
            }

            // downloading the recording
            mediarecordingObjectForCurrStream.addEventListener("stop", function () {
                // convert recording to url
                // type -> MINE type
                const blob = new Blob(recording, { type: 'video/webm' });
                const url = window.URL.createObjectURL(blob);

                let a = document.createElement("a");
                a.download = "file.webm";
                a.href = url;
                a.click();
                recording = []
            })

        }).catch(function (err) {
            console.log(err)
            alert("please allow both microphone and camera");
        });
})

recordBtn.addEventListener("click", function () {
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("First select the devices");
        return;
    }

    if (isRecording == false) {
        mediarecordingObjectForCurrStream.start();
        recordBtn.classList.add("record-animation");
    } else {
        mediarecordingObjectForCurrStream.stop();
        recordBtn.classList.remove("record-animation");

        stream.getTracks().forEach(s => s.stop())
        stream = null;
    }

    isRecording = !isRecording;
})