"use strict";

const videoContainer = document.querySelector('#video-container');

let { width, height } = videoContainer.getBoundingClientRect();

export const rdimWidth = width;
export const rdimHeight = height;