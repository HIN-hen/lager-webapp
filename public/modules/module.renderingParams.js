"use strict";

// Video (Stream), Canvas
const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const noActiveStream = document.querySelector('.no-active-stream');

// Adapted width, height of video, canvas
const videoContainer = document.querySelector('#video-container');
let { width, height } = videoContainer.getBoundingClientRect();
console.log("orWidth: " + width, ", orHeight: " + height);

const resizeObserver = new ResizeObserver((entries) => {
    const elementSize = entries[0];
    const { height, width } = elementSize.contentRect;
    console.log(width, height);
    canvas.height = height;
    canvas.width = width;
    alert("resized ... changed view mode.");
});

// Watch viewport changes mobile portrait <-> landscape mode
window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    console.log(e);
    const portrait = e.matches;

    if (portrait) {
        // do something
        resizeObserver.observe(videoContainer);
    } else {
        // do something else
        resizeObserver.observe(videoContainer);
    }
});

console.log(canvas);
console.log("cWidth: " + canvas.width, "cHeight: " + canvas.height);

export { 
    width, 
    height, 
    canvas,
    video,
    noActiveStream
};