// Selects the HTML canvas element with the id "gameBoard" and assigns it to `gameBoard`.
const gameBoard = document.querySelector("#gameBoard");

// Gets the 2D rendering context of the canvas for drawing shapes and objects.
const ctx = gameBoard.getContext("2d");

// Selects the HTML element with the id "scoreText" to display the game score.
const scoreText = document.querySelector("#scoreText");

// Selects the HTML button element with the id "resetBtn" to reset the game when clicked.
const resetBtn = document.querySelector("#resetBtn");

// Stores the width of the canvas into the `gameWidth` variable.
const gameWidth = gameBoard.width;

// Stores the height of the canvas into the `gameHeight` variable.
const gameHeight = gameBoard.height;

// Sets the background color of the game board.
const boardBackground = "white";

// Sets the color of the snake.
const snakeColor = "lightgreen";

// Sets the color of the snake's border.
const snakeBorder = "black";

// Sets the color of the food.
const foodColor = "red";

// Defines the size of each unit (grid square) in the game.
const unitSize = 25;

// Boolean flag to indicate whether the game is currently running.
let running = false;

// Sets the snake's initial horizontal velocity (moving right by default).
let xVelocity = unitSize;

// Sets the snake's initial vertical velocity (not moving vertically by default).
let yVelocity = 0;

// Variables to store the food's x and y coordinates.
let foodX;
let foodY;

// Stores the player's score.
let score = 0;

// Array representing the snake as a list of coordinate objects (x, y positions).
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

// Adds an event listener to handle keyboard input for changing the snake's direction.
window.addEventListener("keydown", changeDirection);

// Adds an event listener to reset the game when the reset button is clicked.
resetBtn.addEventListener("click", resetGame);

// Starts the game.
gameStart();

// Initializes the game state and begins the main game loop.
function gameStart() {
  running = true; // Sets the game state to running.
  scoreText.textContent = score; // Displays the initial score.
  createFood(); // Generates the initial food position.
  drawFood(); // Draws the food on the game board.
  nextTick(); // Starts the game loop.
}

// Runs the game loop, which repeatedly updates the game state.
function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard(); // Clears the canvas for the next frame.
      drawFood(); // Draws the food on the board.
      moveSnake(); // Updates the snake's position.
      drawSnake(); // Draws the snake on the board.
      checkGameOver(); // Checks if the game is over.
      nextTick(); // Calls the next iteration of the game loop.
    }, 125); // Sets the game loop interval (speed of the snake).
  } else {
    displayGameOver(); // Displays the "Game Over" message if the game ends.
  }
}

// Clears
