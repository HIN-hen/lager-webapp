const toolBox = document.querySelector('ul.toolbox');
const brushModal = document.querySelector('.brush-modal');
const paletteModal = document.querySelector('.palette-modal');
const toolBtns = [...toolBox.querySelectorAll('button')];

const rangeSelectorStrokeSize = toolBox.querySelector('input#stroke-size');
const pickerSelectorStrokeColor = toolBox.querySelector('input#stroke-color');

const [brush, palette, undo, redo, init, save] = toolBtns;

let actionId = null; // active tooltip id
let tempId = null; // temp var for detecting tooltip id 2times click on same button (icon)

let strokeColor = "#00A870";
let strokeSize = 8;

// Todo: BUG - possibility to open 2 tooltips at same time 
toolBox.addEventListener("click", (event) => {

    let action = event.target;

    actionId = event.target.name;

    if (actionId) {

        const tooltip = toolBox.querySelector(`div.tooltip[id=${actionId}]`);
        
        // tooltip only needed in stroke and palette id (brush and stroke)
        if (tooltip && (actionId === 'brush' || actionId === 'palette')) {
            const tooltipContentClass = tooltip.querySelector('span.tooltip-content').classList;

            tempId !== actionId ? tooltipContentClass.remove('d-none') : [tooltipContentClass.add('d-none'),  actionId = null];
        
            tempId = actionId;

        } 

       action.matches('.tool-undo') && doUndo();
       action.matches('.tool-redo') && doRedo();
       action.matches('.tool-init') && doInit();
       action.matches('.tool-save') && doSave();
    }
});

//-- toolbox actions
const reset = () => { 
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); 
    i = -1; 
};

const fillColor = () => { const [r,g,b] = ctx.getImageData(0,0,1,1).data; };

const doUndo = () => {
    if (i <= 0) return reset();
    i--;
    console.log(history[i]);
    ctx.putImageData(history[i], 0, 0);
    fillColor(); 
};

const doRedo = () => {
    if (i >= history.length-1) return i = history.length-1;
    i++;
    ctx.putImageData(history[i],0,0);
    fillColor();
};

const doInit = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // reset to the beginning of drawing.
    history = [];
    i = -1; 
};

const doSave = () => { doTakeAPhoto(); };

//-- event listeners for changing stroke size and color
rangeSelectorStrokeSize.addEventListener("change", (event) => {
    strokeSize = event.target.value;
});

pickerSelectorStrokeColor.addEventListener("change", (event) => {
    strokeColor = event.target.value;
});