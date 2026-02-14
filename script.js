// ==========================================
// DATA: MATRICES DE BITS (Tus fonts y sprites originales)
// ==========================================

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
  "¿": ["010","000","110","001","111"],
  ",": ["0","0","0","1","1"],
};

// Paleta de colores Link
const P = {
  0: null, 1: "#2ecc71", 2: "#f1c27d", 3: "#000000",
  4: "#8b4513", 5: "#145214", 6: "#ffffff", 7: "#ff0000", 8: "#ff69b4",
};

const LINK_IDLE = [
  [0,0,3,3,3,0,0], [0,3,1,1,1,3,0], [3,1,2,2,2,1,3],
  [3,1,2,2,2,1,3], [0,4,0,4,0,4,0], [0,4,0,4,0,4,0],
];

const LINK_WALK = [
  [0,0,3,3,3,0,0], [0,3,1,1,1,3,0], [3,1,2,2,2,1,3],
  [3,1,2,2,2,1,3], [0,4,4,0,4,4,0], [0,4,0,4,0,4,0],
];

const LINK_VICTORY = [
  [0,0,6,0,0,0,0], [0,0,6,0,0,0,0], [0,0,3,3,3,0,0],
  [0,3,1,1,1,3,0], [3,1,2,2,2,1,3], [0,4,0,4,0,4,0], [0,4,0,4,0,4,0],
];

// Chest
const CHEST_CLOSED = [
  [3,3,3,3,3,3], [3,1,1,1,1,3], [3,1,2,2,1,3],
  [3,1,1,1,1,3], [3,3,3,3,3,3],
];
const CHEST_OPEN = [
  [3,3,3,3,3,3], [3,0,0,0,0,3], [3,1,2,2,1,3],
  [3,1,1,1,1,3], [3,3,3,3,3,3],
];
const C = { 0: null, 1: "#8b4513", 2: "#f8e16c", 3: "#000000" };

// Enemies
const BAT1 = [[0,1,0,1,0],[1,1,1,1,1],[1,2,1,2,1],[1,1,1,1,1]];
const BAT2 = [[1,0,0,0,1],[1,1,1,1,1],[0,2,1,2,0],[0,1,1,1,0]];
const SLIME1 = [[0,3,3,3,0],[3,2,2,2,3],[3,2,1,2,3],[0,3,3,3,0]];
const SLIME2 = [[0,3,3,3,0],[3,2,2,2,3],[3,1,2,1,3],[0,3,3,3,0]];
const FLAME1 = [[0,0,3,0,0],[0,3,2,3,0],[3,2,2,2,3],[0,3,2,3,0],[0,0,3,0,0]];
const FLAME2 = [[0,3,0,3,0],[3,2,3,2,3],[0,3,2,3,0],[0,0,3,0,0],[0,0,3,0,0]];

const EP = { 0: null, 1: "#8b0000", 2: "#ffcc00", 3: "#aaffcc" };

