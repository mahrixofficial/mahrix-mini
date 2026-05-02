const game = document.getElementById("game");
const player = document.getElementById("player");
const obstaclesContainer = document.getElementById("obstacles");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");

const startOverlay = document.getElementById("start-overlay");
const gameoverOverlay = document.getElementById("gameover-overlay");
const restartBtn = document.getElementById("restart-btn");

let lane = 1;
let score = 0;
let best = localStorage.getItem("mahrix_best") || 0;

let gameRunning = false;
let speed = 4;

let gameLoop;
let scoreLoop;
let spawnTimeout;

/* =========================
   INIT
========================= */

bestEl.textContent = best;
updatePlayer();

/* =========================
   PLAYER
========================= */

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

/* =========================
   GAME FLOW
========================= */

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

  clearTimeout(spawnTimeout);
  clearInterval(scoreLoop);
  cancelAnimationFrame(gameLoop);

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

/* =========================
   OBSTACLES
========================= */

function startSpawning() {
  if (!gameRunning) return;

  spawnObstacle();

  const delay = 600 + Math.random() * 500;
  spawnTimeout = setTimeout(startSpawning, delay);
}

function spawnObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const obstacleLane = Math.floor(Math.random() * 3);
  obstacle.dataset.lane = obstacleLane;
  obstacle.style.left = getLanePosition(obstacleLane);
  obstacle.style.top = "-50px";

  obstaclesContainer.appendChild(obstacle);
}

function getLanePosition(laneIndex) {
  if (laneIndex === 0) return "10%";
  if (laneIndex === 1) return "50%";
  return "90%";
}

/* =========================
   GAME LOOP
========================= */

function updateGame() {
  if (!gameRunning) return;

  const playerTop = game.clientHeight - 60;
  const obstacles = document.querySelectorAll(".obstacle");

  obstacles.forEach(ob => {
    let top = parseFloat(ob.style.top);
    top += speed;
    ob.style.top = top + "px";

    // COLLISION
    if (
      parseInt(ob.dataset.lane) === lane &&
      top > playerTop - 20 &&
      top < playerTop + 20
    ) {
      gameOver();
    }

    // REMOVE OFFSCREEN
    if (top > game.clientHeight) {
      ob.remove();
    }
  });

  gameLoop = requestAnimationFrame(updateGame);
}

/* =========================
   CONTROLS
========================= */

// Keyboard
document.addEventListener("keydown", (e) => {
  if (!gameRunning && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    startGame();
  }

  if (e.key === "ArrowLeft" || e.key === "a") moveLeft();
  if (e.key === "ArrowRight" || e.key === "d") moveRight();
});

// Touch
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

// Click
game.addEventListener("click", () => {
  if (!gameRunning) startGame();
});

// Restart
restartBtn.addEventListener("click", resetGame);