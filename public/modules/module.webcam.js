"use strict";

import { width, height, video, noActiveStream } from "/modules/module.renderingParams.js";
import { pauseAndDrawOnImage, snapshot, /*toggleFs*/ } from "/modules/module.controlButtons.js";

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
      ideal: 1.777777778 // 16/9 as ideal
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

const activateWebcam = async () => {
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
      pauseAndDrawOnImage.setAttribute('disabled', true);
      //toggleFs.setAttribute('disabled', true);
      snapshot.setAttribute('disabled', true);
    }
  };
  
  export default activateWebcam;