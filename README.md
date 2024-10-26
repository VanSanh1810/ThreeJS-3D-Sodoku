# ThreeJS 3D Sodoku 

This project is a clone of the [Actual 3D Sudoku game](https://aaron-f-bianchi.itch.io/actual-3d-sudoku), inspired by the original version developed by Aaron. It brings a unique 3D twist to the classic Sudoku puzzle by using a cube-based format instead of a standard 2D grid. The game incorporates WebAssembly (WASM) to efficiently generate game puzzles, ensuring fast and reliable puzzle creation.

> Note: The project is not yet complete so it may cause some lag during play and I'm still trying to optimize it!

## Table of Contents
-   [Introduction](#Introduction)
-   [Features](#Features)
-   [Setup](#Setup)
-   [Instructions](#Instructions)

## Introduction
ThreeJS 3D Sudoku challenges players to complete a 3D Sudoku puzzle by rotating and positioning numbers on a cube, with WebAssembly providing high-performance puzzle generation. This addition speeds up game setup, delivering a smooth, optimized experience even for larger or more complex puzzles.

## Features

- 3D Puzzle Gameplay: Navigate and solve a Sudoku puzzle on a rotating 3D cube and solve like normal 2D sodoku on each axis plane.
- Efficient Puzzle Generation: WASM is used to handle puzzle generation, ensuring quick and randomized puzzles.
- Intuitive Controls: Rotate, zoom, and manipulate the cube for a clear view of each side.

## Setup
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Clone this repo 
```bash
  git clone https://github.com/VanSanh1810/ThreeJS-3D-Sodoku.git
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Navigate to the project directory
```bash
  cd ThreeJS-3D-Sodoku
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Install dependencies
```bash
  npm i
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. Start the game
```bash
  npm run dev
```

> If you want to modify the wasm, you need to install the [Emscripten](https://emscripten.org) tools to compile the c code to wasm. The origin is locate at public/wasm

## Instructions

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Goal: Place numbers on each side of the cube, ensuring no duplicate numbers appear in any row, column, or 3x3 sub-grid.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Controls:
- Hold and move left mouse to change the view angle.
- Click left mouse to select one cell, use with CTRL for multiple selection.
- Hold and move right mouse to zoom
- Q and W to slice on X axis
- A and S to slice on Y axis
- Z and X to slice on Z axis
- Click 2D view button to switch to current slice view
- Click 3D view to exit the 2D view
- Clear cell to clear the data of selected cells, deletion order is number -> clue
- P to toggle fill mode (CLUE or VALUE)