// ===========================
// CANVAS
// ===========================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// ===========================
// RESIZE RESPONSIVE NES
// ===========================

const BASE_WIDTH = 256;
const BASE_HEIGHT = 240;

function resize() {

  // resolución interna fija tipo NES
  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;

  // escala proporcional
  const scale = Math.min(
    window.innerWidth / BASE_WIDTH,
    window.innerHeight / BASE_HEIGHT
  );

  canvas.style.width = BASE_WIDTH * scale + "px";
  canvas.style.height = BASE_HEIGHT * scale + "px";

  // centrar pantalla
  canvas.style.position = "absolute";
  canvas.style.left = "50%";
  canvas.style.top = "50%";
  canvas.style.transform = "translate(-50%, -50%)";
}

window.addEventListener("resize", resize);
resize();

window.addEventListener("resize", resize);
resize();

// ===========================
// AUDIO
// ===========================
const music = document.getElementById("bgmusic");
music.volume = 0.3;

// ===========================
// GAME STATE
// ===========================
/*
start -> countdown -> play
play: free movement, chest exists, if reaches chest => question
question -> yesPath OR battle
battle -> victoryReward -> heartScene -> play (free again)
yesPath -> heartScene -> play
*/
let state = "start";
let countdown = 3;
let countdownAcc = 0;
let titleAngle = 0;

function resetGame() {
  state = "start";
  countdown = 3;
  countdownAcc = 0;
  link.x = 200;
  link.y = 200;
  link.freeze = false;
  chest.open = false;
  chest.asked = false;
  enemies = [];
}

// ===========================
// PIXEL CONFIG
// ===========================
const PIXEL = 6;          // tamaño de "pixel" del juego
const TILE = 12;          // tile base (para árboles/cofre)
const UI_SCALE = 1;       // por si luego quieres crecer texto UI

// ===========================
// SIMPLE PIXEL FONT (mayúsculas + números básicos)
// ===========================
const FONT = {
  A: ["010","101","111","101","101"],
  B: ["110","101","110","101","110"],
  C: ["011","100","100","100","011"],
  D: ["110","101","101","101","110"],
  E: ["111","110","100","110","111"],
  F: ["111","110","100","110","100"],
  G: ["011","100","101","101","011"],
  H: ["101","101","111","101","101"],
  I: ["111","010","010","010","111"],
  J: ["111","001","001","101","010"],
  K: ["101","110","100","110","101"],
  L: ["100","100","100","100","111"],
  M: ["101","111","111","101","101"],
  N: ["101","111","111","111","101"],
  O: ["010","101","101","101","010"],
  P: ["110","101","110","100","100"],
  Q: ["010","101","101","111","011"],
  R: ["110","101","110","110","101"],
  S: ["011","110","010","011","110"],
  T: ["111","010","010","010","010"],
  U: ["101","101","101","101","111"],
  V: ["101","101","101","101","010"],
  W: ["101","101","111","111","101"],
  X: ["101","101","010","101","101"],
  Y: ["101","101","010","010","010"],
  Z: ["111","001","010","100","111"],
  "0": ["111","101","101","101","111"],
  "1": ["010","110","010","010","111"],
  "2": ["111","001","111","100","111"],
  "3": ["111","001","111","001","111"],
  "4": ["101","101","111","001","001"],
  "5": ["111","100","111","001","111"],
  "6": ["111","100","111","101","111"],
  "7": ["111","001","010","010","010"],
  "8": ["111","101","111","101","111"],
  "9": ["111","101","111","001","111"],
  " ": ["0","0","0","0","0"],
  ".": ["0","0","0","0","1"],
  "?": ["111","001","011","000","010"],
  "!": ["1","1","1","0","1"],
  ":": ["0","1","0","1","0"],
  "¿": ["010","000","110","001","111"], // aproximación
  ",": ["0","0","0","1","1"],
};

function drawPixelText(text, x, y, color = "#aaffcc", scale = 2) {
  text = String(text).toUpperCase();
  const charW = 3 * scale;
  const charH = 5 * scale;
  const gap = 1 * scale;

  let cursorX = x;
  for (const ch of text) {
    const glyph = FONT[ch] || FONT[" "];
    for (let r = 0; r < glyph.length; r++) {
      for (let c = 0; c < glyph[r].length; c++) {
        if (glyph[r][c] === "1") {
          ctx.fillStyle = color;
          ctx.fillRect(cursorX + c * scale, y + r * scale, scale, scale);
        }
      }
    }
    cursorX += charW + gap;
  }
}

