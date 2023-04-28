let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;

let recorder;
let chunks = [];

let constraints = {
  video: true,
  audio: true,
};
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    let blob = new Blob(chunks, { type: "video/mp4" });
    let videURL = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = videURL;
    a.download = "video.mp4";
    a.click();
  });
});

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;

  recordFlag = !recordFlag;

  if (recordFlag) {
    recorder.start();
    recordBtn.classList.add("scale-record");
    startTimer();
  } else {
    recorder.stop();
    recordBtn.classList.remove("scale-record");
    stoptTimer();
  }
});

captureBtnCont.addEventListener("click", (e) => {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);
  let imageURL=canvas.toDataURL();
  let a =document.createElement("a");
  a.href=imageURL;
  a.download="image.jpg";
  a.click();
});

let timerID;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let totalSeconds = counter;
    let hours = Number.parseInt(counter/3600);
    totalSeconds = totalSeconds % 3600;
    let minutes = Number.parseInt(totalSeconds/60);
    totalSeconds = totalSeconds % 60;
    let seconds = totalSeconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerText = `${hours}:${minutes}:${seconds}`;

    counter++;
  }
  timerID = setInterval(displayTimer, 1000);
}

function stoptTimer() {
  clearInterval(timerID);
  timer.innerText = "00:00:00";
  timer.style.display = "none";
}
