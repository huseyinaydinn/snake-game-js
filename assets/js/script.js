const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const hightScoreElement = document.querySelector('.high-score');

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;

let hightScore = localStorage.getItem('high-score') || 0;
hightScoreElement.innerHTML = `High Score: ${hightScore}`;

function changeFoodPosition() {
  // Passing a random 0 - 30 value as food position
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
  // clearing the timer and reloading the page on game over.
  clearInterval(setIntervalId);
  alert('Game Over! Press OK to replay');
  location.reload();
};

const changeDirection = (e) => {
  if (e.key === 'ArrowUp' && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === 'ArrowDown' && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === 'ArrowLeft' && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === 'ArrowRight' && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  //checking if snake hit the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // pushing food position to snake body array
    score++;

    hightScore = score >= hightScore ? score : hightScore;
    localStorage.setItem('high-score', hightScore);
    scoreElement.innerHTML = `Score: ${score}`;
    hightScoreElement.innerHTML = `High Score: ${hightScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // shifting forward the values of the elements in the snake body by one
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; // setting first element of snake body to current snake position

  // updating the snake's head position based on the currently velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // Updating the snake's head is out of the wall, if so settings gameOver to true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // adding a div for each part of the snake's body
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // checking if the snake head hit the body, if so set game over to true
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 150);
document.addEventListener('keydown', changeDirection);
