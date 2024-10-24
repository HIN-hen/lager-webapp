const video = document.querySelector('video');
const noActiveStream = document.querySelector('.no-active-stream');
const videoContainer = document.getElementById('main');
const drawingToolBox = document.querySelector('ul.toolbox');
const guiContainer = document.getElementById('controls');

//const screenshotImg = document.querySelector('img');
const videoOverlay = document.querySelector('.video-overlay');

const buttons = [...guiContainer.querySelectorAll('button')];
const [toggleFs, photoLibrary, snapshot, pauseAndDrawOnImage] = buttons;

// get dimensions of videoContainer and adapt canvas and video to this dimensions!
const { width, height } = videoContainer.getBoundingClientRect();

// set video constraints
const constraints = {
  audio: false,
  video: {
    width: {
      min: 640, ideal: width, max: 2560
    },
    height: {
      min: 400, ideal: height, max: 1440
    },
    aspectRatio: {
      ideal: 1.777777778 // 16/9
    },
    frameRate: {
      min: 30,
      max: 60
    },
    facingMode: "environment" // user = front cam, environment = back cam
  }
};

//-- get video device infos / checking device support
const getVideoDevices = async () => {
  let availableVideoDevices = null;
  try {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    availableVideoDevices = mediaDevices.filter(el => el.kind === 'videoinput');
  } catch (error) {
    console.log("available camera devices -> " + error.message);
  }
  return availableVideoDevices;
};

//-- get (active) camera media stream
const getMediaStream = async () => {
  let mediaStream = null;
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.log("get user media -> " + error.message);
  }
  return mediaStream;
};

//-- Pause / play video
// Todo: remove unnecessary code
const doPausePlayVideo = () => {
  //const canvas = document.querySelector('canvas');
  const playPauseButton = document.querySelector('.pause-and-draw-on-image');
  !video.paused ? video.pause() : video.play();
  /*
  if (!video.paused) {
    video.pause();
    createCanvas();
    drawingToolBox.classList.add("show-tools");
    videoContainer.classList.add('drawing-active');
    video.classList.add('d-none');
    playPauseButton.setAttribute('aria-pressed', 'true');
    showSnackBar('Drawing mode enabled.');
  } else {
    //canvas.remove();
    video.play();
    drawingToolBox.classList.remove("show-tools");
    videoContainer.classList.remove('drawing-active');
    video.classList.remove('d-none');
    playPauseButton.setAttribute('aria-pressed', 'false');
    showSnackBar('Drawing mode disabled.');
  }
    */
};

/*
const createCanvas = () => {
  const mainContainer = document.getElementById('main');
  canvas = document.createElement('canvas');
  
  const { width, height } = video.getBoundingClientRect();
  
  canvas.width = width;
  canvas.height = height;

  ctx = canvas.getContext('2d', { willReadFrequently: true }); // faster with will read frequently ;)

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  mainContainer.prepend(canvas);

  drawOnCanvas(canvas, ctx);
};
*/

// draw on canvas, give user drawing tools
// adjust mouse pointer to actual viewport
// with touch support for mobile devices
const drawOnCanvas = (canvas, ctx) => {


  console.log(ctx);

  let painting = false;

  const startPos = (e) => { 
    painting = true;
    draw(e);
  }

  const endPos = (e) => {
    painting = false;
    ctx.beginPath();

    if (!['mouseup','touchend'].includes(e.type)) return; // if not mouseup / touchend don't save in history!

    history.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    i++;
  }

  // lets draw ...
  const draw = (e) => {
    if (!painting) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    ctx.lineWidth = strokeSize;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }

  // mouse / touch event listeners on canvas
  canvas.addEventListener("mousedown", startPos, false);
  canvas.addEventListener("touchstart", startPos, false);
  canvas.addEventListener("mouseup", endPos, false);
  canvas.addEventListener("touchend", endPos, false);
  canvas.addEventListener("mousemove", draw, false);
  canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent);
  }, false);
};

//-- Camera snapshot button (take a photo with and without draw lines)
//-- use modern webP images with much lower size and same quality (https://developers.google.com/speed/webp?hl=de)
// Todo: Optimize handling!!!
const doTakeAPhoto = async () => {
  const canvas = document.querySelector('canvas');

  const element = canvas.toDataURL("image/webp");
  //screenshotImg.src = element;
  //screenshotImg.classList.remove('d-none');

  await uploadPhotoToFolder(element);
  await feedbackPhotoTaken();

  showSnackBar('Photo uploaded.');
};

