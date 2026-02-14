// ======================================================
// PHASER 3 VERSION - READY FOR GITHUB PAGES (CDN)
// ======================================================
// Add this BEFORE this script in your index.html:
//
// <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.js"></script>
// <script src="script.js"></script>
// ======================================================

const BASE_WIDTH = 960;
const BASE_HEIGHT = 540;

const config = {
    type: Phaser.AUTO,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    backgroundColor: "#021a0f",
    parent: null,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

// ======================================================
// GLOBAL STATE
// ======================================================
let state = "start";
let countdown = 3;
let countdownAcc = 0;
let titleAngle = 0;

let link;
let chest;
let enemies = [];
let heartPulse = 0;
let heartLines = [];
let heartTimer = 0;
let victoryTimer = 0;
let victoryLines = [];

let cursors;
let particles = [];

let music;

// ======================================================
// PRELOAD
// ======================================================
function preload() {
    this.load.audio("bgmusic", "static/zelda8bit.mp3");
}

// ======================================================
// CREATE
// ======================================================
function create() {

    music = this.sound.add("bgmusic", { loop: true, volume: 0.3 });

    cursors = this.input.keyboard.createCursorKeys();

    link = {
        x: 200,
        y: 200,
        speed: 220,
        frame: 0,
        frameAcc: 0,
        freeze: false
    };

    chest = {
        x: BASE_WIDTH - 220,
        y: BASE_HEIGHT - 260,
        open: false,
        asked: false
    };

    for (let i = 0; i < 90; i++) {
        particles.push({
            x: Phaser.Math.Between(0, BASE_WIDTH),
            y: Phaser.Math.Between(0, BASE_HEIGHT),
            v: Phaser.Math.Between(10, 30)
        });
    }

    this.input.on("pointerdown", pointerDown, this);
}

// ======================================================
// UPDATE
// ======================================================
function update(time, delta) {

    const dt = Math.min(0.033, delta / 1000);

    drawForest(this, dt);

    if (state === "start") {
        drawTitle(this, dt);
        drawCenteredText(this, ["HAZ CLICK PARA EMPEZAR", "ESTA AVENTURA"], BASE_HEIGHT / 2 - 40, 3);
        return;
    }

    if (state === "countdown") {
        countdownAcc += dt;
        drawCenteredText(this, [String(countdown)], BASE_HEIGHT / 2 - 30, 6);

        if (countdownAcc >= 1) {
            countdown--;
            countdownAcc = 0;
        }
        if (countdown < 0) {
            state = "play";
            link.freeze = false;
        }
        return;
    }

    drawChest(this);

    if (state === "play") {
        updateLink(dt);
        drawLink(this);
        updateChest();
        drawCenteredText(this, ["MUEVETE CON FLECHAS", "VE AL COFRE"], 30, 2);
        return;
    }

    if (state === "question") {
        drawLink(this);
        drawCenteredText(this, ["QUIERES SER MI VALENTINE?"], BASE_HEIGHT / 2 - 140, 3);
        drawButton(this, BASE_WIDTH / 2 - 200, BASE_HEIGHT / 2 + 60, "YES");
        drawButton(this, BASE_WIDTH / 2 + 40, BASE_HEIGHT / 2 + 60, "NO");
        return;
    }

    if (state === "battle") {
        drawLink(this);
        updateEnemies(dt);
        drawEnemies(this);
        drawCenteredText(this, ["DERROTA A LOS ENEMIGOS"], 30, 2);
        return;
    }

    if (state === "victoryReward") {
        drawVictory(this, dt);
        return;
    }

    if (state === "heart") {
        drawHeart(this, dt);
        drawRestart(this);
        heartTimer += dt;
        if (heartTimer > 5) {
            resetGame();
        }
        return;
    }
}

// ======================================================
// INPUT
// ======================================================
function pointerDown(pointer) {

    const mx = pointer.worldX;
    const my = pointer.worldY;

    if (state === "start") {
        music.play();
        state = "countdown";
        countdown = 3;
        countdownAcc = 0;
        return;
    }

    if (state === "question") {
        if (mx < BASE_WIDTH / 2) {
            triggerYes();
        } else {
            triggerNo();
        }
        return;
    }

    if (state === "battle") {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];
            if (Phaser.Geom.Rectangle.Contains(
                new Phaser.Geom.Rectangle(e.x, e.y, 54, 54),
                mx, my
            )) {
                enemies.splice(i, 1);
            }
        }

        if (enemies.length === 0) {
            startVictory("WOW, ERES MUY VALIENTE", "DE RECOMPENSA TEN MI CORAZON :3");
        }
        return;
    }

    if (state === "heart") {
        resetGame();
    }
}

// ======================================================
// LOGIC
// ======================================================
function updateLink(dt) {
    if (link.freeze) return;

    let vx = 0, vy = 0;

    if (cursors.left.isDown) vx -= 1;
    if (cursors.right.isDown) vx += 1;
    if (cursors.up.isDown) vy -= 1;
    if (cursors.down.isDown) vy += 1;

    const mag = Math.hypot(vx, vy) || 1;
    vx /= mag;
    vy /= mag;

    link.x += vx * link.speed * dt;
    link.y += vy * link.speed * dt;

    link.x = Phaser.Math.Clamp(link.x, 20, BASE_WIDTH - 120);
    link.y = Phaser.Math.Clamp(link.y, 80, BASE_HEIGHT - 140);
}