function drawCenteredText(lines, yStart, color = "#aaffcc", scale = 3, lineGap = 10) {
  const arr = Array.isArray(lines) ? lines : [lines];
  arr.forEach((line, i) => {
    const linePx = (line.length * (3 * scale + 1 * scale)) - (1 * scale);
    const x = Math.floor(canvas.width / 2 - linePx / 2);
    const y = yStart + i * (5 * scale + lineGap);
    drawPixelText(line, x, y, color, scale);
  });
}


function draw3DTitle(dt) {
  titleAngle += dt * 1.1;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 120;

  const text = "THE LEGEND OF ???";

  ctx.save();
  ctx.translate(centerX, centerY);

  // Rotación eje Y simulada
  const scaleX = 0.85 + Math.cos(titleAngle) * 0.25;
  ctx.scale(scaleX, 1);

  // Movimiento flotante vertical
  const floatY = Math.sin(titleAngle * 2) * 10;
  ctx.translate(0, floatY);

  // ===== PROFUNDIDAD 3D (extrusión falsa) =====
  const depthLayers = 8;
  for (let i = depthLayers; i > 0; i--) {
    ctx.fillStyle = `rgba(60, 40, 10, ${0.4 + i * 0.05})`;
    drawPixelText(
      text,
      -420 + i * 3,
      i * 3,
      "#3b2a0a",
      8
    );
  }

  // ===== CONTORNO OSCURO =====
  drawPixelText(text, -420 - 4, 0, "#000000", 8);
  drawPixelText(text, -420 + 4, 0, "#000000", 8);
  drawPixelText(text, -420, -4, "#000000", 8);
  drawPixelText(text, -420, 4, "#000000", 8);

  // ===== TEXTO PRINCIPAL DORADO =====
  const goldPulse = 200 + Math.sin(titleAngle * 3) * 30;
  const goldColor = `rgb(${goldPulse}, ${goldPulse - 40}, 0)`;

  drawPixelText(text, -420, 0, goldColor, 8);

  // ===== BRILLO SUPERIOR =====
  ctx.globalAlpha = 0.3;
  drawPixelText(text, -420, -6, "#ffffff", 8);
  ctx.globalAlpha = 1;

  ctx.restore();
}



// ===========================
// WORLD: bosque pixel con árboles + partículas
// ===========================
let particles = Array.from({ length: 90 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  s: 1 + Math.random() * 2,
  v: 10 + Math.random() * 25,
}));

function drawForest(dt) {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#021a0f");
  g.addColorStop(1, "#063d24");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ccffcc";
  ctx.beginPath();
  ctx.arc(canvas.width - 140, 110, 40, 0, Math.PI * 2);
  ctx.fill();

  for (let x = 0; x < canvas.width + 100; x += 140) {
    drawTree(x, canvas.height - 260, 0.7);
  }
  for (let x = 60; x < canvas.width + 100; x += 120) {
    drawTree(x, canvas.height - 210, 1);
  }

  for (const p of particles) {
    p.y -= p.v * dt;
    if (p.y < -10) {
      p.y = canvas.height + 10;
      p.x = Math.random() * canvas.width;
    }
    ctx.fillStyle = "#aaffcc";
    ctx.fillRect(p.x, p.y, p.s, p.s);
  }
}

function drawTree(x, y, scale = 1) {
  const trunkW = 3 * TILE * scale;
  const trunkH = 6 * TILE * scale;
  const crownR = 4 * TILE * scale;

  ctx.fillStyle = "#0b5d2a";
  ctx.fillRect(x, y, trunkW, trunkH);

  ctx.fillStyle = "#0e7a35";
  ctx.fillRect(x - crownR / 2, y - crownR / 2, trunkW + crownR, crownR);
  ctx.fillRect(x - crownR / 3, y - crownR, trunkW + (2 * crownR) / 3, crownR);
  ctx.fillRect(x, y - (3 * crownR) / 2, trunkW, crownR);
}

// ===========================
// LINK (pixel art generado): 2 frames
// ===========================
const P = {
  0: null,
  1: "#2ecc71",
  2: "#f1c27d",
  3: "#000000",
  4: "#8b4513",
  5: "#145214",
  6: "#ffffff",
  7: "#ff0000",
  8: "#ff69b4",
};

