"use strict";

import { rdimWidth, rdimHeight } from "/modules/module.renderingDimensions.js";

let canvas, ctx;
canvas = document.querySelector('canvas');
const video = document.querySelector('video');

const activateCanvas = async () => {
    
    canvas.height = rdimHeight;
    canvas.width = rdimWidth;
  
    const fps = 60;
    let canvasInterval = null;
  
    ctx = canvas.getContext('2d', { 
      willReadFrequently: true, // for faster drawing
      alpha: false 
    });
    
    const drawImage = () => ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    canvasInterval = window.setInterval(() => {
      drawImage(video);
    }, 1000 / fps);
  
    video.onpause = () => clearInterval(canvasInterval);
    
    video.onended = () => clearInterval(canvasInterval);
    
    video.onplay = () => {
      clearInterval(canvasInterval);
      canvasInterval = window.setInterval(() => {
        drawImage(video);
      }, 1000 / fps);
    };
  
};

  // draw on canvas, give user the drawing tools
// adjust mouse pointer to actual viewport
// with touch support for all mobile devices
const drawOnCanvas = (canvas, ctx) => {

    let painting = false;
  
    const startPos = (e) => { 
      painting = true;
      draw(e);
    }
  
    const endPos = (e) => {
      painting = false;
      ctx.beginPath();
  
      if (!['mouseup','touchend'].includes(e.type)) return; // if not mouseup / touchend don't save in history! it ends here ;)
  
      history.push(ctx.getImageData(0,0,canvas.width,canvas.height));
      i++;
    }
  
    // lets draw ...
    const draw = (e) => {
      if (!painting) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      ctx.lineWidth = strokeSize;
      ctx.lineCap = "round";
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.strokeStyle = strokeColor;
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    }
  
    // mouse / touch event listeners on canvas
    canvas.addEventListener("mousedown", startPos, false);
    canvas.addEventListener("touchstart", startPos, false);
    canvas.addEventListener("mouseup", endPos, false);
    canvas.addEventListener("touchend", endPos, false);
    canvas.addEventListener("mousemove", draw, false);
    canvas.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      draw(mouseEvent);
    }, false);
  };

export default activateCanvas;
