# Pixel Art Maker

A browser-based pixel art editor in TypeScript, built on an engine that keeps drawing state
entirely separate from the DOM.

## What it does

Draw on a pixel grid with a set of tools, choosing colours and editing cell by cell. The
canvas renders from engine state, so what's displayed is always a projection of the model
rather than something the UI mutates directly.

- Multiple drawing tools, enumerated in `DrawingTool`
- Grid-based canvas with per-cell colour
- Engine state independent of rendering
- Unit-tested drawing logic

## Architecture

```
src/
  engine.ts       PixelArtMakerEngine - grid state and drawing operations
  engine.test.ts  unit tests over the engine
  utils.ts        helpers
  main.ts         DOM wiring and event handling
index.html        markup
vite.config.ts    build configuration
```

`PixelArtMakerEngine` owns the grid and every operation that modifies it; `main.ts` does
nothing but translate user events into engine calls and render the result. That boundary is
what makes `engine.test.ts` possible — the drawing logic is tested directly, with no DOM, no
browser, and no simulated clicks.

## Running it

```bash
npm install
npm run dev      # dev server
npm test         # unit tests
npm run build    # production build
```

Built with Vite and TypeScript.
