feather.replace();

const controls = document.querySelector('.controls');
const webCamInfo = document.querySelector('.webcam-info > span');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
    facingMode: {
      exact: 'environment' // use front cam
    }
  }
};

// play stream
play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia({ video: true })) {
    const actualConstraints = {
        ...constraints, 
        deviceId: webCamInfo.id
    }
    startStream(actualConstraints);
  }
};

// pause stream
const pauseStream = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

// do the screenshot
const doScreenshot = async () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL('image/webp');
  screenshotImage.classList.remove('d-none');
  await sendImageToServer(screenshotImage.src);
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;

const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};

// Todo: Api for sending image to server ...
const sendImageToServer = async (imageStr) => {
  await fetch('/upload', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "name": "test" })
  })
};

// handle stream
const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  screenshot.classList.remove('d-none');

};

// get camera
const getCamera = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevice = devices.filter(device => device.kind === 'videoinput')[0];
  webCamInfo.setAttribute('id', videoDevice.deviceId);
  webCamInfo.append(videoDevice.label);
  //autostart(videoDevice);
};

// autostart camera
const autostart = (device) => {
    device ? play.click() : null;
}

// get camera with autostart
getCamera();