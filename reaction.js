const lights = document.querySelectorAll(".light");
const statusText = document.getElementById("status-text");

const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");

const overlay = document.getElementById("gameover-overlay");
const resultText = document.getElementById("result-text");
const restartBtn = document.getElementById("restart-btn");

let state = "idle"; // idle, countdown, go
let startTime = 0;
let best = localStorage.getItem("mahrix_reaction_best") || null;

bestEl.textContent = best ? best + " ms" : "--";

function startGame() {
  if (state !== "idle") return;

  resetLights();
  overlay.classList.add("hidden");

  state = "countdown";
  statusText.textContent = "Wait for green...";

  runLights(0);
}

function runLights(index) {
  if (index < lights.length) {
    lights[index].classList.add("active");

    setTimeout(() => {
      runLights(index + 1);
    }, 400);
  } else {
    // random delay before GO
    const delay = 800 + Math.random() * 1200;

    setTimeout(() => {
      triggerGo();
    }, delay);
  }
}

function triggerGo() {
  lights.forEach(l => {
    l.classList.remove("active");
    l.classList.add("go");
  });

  statusText.textContent = "GO!";
  state = "go";
  startTime = performance.now();
}

function handleTap() {
  if (state === "idle") {
    startGame();
    return;
  }

  if (state === "countdown") {
    // FALSE START
    endGame("Too Early!");
    return;
  }

  if (state === "go") {
    const reactionTime = Math.floor(performance.now() - startTime);
    timeEl.textContent = reactionTime + " ms";

    if (!best || reactionTime < best) {
      best = reactionTime;
      localStorage.setItem("mahrix_reaction_best", best);
      bestEl.textContent = best + " ms";
    }

    endGame(reactionTime + " ms");
  }
}

function endGame(text) {
  state = "idle";
  resultText.textContent = text;
  overlay.classList.remove("hidden");
}

function resetLights() {
  lights.forEach(l => {
    l.classList.remove("active", "go");
  });
}

// INPUTS
document.addEventListener("click", handleTap);
document.addEventListener("touchstart", handleTap);
document.addEventListener("keydown", (e) => {
  if (e.key === " ") handleTap();
});

restartBtn.addEventListener("click", startGame);