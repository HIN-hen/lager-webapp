"use strict";

const controlsContainer = document.querySelector('#controls-container');

const buttons = [...controlsContainer.querySelectorAll('button')];

export const [/*toggleFs,*/ photoLibrary, snapshot, pauseAndDrawOnImage] = buttons;