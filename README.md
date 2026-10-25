# React Three Fiber — a scroll presentation

A 10-minute presentation about **React Three Fiber (R3F)**, built in React Three Fiber itself. You fly a spaceship along a curved path past 7 chapters, inspired by the Awwwards website [Atmos](https://atmos.leeroy.ca/).

Indi Watté · Capita selecta · October 2026

## How to run it

You need [Node.js](https://nodejs.org/) 20.19 or newer.

```sh
npm install
npm run dev
```

Open the link that appears in the terminal (usually http://localhost:5173) and **scroll** to move through the presentation.

## What's in it

| # | Chapter | What you see |
| --- | --- | --- |
| 0 | Intro | Title and the spaceship |
| 1 | What is R3F? | Code types itself out while a cube builds itself |
| 2 | Core features | Components, hooks, events, state, and the two ways to change a scene |
| 3 | Comparison | Atmos built twice (Three.js vs R3F), one effect in both, and alternatives |
| 4 | My research | My 7 research steps, with screenshots and recordings |
| 5 | The demo | A hangar with physics, controlled by React state |
| 6 | Conclusion | When to use R3F, strengths and weaknesses, what I learned, sources |

**Demo controls (chapter 5):** choose a shape (crate, ball, barrel), **Drop**, **Undo**, **Reset** and **Night mode**. Click an object to kick it. The panel on the left shows the React state live: every line in the list is one object in 3D.

## Project structure

```
src/
  main.jsx           starts the app
  Presentation.jsx   puts everything together (state, scene, buttons)
  chapters/          one file per chapter
  components/        reusable 3D pieces (Sky, Plane, CameraRig, Page, Media, …)
  ui/                HTML on top of the 3D (progress bar, data panel)
  data/              all chapter texts
  utils/             path maths and colors
  experiments/       my 5 library experiments
public/              3D models, videos and screenshots
```

## The experiments

During my research I tried the 5 most-used R3F libraries: drei, leva, rapier, postprocessing and gltfjsx. To view one, change the import in `src/main.jsx`, for example:

```js
import App from './experiments/RapierTest.jsx'
```

## Built with

React, React Three Fiber, drei, rapier (physics), postprocessing, leva, gltfjsx, maath and Vite.

## Important: pinned versions

`@react-three/fiber` is pinned to **9.7.0** and React to **19.2.9**. Version 9.8 of R3F breaks the scrolling of drei's `ScrollControls` (no error, the page just stops reacting to scroll). Please don't update these packages.

## Credits

- **Spaceship model:** "Spaceship" by [Quaternius](https://quaternius.com), Public Domain (CC0)
- **Inspiration:** Atmos by LEEROY ([Awwwards case study](https://www.awwwards.com/case-study-atmos.html)) and Wawa Sensei's R3F rebuild ([wawasensei.dev](https://wawasensei.dev))
- **Fonts:** Unbounded, Inter and JetBrains Mono (all free, via Fontsource)

The full list of sources are in my notion research pages
