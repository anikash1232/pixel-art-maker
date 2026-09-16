/**
 * This file contains all of the "business logic" and functionality for
 * the pixel art maker, wrapped into the `PixelArtMakerEngine` class.
 * In the traditional MVC architectural sense you are used to from
 * COMP 301, this would be the *model*.
 */

import { hexToRgb, RgbColor } from "./utils";

/** All of the supported tools / operations. */
export enum DrawingTool {
  Pencil,
  Bucket,
  Eraser,
}

/**
 * Defines the PixelArtMakerEngine object, which abstracts the current
 * state and functionality for the pixel art maker.
 */
export class PixelArtMakerEngine {
  /** Stores the current tool selected by the user. */
  activeTool: DrawingTool = DrawingTool.Pencil;

  /** Stores the current color selection by the user. */
  activeColor: RgbColor = hexToRgb('#000000');

  /**
   * Stores the current state of the canvas.
   *
   * The canvas is stored as a 2D array of RgbColor objects. The canvas
   * has 16 rows and 16 columns. Rows are accessible by the first index
   * and columns by the second. For example, to select row 3, column 2,
   * you would use: this._canvas[2][1].
   *
   * Note the use of `get` / `set` syntax for width and height. 
   * This is special "syntactic
   * sugar" allowing us to set custom implementations for the getter
   * and setter of a property in TypeScript! You can read more about
   * these methods here:
   * https://www.typescriptlang.org/docs/handbook/2/classes.html#getters--setters
   *
   * This enables the canvas width and height to be accessible from `main.ts`, but *not*
   * settable (since the setter isn't defined)! This ensures that you do
   * not accidentally try to modify the canvas dimensions.
   * 
   * The pixel values within the canvas can be retrieved and set as RgbColor objects
   * using the getPixel() and setPixel() methods.
   */

  private _canvas: RgbColor[][] = [];

  get width() {
    return 16;
  }

  get height() {
    return 16;
  }

  getPixel(r: number, c: number) : RgbColor {
    if (r < 0 || c < 0 || r >= this.height || c >= this.width) {
      throw new Error(`Coordinates out of bounds.`);
    }
    return this._canvas[r][c];
  }

  setPixel(r: number, c: number, rgb: RgbColor) : void {
    if (r < 0 || c < 0 || r >= this.height || c >= this.width) {
      throw new Error(`Coordinates out of bounds.`);
    }
    this._canvas[r][c] = rgb;
  }


  /** Constructor - sets up canvas from local storage if it exists, 
   *  otherwise as a blank canvas.
  */
  constructor() {
    this.loadCanvas();
  }

  /**
   * Change the color of a cell, depending on the selected tool.
   * - If the pencil is selected, the color is changed to the active color.
   * - If the bucket is selected, the entire canvas's color is set.
   * - If the eraser is selected, the color is changed to default.
   * Upon each canvas change, the canvas is saved by calling `saveCanvas`.
   * @param r: Row of the cell to paint (from 0-15)
   * @param c: Column of the cell to paint (from 0-15)
   */
  paintCell(r: number, c: number): void {
    if (this.activeTool === DrawingTool.Pencil) {
      // The pencil paints only the cell that was clicked / dragged through.
      this.setPixel(r, c, { ...this.activeColor });
    } else if (this.activeTool === DrawingTool.Bucket) {
      // The bucket floods the whole canvas with the active color.
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          this.setPixel(row, col, { ...this.activeColor });
        }
      }
    } else {
      // The eraser restores the cell to its default checkerboard color.
      this.setPixel(r, c, this.blankCellColor(r, c));
    }
    this.saveCanvas();
  }

  // NOTE: Remember that the blank canvas is not entirely white - to
  // make the grid more apparent, we use a checkerboard pattern! Use
  // the `blankCellColor(r, c)` method to determine which color should
  // be placed at a cell in position (r,c).

  /** Clears the canvas back to its default colors, then saves the canvas. */
  clearCanvas(): void {
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        this.setPixel(r, c, this.blankCellColor(r, c));
      }
    }
    this.saveCanvas();
  }

  /** Downloads the currently drawn canvas as a PNG file  */
  downloadImageFromCanvas(): void {
    // First, we will reduce the 2D canvas into a 1D array
    let data = this._canvas.flat();
    // We want to then expand this object so colors become an array
    // in the format: [r, g, b, a].
    let expandedRgbData = data.map((rgb) => [rgb.r, rgb.g, rgb.b, rgb.a]);
    // Finally, we want to collapse this list into a single 1D array
    // that encodes the data for every r, g, b, a value for every pixel.
    // The final format would be:
    // [r1, g1, b1, a1, r2, g2, b2, a2, ...  rn, gn, bn, an] for n pixels.
    let encodedData = expandedRgbData.flat();
    // Create dummy HTML Canvas element to insert this image data into.
    let canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    // Create the final image data for the context
    let context = canvas.getContext("2d")!;
    let imageData = context.createImageData(16, 16);
    encodedData.forEach((value, i) => {
      imageData.data[i] = value;
    });
    // Place the image data into the dummy canvas at (0,0).
    canvas.getContext("2d")!.putImageData(imageData, 0, 0);

    // Create image and get image URL
    let imageUrl = canvas.toDataURL("image/png");

    // Create a dummy downloadable link, click it, then delete.
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "pixel-art.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /** Determines the cell color for a "blank" cell (either white or gray) */
  blankCellColor(r: number, c: number): RgbColor {
    let white = {r: 0xff, g: 0xff, b: 0xff, a: 0xff};
    let gray =  {r: 0xde, g: 0xde, b: 0xde, a: 0xff};
    if (r % 2 === 0) {
      return c % 2 === 0 ? gray : white;
    } else {
      return c % 2 === 0 ? white : gray;
    }
  }

  /**
   * Loads a previously existing canvas from local storage memory, if
   * it exists. This enables for drawings to persist even after
   * refreshing the page. Since data in local storage can only be
   * stored as a string, we use `JSON.parse()` coupled with a typecast
   * to convert the string representation back into a TypeScript object.
   */
  private loadCanvas(): void {
    // Attempt to load the stored canvas
    if (
      typeof localStorage !== "undefined" &&
      localStorage.getItem("a02-canvas")
    ) {
      this._canvas = JSON.parse(
        localStorage.getItem("a02-canvas")!
      ) as RgbColor[][];
    } else {
      // If no canvas exists, create a blank one
      this._canvas = [];
      for (let r = 0; r < this.height; r++) {
        let row: RgbColor[] = [];
        for (let c = 0; c < this.width; c++) {
          row.push(this.blankCellColor(r, c));
        }
        this._canvas.push(row);
      }
    }
  }

  /** Saves the canvas into local storage. Should be called after 
   * any operation that changes the canvas.
  */
  private saveCanvas(): void {
    try {
      localStorage.setItem("a02-canvas", JSON.stringify(this._canvas));
    } catch {}
  }
}