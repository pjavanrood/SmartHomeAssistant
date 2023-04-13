const WIDTH = 1000;
const HEIGHT = 200;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;
let analyzer;

const stopButton = document.getElementById('stop');
const startButton = document.getElementById('start');


const handleSuccess = function(stream) {
    const options = {mimeType: 'audio/webm'};
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, options);
    let exitRecording = false;

    mediaRecorder.addEventListener('dataavailable', function(e) {
        if (e.data.size > 0) recordedChunks.push(e.data);
    });

    mediaRecorder.addEventListener('stop', async function() {
        let blob = new Blob(recordedChunks);
        await sendAudio(blob).then((res) => {});
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
        exitRecording = true;
    });

    stopButton.addEventListener('click', function() {
        mediaRecorder.stop();
    });

    mediaRecorder.start();

    const audioCtx = new AudioContext();
    analyzer = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyzer);
    // How much data should we collect
    analyzer.fftSize = 2 ** 12;
    // pull the data off the audio
    bufferLength = analyzer.frequencyBinCount;
    // how many pieces of data are there?!?
    bufferLength = analyzer.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const frequencyData = new Uint8Array(bufferLength);
    drawTimeData(timeData);
    drawFrequency(frequencyData);

    if(exitRecording)
        return;
};

startButton.addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
})


async function sendAudio(blob) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/audio", true);
    let formData = new FormData();
    formData.append("audio", blob);

    xhr.onload = function () {
        document.getElementById('result').append(
            document.createTextNode(
                'RESULT: ' + xhr.responseText + '\n'
            )
        )
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
    ctx.lineWidth = 5;
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

