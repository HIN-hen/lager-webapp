"use strict";

// Video (Stream), Canvas
const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const noActiveStream = document.querySelector('.no-active-stream');

// Adapted width, height of video, canvas
const videoContainer = document.querySelector('#video-container');
let { width, height } = videoContainer.getBoundingClientRect();

// change from no active cam to active cam reload of video container is required
window.addEventListener('resize', videoContainer => {
    console.log(videoContainer);
    location.reload();   
});
window.removeEventListener('resize', videoContainer);

export { 
    width, 
    height, 
    canvas,
    video,
    noActiveStream
};