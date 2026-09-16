/**
 * This file configures the event handlers necessary to connect the UI of our app
 * to functionality.
 *
 * In the traditional MVC architectural sense you are used to from
 * COMP 301, this would be the *controller*.
 */

import { DrawingTool, PixelArtMakerEngine } from "./engine";
import { rgbToHex, hexToRgb } from "./utils";

// Defines the `PixelArtMakerEngine` instance that will be used by this application.
const engine = new PixelArtMakerEngine();

// Defines a helper variable to determine if the mouse is pressed or not.
let isMouseDown = false;

// Defines a new `cellCursor` HTML element that should be placed inside of cells
// if they are hovered over whenever the user is not drawing (not pressed down).
// This will highlight which cell the user is pointing on.
const cellCursor = document.createElement("div");
cellCursor.style.backgroundColor = "white";
cellCursor.style.opacity = "0.3";
cellCursor.style.boxSizing = "border-box";
cellCursor.style.margin = "3px";
cellCursor.style.flexGrow = "1";
cellCursor.style.alignSelf = "stretch";
cellCursor.style.border = "dotted black";

// Keeps track of the cell the mouse is currently hovering over, so that the
// cursor can be put back in the right place once the user stops drawing.
let hoveredCell: HTMLElement | null = null;

/**
 * Helper function that syncs the HTML canvas with the state of the canvas in
 * the `canvas` property of the engine.
 *
 * This means that calling this function should change the colors of all of the
 * cells on the canvas to the color stored in the canvas. You should set the
 * CSS attribute for the background color to the CSS hexstring that corresponds
 * to the RgbColor stored in the Canvas. See the function rgbToHex in the
 * file utils.ts.
 */
const syncCanvasWithEngine = () => {
  for (let r = 0; r < engine.height; r++) {
    for (let c = 0; c < engine.width; c++) {
      // Each cell in index.html has an id in the form `r{row}_c{column}`.
      const cell = document.getElementById(`r${r}_c${c}`);
      if (cell === null) {
        continue;
      }
      cell.style.backgroundColor = rgbToHex(engine.getPixel(r, c));
    }
  }
};

// Syncs the canvas at the start.
syncCanvasWithEngine();

// Track whether the mouse is pressed anywhere on the page. Listening on the
// document (rather than on each cell) means that a press or release outside of
// the canvas is still accounted for.
document.addEventListener("mousedown", () => {
  isMouseDown = true;
  // While the user is drawing, the hover cursor should get out of the way.
  cellCursor.remove();
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
  // Once the user stops drawing, show the cursor on whichever cell they are on.
  if (hoveredCell !== null) {
    hoveredCell.appendChild(cellCursor);
  }
});

// If the mouse leaves the page entirely, the mouseup may never reach us, so
// reset the drawing state to avoid painting when the mouse comes back.
document.addEventListener("mouseleave", () => {
  isMouseDown = false;
  hoveredCell = null;
  cellCursor.remove();
});

// Handle the user clicking on -- or dragging *through* -- each cell.
// "mousedown" paints as soon as the button is pressed (rather than waiting for
// the release, as "click" would), and "mouseenter" continues painting every
// cell the mouse is dragged through while the button is held down.
for (let r = 0; r < engine.height; r++) {
  for (let c = 0; c < engine.width; c++) {
    const cell = document.getElementById(`r${r}_c${c}`);
    if (cell === null) {
      continue;
    }

    const paintThisCell = () => {
      engine.paintCell(r, c);
      syncCanvasWithEngine();
    };

    cell.addEventListener("mousedown", paintThisCell);

    cell.addEventListener("mouseenter", () => {
      hoveredCell = cell;
      if (isMouseDown) {
        paintThisCell();
      } else {
        // Appending the cursor also removes it from the previous cell.
        cell.appendChild(cellCursor);
      }
    });
  }
}

// If the mouse leaves the canvas (for example, to change tools), the cursor
// should not stay stuck in the last cell it was in.
document.getElementById("canvas")?.addEventListener("mouseleave", () => {
  hoveredCell = null;
  cellCursor.remove();
});

// Change the selected color when the user picks a new one. The color input
// (`#color-picker`) is invisible and layered underneath the icon that actually
// displays the color (`#color-icon`), so both need to be updated.
const colorIcon = document.getElementById("color-icon");
const colorPicker = document.getElementById("color-picker");

const handleColorChange = (event: Event) => {
  const hex = (event.target as HTMLInputElement).value;
  engine.activeColor = hexToRgb(hex);
  if (colorIcon !== null) {
    colorIcon.style.color = hex;
  }
};

// "change" fires once the user commits a color; "input" also updates the blob
// live while they are still dragging around inside the color picker.
colorPicker?.addEventListener("change", handleColorChange);
colorPicker?.addEventListener("input", handleColorChange);

// Change the engine's active tool when one of the tool buttons is pressed, and
// move the "selected" class so the user can see which tool is active.
const tools: [string, DrawingTool][] = [
  ["pencil", DrawingTool.Pencil],
  ["bucket", DrawingTool.Bucket],
  ["eraser", DrawingTool.Eraser],
];

tools.forEach(([id, tool]) => {
  const button = document.getElementById(id);
  if (button === null) {
    return;
  }
  button.addEventListener("click", () => {
    document
      .querySelectorAll("#options-drawer .option-button")
      .forEach((otherButton) => otherButton.classList.remove("selected"));
    button.classList.add("selected");
    engine.activeTool = tool;
  });
});

// Download the current image when the "save" / download button is pressed.
document.getElementById("save")?.addEventListener('click', () => engine.downloadImageFromCanvas());

// Clear the canvas when the "clear" button is pressed, but only after the user
// confirms -- clearing a drawing cannot be undone.
document.getElementById("clear")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the canvas? This cannot be undone.")) {
    engine.clearCanvas();
    syncCanvasWithEngine();
  }
});
