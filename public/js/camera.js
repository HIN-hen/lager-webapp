import activateWebcam from "/modules/module.webcam.js";
import * as activateCanvas from "/modules/module.canvas.js";
import * as uiControls from "/modules/module.controls.js";

//-- Load Webcam Stream 
await activateWebcam();

//-- Activate canvas extracted from video stream
await activateCanvas;

//-- Show UI Controls
await uiControls;