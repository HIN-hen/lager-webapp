"use strict";

import { width, height, video, noActiveStream } from "/modules/module.renderingParams.js";
import { pauseAndDrawOnImage, snapshot, canvasZoom } from "/modules/module.controlButtons.js";

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

// activate webcam with check
const activateWebcam = async () => {

    noActiveStream.classList.remove('d-none');
    pauseAndDrawOnImage.setAttribute('disabled', true);
    snapshot.setAttribute('disabled', true);
  
    // case 1: no available media device
    const hasVideoDevices = await getVideoDevices();
    if (hasVideoDevices.length === 0) {
      return;
    } 

    // case 2: no available media stream (cam blocked in browser from user etc.)
    const hasMediaStream = await getMediaStream();
    if (hasMediaStream === null || !'id' in hasMediaStream) {
      return;
    }
    
    // all ok ? let's play and feed canvas with video frames ;)
    video.srcObject = hasMediaStream;
 
    // activate interaction ui buttons
    noActiveStream.classList.add('d-none');
    canvasZoom.classList.remove('d-none');
    pauseAndDrawOnImage.removeAttribute('disabled');
    snapshot.removeAttribute('disabled');

  };
  
  export default activateWebcam;