const LINK_IDLE = [
  [0,0,3,3,3,0,0],
  [0,3,1,1,1,3,0],
  [3,1,2,2,2,1,3],
  [3,1,2,2,2,1,3],
  [0,4,0,4,0,4,0],
  [0,4,0,4,0,4,0],
];

const LINK_WALK = [
  [0,0,3,3,3,0,0],
  [0,3,1,1,1,3,0],
  [3,1,2,2,2,1,3],
  [3,1,2,2,2,1,3],
  [0,4,4,0,4,4,0],
  [0,4,0,4,0,4,0],
];

const LINK_VICTORY = [
  [0,0,6,0,0,0,0],
  [0,0,6,0,0,0,0],
  [0,0,3,3,3,0,0],
  [0,3,1,1,1,3,0],
  [3,1,2,2,2,1,3],
  [0,4,0,4,0,4,0],
  [0,4,0,4,0,4,0],
];

function drawMatrix(sprite, x, y, pixelSize = 8) {
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < sprite[r].length; c++) {
      const v = sprite[r][c];
      if (v !== 0 && v !== null) {
        ctx.fillStyle = P[v];
        ctx.fillRect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

const link = {
  x: 200,
  y: 200,
  speed: 220,
  frame: 0,
  frameAcc: 0,
  freeze: false,
};

// ===========================
// CHEST (pixel art): cerrado / abierto
// ===========================
const CHEST_CLOSED = [
  [3,3,3,3,3,3],
  [3,1,1,1,1,3],
  [3,1,2,2,1,3],
  [3,1,1,1,1,3],
  [3,3,3,3,3,3],
];
const CHEST_OPEN = [
  [3,3,3,3,3,3],
  [3,0,0,0,0,3],
  [3,1,2,2,1,3],
  [3,1,1,1,1,3],
  [3,3,3,3,3,3],
];
const C = { 0: null, 1: "#8b4513", 2: "#f8e16c", 3: "#000000" };

function drawChest(open, x, y, pixelSize = 10) {
  const spr = open ? CHEST_OPEN : CHEST_CLOSED;
  for (let r = 0; r < spr.length; r++) {
    for (let c = 0; c < spr[r].length; c++) {
      const v = spr[r][c];
      if (v !== 0 && v !== null) {
        ctx.fillStyle = C[v];
        ctx.fillRect(x + c * pixelSize, y + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }
}

const chest = { x: 0, y: 0, open: false, asked: false };

function placeChest() {
  chest.x = canvas.width - 220;
  chest.y = canvas.height - 260;
}
placeChest();
window.addEventListener("resize", placeChest);

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// ===========================
// INPUT (PC + MOBILE NES BUTTONS)
// ===========================
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false
};

// PC keyboard
window.addEventListener("keydown", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    keys[e.key] = false;
  }
});

// NES touch buttons layout
const touchButtons = {
  left:  {x:0,y:0,size:72, pressed:false},
  right: {x:0,y:0,size:72, pressed:false},
  up:    {x:0,y:0,size:72, pressed:false},
  down:  {x:0,y:0,size:72, pressed:false},
};

function layoutTouchButtons() {
  const baseY = canvas.height - 150;
  touchButtons.left.x = 45;  touchButtons.left.y = baseY;
  touchButtons.right.x = 195; touchButtons.right.y = baseY;
  touchButtons.up.x = 120;    touchButtons.up.y = baseY - 90;
  touchButtons.down.x = 120;  touchButtons.down.y = baseY;
}
layoutTouchButtons();
window.addEventListener("resize", layoutTouchButtons);

function resetTouchPressed() {
  for (const k in touchButtons) touchButtons[k].pressed = false;
  keys.ArrowLeft = keys.ArrowRight = keys.ArrowUp = keys.ArrowDown = false;
}

function touchHit(dir, mx, my) {
  const b = touchButtons[dir];
  return mx >= b.x && mx <= b.x + b.size && my >= b.y && my <= b.y + b.size;
}

function applyTouchState(mx, my) {
  // limpiar
  resetTouchPressed();

  // set pressed según posición
  if (touchHit("left", mx, my))  { touchButtons.left.pressed = true;  keys.ArrowLeft = true; }
  if (touchHit("right", mx, my)) { touchButtons.right.pressed = true; keys.ArrowRight = true; }
  if (touchHit("up", mx, my))    { touchButtons.up.pressed = true;    keys.ArrowUp = true; }
  if (touchHit("down", mx, my))  { touchButtons.down.pressed = true;  keys.ArrowDown = true; }
}

// IMPORTANT: prevent page scroll on mobile while touching the canvas
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const mx = t.clientX - rect.left;
  const my = t.clientY - rect.top;

  // START SCREEN
  if (state === "start") {
    music.play().catch(()=>{});
    state = "countdown";
    countdown = 3;
    countdownAcc = 0;
    return;
  }

  // QUESTION (YES / NO)
  if (state === "question") {
    if (pointInRect(mx, my, ui.yesBtn.x, ui.yesBtn.y, ui.yesBtn.w, ui.yesBtn.h)) {
      triggerYes();
      return;
    }
    if (pointInRect(mx, my, ui.noBtn.x, ui.noBtn.y, ui.noBtn.w, ui.noBtn.h)) {
      triggerNo();
      return;
    }
  }

  // BATTLE
  if (state === "battle") {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const en = enemies[i];
      if (pointInRect(mx, my, en.x, en.y, en.size, en.size)) {
        enemies.splice(i, 1);
        break;
      }
    }

    if (enemies.length === 0) {
      startVictoryReward("WOW, ERES MUY VALIENTE", "DE RECOMPENSA TEN MI CORAZON :3");
    }
  }

  // HEART (RESTART)
  if (state === "heart") {
    if (pointInRect(mx, my, restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h)) {
      resetGame();
      return;
    }
  }

  // NES movement buttons
  applyTouchState(mx, my);

}, { passive: false });


canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const mx = t.clientX - rect.left;
  const my = t.clientY - rect.top;
  applyTouchState(mx, my);
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  resetTouchPressed();
}, { passive: false });

function drawNESButton(btn, direction) {
  const s = btn.size;
  const x = btn.x;
  const y = btn.y;

  // sombra/borde exterior
  ctx.fillStyle = "#000000";
  ctx.fillRect(x - 5, y - 5, s + 10, s + 10);

  // estado presionado: un poco más oscuro y "hundido"
  const pressed = !!btn.pressed;
  const inset = pressed ? 3 : 0;

  // fondo
  ctx.fillStyle = pressed ? "#0a5f2a" : "#0e7a35";
  ctx.fillRect(x + inset, y + inset, s - inset, s - inset);

  // borde interior
  ctx.strokeStyle = "#aaffcc";
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 3 + inset, y + 3 + inset, s - 6 - inset, s - 6 - inset);

  // flecha pixel
  ctx.fillStyle = "#ffffff";
  const cx = x + s / 2 + inset;
  const cy = y + s / 2 + inset;
  const p = 8;

  if (direction === "left") {
    ctx.fillRect(cx - p*2, cy, p*2, p);
    ctx.fillRect(cx - p*2, cy - p, p, p);
    ctx.fillRect(cx - p*2, cy + p, p, p);
  }
  if (direction === "right") {
    ctx.fillRect(cx, cy, p*2, p);
    ctx.fillRect(cx + p, cy - p, p, p);
    ctx.fillRect(cx + p, cy + p, p, p);
  }
  if (direction === "up") {
    ctx.fillRect(cx, cy - p*2, p, p*2);
    ctx.fillRect(cx - p, cy - p*2, p, p);
    ctx.fillRect(cx + p, cy - p*2, p, p);
  }
  if (direction === "down") {
    ctx.fillRect(cx, cy, p, p*2);
    ctx.fillRect(cx - p, cy + p, p, p);
    ctx.fillRect(cx + p, cy + p, p, p);
  }
}

function drawTouchButtonsIfMobile() {
  // no molestamos en desktop (pero si quieres que se vean siempre, quita este if)
  const isTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  if (!isTouch) return;

  drawNESButton(touchButtons.left, "left");
  drawNESButton(touchButtons.right, "right");
  drawNESButton(touchButtons.up, "up");
  drawNESButton(touchButtons.down, "down");
}