function updateChest() {
    if (state !== "play") return;

    const touching =
        link.x < chest.x + 60 &&
        link.x + 60 > chest.x &&
        link.y < chest.y + 50 &&
        link.y + 50 > chest.y;

    if (touching && !chest.asked) {
        chest.open = true;
        chest.asked = true;
        link.freeze = true;
        state = "question";
    }
}

function spawnEnemies() {
    enemies = [];
    for (let i = 0; i < 7; i++) {
        enemies.push({
            x: Phaser.Math.Between(80, BASE_WIDTH - 80),
            y: Phaser.Math.Between(120, BASE_HEIGHT - 80),
            vx: Phaser.Math.Between(-120, 120),
            vy: Phaser.Math.Between(-120, 120)
        });
    }
}

function updateEnemies(dt) {
    enemies.forEach(e => {
        e.x += e.vx * dt;
        e.y += e.vy * dt;

        if (e.x < 20 || e.x > BASE_WIDTH - 60) e.vx *= -1;
        if (e.y < 90 || e.y > BASE_HEIGHT - 60) e.vy *= -1;
    });
}

function triggerYes() {
    startVictory("TE AMO", "GRACIAS POR HACER MI VALENTINE MUY ESPECIAL :3");
}

function triggerNo() {
    spawnEnemies();
    state = "battle";
}

function startVictory(l1, l2) {
    victoryTimer = 0;
    victoryLines = [l1, l2];
    state = "victoryReward";
}

function resetGame() {
    state = "start";
    countdown = 3;
    link.x = 200;
    link.y = 200;
    link.freeze = false;
    chest.open = false;
    chest.asked = false;
    enemies = [];
    heartTimer = 0;
}

// ======================================================
// DRAW FUNCTIONS
// ======================================================
function drawForest(scene, dt) {

    const g = scene.add.graphics();
    g.fillGradientStyle(0x021a0f, 0x021a0f, 0x063d24, 0x063d24, 1);
    g.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    particles.forEach(p => {
        p.y -= p.v * dt;
        if (p.y < 0) p.y = BASE_HEIGHT;
        g.fillStyle(0xaaffcc, 1);
        g.fillRect(p.x, p.y, 2, 2);
    });
}

function drawLink(scene) {
    const g = scene.add.graphics();
    g.fillStyle(0x2ecc71, 1);
    g.fillRect(link.x, link.y, 60, 60);
}

function drawChest(scene) {
    const g = scene.add.graphics();
    g.fillStyle(chest.open ? 0xf8e16c : 0x8b4513, 1);
    g.fillRect(chest.x, chest.y, 60, 50);
}

function drawEnemies(scene) {
    const g = scene.add.graphics();
    enemies.forEach(e => {
        g.fillStyle(0xff0000, 1);
        g.fillRect(e.x, e.y, 50, 50);
    });
}

function drawTitle(scene, dt) {
    titleAngle += dt * 1.2;

    const text = scene.add.text(BASE_WIDTH / 2, BASE_HEIGHT / 2 - 120,
        "THE LEGEND OF ???",
        { fontFamily: "monospace", fontSize: "48px", color: "#ffd700" }
    ).setOrigin(0.5);

    text.setScale(0.9 + Math.cos(titleAngle) * 0.1);
}

function drawCenteredText(scene, lines, y, scale) {
    const arr = Array.isArray(lines) ? lines : [lines];
    arr.forEach((line, i) => {
        scene.add.text(BASE_WIDTH / 2, y + i * 40, line, {
            fontFamily: "monospace",
            fontSize: `${18 * scale}px`,
            color: "#aaffcc"
        }).setOrigin(0.5);
    });
}

function drawButton(scene, x, y, label) {
    const g = scene.add.graphics();
    g.fillStyle(0x0b5d2a, 1);
    g.fillRect(x, y, 170, 60);
    scene.add.text(x + 85, y + 30, label, {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#aaffcc"
    }).setOrigin(0.5);
}

function drawVictory(scene, dt) {
    victoryTimer += dt;
    drawCenteredText(scene, victoryLines, BASE_HEIGHT / 2 - 100, 3);

    if (victoryTimer > 2.5) {
        state = "heart";
        heartLines = victoryLines;
    }
}

function drawHeart(scene, dt) {
    heartPulse += dt * 3;
    const scale = 1 + Math.sin(heartPulse) * 0.2;

    const g = scene.add.graphics();
    g.fillStyle(0xff0000, 1);
    g.fillCircle(BASE_WIDTH / 2, BASE_HEIGHT / 2, 60 * scale);

    drawCenteredText(scene, heartLines, BASE_HEIGHT / 2 + 100, 3);
}

function drawRestart(scene) {
    drawCenteredText(scene, ["VOLVER A COMENZAR"], BASE_HEIGHT - 60, 2);
}
