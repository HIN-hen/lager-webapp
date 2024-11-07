"use strict";

import { pauseAndDrawOnImage, snapshot, toggleFs } from "/modules/module.controlButtons.js";

const video = document.querySelector('video');
const videoOverlay = document.querySelector('.video-overlay');
const drawingToolBox = document.querySelector('ul.toolbox');
const videoContainer = document.querySelector('#video-container');

//-- Pause / play video
const doPausePlayVideo = async () => {

    if (!video.paused) {
      video.pause();
      drawingToolBox.classList.add("show-tools");
      videoContainer.classList.add('drawing-active');
      pauseAndDrawOnImage.setAttribute('aria-pressed', 'true');
      showSnackBar('Drawing mode enabled.');
    } else {
      await video.play();
      drawingToolBox.classList.remove("show-tools");
      videoContainer.classList.remove('drawing-active');
      pauseAndDrawOnImage.setAttribute('aria-pressed', 'false');
      showSnackBar('Drawing mode disabled.');
    }
  };
  
  //-- Camera snapshot button (take a photo with and without draw lines)
  //-- use modern webP images with much lower size and same quality (https://developers.google.com/speed/webp?hl=de)
  const doTakeAPhoto = async () => {
    const canvas = document.querySelector('canvas');
  
    const element = canvas.toDataURL("image/webp");
   
    await uploadPhotoToFolder(element);
    await feedbackPhotoTaken();
  
    showSnackBar('Photo uploaded.');
  };
  
  /* If client requests fullscreen mode */
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

/* Controls Buttons click events */
pauseAndDrawOnImage.onclick = doPausePlayVideo;
snapshot.onclick = doTakeAPhoto;
toggleFs.onclick = doToggleFullScreen;