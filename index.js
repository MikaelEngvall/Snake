// Select the game board canvas element from the DOM
const gameBoard = document.querySelector("#gameBoard");

// Get the 2D rendering context for drawing on the canvas
const ctx = gameBoard.getContext("2d");

// Select the score display element from the DOM
const scoreText = document.querySelector("#scoreText");

// Select the reset button element from the DOM
const resetBtn = document.querySelector("#resetBtn");

// Get the width and height of the game board canvas
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

// Define the background color of the game board
const boardBackground = "white";

// Define the snake's body color and border color
const snakeColor = "lightgreen";
const snakeBorder = "black";

// Define the food color
const foodColor = "red";

// Define the size of one unit (used for snake and food dimensions)
const unitSize = 25;

// Initialize game state variables
let running = false; // Indicates if the game is running
let xVelocity = unitSize; // Snake's horizontal movement velocity
let yVelocity = 0; // Snake's vertical movement velocity
let foodX; // X-coordinate of the food
let foodY; // Y-coordinate of the food
let score = 0; // Current score

// Define the initial snake body as an array of segments
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

// Add an event listener to capture keydown events for changing snake direction
window.addEventListener("keydown", changeDirection);

// Add a click event listener to the reset button for restarting the game
resetBtn.addEventListener("click", resetGame);

// Start the game
gameStart();

function gameStart() {
  // Set the game state to running
  running = true;

  // Display the initial score
  scoreText.textContent = score;

  // Generate a random position for the food
  createFood();

  // Draw the food on the canvas
  drawFood();

  // Start the game loop
  nextTick();
}

function nextTick() {
  // Continue the game loop if the game is running
  if (running) {
    setTimeout(() => {
      clearBoard(); // Clear the canvas
      drawFood(); // Redraw the food
      moveSnake(); // Update the snake's position
      drawSnake(); // Redraw the snake
      checkGameOver(); // Check if the game is over
      nextTick(); // Repeat the loop
    }, 125); // Set the game speed (125ms per frame)
  } else {
    // Display "Game Over" if the game is no longer running
    displayGameOver();
  }
}

function clearBoard() {
  // Fill the entire canvas with the background color to clear it
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
  // Generate a random coordinate for the food within the board boundaries
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize); // Random X-coordinate
  foodY = randomFood(0, gameWidth - unitSize); // Random Y-coordinate
}

function drawFood() {
  // Draw the food on the canvas as a red square
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
  // Create a new head based on the snake's velocity
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

  // Add the new head to the beginning of the snake array
  snake.unshift(head);

  // Check if the snake has eaten the food
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1; // Increment the score
    scoreText.textContent = score; // Update the score display
    createFood(); // Generate new food
  } else {
    // Remove the last segment of the snake to maintain its length
    snake.pop();
  }
}

function drawSnake() {
  // Draw each segment of the snake
  ctx.fillStyle = snakeColor; // Set snake body color
  ctx.strokeStyle = snakeBorder; // Set snake border color
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize); // Draw body
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize); // Draw border
  });
}

function changeDirection(event) {
  // Capture the key code of the pressed key
  const keyPressed = event.keyCode;

  // Define key codes for arrow keys
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  // Determine the snake's current direction
  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  // Change the snake's direction based on the key pressed, preventing reversal
  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameOver() {
  // Check if the snake collides with the wall
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }

  // Check if the snake collides with itself
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  // Display "Game Over" text in the center of the canvas
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false; // Stop the game
}

function resetGame() {
  // Reset game variables to their initial state
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart(); // Restart the game
}
