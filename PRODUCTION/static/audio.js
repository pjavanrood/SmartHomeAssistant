//Import functions from the other js file
import { LEDon, LEDoff, LEDred, LEDgreen, LEDblue, lockDoor } from './index.js';

//constants for canvas
const WIDTH = 1000;
const HEIGHT = 200;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;
let analyzer;
let bufferLength;

//HTML elements
const stopButton = document.getElementById('stop');
const startButton = document.getElementById('start');


//Function to run when user agrees to record voice
const handleSuccess = function(stream) {
    const options = {mimeType: 'audio/webm'};
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, options);
    let exitRecording = false;

    //add the recorded data to buffer
    mediaRecorder.addEventListener('dataavailable', function(e) {
        if (e.data.size > 0) recordedChunks.push(e.data);
    });

    //wrap up the collected data
    mediaRecorder.addEventListener('stop', async function() {
        let blob = new Blob(recordedChunks);
        await sendAudio(blob).then((res) => {});
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
        exitRecording = true;
    });

    //Stop recording
    stopButton.addEventListener('click', function() {
        mediaRecorder.stop();
    });

    //Start recording
    mediaRecorder.start();

    //Visualizing the sound wave using FFT(Fast-Fourier-Transform)
    const audioCtx = new AudioContext();
    analyzer = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyzer);
    // How much data should we collect
    analyzer.fftSize = 2 ** 12;
    // pull the data off the audio
    bufferLength = analyzer.frequencyBinCount;
    // how many pieces of data are there?!?
    //bufferLength = analyzer.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const frequencyData = new Uint8Array(bufferLength);
    drawTimeData(timeData);
    drawFrequency(frequencyData);

    if(exitRecording)
        return;
};

//Start Recording
startButton.addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
})

//Function to display the result of the voice command on the webpage
function handleResponse(response) {
    /**
     * Result is returned in a JSON with the following format
     * {
     *      prediction: value
     * }
     * 
     * value is a string that is either:
     * - "INVALID"
     * - "Light {on/off/red/green/blue}"
     * - "Door {open/close}"
     */
    let resJson = JSON.parse(response);
    let prediction = resJson.prediction;
    let lightStatus;
    if(prediction == "INVALID") {
        return;
    }

    let predArray = prediction.split(" ");

    if(predArray.length != 2) return;

    if(predArray[0] == "Light") {
        document.getElementById("light-status").textContent = predArray[1];
        switch(predArray[1]) {
            case "on":
                LEDon();
                break;
            case "off":
                LEDoff();
                break;
            case "red":
                LEDred();
                break;
            case "green":
                LEDgreen();
                break;
            case "blue":
                LEDblue();
                break;
            default:
                LEDoff();
                break;
        }
    } else if(predArray[0] == "Door") {
        document.getElementById("door-status").textContent = predArray[1];
        if(predArray[1] == "open" && doorStatus == "closed") {
            lockDoor();
            doorStatus = "open";
        }

        else if(predArray[1] == "close" && doorStatus == "open") {
            lockDoor();
            doorStatus = "closed";
        }
    }
}

//Send Audio to back-end server using XMLHttpRequest
async function sendAudio(blob) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/audio", true);
    let formData = new FormData();
    formData.append("audio", blob);

    xhr.onload = function () {
        // document.getElementById('result').append(
        //     document.createTextNode(
        //         'RESULT: ' + xhr.responseText + '\n'
        //     )
        // );
        handleResponse(xhr.responseText);
    };
    
    await xhr.send(formData);
}



function drawTimeData(timeData) {
    // inject the time data into our timeData array
    analyzer.getByteTimeDomainData(timeData);
    // now that we have the data, lets turn it into something visual
    // 1. Clear the canvas TODO
    // 2. setup some canvas drawing
    // 1. Clear the canvas TODO
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#ffc600";
    ctx.beginPath();
    const sliceWidth = WIDTH / bufferLength;
    let x = 0;
    timeData.forEach((data, i) => {
      const v = data / 128;
      const y = (v * HEIGHT) / 2;
      // draw our lines
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    });
  
    ctx.stroke();
  
    // call itself as soon as possible
    requestAnimationFrame(() => drawTimeData(timeData));
}


function drawFrequency(frequencyData) {
    // get the frequency data into our frequencyData array
    analyzer.getByteFrequencyData(frequencyData);
    //console.log(frequencyData);
    requestAnimationFrame(() => drawFrequency(frequencyData));
}



//To check the intruder status, we are using sockets to get instant reaction to changes happening on the pi
socketio.on('message', (message) => {
    if(message == "INTRUDER") {
        if(document.getElementById("intruder-status").textContent != "WARNING")
            document.getElementById("intruder-status").textContent = "WARNING";
    } else if(message == "SAFE") {
        if(document.getElementById("intruder-status").textContent != "SAFE")
            document.getElementById("intruder-status").textContent = "SAFE";
    }
})