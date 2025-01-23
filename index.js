// Constants for game configuration
const CONFIG = {
  boardBackground: "white",
  snakeColor: "lightgreen",
  snakeBorder: "black",
  foodColor: "red",
  unitSize: 25,
  gameSpeed: 125,
};

// Add a reference to the pause button
const pauseBtn = document.getElementById("pauseBtn");

// DOM Elements
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// Modify the pause button logic
pauseBtn.addEventListener("click", () => {
  if (state.paused) {
    // Resume the game
    state.paused = false;
    pauseBtn.textContent = "⏸ Pause";
    gameLoop(); // Resume the game loop
  } else {
    // Pause the game
    state.paused = true;
    pauseBtn.textContent = "▶️ Resume";
  }
});

// Game State
const state = {
  running: false,
  paused: false,
  xVelocity: CONFIG.unitSize,
  yVelocity: 0,
  foodX: 0,
  foodY: 0,
  score: 0,
  snake: [],
};

// Initialize the game
function initializeGame() {
  resetGame();
  resetBtn.addEventListener("click", resetGame);
  window.addEventListener("keydown", handleKeyDown);
  upBtn.addEventListener("click", () => handleDirectionChange(38));
  downBtn.addEventListener("click", () => handleDirectionChange(40));
  leftBtn.addEventListener("click", () => handleDirectionChange(37));
  rightBtn.addEventListener("click", () => handleDirectionChange(39));
}

// Reset the game state
function resetGame() {
  state.running = true;
  state.paused = false;
  state.xVelocity = CONFIG.unitSize;
  state.yVelocity = 0;
  state.score = 0;
  state.snake = [
    { x: CONFIG.unitSize * 4, y: 0 },
    { x: CONFIG.unitSize * 3, y: 0 },
    { x: CONFIG.unitSize * 2, y: 0 },
    { x: CONFIG.unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  updateScore(0);
  createFood();
  drawFood();
  gameLoop();
}

// Main game loop
function gameLoop() {
  if (!state.running) {
    displayGameOver();
    return;
  }

  if (!state.paused) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkCollision();
      gameLoop(); // Recursively call the game loop
    }, CONFIG.gameSpeed);
  }
}

// Draw and clear board
function clearBoard() {
  ctx.fillStyle = CONFIG.boardBackground;
  ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
}

// Handle food creation and drawing
function createFood() {
  const randomCoordinate = (min, max) =>
    Math.round((Math.random() * (max - min) + min) / CONFIG.unitSize) *
    CONFIG.unitSize;

  state.foodX = randomCoordinate(0, gameBoard.width - CONFIG.unitSize);
  state.foodY = randomCoordinate(0, gameBoard.height - CONFIG.unitSize);
}

function drawFood() {
  ctx.fillStyle = CONFIG.foodColor;
  ctx.fillRect(state.foodX, state.foodY, CONFIG.unitSize, CONFIG.unitSize);
}

// Handle snake movement and drawing
function moveSnake() {
  const head = {
    x: state.snake[0].x + state.xVelocity,
    y: state.snake[0].y + state.yVelocity,
  };

  state.snake.unshift(head);

  // Check if food is eaten
  if (head.x === state.foodX && head.y === state.foodY) {
    updateScore(state.score + 1);
    createFood();
  } else {
    state.snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = CONFIG.snakeColor;
  ctx.strokeStyle = CONFIG.snakeBorder;
  state.snake.forEach((part) => {
    ctx.fillRect(part.x, part.y, CONFIG.unitSize, CONFIG.unitSize);
    ctx.strokeRect(part.x, part.y, CONFIG.unitSize, CONFIG.unitSize);
  });
}

// Handle score updates with animation
function updateScore(newScore) {
  state.score = newScore;
  scoreText.textContent = newScore;
  scoreText.classList.add("score-pop");
  setTimeout(() => scoreText.classList.remove("score-pop"), 400);
}

// Handle direction changes
function handleKeyDown(event) {
  handleDirectionChange(event.keyCode);
}

function handleDirectionChange(keyCode) {
  const { xVelocity, yVelocity } = state;
  const goingUp = yVelocity === -CONFIG.unitSize;
  const goingDown = yVelocity === CONFIG.unitSize;
  const goingRight = xVelocity === CONFIG.unitSize;
  const goingLeft = xVelocity === -CONFIG.unitSize;

  switch (true) {
    case keyCode === 37 && !goingRight: // Left
      state.xVelocity = -CONFIG.unitSize;
      state.yVelocity = 0;
      break;
    case keyCode === 38 && !goingDown: // Up
      state.xVelocity = 0;
      state.yVelocity = -CONFIG.unitSize;
      break;
    case keyCode === 39 && !goingLeft: // Right
      state.xVelocity = CONFIG.unitSize;
      state.yVelocity = 0;
      break;
    case keyCode === 40 && !goingUp: // Down
      state.xVelocity = 0;
      state.yVelocity = CONFIG.unitSize;
      break;
  }
}

// Check collisions with the wall or itself
function checkCollision() {
  const head = state.snake[0];

  // Check wall collisions
  if (
    head.x < 0 ||
    head.x >= gameBoard.width ||
    head.y < 0 ||
    head.y >= gameBoard.height
  ) {
    state.running = false;
  }

  // Check self-collision
  for (let i = 1; i < state.snake.length; i++) {
    if (state.snake[i].x === head.x && state.snake[i].y === head.y) {
      state.running = false;
    }
  }
}

// Display "Game Over" message
function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameBoard.width / 2, gameBoard.height / 2);
}

// Initialize the game on page load
initializeGame();
