/**
 * DO NOT MODIFY THIS FILE!
 * This file contains all of the unit tests for the `PixelArtMakerEngine` class.
 *
 * You may run this locally if you would like to check your work to ensure that
 * you completed the `PixelArtMakerEngine` implementation correctly:
 * `npm run test`
 *
 * This will run the tests in this file and output the results to the console.
 */

import { describe, expect, test, beforeEach } from "vitest";
import { DrawingTool, PixelArtMakerEngine } from "./engine";
import { hexToRgb } from "./utils";

// Create a test suite for the Engine object.
describe("Pixel Art Maker Engine", () => {
  // Engine object to be used in the tests.
  let engine: PixelArtMakerEngine;

  // Create a new instance of the Engine object before each test.
  beforeEach(() => {
    engine = new PixelArtMakerEngine();
  });

  test("If the pencil is selected when painting a cell, the color is changed to the active color", () => {
    engine.activeTool = DrawingTool.Pencil;
    engine.activeColor = hexToRgb("#ff0000");
    engine.paintCell(0, 0);
    // Verify the cell was painted
    expect(engine.getPixel(0,0)).toStrictEqual(engine.activeColor);
    // Verify that only one cell was affected.
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        if (r !== 0 || c !== 0) {
          expect(engine.getPixel(r,c)).toStrictEqual(engine.blankCellColor(r, c));
        }
      }
    }
  });

  test("If the bucket is selected when painting a cell, the entire canvas's color is set", () => {
    engine.activeTool = DrawingTool.Bucket;
    engine.activeColor = hexToRgb("#ff0000");
    engine.paintCell(0, 0);
    // Verify that every cell was painted.
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        expect(engine.getPixel(r,c)).toStrictEqual(engine.activeColor);
      }
    }
  });

  test("If the eraser is selected when painting a cell, the color is changed to default.", () => {
    engine.activeTool = DrawingTool.Eraser;
    let red = hexToRgb("#ff0000");
    // Set the entire canvas to red
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        engine.setPixel(r,c,red);
      }
    }
    engine.paintCell(0, 0);
    // Verify that only one cell was affected.
    expect(engine.getPixel(0,0)).toStrictEqual(engine.blankCellColor(0, 0));
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        if (r !== 0 || c !== 0) {
          expect(engine.getPixel(r,c)).toStrictEqual(red);
        }
      }
    }
  });

  test("Clearing the canvas restores it to the default look.", () => {
    // Paint the entire canvas
    let red = hexToRgb("#ff0000");
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        engine.setPixel(r,c,red);
      }
    }
    engine.clearCanvas();
    // Ensures that the canvas is back to its default state
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        if (r !== 0 || c !== 0) {
          expect(engine.getPixel(r,c)).toStrictEqual(engine.blankCellColor(r, c));
        }
      }
    }
  });
});
