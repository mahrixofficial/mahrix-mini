const bar = document.getElementById("bar");
const target = document.getElementById("target");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");

const startOverlay = document.getElementById("start-overlay");
const gameoverOverlay = document.getElementById("gameover-overlay");
const restartBtn = document.getElementById("restart-btn");

let position = 0;
let direction = 1;
let speed = 2;

let gameRunning = false;
let score = 0;
let best = localStorage.getItem("mahrix_timing_best") || 0;

let loop;

// INIT BEST
bestEl.textContent = best;

// START
function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  speed = 2;

  position = 0;
  direction = 1;

  scoreEl.textContent = score;

  startOverlay.classList.add("hidden");
  gameoverOverlay.classList.add("hidden");

  loop = requestAnimationFrame(update);
}

// UPDATE LOOP
function update() {
  if (!gameRunning) return;

  position += speed * direction;

  if (position >= 100) {
    position = 100;
    direction = -1;
  }

  if (position <= 0) {
    position = 0;
    direction = 1;
  }

  bar.style.left = position + "%";

  loop = requestAnimationFrame(update);
}

// STOP (player input)
function stopBar() {
  if (!gameRunning) {
    startGame();
    return;
  }

  const barRect = bar.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const isInside =
    barRect.left >= targetRect.left &&
    barRect.right <= targetRect.right;

  if (isInside) {
    // SUCCESS
    score++;
    scoreEl.textContent = score;

    speed += 0.3; // harder

    // reset bar
    position = 0;
    direction = 1;

  } else {
    gameOver();
  }
}

// GAME OVER
function gameOver() {
  gameRunning = false;
  cancelAnimationFrame(loop);

  if (score > best) {
    best = score;
    localStorage.setItem("mahrix_timing_best", best);
    bestEl.textContent = best;
  }

  gameoverOverlay.classList.remove("hidden");
}

// RESTART
function resetGame() {
  startGame();
}

// INPUTS

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter") stopBar();
});

document.addEventListener("click", stopBar);
document.addEventListener("touchstart", stopBar);

restartBtn.addEventListener("click", resetGame);