// ===========================
// click gameplay: start + battle hit + buttons (yes/no)
// ===========================
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (state === "start") {
    music.play().catch(()=>{});
    state = "countdown";
    countdown = 3;
    countdownAcc = 0;
    return;
  }

  if (state === "question") {
    if (pointInRect(mx, my, ui.yesBtn.x, ui.yesBtn.y, ui.yesBtn.w, ui.yesBtn.h)) {
      triggerYes();
      return;
    }
    if (pointInRect(mx, my, ui.noBtn.x, ui.noBtn.y, ui.noBtn.w, ui.noBtn.h)) {
      triggerNo();
      return;
    }
  }

  if (state === "battle") {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const en = enemies[i];
      if (pointInRect(mx, my, en.x, en.y, en.size, en.size)) {
        enemies.splice(i, 1);
        break;
      }
    }
    if (enemies.length === 0) {
      startVictoryReward("WOW, ERES MUY VALIENTE", "DE RECOMPENSA TEN MI CORAZON :3");
    }
  }

  if (state === "heart") {
    if (pointInRect(mx, my, restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h)) {
      resetGame();
    }
  }

});

function pointInRect(px, py, x, y, w, h) {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}

// ===========================
// UI BUTTONS (YES / NO pixel)
// ===========================
const ui = {
  yesBtn: { x: 0, y: 0, w: 170, h: 60 },
  noBtn:  { x: 0, y: 0, w: 170, h: 60 },
};

function layoutQuestionUI() {
  const midX = canvas.width / 2;
  const baseY = canvas.height / 2 + 80;
  ui.yesBtn.x = midX - 190;
  ui.yesBtn.y = baseY;
  ui.noBtn.x  = midX + 20;
  ui.noBtn.y  = baseY;
}
layoutQuestionUI();
window.addEventListener("resize", layoutQuestionUI);

function drawButton(btn, label) {
  ctx.fillStyle = "#0b5d2a";
  ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
  ctx.strokeStyle = "#aaffcc";
  ctx.lineWidth = 3;
  ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

  const scale = 3;
  const linePx = (label.length * (3 * scale + 1 * scale)) - (1 * scale);
  const tx = Math.floor(btn.x + btn.w/2 - linePx/2);
  const ty = Math.floor(btn.y + 18);
  drawPixelText(label, tx, ty, "#aaffcc", scale);
}
// ===========================
// RESTART BUTTON
// ===========================
const restartBtn = { x: 0, y: 0, w: 260, h: 70 };

function layoutRestartBtn() {
  restartBtn.x = canvas.width / 2 - restartBtn.w / 2;
  restartBtn.y = canvas.height - 120;
}
layoutRestartBtn();
window.addEventListener("resize", layoutRestartBtn);

function drawRestartButton() {
  ctx.fillStyle = "#0b5d2a";
  ctx.fillRect(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h);

  ctx.strokeStyle = "#aaffcc";
  ctx.lineWidth = 4;
  ctx.strokeRect(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h);

  const label = "VOLVER A COMENZAR";
  const scale = 3;
  const linePx = (label.length * (3 * scale + 1 * scale)) - (1 * scale);
  const tx = Math.floor(restartBtn.x + restartBtn.w/2 - linePx/2);
  const ty = restartBtn.y + 20;

  drawPixelText(label, tx, ty, "#aaffcc", scale);
}





// ===========================
// ENEMIES (mezcla): bat, slime, flame (2 frames cada uno)
// ===========================
const ENEMY_TYPES = ["bat", "slime", "flame"];

const BAT1 = [
  [0,1,0,1,0],
  [1,1,1,1,1],
  [1,2,1,2,1],
  [1,1,1,1,1]
];
const BAT2 = [
  [1,0,0,0,1],
  [1,1,1,1,1],
  [0,2,1,2,0],
  [0,1,1,1,0]
];

const SLIME1 = [
  [0,3,3,3,0],
  [3,2,2,2,3],
  [3,2,1,2,3],
  [0,3,3,3,0]
];
const SLIME2 = [
  [0,3,3,3,0],
  [3,2,2,2,3],
  [3,1,2,1,3],
  [0,3,3,3,0]
];

const FLAME1 = [
  [0,0,3,0,0],
  [0,3,2,3,0],
  [3,2,2,2,3],
  [0,3,2,3,0],
  [0,0,3,0,0],
];
const FLAME2 = [
  [0,3,0,3,0],
  [3,2,3,2,3],
  [0,3,2,3,0],
  [0,0,3,0,0],
  [0,0,3,0,0],
];

const EP = {
  0: null,
  1: "#8b0000",
  2: "#ffcc00",
  3: "#aaffcc",
};

