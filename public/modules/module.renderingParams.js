"use strict";

// Video (Stream), Canvas
const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const noActiveStream = document.querySelector('.no-active-stream');

// Adapted width, height of video, canvas
const videoContainer = document.querySelector('#video-container');
let { width, height } = videoContainer.getBoundingClientRect();


// Todo: Observe video container and adapt canvas
const resizeObserver = new ResizeObserver((entries) => {
    let { width, height } = entries[0].contentRect;
    canvas.width = width;
    canvas.height = height;
    alert('resized video container.');
  });

resizeObserver.observe(videoContainer);


export { 
    width, 
    height, 
    canvas,
    video,
    noActiveStream
};