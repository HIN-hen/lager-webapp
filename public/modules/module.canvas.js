"use strict";

import { width, height, video, canvas } from "/modules/module.renderingParams.js";

let ctx;
let strokeColor = "#00A870";
let strokeSize = 8;
let history = [];
let i = -1;

const toolBox = document.querySelector('ul.toolbox');
const modalContents = toolBox.querySelectorAll('span.toolbox-modal-content');

const rangeSelectorStrokeSize = toolBox.querySelector('input#stroke-size');
const pickerSelectorStrokeColor = toolBox.querySelector('input#stroke-color');

canvas.width = width;
canvas.height = height;
    
const fps = 60;
let canvasInterval = null;
    
ctx = canvas.getContext('2d', { 
    willReadFrequently: true, // for faster drawing
    alpha: false
});
     
const drawIt = () => ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

const initCanvasAndHistory = () => {
  history = [];
  i = -1;
  // on history index 0 hold blank canvas without drawing lines from context!
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

canvasInterval = window.setInterval(() => {
    drawIt();
}, 1000 / fps);
    
video.onpause = () => { 
  clearInterval(canvasInterval);
  initCanvasAndHistory();
}
    
video.onended = () => clearInterval(canvasInterval);
        
video.onplay = () => {
    clearInterval(canvasInterval);
    canvasInterval = window.setInterval(() => {
    drawIt();
    }, 1000 / fps);
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
  
      history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
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

drawOnCanvas(canvas, ctx);

//-- toolbox actions with visual handling drawing history
// remove all drawings from canvas
const reset = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); 
    i = -1; 
};

// fill with selected color
const fillColor = () => { const [r,g,b] = ctx.getImageData(0, 0, 1, 1).data; };

// undo drawings stepwise
const doUndo = () => {
    //if (i <= 0) return reset();
    i--;
    ctx.putImageData(history[i], 0, 0);
    //fillColor(); 
};

// redo deleted drawings stepwise
const doRedo = () => {
    if (i >= history.length-1) return i = history.length-1;
    i++;
    ctx.putImageData(history[i], 0, 0);
    //fillColor();
};

// initiate drawing history
const doInitHistory = () => {
    //ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // start from the beginning
    ctx.putImageData(history[0], 0, 0);
    //history = [];
    i = -1; 
};

// save photo
//const doSave = () => doTakeAPhoto; // same as take a photo functionality

// toolbox actions
toolBox.addEventListener("click", (event) => {

    const action = event.target;

    const modal = (type) => {
       const found = [...modalContents].find(el => el.id === type);
       found.classList.toggle('d-none');
    }
  
    action.matches('.tool-brush') && modal("brush");
    action.matches('.tool-palette') && modal("palette");
    action.matches('.tool-undo') && doUndo();
    action.matches('.tool-redo') && doRedo();
    action.matches('.tool-init') && doInitHistory();
    action.matches('.tool-save') && doTakeAPhoto();
});

//-- event listeners for changing stroke size and color
rangeSelectorStrokeSize.addEventListener("change", (event) => {
    strokeSize = event.target.value;
});

pickerSelectorStrokeColor.addEventListener("change", (event) => {
    strokeColor = event.target.value;
});