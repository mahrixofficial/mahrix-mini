const game = document.getElementById("game");
const player = document.getElementById("player");
const obstaclesContainer = document.getElementById("obstacles");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");

const startOverlay = document.getElementById("start-overlay");
const gameoverOverlay = document.getElementById("gameover-overlay");
const restartBtn = document.getElementById("restart-btn");

const flash = document.getElementById("flash");

let lane = 1;
let score = 0;
let best = localStorage.getItem("mahrix_best") || 0;

let gameRunning = false;
let speed = 4;

let gameLoop;
let scoreLoop;
let spawnTimeout;

// INIT
bestEl.textContent = best;
updatePlayer();

/* ======================
   PLAYER
====================== */
function updatePlayer() {
  player.className = "";
  player.classList.add(`lane-${lane}`);
}

function animatePlayer() {
  player.style.transform = "translateX(-50%) scale(0.9)";
  setTimeout(() => {
    player.style.transform = "translateX(-50%) scale(1)";
  }, 50);
}

function moveLeft() {
  if (lane > 0) {
    lane--;
    updatePlayer();
    animatePlayer();
  }
}

function moveRight() {
  if (lane < 2) {
    lane++;
    updatePlayer();
    animatePlayer();
  }
}

/* ======================
   GAME FLOW
====================== */
function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  speed = 4;

  scoreEl.textContent = score;

  startOverlay.classList.add("hidden");
  gameoverOverlay.classList.add("hidden");

  clearGame();

  startSpawning();
  gameLoop = requestAnimationFrame(updateGame);

  scoreLoop = setInterval(() => {
    score++;
    scoreEl.textContent = score;

    if (score % 10 === 0) speed += 0.5;
  }, 100);
}

function gameOver() {
  gameRunning = false;

  cancelAnimationFrame(gameLoop);
  clearInterval(scoreLoop);
  clearTimeout(spawnTimeout);

  triggerFlash("fail");
  shakeScreen();

  if (score > best) {
    best = score;
    localStorage.setItem("mahrix_best", best);
    bestEl.textContent = best;
  }

  gameoverOverlay.classList.remove("hidden");
}

function resetGame() {
  clearGame();
  startGame();
}

function clearGame() {
  obstaclesContainer.innerHTML = "";
}

/* ======================
   OBSTACLES
====================== */
function startSpawning() {
  if (!gameRunning) return;

  spawnObstacle();

  const delay = 600 + Math.random() * 500;
  spawnTimeout = setTimeout(startSpawning, delay);
}

function spawnObstacle() {
  const ob = document.createElement("div");
  ob.classList.add("obstacle");

  const obLane = Math.floor(Math.random() * 3);
  ob.dataset.lane = obLane;

  ob.style.left = getLanePosition(obLane);
  ob.style.top = "-50px";

  obstaclesContainer.appendChild(ob);
}

function getLanePosition(l) {
  if (l === 0) return "10%";
  if (l === 1) return "50%";
  return "90%";
}

/* ======================
   LOOP
====================== */
function updateGame() {
  if (!gameRunning) return;

  const playerTop = game.clientHeight - 60;
  const obstacles = document.querySelectorAll(".obstacle");

  obstacles.forEach(ob => {
    let top = parseFloat(ob.style.top);
    top += speed;
    ob.style.top = top + "px";

    if (
      parseInt(ob.dataset.lane) === lane &&
      top > playerTop - 20 &&
      top < playerTop + 20
    ) {
      gameOver();
    }

    if (top > game.clientHeight) {
      ob.remove();
    }
  });

  gameLoop = requestAnimationFrame(updateGame);
}

/* ======================
   JUICE
====================== */
function triggerFlash(type) {
  flash.className = "flash " + type + " show";

  setTimeout(() => {
    flash.className = "flash " + type;
  }, 100);
}

function shakeScreen() {
  game.classList.add("shake");
  setTimeout(() => game.classList.remove("shake"), 250);
}

/* ======================
   INPUTS
====================== */
document.addEventListener("keydown", (e) => {
  if (!gameRunning) startGame();

  if (e.key === "ArrowLeft" || e.key === "a") moveLeft();
  if (e.key === "ArrowRight" || e.key === "d") moveRight();
});

game.addEventListener("click", () => {
  if (!gameRunning) startGame();
});

game.addEventListener("touchstart", (e) => {
  if (!gameRunning) {
    startGame();
    return;
  }

  const x = e.touches[0].clientX;
  const mid = window.innerWidth / 2;

  if (x < mid) moveLeft();
  else moveRight();
});

restartBtn.addEventListener("click", resetGame);