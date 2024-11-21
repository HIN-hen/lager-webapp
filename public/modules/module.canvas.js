"use strict";

import { video, canvas, videoContainer } from "/modules/module.renderingParams.js";
import { pauseAndDrawOnImage, snapshot } from "/modules/module.controlButtons.js";

let ctx;
let strokeColor = "#00A870";
let strokeSize = 8;
let history = [];
let i = -1;

const toolBox = document.querySelector('ul.toolbox');
const modalContents = toolBox.querySelectorAll('span.toolbox-modal-content');

const rangeSelectorStrokeSize = toolBox.querySelector('input#stroke-size');
const pickerSelectorStrokeColor = toolBox.querySelector('input#stroke-color');

//canvas.width = width;
//canvas.height = height;
    
const fps = 60;
let canvasInterval = null;
    
ctx = canvas.getContext('2d', { 
    willReadFrequently: true, // for faster drawing
    alpha: false
});
     
const drawIt = () => ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// init canvas, drawing and history at once
const initCanvasDrawingAndHistory = () => {
  history = [];
  i = -1;
  // on history index 0 hold blank canvas without drawing lines from context!
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  // ... and count up
  i++
  //drawOnCanvas();
};

canvasInterval = window.setInterval(() => {
    drawIt();
}, 1000 / fps);
    
video.onpause = () => { 

    initCanvasDrawingAndHistory(); // prepare canvas for drawing actions :)

    canvas.addEventListener("mousedown", startPos, false);
    canvas.addEventListener("touchstart", startPos, false);
    canvas.addEventListener("mouseup", endPos, false);
    canvas.addEventListener("touchend", endPos, false);
    canvas.addEventListener("mouseout", draw, false); // stop if drawing out of canvas area!
    canvas.addEventListener("mousemove", draw, false);
    canvas.addEventListener("touchmove", (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      draw(mouseEvent);
    }, false);
    
    clearInterval(canvasInterval);
};
    
video.onended = () => clearInterval(canvasInterval);
        
video.onplay = () => {
    // important: remove all listeners to prevent performance issues!
    canvas.removeEventListener("mousedown", startPos);
    canvas.removeEventListener("touchstart", startPos);
    canvas.removeEventListener("mouseup", endPos);
    canvas.removeEventListener("touchend", endPos);
    canvas.removeEventListener("mouseout", draw);
    canvas.removeEventListener("mousemove", draw);
    canvas.removeEventListener("touchmove", draw);

  clearInterval(canvasInterval);
  canvasInterval = window.setInterval(() => {
    drawIt();
  }, 1000 / fps);
};

let painting = false;

    const startPos = (e) => { 
      painting = true;
      draw(e);
    }

    const endPos = (e) => {
      painting = false;
      ctx.beginPath();

      // if not mouseup / touchend or mouseout don't save in history! it ends here ;)
      if (!['mouseup','touchend','mouseout'].includes(e.type)) return;
  
      // begins on history index 1
      history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      i++; // ... and count up  
    };

    // lets draw ...
    const draw = (e) => {
      if (!painting) {
        return;
      }
      if (e.type === 'mouseout') { // catch on drawing mouse out events to prevent mouse drawing bug.
        endPos(e);
        alert("Drawing outside detected.");
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
    };

/* *********************** */
/* Canvas Drawing History */
/* ***********************/
const historyInit = () => {
  history.length = 1;
  ctx.putImageData(history[0], 0, 0); 
  i = -1; 
};

const historyStepUndo = () => {
    if (i <= 0) return; // history on count 0 or below? leave it ;)
    i--;
    ctx.putImageData(history[i], 0, 0);
};

const historyStepRedo = () => {
    if (i >= history.length-1) return i = history.length-1;
    i++;
    ctx.putImageData(history[i], 0, 0);
};

/* ******************* */
/* Toolbox Actions ****/
/* *******************/
toolBox.addEventListener("click", (event) => {

    const action = event.target;

    const modal = (type) => {
       const found = [...modalContents].find(el => el.id === type);
       found.classList.toggle('d-none');
    };
  
    action.matches('.tool-brush') && modal("brush");
    action.matches('.tool-palette') && modal("palette");
    action.matches('.tool-undo') && historyStepUndo();
    action.matches('.tool-redo') && historyStepRedo();
    action.matches('.tool-init') && historyInit();
    action.matches('.tool-save') && snapshot.click();
});

//-- event listeners for changing stroke size and color
rangeSelectorStrokeSize.addEventListener("change", (event) => {
    strokeSize = event.target.value;
});

pickerSelectorStrokeColor.addEventListener("change", (event) => {
    strokeColor = event.target.value;
});

// detect changes of dimensions from videoContainer to adapt canvas to new dimensions
const resizeObserver = new ResizeObserver((entries) => {
  video.play(); // keep canvas alive on resizing via playing video to get frames!
  pauseAndDrawOnImage.setAttribute('aria-pressed', false);

  const entry = entries[0];
  
  const { clientWidth, clientHeight } = entry.target;

  canvas.width = clientWidth;
  canvas.height = clientHeight;
});

resizeObserver.observe(videoContainer);
