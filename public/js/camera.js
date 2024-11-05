import activateWebcam from "/modules/module.webcam.js";
import activateCanvas from "/modules/module.canvas.js";
import * as uiControls from "/modules/module.controls.js";

//const videoContainer = document.querySelector('#video-container');

//const video = document.querySelector('video');

const canvas = document.querySelector('canvas');

//const noActiveStream = document.querySelector('.no-active-stream');
const drawingToolBox = document.querySelector('ul.toolbox');
const controlsContainer = document.querySelector('#controls-container');
const videoOverlay = document.querySelector('.video-overlay');

//const buttons = [...controlsContainer.querySelectorAll('button')];
//const [toggleFs, photoLibrary, snapshot, pauseAndDrawOnImage] = buttons;

await activateWebcam();
await activateCanvas();
//await uiControls();

//const screenshotImg = document.querySelector('img');

// important: get dimensions of videoContainer and adapt canvas and video to this dimensions!
// videostream will be played via canvas to ensure snapshot and/or pause, draw and snapshot easily
//const { width, height } = videoContainer.getBoundingClientRect();
