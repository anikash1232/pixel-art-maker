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
// HINT: You should make use of this to figure out how to manage drawing on the canvas!
// HINT 2: You will need to find a way to toggle this variable to see if the mouse is
//         pressed or not anywhere on the website...
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

/** --------------------------------------------------------------------------- */
/** | All to-dos are listed below!                                            | */
/** --------------------------------------------------------------------------- */

// TODO: Implement the `syncCanvasWithEngine` method below.

/**
 * Helper function that syncs the HTML canvas with the state of the canvas in
 * the `canvas` property of the engine.
 *
 * This means that calling this function should change the colors of all of the
 * cells on the canvas to the color stored in the canvas. You should set the 
 * CSS attribute for the background color to the CSS hexstring that corresponds
 * to the RgbColor stored in the Canvas. See the function rgbToHex in the 
 * file utils.ts.
 *
 * Note: Examine `index.html` to figure out how to refer to each cell object
 *       using DOM methods!
 */
const syncCanvasWithEngine = () => {
  /* Your code here */
};

// Syncs the canvas at the start.
syncCanvasWithEngine();

// TODO: Through creating event handlers, correctly toggle `isMouseDown` to
//       represent the state of whether the mouse is pressed down or not!

/* Your code here */

// TODO: Set up the correct event handlers to handle the user clicking on
//       **or dragging *through* ** each cell to paint on the canvas!
//       Utilize the `engine` methods and `syncCanvasWithEngine` to
//       accomplish this.
//
// HINT: Just using "click" as the event will not be sufficient, for
//       two reasons:
//       - Click only will activate when the user *lifts up* the mouse
//         button and not immediately when pressing, which is not the
//         feel we want when drawing.
//       - Often, users will want to drag across *many* cells at once
//         to paint all of them! It will be up to you to find the correct
//         combination of event handlers to implement this functionality.

/* Your code here. */

// TODO: Create the correct event handler to change the selected color once
//       the user picks a new color. Update the engine to use the new color
//       and update the color CSS attribute of the color icon to reflect
//       the newly selected color. Note that the color input (i.e., the color picker)
//       and the color icon are separate HTML elements - try to find them in the HTML!
//
// NOTE: Check out the following official documentation to learn a bit more
//       about the type of event handler needed here...
//       https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
//
// HINT: If you are having issues with `event.target` not having the property
//       `value`, that is because of a TypeScript quirk. This error would
//       disappear if you first cast: (event.target as HTMLInputElement)

/* Your code here. */

// TODO: Create the correct event handlers to change the engine's active tool
//       to the pencil, bucket, or eraser when these buttons are pressed!
//
// HINT: You can find the HTML elements to work with in the #options-drawer element.
//       Remember, these three tools are option buttons..
//
//       Note that there is a CSS rule in styles.css at the end of the file
//       which properly sets the background of the currently selected tool identified
//       by the presence of "selected" as part of the class attribute. 
//       In index.html you can see that the pencil button starts off with this class value.
//       Your code should remove "selected" from the class attribute of the tool that 
//       currently has it and then add "selected" to the class attribute of the tool that
//       was newly selected. This can be done using the classList property of DOM elements.
//       See: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

/* Your code here. */

// TODO: Create the correct event handler to download the current image when
//       the "save" / download button is pressed.

document.getElementById("save")?.addEventListener('click', () => engine.downloadImageFromCanvas());

/* Your code here. */

// TODO: Create the correct event handler to *show a confirmation alert* prompting
//       the user when the user presses the "clear" image button. If the user pressed
//       "OK", clear the image. Otherwise, do nothing. Use `syncCanvasWithEngine`!
//
// NOTE: For more information on how to show alerts, check out this resource:
//       https://www.w3schools.com/js/js_popup.asp

/* Your code here */

// TODO: Finally, you want to make use of the reference to the `cellCursor` HTML element.
//       You want this cursor to appear in the cell that the user is currently hovering
//       over *if they are not actively drawing*. This cursor should then slightly whiten
//       / highlight the cell, allowing the user to see what cell they are about to click
//       as they draw on the canvas. To make the cursor appear, simply add it as a child
//       element to the cell. Other requirements:
//       -  If the user presses down to start to draw, the cursor should disappear.
//       - Once the user releases the mouse button, the cursor should reappear.
//       - If the user's mouse leaves the canvas window (for example, to change tools),
//         the cursor should disappear also rather than staying stuck in a random cell.
//
// NOTE: You are recommended to modify event handlers from above to accomplish this, but
//       feel free to create new event handlers if you wish.

// FINAL STEP: Congratulations! Now, try drawing something cool!