// ==========================================
// CLASE PRINCIPAL PHASER
// ==========================================

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        // Estado del juego
        this.gameState = "start"; 
        this.countdown = 3;
        this.titleAngle = 0;
        this.chestAsked = false;
        this.enemies = [];
    }

    preload() {
        // No cargamos imágenes externas, generaremos texturas desde los bits
    }

    create() {
        // 1. GENERAR TEXTURAS DESDE TUS MATRICES
        // Esto optimiza el juego creando imágenes reales a partir de tus arrays
        this.generateTextureFromMatrix('link_idle', LINK_IDLE, P, 12);
        this.generateTextureFromMatrix('link_walk', LINK_WALK, P, 12);
        this.generateTextureFromMatrix('link_victory', LINK_VICTORY, P, 12);
        this.generateTextureFromMatrix('chest_closed', CHEST_CLOSED, C, 10);
        this.generateTextureFromMatrix('chest_open', CHEST_OPEN, C, 10);
        
        this.generateTextureFromMatrix('bat1', BAT1, EP, 10);
        this.generateTextureFromMatrix('bat2', BAT2, EP, 10);
        this.generateTextureFromMatrix('slime1', SLIME1, EP, 10);
        this.generateTextureFromMatrix('slime2', SLIME2, EP, 10);
        this.generateTextureFromMatrix('flame1', FLAME1, EP, 10);
        this.generateTextureFromMatrix('flame2', FLAME2, EP, 10);

        // 2. FONDO Y BOSQUE
        this.createForestBackground();

        // 3. OBJETOS DEL JUEGO
        // Cofre
        this.chest = this.physics.add.sprite(this.scale.width - 220, this.scale.height - 260, 'chest_closed');
        this.chest.setImmovable(true);

        // Link (Jugador)
        this.link = this.physics.add.sprite(200, 200, 'link_idle');
        this.link.setCollideWorldBounds(true);
        this.link.body.setSize(this.link.width * 0.8, this.link.height * 0.8); // Hitbox un poco más pequeña
        
        // Grupo de enemigos
        this.enemiesGroup = this.physics.add.group();

        // 4. UI LAYER (Graphics para dibujar tu texto pixel art)
        this.uiGraphics = this.add.graphics();
        this.uiGraphics.setDepth(100); // Siempre encima

        // 5. CONTROLES
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Controles Táctiles (NES style)
        this.createVirtualControls();

        // 6. EVENTOS DE MOUSE/TOUCH (Global)
        this.input.on('pointerdown', (pointer) => this.handleGlobalClick(pointer));

        // 7. MUSICA (Simulada, asegúrate de tener el elemento en HTML)
        this.soundElement = document.getElementById("bgmusic");
        if(this.soundElement) this.soundElement.volume = 0.3;

        // Variables de animación
        this.lastFrameTime = 0;
        this.victoryTimer = 0;
        this.heartPulse = 0;
    }

    update(time, delta) {
        // Convertir delta a segundos para tus fórmulas originales
        const dt = delta / 1000; 

        // Limpiar UI cada frame para redibujar texto
        this.uiGraphics.clear();

        if (this.gameState === "start") {
            this.draw3DTitle(dt);
            this.drawCenteredText(["HAZ CLICK PARA EMPEZAR", "ESTA AVENTURA"], this.scale.height/2 - 40, "#aaffcc", 3, 14);
            return;
        }

        if (this.gameState === "countdown") {
            this.updateCountdown(dt);
            return;
        }

        if (this.gameState === "play") {
            this.updateLinkMovement(dt);
            this.checkChestCollision();
            this.drawPlayUI();
        }

        if (this.gameState === "question") {
            this.drawCenteredText(["ABS...", "QUIERES SER MI VALENTINE?"], this.scale.height/2 - 140, "#aaffcc", 3, 14);
            this.drawYesNoButtons();
        }

        if (this.gameState === "battle") {
            this.updateEnemies(time);
            this.drawCenteredText(["DERROTA A LOS ENEMIGOS", "DA CLICK EN CADA UNO"], 30, "#aaffcc", 2, 10);
        }

        if (this.gameState === "victoryReward") {
            this.updateVictory(dt);
        }

        if (this.gameState === "heart") {
            this.updateHeartScene(dt);
        }

        // Dibujar botones táctiles si es móvil
        this.drawTouchControls();
    }

    // ==========================================
    // LOGICA DEL JUEGO
    // ==========================================

    createForestBackground() {
        // Gradiente de fondo
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x021a0f, 0x021a0f, 0x063d24, 0x063d24, 1);
        graphics.fillRect(0, 0, this.scale.width, this.scale.height);

        // Luna
        graphics.fillStyle(0xccffcc, 1);
        graphics.fillCircle(this.scale.width - 140, 110, 40);

        // Partículas (Estrellas/Luciérnagas)
        for(let i=0; i<90; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            const size = Phaser.Math.Between(1, 3);
            graphics.fillStyle(0xaaffcc, 0.5);
            graphics.fillRect(x, y, size, size);
        }
        
        // Para los árboles usaremos tu lógica de dibujo pero en una textura estática
        // para no redibujar cada frame (mejor rendimiento)
        const treeGraphics = this.make.graphics({x: 0, y: 0, add: false});
        
        const drawTree = (x, y, s) => {
            const TILE = 12;
            const trunkW = 3 * TILE * s;
            const trunkH = 6 * TILE * s;
            const crownR = 4 * TILE * s;
            
            treeGraphics.fillStyle(0x0b5d2a);
            treeGraphics.fillRect(x, y, trunkW, trunkH);
            
            treeGraphics.fillStyle(0x0e7a35);
            treeGraphics.fillRect(x - crownR / 2, y - crownR / 2, trunkW + crownR, crownR);
            treeGraphics.fillRect(x - crownR / 3, y - crownR, trunkW + (2 * crownR) / 3, crownR);
            treeGraphics.fillRect(x, y - (3 * crownR) / 2, trunkW, crownR);
        };

        for (let x = 0; x < this.scale.width + 100; x += 140) drawTree(x, this.scale.height - 260, 0.7);
        for (let x = 60; x < this.scale.width + 100; x += 120) drawTree(x, this.scale.height - 210, 1);
        
        treeGraphics.generateTexture('forest_trees', this.scale.width, this.scale.height);
        this.add.image(this.scale.width/2, this.scale.height/2, 'forest_trees');
    }

    updateCountdown(dt) {
        this.countdown -= dt;
        let num = Math.ceil(this.countdown);
        if (num < 1) num = 1; // Visual fix
        
        this.drawCenteredText([String(num)], this.scale.height/2 - 30, "#aaffcc", 6, 20);

        if (this.countdown <= 0) {
            this.gameState = "play";
            this.resetGameEntities();
        }
    }

    updateLinkMovement(dt) {
        const speed = 220;
        let vx = 0;
        let vy = 0;

        // Input Teclado
        if (this.cursors.left.isDown) vx = -1;
        else if (this.cursors.right.isDown) vx = 1;
        
        if (this.cursors.up.isDown) vy = -1;
        else if (this.cursors.down.isDown) vy = 1;

        // Input Virtual
        if (this.touchKeys.left) vx = -1;
        if (this.touchKeys.right) vx = 1;
        if (this.touchKeys.up) vy = -1;
        if (this.touchKeys.down) vy = 1;

        // Normalizar
        if (vx !== 0 || vy !== 0) {
            const mag = Math.sqrt(vx*vx + vy*vy);
            vx /= mag; vy /= mag;
            
            // Animación
            this.link.play('walk_anim', true); // Usamos lógica simple de cambio de textura
            // Alternar texturas manualmente para simular tus 2 frames
            this.lastFrameTime += dt;
            if (this.lastFrameTime > 0.2) {
                this.link.setTexture(this.link.texture.key === 'link_idle' ? 'link_walk' : 'link_idle');
                this.lastFrameTime = 0;
            }
        } else {
            this.link.setTexture('link_idle');
        }

        this.link.setVelocity(vx * speed, vy * speed);
    }

    checkChestCollision() {
        if (this.chestAsked) return;

        if (this.physics.overlap(this.link, this.chest)) {
            this.chest.setTexture('chest_open');
            this.chestAsked = true;
            this.gameState = "question";
            this.link.setVelocity(0,0);
        }
    }

    drawPlayUI() {
        this.drawCenteredText(["MUEVETE CON FLECHAS"], 30, "#aaffcc", 2, 10);
        this.drawCenteredText(["VE AL COFRE"], 60, "#aaffcc", 2, 10);
    }

    handleGlobalClick(pointer) {
        const mx = pointer.x;
        const my = pointer.y;

        if (this.gameState === "start") {
            if(this.soundElement) this.soundElement.play().catch(e=>console.log(e));
            this.gameState = "countdown";
            this.countdown = 3;
            return;
        }

        if (this.gameState === "question") {
            // Verificar botones SI / NO
            if (this.pointInRect(mx, my, this.ui.yes)) this.triggerYes();
            if (this.pointInRect(mx, my, this.ui.no)) this.triggerNo();
        }

        if (this.gameState === "battle") {
            // Click en enemigos
            const enemies = this.enemiesGroup.getChildren();
            for(let i = enemies.length - 1; i >= 0; i--) {
                const en = enemies[i];
                if (en.getBounds().contains(mx, my)) {
                    en.destroy();
                    // Check win condition
                    if (this.enemiesGroup.countActive() === 0) {
                        this.startVictory("WOW, ERES MUY VALIENTE", "DE RECOMPENSA TEN MI CORAZON :3");
                    }
                    break; 
                }
            }
        }

        if (this.gameState === "heart") {
             if (this.pointInRect(mx, my, this.ui.restart)) {
                 this.scene.restart();
             }
        }
    }

    triggerYes() {
        this.startVictory("TE AMO", "GRACIAS POR HACER MI VALENTINE MUY ESPECIAL :3");
    }

    triggerNo() {
        this.gameState = "battle";
        this.spawnEnemies();
    }

    spawnEnemies() {
        const types = [
            {k1:'bat1', k2:'bat2'}, 
            {k1:'slime1', k2:'slime2'}, 
            {k1:'flame1', k2:'flame2'}
        ];
        
        for(let i=0; i<7; i++) {
            const type = Phaser.Utils.Array.GetRandom(types);
            const x = Phaser.Math.Between(80, this.scale.width - 160);
            const y = Phaser.Math.Between(140, this.scale.height - 220);
            
            const enemy = this.enemiesGroup.create(x, y, type.k1);
            enemy.setData('typeInfo', type);
            enemy.setData('animTimer', 0);
            
            const vx = (Math.random() < 0.5 ? -1 : 1) * Phaser.Math.Between(40, 120);
            const vy = (Math.random() < 0.5 ? -1 : 1) * Phaser.Math.Between(40, 120);
            enemy.setVelocity(vx, vy);
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setInteractive(); // Para clicks
        }
    }

    updateEnemies(time) {
        this.enemiesGroup.children.iterate((en) => {
            // Animación simple frame swap
            let timer = en.getData('animTimer') + 1;
            if (timer > 15) { // cada 15 frames aprox
                const keys = en.getData('typeInfo');
                en.setTexture(en.texture.key === keys.k1 ? keys.k2 : keys.k1);
                timer = 0;
            }
            en.setData('animTimer', timer);
        });
    }

    startVictory(line1, line2) {
        this.gameState = "victoryReward";
        this.victoryLines = [line1, line2];
        this.victoryTimer = 0;
        this.link.setTexture('link_victory');
    }

    updateVictory(dt) {
        this.victoryTimer += dt;
        
        // Aura dorada
        const r = 18 + Math.sin(this.victoryTimer * 8) * 4;
        this.uiGraphics.fillStyle(0xffff99, 0.65);
        this.uiGraphics.fillCircle(this.scale.width/2, this.scale.height/2 - 150, r*5); // Ajustado escala

        // Dibujar Link Victory estático en el centro
        this.link.setPosition(this.scale.width/2, this.scale.height/2 - 120);
        this.link.setTexture('link_victory');
        
        this.drawCenteredText(this.victoryLines, Math.floor(this.scale.height/2 - 220), "#aaffcc", 3, 12);

        if (this.victoryTimer > 3) {
            this.gameState = "heart";
            this.heartLines = this.victoryLines[0].includes("TE AMO") 
                ? ["TE AMO", "GRACIAS POR HACER MI VALENTINE", "MUY ESPECIAL :3"]
                : ["WOW, ERES MUY VALIENTE", "DE RECOMPENSA TEN MI CORAZON :3"];
        }
    }

    updateHeartScene(dt) {
        this.heartPulse += dt * 3;
        const scale = 1 + Math.sin(this.heartPulse) * 0.18;
        
        // Dibujar corazón pixel art proceduralmente con Graphics
        const cx = this.scale.width/2;
        const cy = this.scale.height/2 - 30;
        const s = scale * 18;

        // Aura rosa
        this.uiGraphics.fillStyle(0xff69b4, 0.25);
        this.uiGraphics.fillRect(cx - 6*s, cy - 6*s, 12*s, 12*s);

        // Pixeles rojos
        this.uiGraphics.fillStyle(0xff0000, 1);
        const heartMatrix = [[0,1,0,1,0],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]];
        
        for(let r=0; r<5; r++){
            for(let c=0; c<5; c++){
                if(heartMatrix[r][c] === 1) {
                    this.uiGraphics.fillRect(cx + (c-2)*s, cy + (r-2)*s, s, s);
                }
            }
        }

        this.drawCenteredText(this.heartLines, Math.floor(this.scale.height/2 + 130), "#aaffcc", 3, 14);
        this.drawRestartButton();
    }

    // ==========================================
    // SISTEMA DE TEXTO PIXEL ART (Mantenido)
    // ==========================================
    
    // Adaptación: Dibuja directamente en this.uiGraphics
    drawPixelText(text, x, y, colorStr, scale) {
        text = String(text).toUpperCase();
        const charW = 3 * scale;
        const gap = 1 * scale;
        let cursorX = x;
        
        // Convertir color string hex a número para Phaser
        const color = parseInt(colorStr.replace("#", "0x"), 16);
        this.uiGraphics.fillStyle(color, 1);

        for (const ch of text) {
            const glyph = FONT[ch] || FONT[" "];
            for (let r = 0; r < glyph.length; r++) {
                for (let c = 0; c < glyph[r].length; c++) {
                    if (glyph[r][c] === "1") {
                        this.uiGraphics.fillRect(cursorX + c * scale, y + r * scale, scale, scale);
                    }
                }
            }
            cursorX += charW + gap;
        }
    }

    drawCenteredText(lines, yStart, color, scale, lineGap) {
        const arr = Array.isArray(lines) ? lines : [lines];
        arr.forEach((line, i) => {
            const linePx = (line.length * (3 * scale + 1 * scale)) - (1 * scale);
            const x = Math.floor(this.scale.width / 2 - linePx / 2);
            const y = yStart + i * (5 * scale + lineGap);
            this.drawPixelText(line, x, y, color, scale);
        });
    }

    draw3DTitle(dt) {
        this.titleAngle += dt * 1.1;
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2 - 120;
        const text = "THE LEGEND OF ???";

        // Simulación 3D manual dibujando texto múltiples veces
        const floatY = Math.sin(this.titleAngle * 2) * 10;
        
        // El ancho estimado del texto es ~420px a escala 8
        const textW = (text.length * (3*8 + 8)) - 8;
        const startX = centerX - textW/2;
        const startY = centerY + floatY;

        // Capas profundidad
        for (let i = 8; i > 0; i--) {
            this.uiGraphics.fillStyle(0x3c280a, 0.4 + i * 0.05);
            // Nota: drawPixelText modificado para aceptar coordenadas base
            this.drawPixelText(text, startX + i*3, startY + i*3, "#3b2a0a", 8);
        }

        // Color dorado pulsante
        const goldPulse = Math.floor(200 + Math.sin(this.titleAngle * 3) * 30);
        const r = goldPulse;
        const g = goldPulse - 40;
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8)).toString(16).slice(1);
        
        this.drawPixelText(text, startX, startY, hex, 8);
        
        // Brillo blanco sutil
        // (Omitido por simplicidad de Graphics, pero el dorado ya destaca)
    }

    // ==========================================
    // UI ELEMENTS
    // ==========================================

    drawYesNoButtons() {
        const midX = this.scale.width / 2;
        const baseY = this.scale.height / 2 + 80;
        
        this.ui = this.ui || {};
        this.ui.yes = { x: midX - 190, y: baseY, w: 170, h: 60 };
        this.ui.no =  { x: midX + 20, y: baseY, w: 170, h: 60 };

        const drawBtn = (btn, label) => {
            this.uiGraphics.fillStyle(0x0b5d2a);
            this.uiGraphics.fillRect(btn.x, btn.y, btn.w, btn.h);
            this.uiGraphics.lineStyle(3, 0xaaffcc);
            this.uiGraphics.strokeRect(btn.x, btn.y, btn.w, btn.h);
            
            const scale = 3;
            const linePx = (label.length * (3 * scale + scale)) - scale;
            const tx = btn.x + btn.w/2 - linePx/2;
            const ty = btn.y + 18;
            this.drawPixelText(label, tx, ty, "#aaffcc", scale);
        };

        drawBtn(this.ui.yes, "YES");
        drawBtn(this.ui.no, "NO");
    }

    drawRestartButton() {
        const w = 260, h = 70;
        const x = this.scale.width/2 - w/2;
        const y = this.scale.height - 120;
        
        this.ui = this.ui || {};
        this.ui.restart = { x, y, w, h };

        this.uiGraphics.fillStyle(0x0b5d2a);
        this.uiGraphics.fillRect(x, y, w, h);
        this.uiGraphics.lineStyle(4, 0xaaffcc);
        this.uiGraphics.strokeRect(x, y, w, h);

        const label = "VOLVER A COMENZAR";
        const scale = 3;
        const linePx = (label.length * (3 * scale + scale)) - scale;
        this.drawPixelText(label, x + w/2 - linePx/2, y + 20, "#aaffcc", scale);
    }

    // ==========================================
    // CONTROLES VIRTUALES (Touch)
    // ==========================================
    
    createVirtualControls() {
        this.touchKeys = { left: false, right: false, up: false, down: false };
        this.touchZones = {};

        // Definimos zonas interactivas invisibles pero grandes para mejor tacto
        const addZone = (dir, x, y, s) => {
            const zone = this.add.zone(x, y, s, s).setOrigin(0,0).setInteractive();
            zone.on('pointerdown', () => this.touchKeys[dir] = true);
            zone.on('pointerup', () => this.touchKeys[dir] = false);
            zone.on('pointerout', () => this.touchKeys[dir] = false);
            return {x, y, s};
        };

        const baseY = this.scale.height - 120;
        const size = 100; // Grande para touch
        
        // Coordenadas visuales
        this.touchZones.left = addZone('left', 60, baseY, size);
        this.touchZones.right = addZone('right', 220, baseY, size);
        this.touchZones.up = addZone('up', 140, baseY - 100, size);
        this.touchZones.down = addZone('down', 140, baseY, size);
    }

    drawTouchControls() {
        // Solo dibujar si es un dispositivo táctil (o siempre para debug)
        if (this.sys.game.device.os.desktop === false) {
            const drawNESBtn = (zone, dir) => {
                const {x, y, s} = zone;
                const pressed = this.touchKeys[dir];
                
                this.uiGraphics.fillStyle(0x000000);
                this.uiGraphics.fillRect(x-5, y-5, s+10, s+10);
                
                this.uiGraphics.fillStyle(pressed ? 0x0a5f2a : 0x0e7a35);
                const inset = pressed ? 3 : 0;
                this.uiGraphics.fillRect(x+inset, y+inset, s-inset, s-inset);
                
                this.uiGraphics.lineStyle(3, 0xaaffcc);
                this.uiGraphics.strokeRect(x+3+inset, y+3+inset, s-6-inset, s-6-inset);
                
                // Dibujar flecha (simplificado)
                this.uiGraphics.fillStyle(0xffffff);
                const cx = x + s/2 + inset;
                const cy = y + s/2 + inset;
                const p = 8;
                
                if (dir === "left") this.uiGraphics.fillRect(cx-p*2, cy-p/2, p*2, p);
                if (dir === "right") this.uiGraphics.fillRect(cx, cy-p/2, p*2, p);
                if (dir === "up") this.uiGraphics.fillRect(cx-p/2, cy-p*2, p, p*2);
                if (dir === "down") this.uiGraphics.fillRect(cx-p/2, cy, p, p*2);
            };

            drawNESBtn(this.touchZones.left, "left");
            drawNESBtn(this.touchZones.right, "right");
            drawNESBtn(this.touchZones.up, "up");
            drawNESBtn(this.touchZones.down, "down");
        }
    }

    // ==========================================
    // UTILS
    // ==========================================

    resetGameEntities() {
        this.link.setPosition(200, 200);
        this.link.setTexture('link_idle');
        this.link.setVelocity(0,0);
        this.chest.setTexture('chest_closed');
        this.chestAsked = false;
        this.enemiesGroup.clear(true, true);
    }

    pointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
    }

    // MAGIA: Convierte tus arrays [0,1,3...] en texturas reales de Phaser
    generateTextureFromMatrix(key, matrix, palette, pixelSize) {
        const h = matrix.length;
        const w = matrix[0].length;
        
        // Creamos un canvas temporal
        const canvas = document.createElement('canvas');
        canvas.width = w * pixelSize;
        canvas.height = h * pixelSize;
        const ctx = canvas.getContext('2d');

        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                const val = matrix[r][c];
                if (val !== 0 && val !== null) {
                    ctx.fillStyle = palette[val];
                    ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        // Añadimos la textura al gestor de Phaser
        this.textures.addCanvas(key, canvas);
    }
}

// ==========================================
// CONFIGURACIÓN DEL JUEGO
// ==========================================

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    backgroundColor: '#021a0f',
    parent: document.body, // Inyectar en el body directamente
    scale: {
        mode: Phaser.Scale.FIT, // AJUSTE RESPONSIVE PERFECTO
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 } // Top-down, sin gravedad
        }
    },
    scene: MainScene
};

const game = new Phaser.Game(config);