/* If client requests fullscreen mode (maybe better on mobile) */
const doToggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
        .then(res => toggleFs.setAttribute('aria-pressed', true));
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
        .then(res => toggleFs.setAttribute('aria-pressed', false));
  }
};

// image upload
const uploadPhotoToFolder = async (photo) => {
  const strPhoto = await photo.replace(/^data:image\/[a-z]+;base64,/, "");
  await fetch('api/photos/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "base64": strPhoto })
  });
};

// give user feedback (visual, sound)
const feedbackPhotoTaken = async () => {
  let visible = false;

  const sound = new Audio('sound/camera_sound.mp3');
  const reset = () => { visible = false; videoOverlay.style.display = 'none' };

  if (!visible) {
    visible = true;
    videoOverlay.style.display = 'block';
    await sound.play();
    setTimeout(reset, 80);
  }
};

//-- init application
const initApplication = async () => {
  const hasVideoDevices = await getVideoDevices();
  const hasMediaStream = await getMediaStream();
  if (hasVideoDevices.length > 0 && (hasMediaStream && 'id' in hasMediaStream)) {
    video.srcObject = hasMediaStream;
    video.onloadedmetadata = () => {
      video.play();
    }
    pauseAndDrawOnImage.classList.remove('d-none');
    snapshot.classList.remove('d-none');
  } else {
    console.log('init application -> no active camera stream') 
    noActiveStream.classList.remove('d-none');
  }
};

/* Controls Buttons click events */
pauseAndDrawOnImage.onclick = doPausePlayVideo;
snapshot.onclick = doTakeAPhoto;
toggleFs.onclick = doToggleFullScreen;

/* initialize application after DOM content was loaded */
document.addEventListener('DOMContentLoaded', async () => {
  await initApplication();

  
  const videoEl = document.getElementById('w');
  videoEl.height = height;
  videoEl.width = width;

  const canvas = document.getElementById('c');
  canvas.classList.remove('d-none');
  videoEl.classList.add('d-none');
  
  canvas.width = width;
  canvas.height = height;

  const fps = 60;
  let canvasInterval = null;

  const ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: false });
  
  const drawImage = () => {
    ctx.drawImage(videoEl, 0, 0, width, height);
  }
  canvasInterval = window.setInterval(() => {
    drawImage(videoEl);
  }, 1000 / fps);
  videoEl.onpause = function() {
    clearInterval(canvasInterval);
  };
  videoEl.onended = function() {
    clearInterval(canvasInterval);
  };
  videoEl.onplay = function() {
    clearInterval(canvasInterval);
    canvasInterval = window.setInterval(() => {
      drawImage(videoEl);
    }, 1000 / fps);
  };

  drawingToolBox.classList.add("show-tools");
  videoContainer.classList.add('drawing-active');
  
  drawOnCanvas(canvas, ctx);


  /*
  window.cancelRequestAnimFrame = (function(){
    return  window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout
  })();

const canvas = new fabric.Canvas('c', {
  isDrawingMode: true
});
canvas.freeDrawingBrush.width = 25;
canvas.freeDrawingBrush.color = "rgba(255,0,0,.3)";

canvas.setHeight(height);
canvas.setWidth(width);

const videoEl = document.getElementById('w');
videoEl.height = height;
videoEl.width = width;

const video = new fabric.Image(videoEl);

canvas.add(video);
video.getElement().play();

const playPauseButton = document.querySelector('.pause-and-draw-on-image');
playPauseButton.addEventListener('click', (e) => {
  console.log(videoEl.paused);
  !videoEl.paused ? video.getElement().pause() : videoEl.pause();
})

fabric.util.requestAnimFrame(function render() {
  canvas.renderAll();
  fabric.util.requestAnimFrame(render);
});

/*
let request;
const render = () => {
    canvas.renderAll();
    request = fabric.util.requestAnimFrame(render);
    let current_time = videoEl.currentTime;
    if(current_time >= 1) {
      console.log('ok');
      //cancelRequestAnimFrame(request);
      //videoEl.pause()
    } 
}

//videoEl.play();
fabric.util.requestAnimFrame(render);
*/
});