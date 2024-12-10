"use strict";

const canvasZoom = document.querySelector('#canvas-zoom input');

const controlsContainer = document.querySelector('#controls-container');
const buttons = [...controlsContainer.querySelectorAll('button')];
const [/*toggleFs,*/ photoLibrary, snapshot, pauseAndDrawOnImage] = buttons;

export {
    canvasZoom,
    //toggleFs, 
    photoLibrary, 
    snapshot, 
    pauseAndDrawOnImage
}