function drawEnemyMatrix(m, x, y, px) {
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      const v = m[r][c];
      if (v) {
        ctx.fillStyle = EP[v];
        ctx.fillRect(x + c*px, y + r*px, px, px);
      }
    }
  }
}

let enemies = [];
function spawnEnemies() {
  enemies = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
    enemies.push({
      type,
      x: 80 + Math.random() * (canvas.width - 160),
      y: 140 + Math.random() * (canvas.height - 220),
      vx: (Math.random() < 0.5 ? -1 : 1) * (40 + Math.random()*80),
      vy: (Math.random() < 0.5 ? -1 : 1) * (40 + Math.random()*80),
      frame: 0,
      acc: 0,
      size: 54,
      px: 10,
    });
  }
}

function updateEnemies(dt) {
  for (const en of enemies) {
    en.acc += dt;
    if (en.acc > 0.22) {
      en.frame = en.frame === 0 ? 1 : 0;
      en.acc = 0;
    }
    en.x += en.vx * dt;
    en.y += en.vy * dt;

    if (en.x < 20 || en.x > canvas.width - en.size - 20) en.vx *= -1;
    if (en.y < 90 || en.y > canvas.height - en.size - 20) en.vy *= -1;
  }
}

function drawEnemies() {
  for (const en of enemies) {
    let m;
    if (en.type === "bat")   m = en.frame === 0 ? BAT1 : BAT2;
    if (en.type === "slime") m = en.frame === 0 ? SLIME1 : SLIME2;
    if (en.type === "flame") m = en.frame === 0 ? FLAME1 : FLAME2;

    drawEnemyMatrix(m, en.x, en.y, en.px);

    ctx.fillStyle = "rgba(170,255,204,0.15)";
    ctx.fillRect(en.x-6, en.y-6, en.size+12, en.size+12);
  }
}

// ===========================
// HEART SCENE
// ===========================
let heartPulse = 0;
let heartLines = [];
let heartMessageTimer = 0;

function drawHeart(dt) {
  heartPulse += dt * 3;
  const scale = 1 + Math.sin(heartPulse) * 0.18;

  const heart = [
    [0,1,0,1,0],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [0,1,1,1,0],
    [0,0,1,0,0]
  ];

  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2 - 30);
  ctx.scale(scale*18, scale*18);

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#ff69b4";
  ctx.fillRect(-6, -6, 12, 12);
  ctx.globalAlpha = 1;

  for (let r = 0; r < heart.length; r++) {
    for (let c = 0; c < heart[r].length; c++) {
      if (heart[r][c] === 1) {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(c - 2, r - 2, 1, 1);
      }
    }
  }
  ctx.restore();

  drawCenteredText(heartLines, Math.floor(canvas.height/2 + 130), "#aaffcc", 3, 14);
}

// ===========================
// YES / NO FLOW
// ===========================
function triggerYes() {
  startVictoryReward("TE AMO", "GRACIAS POR HACER MI VALENTINE MUY ESPECIAL :3");
}

function triggerNo() {
  spawnEnemies();
  state = "battle";
}

// ===========================
// VICTORY REWARD
// ===========================
let victoryTimer = 0;
let victoryLines = [];

function startVictoryReward(line1, line2) {
  state = "victoryReward";
  victoryTimer = 0;
  victoryLines = [line1, line2];
  link.freeze = true;
}

function drawVictoryReward(dt) {
  victoryTimer += dt;

  drawMatrix(LINK_VICTORY, canvas.width/2 - 40, canvas.height/2 - 120, 12);

  const r = 18 + Math.sin(victoryTimer * 8) * 4;
  ctx.fillStyle = "rgba(255,255,153,0.65)";
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2 - 150, r, 0, Math.PI*2);
  ctx.fill();

  drawCenteredText(victoryLines, Math.floor(canvas.height/2 - 220), "#aaffcc", 3, 12);

  if (victoryTimer > 2.6) {
    state = "heart";
    heartPulse = 0;
    heartMessageTimer = 0;

    if (victoryLines[0].includes("TE AMO")) {
      heartLines = ["TE AMO", "GRACIAS POR HACER MI VALENTINE", "MUY ESPECIAL :3"];
    } else {
      heartLines = ["WOW, ERES MUY VALIENTE", "DE RECOMPENSA TEN MI CORAZON :3"];
    }

    link.freeze = true;
  }
}

