const game = document.getElementById("game");
const bar = document.getElementById("bar");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");

const startOverlay = document.getElementById("start-overlay");
const gameoverOverlay = document.getElementById("gameover-overlay");
const restartBtn = document.getElementById("restart-btn");

const flashEl = document.getElementById("flash");

let angle = 0;
let velocity = 0;
let holding = false;

let gameRunning = false;
let score = 0;
let best = getBest("mahrix_balance_best");

let loop;
let scoreLoop;

bestEl.textContent = best;

/* START */
function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  angle = 0;
  velocity = 0;
  score = 0;

  scoreEl.textContent = score;

  startOverlay.classList.add("hidden");
  gameoverOverlay.classList.add("hidden");

  loop = requestAnimationFrame(update);

  scoreLoop = setInterval(() => {
    score++;
    scoreEl.textContent = score;
    pop(scoreEl);
  }, 200);
}

/* UPDATE */
function update() {
  if (!gameRunning) return;

  // physics
  if (holding) {
    velocity += 0.3;
  } else {
    velocity -= 0.3;
  }

  // natural instability
  velocity += (Math.random() - 0.5) * 0.2;

  angle += velocity;

  bar.style.transform = `rotate(${angle}deg)`;

  // lose condition
  if (angle > 45 || angle < -45) {
    gameOver();
  }

  loop = requestAnimationFrame(update);
}

/* GAME OVER */
function gameOver() {
  gameRunning = false;

  cancelAnimationFrame(loop);
  clearInterval(scoreLoop);

  flash(flashEl, "fail");
  shake(game);

  if (score > best) {
    best = score;
    setBest("mahrix_balance_best", best);
    bestEl.textContent = best;
  }

  gameoverOverlay.classList.remove("hidden");
}

/* INPUT */
function press() {
  if (!gameRunning) {
    startGame();
    return;
  }
  holding = true;
}

function release() {
  holding = false;
}

restartBtn.addEventListener("click", startGame);

document.addEventListener("mousedown", press);
document.addEventListener("mouseup", release);

document.addEventListener("touchstart", press);
document.addEventListener("touchend", release);

document.addEventListener("keydown", (e) => {
  if (e.key === " ") press();
});

document.addEventListener("keyup", (e) => {
  if (e.key === " ") release();
});