/*
Useful links: 
  https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en#stop-ended-and-active
  https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
*/
// Define working objects
const switchFrontBtn = document.getElementById('switchFrontBtn');
const switchBackBtn = document.getElementById('switchBackBtn')
const snapBtn = document.getElementById('snapBtn'); // take cam snap and upload it to folder.
let cam = document.getElementById('cam');

// reference to the current media stream
let mediaStream = null;

// Prefer camera resolution nearest to 1280x720.
const constraints = { 
  audio: false, 
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
    facingMode: "environment" // default back cam
  } 
}; 

const getMediaStream = async (constraints) => {
  try {
    const mediaStream =  await navigator.mediaDevices.getUserMedia(constraints);
    let video = cam;    
    video.srcObject = mediaStream;
    video.onloadedmetadata = (event) => {
      video.play();
    };
  } catch (err)  {    
    console.error(err.message);   
  }
};

// switch between cameras
const switchCamera = async (cameraMode) => {
  try {
    // stop the current video stream
    if (mediaStream !== null && mediaStream.active) {
      const tracks = mediaStream.getVideoTracks();
      tracks.forEach(track => {
        track.stop();
      })      
    }
    
    // set the video source to null
    cam.srcObject = null;
    
    // change "facingMode"
    constraints.video.facingMode = cameraMode;
    
    // get new media stream
    await getMediaStream(constraints);
  } catch (err)  {    
    console.error(err.message); 
  }
};

// image upload
const uploadPhotoToFolder = async (photo) => {  
  const strPhoto = await photo.src.replace(/^data:image\/[a-z]+;base64,/, "");
  await fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "base64": strPhoto })
  });
};

// take camera picture
const takePicture = async () => {
  let canvas = document.getElementById('canvas');
  let video = document.getElementById('cam');
  let photo = document.getElementById('photo');  
  let context = canvas.getContext('2d');

  const height = video.videoHeight;
  const width = video.videoWidth;
  
  if (width && height) {  
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);    
    const data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    await uploadPhotoToFolder(photo); // upload photo  
    } else {
    clearPhoto();
  }
};

// clear photo
const clearPhoto = () => {
  let canvas = document.getElementById('canvas');
  let photo = document.getElementById('photo');
  let context = canvas.getContext('2d');
  
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
};

// Button click events
switchFrontBtn.onclick = (event) => {
  switchCamera("user");
};

switchBackBtn.onclick = (event) => {  
  switchCamera("environment");
};

snapBtn.onclick = (event) => {  
  takePicture();
  event.preventDefault();
};

// call main function
clearPhoto();
// autostart environment camera
switchCamera("environment");