// ===========================
// UPDATE LINK MOVEMENT
// ===========================
function updateLink(dt) {
  if (link.freeze) return;

  let vx = 0, vy = 0;
  if (keys["ArrowLeft"]) vx -= 1;
  if (keys["ArrowRight"]) vx += 1;
  if (keys["ArrowUp"]) vy -= 1;
  if (keys["ArrowDown"]) vy += 1;

  const moving = (vx !== 0 || vy !== 0);

  const mag = Math.hypot(vx, vy) || 1;
  vx /= mag; vy /= mag;

  link.x += vx * link.speed * dt;
  link.y += vy * link.speed * dt;

  link.x = Math.max(20, Math.min(canvas.width - 120, link.x));
  link.y = Math.max(80, Math.min(canvas.height - 140, link.y));

  if (moving) {
    link.frameAcc += dt;
    if (link.frameAcc > 0.22) {
      link.frame = link.frame === 0 ? 1 : 0;
      link.frameAcc = 0;
    }
  } else {
    link.frame = 0;
  }
}

function drawLink() {
  const sprite = link.frame === 0 ? LINK_IDLE : LINK_WALK;
  drawMatrix(sprite, link.x, link.y, 12);
}

// ===========================
// CHEST LOGIC
// ===========================
function updateChestAndQuestion() {
  const linkW = 7 * 12;
  const linkH = 6 * 12;
  const chestW = 6 * 10;
  const chestH = 5 * 10;

  const touching = rectsOverlap(link.x, link.y, linkW, linkH, chest.x, chest.y, chestW, chestH);

  if (state === "play") {
    if (touching && !chest.asked) {
      chest.open = true;
      chest.asked = true;
      state = "question";
      link.freeze = true;
    }
  }
}

function drawChestScene() {
  drawChest(chest.open, chest.x, chest.y, 10);
}

// ===========================
// MAIN LOOP
// ===========================
function update(dt) {
  drawForest(dt);

  if (state === "start") {
    draw3DTitle(dt);
    drawCenteredText(["HAZ CLICK PARA EMPEZAR", "ESTA AVENTURA"], Math.floor(canvas.height/2 - 40), "#aaffcc", 3, 14);
    drawTouchButtonsIfMobile();
    return;
  }

  if (state === "countdown") {
    countdownAcc += dt;
    drawCenteredText([String(countdown)], Math.floor(canvas.height/2 - 30), "#aaffcc", 6, 20);

    if (countdownAcc >= 1) {
      countdown--;
      countdownAcc = 0;
    }
    if (countdown < 0) {
      state = "play";
      link.freeze = false;
      chest.open = false;
      chest.asked = false;
    }
    drawTouchButtonsIfMobile();
    return;
  }

  drawChestScene();

  if (state === "play") {
    updateLink(dt);
    updateChestAndQuestion();
    drawLink();

    drawCenteredText(["MUEVETE CON FLECHAS"], 30, "#aaffcc", 2, 10);
    drawCenteredText(["VE AL COFRE"], 60, "#aaffcc", 2, 10);

    drawTouchButtonsIfMobile();
    return;
  }

  if (state === "question") {
    drawLink();
    drawCenteredText(["ABS...", "QUIERES SER MI VALENTINE?"], Math.floor(canvas.height/2 - 140), "#aaffcc", 3, 14);
    drawButton(ui.yesBtn, "YES");
    drawButton(ui.noBtn, "NO");
    drawTouchButtonsIfMobile();
    return;
  }

  if (state === "battle") {
    drawLink();
    updateEnemies(dt);
    drawEnemies();
    drawCenteredText(["DERROTA A LOS ENEMIGOS", "DA CLICK EN CADA UNO"], 30, "#aaffcc", 2, 10);
    drawTouchButtonsIfMobile();
    return;
  }

  if (state === "victoryReward") {
    drawChestScene();
    drawVictoryReward(dt);
    drawTouchButtonsIfMobile();
    return;
  }

  if (state === "heart") {
    drawChestScene();
    drawHeart(dt);
    drawRestartButton();

    heartMessageTimer += dt;
    if (heartMessageTimer > 5) {
      state = "play";
      link.freeze = false;
    }
    drawTouchButtonsIfMobile();
    return;
  }
}

let last = 0;
function loop(t) {
  const dt = Math.min(0.033, (t - last) / 1000);
  last = t;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
