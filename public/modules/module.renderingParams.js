"use strict";

// Adapted width, height of video, canvas
const videoContainer = document.querySelector('#video-container');
let { width, height } = videoContainer.getBoundingClientRect();

// Video (Stream), Canvas
const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const noActiveStream = document.querySelector('.no-active-stream');

export { 
    width, 
    height, 
    canvas,
    video,
    noActiveStream
};