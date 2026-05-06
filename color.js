const game = document.getElementById("game");
const wordEl = document.getElementById("word");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");

const overlay = document.getElementById("gameover-overlay");
const restartBtn = document.getElementById("restart-btn");

const flashEl = document.getElementById("flash");

let colors = ["red", "blue", "green", "yellow"];

let score = 0;
let best = getBest("mahrix_color_best");

let currentWord;
let currentColor;
let gameRunning = false;

bestEl.textContent = best;

function startGame() {
  gameRunning = true;
  score = 0;
  scoreEl.textContent = score;
  overlay.classList.add("hidden");

  nextRound();
}

function nextRound() {
  currentWord = colors[Math.floor(Math.random() * colors.length)];
  currentColor = colors[Math.floor(Math.random() * colors.length)];

  wordEl.textContent = currentWord.toUpperCase();
  wordEl.style.color = currentColor;
}

function handleInput(match) {
  if (!gameRunning) {
    startGame();
    return;
  }

  const isMatch = currentWord === currentColor;

  if (match === isMatch) {
    score++;
    scoreEl.textContent = score;

    pop(scoreEl);
    flash(flashEl, "success");

    nextRound();
  } else {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;

  flash(flashEl, "fail");
  shake(game);

  if (score > best) {
    best = score;
    setBest("mahrix_color_best", best);
    bestEl.textContent = best;
  }

  overlay.classList.remove("hidden");
}

restartBtn.addEventListener("click", startGame);

// INPUTS
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") handleInput(true);
  if (e.key === "ArrowRight") handleInput(false);
});

document.addEventListener("click", (e) => {
  const x = e.clientX;
  const mid = window.innerWidth / 2;

  if (x < mid) handleInput(true);
  else handleInput(false);
});