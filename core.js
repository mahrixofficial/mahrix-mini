// ===== MAHRIX CORE =====

function getBest(key) {
  return localStorage.getItem(key) || 0;
}

function setBest(key, value) {
  localStorage.setItem(key, value);
}

// JUICE
function flash(flashEl, type) {
  flashEl.className = "flash " + type + " show";

  setTimeout(() => {
    flashEl.className = "flash " + type;
  }, 100);
}

function shake(gameEl) {
  gameEl.classList.add("shake");
  setTimeout(() => gameEl.classList.remove("shake"), 250);
}

function pop(el) {
  el.classList.add("pop");
  setTimeout(() => el.classList.remove("pop"), 150);
}