# Bricker - A Modern Breakout Game

A modern implementation of the classic Breakout game with smooth animations, score tracking, and combo system.

## Features

- Smooth gameplay with optimized performance
- Score tracking with combo system
- Event logging
- Pause/Resume functionality
- Modern UI with responsive design

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

The game will be available at `http://localhost:3000`

## Controls

- Mouse: Move paddle left/right
- ESC: Pause/Resume game

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── assets/         # Game assets (sprites, images)
├── js/
│   ├── core/      # Core game systems
│   ├── entities/  # Game entities (Ball, Paddle, Bricks)
│   └── skins/     # Visual styles for entities
├── index.html     # Main HTML file
└── package.json   # Project configuration
```

## Technologies Used

- Vanilla JavaScript
- HTML5 Canvas
- Vite for development and building 