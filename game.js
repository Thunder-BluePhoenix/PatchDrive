const vehicles = [
  { id: "car",        name: "Scout Car",    type: "ground", mass: 1.10, thrust: 0.50, grip: 0.86, lift: 0,     drag: 0.018, stability: 0.80, armor: 1.00 },
  { id: "bike",       name: "Ridge Bike",   type: "ground", mass: 0.72, thrust: 0.62, grip: 0.78, lift: 0,     drag: 0.020, stability: 0.52, armor: 0.70 },
  { id: "truck",      name: "Iron Truck",   type: "ground", mass: 1.70, thrust: 0.42, grip: 0.90, lift: 0,     drag: 0.024, stability: 0.95, armor: 1.45 },
  { id: "airplane",   name: "Aero Wing",    type: "air",    mass: 1.05, thrust: 0.62, grip: 0.20, lift: 0.055, drag: 0.014, stability: 0.72, armor: 0.82 },
  { id: "jet",        name: "Storm Jet",    type: "air",    mass: 1.20, thrust: 0.88, grip: 0.16, lift: 0.052, drag: 0.018, stability: 0.64, armor: 0.78 },
  { id: "helicopter", name: "Patch Copter", type: "air",    mass: 1.00, thrust: 0.50, grip: 0.10, lift: 0.072, drag: 0.022, stability: 0.58, armor: 0.84 },
  { id: "spaceship",  name: "Orbit Scrap",  type: "space",  mass: 1.25, thrust: 0.55, grip: 0,    lift: 0,     drag: 0.003, stability: 0.46, armor: 0.90 }
];

const disasters = {
  ground: [
    { name: "Earthquake",    wind:  0.00, shake: 0.95, friction: 0.95, damage: 6 },
    { name: "Flood",         wind:  0.00, shake: 0.10, friction: 0.62, damage: 4 },
    { name: "Sandstorm",     wind: -0.13, shake: 0.20, friction: 0.74, damage: 5 },
    { name: "Meteor Shower", wind:  0.04, shake: 0.40, friction: 1.00, damage: 9 }
  ],
  air: [
    { name: "Thunderstorm", wind: -0.20, shake: 0.70, friction: 1, damage: 7 },
    { name: "Turbulence",   wind:  0.16, shake: 1.00, friction: 1, damage: 5 },
    { name: "Volcanic Ash", wind: -0.06, shake: 0.24, friction: 1, damage: 8 },
    { name: "Cyclone",      wind: -0.32, shake: 0.85, friction: 1, damage: 9 }
  ],
  space: [
    { name: "Asteroid Field", wind:  0.02, shake: 0.65, friction: 1, damage: 9 },
    { name: "Solar Flare",    wind: -0.08, shake: 0.30, friction: 1, damage: 8 },
    { name: "Gravity Well",   wind:  0.00, shake: 0.55, friction: 1, damage: 6 },
    { name: "Debris Storm",   wind:  0.18, shake: 0.70, friction: 1, damage: 7 }
  ]
};

const partByType = {
  ground: ["wheel", "gear", "axle", "spring", "armor plate"],
  air:    ["wing patch", "rotor blade", "rudder", "jet nozzle", "fuel pipe"],
  space:  ["thruster", "shield panel", "oxygen pipe", "solar panel", "reactor coil"]
};

const worldCanvas = document.querySelector("#worldCanvas");
const world = worldCanvas.getContext("2d");
const drawCanvas = document.querySelector("#drawCanvas");
const draw = drawCanvas.getContext("2d");
const vehicleGrid = document.querySelector("#vehicleGrid");
const garage = document.querySelector("#garage");
const game = document.querySelector("#game");
const gameOver = document.querySelector("#gameOver");
const touchControls = document.querySelector("#touchControls");

let selectedVehicleId = "car";
let bank = Number(localStorage.getItem("patchdrive-bank") || 0);
let upgrades = JSON.parse(localStorage.getItem("patchdrive-upgrades") || "{}");
let bestScores = JSON.parse(localStorage.getItem("patchdrive-best-scores") || "{}");
let state = null;
let drawing = false;
let strokes = [];
let currentStroke = [];
let animationId = 0;
const keys = new Set();

const pickupTypes = [
  { type: "coin",   value: 18, color: "#f5b84b" },
  { type: "repair", value: 22, color: "#7fd36b" },
  { type: "fuel",   value: 26, color: "#58c4b8" }
];

// --- Upgrades & persistence ---

function getLevels(id = selectedVehicleId) {
  upgrades[id] ||= { engine: 1, armor: 1, stability: 1, repair: 1 };
  return upgrades[id];
}

function saveProgress() {
  localStorage.setItem("patchdrive-bank", String(bank));
  localStorage.setItem("patchdrive-upgrades", JSON.stringify(upgrades));
  localStorage.setItem("patchdrive-best-scores", JSON.stringify(bestScores));
}

// --- Garage UI ---

function renderGarage() {
  document.querySelector("#bankCoins").textContent = bank;
  vehicleGrid.innerHTML = "";
  vehicles.forEach(vehicle => {
    const button = document.createElement("button");
    button.className = `vehicle-card ${vehicle.id === selectedVehicleId ? "selected" : ""}`;
    button.innerHTML = `<strong>${vehicle.name}</strong><span class="vc-type">${vehicle.type.toUpperCase()}</span><span class="vc-stats">Mass ${vehicle.mass.toFixed(1)} · Stability ${Math.round(vehicle.stability * 100)}</span>`;
    button.addEventListener("click", () => { selectedVehicleId = vehicle.id; renderGarage(); });
    vehicleGrid.appendChild(button);
  });

  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  const levels = getLevels();
  document.querySelector("#selectedVehicleName").textContent = vehicle.name;
  document.querySelector("#selectedVehicleStats").textContent =
    `${vehicle.type} · thrust ${vehicle.thrust.toFixed(2)} · armor ${vehicle.armor.toFixed(2)} · grip ${vehicle.grip.toFixed(2)}`;
  document.querySelector("#selectedVehicleBest").textContent = `Best score: ${Math.floor(bestScores[vehicle.id] || 0)}`;

  ["engine", "armor", "stability", "repair"].forEach(key => {
    document.querySelector(`#${key}Level`).textContent = levels[key];
    const cost = upgradeCost(levels[key]);
    document.querySelector(`#${key}Cost`).textContent = `${cost} coins`;
    const btn = document.querySelector(`[data-upgrade="${key}"]`);
    btn.title = `Upgrade for ${cost} coins`;
    btn.disabled = bank < cost;
  });
}

function upgradeCost(level) { return 80 + level * level * 45; }

// --- Run ---

function startRun() {
  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  const levels = getLevels();
  state = {
    vehicle, levels,
    hp: 100 + (levels.armor - 1) * 18,
    maxHp: 100 + (levels.armor - 1) * 18,
    partHealth: 100,
    score: 0, runCoins: 0,
    x: 170,
    y: vehicle.type === "ground" ? 356 : 230,
    vx: 2.2, vy: 0, angle: 0, spin: 0,
    terrainOffset: 0,
    disaster: null, disasterTimer: 9,
    nextFailure: 5, pickupTimer: 1.4, debrisTimer: 3,
    pickups: [], debris: [],
    particles: [],
    shakeAmount: 0,
    repairOverlay: null,
    wheelAngle: 0,
    rotorAngle: 0,
    fuel: 100, heat: 0,
    event: "Systems online.",
    failedPart: null,
    repairQuality: 1,
    last: performance.now(),
    over: false
  };
  garage.classList.add("hidden");
  game.classList.remove("hidden");
  gameOver.classList.add("hidden");
  if ("ontouchstart" in window) touchControls.classList.remove("hidden");
  clearDrawing();
  updateRepairText();
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(loop);
}

function loop(now) {
  if (!state || state.over) return;
  const dt = Math.min(0.033, (now - state.last) / 1000);
  state.last = now;
  update(dt);
  render();
  animationId = requestAnimationFrame(loop);
}

// --- Update ---

function update(dt) {
  const v = state.vehicle;
  const levels = state.levels;
  const disasterForce = state.disaster || { wind: 0, shake: 0, friction: 1, damage: 0 };
  const engineBoost = 1 + (levels.engine - 1) * 0.12;
  const stabilityBoost = 1 + (levels.stability - 1) * 0.13;
  const qualityPenalty = 1.25 - state.repairQuality * 0.45;
  const input = readInput();
  const boost = input.boost && state.fuel > 4 && state.heat < 92 ? 1.45 : 1;
  const throttle = state.fuel > 0 ? input.throttle : 0.18;
  const speedPressure = Math.min(1.8, Math.max(0, state.vx - 2) * 0.05);

  state.score += dt * (10 + Math.abs(state.vx) * 2);
  state.runCoins += dt * 2.4;
  state.terrainOffset += state.vx * 70 * dt;
  state.disasterTimer -= dt;
  state.nextFailure -= dt;
  state.pickupTimer -= dt;
  state.debrisTimer -= dt;
  state.fuel -= dt * (0.9 + throttle * boost * 2.2);
  state.heat += dt * (throttle * boost * 9 + Math.abs(state.spin) * 2 + speedPressure);
  state.heat -= dt * (v.type === "space" ? 3.2 : 5.1);
  state.fuel = clamp(state.fuel, 0, 100);
  state.heat = clamp(state.heat, 0, 100);
  state.wheelAngle += state.vx * dt * 3.5;
  state.rotorAngle += dt * (8 + throttle * 14);
  state.shakeAmount = Math.max(0, state.shakeAmount - dt * 24);

  if (state.disasterTimer <= 0) {
    const list = disasters[v.type];
    state.disaster = list[Math.floor(Math.random() * list.length)];
    state.disasterTimer = Math.max(5, 10 - state.score * 0.002) + Math.random() * 7;
    const dmg = state.disaster.damage / (v.armor + (levels.armor - 1) * 0.22);
    state.hp -= dmg;
    state.shakeAmount += state.disaster.shake * 12;
    emitSparks(state.x, state.y, Math.ceil(state.disaster.shake * 8));
    state.event = `${state.disaster.name} incoming.`;
  }

  if (state.disaster && state.disasterTimer < 3) state.disaster = null;

  if (state.nextFailure <= 0 && !state.failedPart) {
    const parts = partByType[v.type];
    state.failedPart = parts[Math.floor(Math.random() * parts.length)];
    state.partHealth = 28 + Math.random() * 22;
    state.nextFailure = Math.max(6, 12 - state.score * 0.002) + Math.random() * 8;
    state.shakeAmount += 6;
    emitSparks(state.x, state.y, 10);
    state.event = `${state.failedPart} failed. Draw a fix.`;
    updateRepairText();
  }

  if (state.pickupTimer <= 0) spawnPickup();
  if (state.disaster && state.debrisTimer <= 0) spawnDebris();

  const shake = Math.sin(performance.now() * 0.018) * disasterForce.shake;

  if (v.type === "ground") {
    const groundY = terrainY(state.x + state.terrainOffset);
    const gravity = 0.62 * v.mass;
    const friction = v.grip * disasterForce.friction;
    state.vx += v.thrust * engineBoost * friction * throttle * boost * dt * 9;
    if (input.brake) state.vx *= 1 - 2.2 * dt * friction;
    state.vx *= 1 - (v.drag + (1 - friction) * 0.05) * qualityPenalty;
    state.vy += gravity;
    if (state.y >= groundY) {
      const impact = Math.max(0, state.vy - 7);
      if (impact > 3) { state.shakeAmount += impact * 0.9; emitSparks(state.x, state.y, Math.ceil(impact * 0.6)); }
      state.hp -= impact * 0.35 / v.armor;
      state.y = groundY;
      state.vy *= -0.12;
      state.spin += (input.turn * 0.036 + shake * 0.018 - state.angle * 0.02) / stabilityBoost;
    }
  } else if (v.type === "air") {
    const flightThrottle = input.thrusting ? throttle : 0.22;
    const liftInput = v.id === "helicopter" ? 0.35 + flightThrottle * 0.85 : 0.25 + flightThrottle * 0.9;
    const baseLift = v.id === "helicopter" ? v.lift * 6.1 : Math.max(0.2, state.vx) * v.lift * 3.2;
    const lift = baseLift * liftInput;
    const descent = input.brake ? 0.42 : 0;
    const groundY = terrainY(state.x + state.terrainOffset);
    state.vx += (v.thrust * engineBoost * flightThrottle * boost + disasterForce.wind) * dt * 7;
    state.vy += (0.34 * v.mass - lift + descent) * dt * 3.4 + shake * 0.02;
    state.vx *= 1 - v.drag * qualityPenalty;
    state.vy *= 0.985;
    state.spin += (input.turn * 0.035 + disasterForce.wind * 0.025 + shake * 0.01 - state.angle * 0.018) / stabilityBoost;
    if (state.y >= groundY) {
      const impact = Math.max(0, state.vy - 4.2);
      if (impact > 1.5) { state.shakeAmount += impact * 1.4; emitSparks(state.x, state.y, Math.ceil(impact)); }
      state.hp -= impact * 1.8 / v.armor;
      state.y = groundY;
      state.vy *= -0.1;
      state.vx *= 0.82;
      state.spin += (state.angle > 0 ? 0.025 : -0.025) + input.turn * 0.02;
      if (impact > 1.2) state.event = "Hard landing damaged the frame.";
    }
  } else {
    state.vx += (v.thrust * engineBoost * throttle * boost + disasterForce.wind) * dt * 5;
    state.vy += input.turn * 0.018 + Math.sin(state.score * 0.03) * 0.014 + shake * 0.015;
    state.vx *= 1 - v.drag;
    state.vy *= 0.999;
    state.spin += (input.turn * 0.026 + disasterForce.wind * 0.018 + shake * 0.012) / stabilityBoost;
  }

  state.x = 170;
  state.y += state.vy;
  state.angle += state.spin;
  state.spin *= 0.965;

  if (state.failedPart) {
    state.partHealth -= dt * (4.5 + Math.abs(state.spin) * 16 + disasterForce.damage * 0.16);
    state.hp -= dt * (1.1 + qualityPenalty * 0.8);
  }

  if (state.heat >= 98) {
    state.hp -= dt * 9;
    if (Math.random() < dt * 4) emitSmoke(state.x, state.y - 20, 2);
    state.event = "Engine overheating.";
  }

  const hpRatio = state.hp / state.maxHp;
  if (hpRatio < 0.6 && Math.random() < dt * (0.6 - hpRatio) * 10) {
    emitSmoke(state.x + (Math.random() - 0.5) * 28, state.y - 10, hpRatio < 0.3 ? 2 : 1);
  }

  updatePickupsAndDebris(dt);
  updateParticles(dt);

  if (state.y < 40 || state.y > worldCanvas.height - 24 || Math.abs(state.angle) > 1.5) {
    state.hp -= dt * 18;
  }

  state.hp = Math.min(state.maxHp, state.hp);
  if (state.hp <= 0 || state.partHealth <= 0) endRun();
  updateHud();
}

function readInput() {
  const up    = keys.has("arrowup")    || keys.has("w");
  const down  = keys.has("arrowdown")  || keys.has("s");
  const left  = keys.has("arrowleft")  || keys.has("a");
  const right = keys.has("arrowright") || keys.has("d");
  return {
    throttle: up ? 1 : 0.52,
    brake: down ? 1 : 0,
    turn: (right ? 1 : 0) - (left ? 1 : 0),
    boost: keys.has(" "),
    thrusting: up
  };
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// --- Pickups & Debris ---

function spawnPickup() {
  const spec = pickupTypes[Math.floor(Math.random() * pickupTypes.length)];
  const laneY = state.vehicle.type === "ground"
    ? terrainY(state.terrainOffset + worldCanvas.width + 80) - 58
    : 100 + Math.random() * 250;
  state.pickups.push({ ...spec, x: worldCanvas.width + 80, y: laneY, r: spec.type === "coin" ? 13 : 16 });
  state.pickupTimer = 1.2 + Math.random() * 2.1;
}

function spawnDebris() {
  state.debris.push({
    x: worldCanvas.width + 70,
    y: state.vehicle.type === "ground" ? 40 + Math.random() * 220 : 30 + Math.random() * 420,
    vx: -60 - Math.random() * 90,
    vy: state.vehicle.type === "space" ? -20 + Math.random() * 40 : 60 + Math.random() * 90,
    r: 12 + Math.random() * 16
  });
  state.debrisTimer = 0.75 + Math.random() * 1.4;
}

function updatePickupsAndDebris(dt) {
  const scroll = state.vx * 70 * dt;
  state.pickups.forEach(p => {
    p.x -= scroll;
    p.y += Math.sin((state.score + p.x) * 0.04) * 0.35;
  });
  state.debris.forEach(d => {
    d.x += d.vx * dt - scroll * 0.42;
    d.y += d.vy * dt;
  });

  state.pickups = state.pickups.filter(p => {
    if (distance(p.x, p.y, state.x, state.y) < p.r + 42) { collectPickup(p); return false; }
    return p.x > -80;
  });

  state.debris = state.debris.filter(d => {
    if (distance(d.x, d.y, state.x, state.y) < d.r + 36) {
      state.hp -= (12 + d.r * 0.6) / (state.vehicle.armor + (state.levels.armor - 1) * 0.25);
      state.spin += d.vx > -100 ? 0.16 : -0.16;
      state.shakeAmount += 7;
      emitSparks(state.x, state.y, 12);
      state.event = "Debris impact.";
      return false;
    }
    return d.x > -100 && d.y < worldCanvas.height + 100;
  });
}

function collectPickup(p) {
  emitCoinPop(p.x, p.y);
  if (p.type === "coin") {
    state.runCoins += p.value;
    state.event = `Collected ${p.value} coins.`;
  } else if (p.type === "repair") {
    state.hp = Math.min(state.maxHp, state.hp + p.value);
    state.partHealth = Math.min(100, state.partHealth + p.value * 0.8);
    state.event = "Repair kit collected.";
  } else {
    state.fuel = Math.min(100, state.fuel + p.value);
    state.heat = Math.max(0, state.heat - 10);
    state.event = "Fuel cell collected.";
  }
}

function distance(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
function terrainY(x) { return 375 + Math.sin(x * 0.011) * 34 + Math.sin(x * 0.031) * 12; }

// --- Particle system ---

function emitSmoke(x, y, count = 1) {
  for (let i = 0; i < count; i++) {
    if (!state || state.particles.length >= 280) return;
    const g = 55 + Math.floor(Math.random() * 30);
    state.particles.push({
      x: x + (Math.random() - 0.5) * 16, y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 10, vy: -18 - Math.random() * 20,
      color: `rgb(${g},${g},${g})`, r: 5 + Math.random() * 8,
      life: 0.9 + Math.random() * 0.7, maxLife: 1.6, smoke: true
    });
  }
}

function emitSparks(x, y, count = 6) {
  for (let i = 0; i < count; i++) {
    if (!state || state.particles.length >= 280) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = 55 + Math.random() * 130;
    state.particles.push({
      x: x + (Math.random() - 0.5) * 18, y: y + (Math.random() - 0.5) * 18,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 40,
      color: Math.random() < 0.5 ? "#f5b84b" : "#f46a55",
      r: 2 + Math.random() * 3,
      life: 0.22 + Math.random() * 0.22, maxLife: 0.44, smoke: false
    });
  }
}

function emitCoinPop(x, y) {
  for (let i = 0; i < 8; i++) {
    if (!state || state.particles.length >= 280) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = 45 + Math.random() * 80;
    state.particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 55,
      color: "#f5b84b", r: 2.5 + Math.random() * 3,
      life: 0.4 + Math.random() * 0.25, maxLife: 0.65, smoke: false
    });
  }
}

function updateParticles(dt) {
  state.particles = state.particles.filter(p => p.life > 0);
  state.particles.forEach(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += (p.smoke ? -4 : 32) * dt;
    p.vx *= p.smoke ? 0.98 : 0.96;
    if (p.smoke) p.r += dt * 5;
    p.life -= dt;
  });
}

function drawParticles() {
  state.particles.forEach(p => {
    const alpha = Math.max(0, p.life / p.maxLife) * 0.85;
    world.save();
    world.globalAlpha = alpha;
    world.fillStyle = p.color;
    world.beginPath();
    world.arc(p.x, p.y, Math.max(0.5, p.r), 0, Math.PI * 2);
    world.fill();
    world.restore();
  });
}

// --- Render ---

function render() {
  const W = worldCanvas.width;
  const H = worldCanvas.height;
  world.clearRect(0, 0, W, H);

  const sx = state.shakeAmount > 0.4 ? (Math.random() - 0.5) * state.shakeAmount * 1.6 : 0;
  const sy = state.shakeAmount > 0.4 ? (Math.random() - 0.5) * state.shakeAmount * 1.6 : 0;

  world.save();
  world.translate(sx, sy);
  drawBackground(W, H);
  drawTerrain(W, H);
  drawPickupsAndDebris();
  drawParticles();
  drawVehicle();
  world.restore();
}

function drawBackground(W, H) {
  const v = state.vehicle;
  const t = state.terrainOffset;

  if (v.type === "space") {
    const sky = world.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#050818");
    sky.addColorStop(1, "#0e0c1a");
    world.fillStyle = sky;
    world.fillRect(0, 0, W, H);

    world.save();
    world.globalAlpha = 0.14;
    const neb = world.createRadialGradient(W * 0.35, H * 0.38, 0, W * 0.35, H * 0.38, W * 0.6);
    neb.addColorStop(0, "#4a2878");
    neb.addColorStop(1, "transparent");
    world.fillStyle = neb;
    world.fillRect(0, 0, W, H);
    world.restore();

    world.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 80; i++) {
      const x = ((i * 97 + t * 0.04) % W + W) % W;
      const y = ((i * 61) % H + H) % H;
      world.fillRect(x, y, 1, 1);
    }
    world.fillStyle = "rgba(255,255,255,0.85)";
    for (let i = 0; i < 40; i++) {
      const x = ((i * 143 + t * 0.14) % W + W) % W;
      const y = ((i * 83) % H + H) % H;
      world.fillRect(x, y, 1.5, 1.5);
    }
  } else if (v.type === "air") {
    const isVolcanic = state.disaster?.name.includes("Volcanic");
    const isStorm = state.disaster?.name.includes("Thunder") || state.disaster?.name.includes("Cyclone");
    const sky = world.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, isVolcanic ? "#2e1408" : isStorm ? "#141824" : "#173c48");
    sky.addColorStop(0.7, isVolcanic ? "#3a1c0a" : isStorm ? "#1a2230" : "#2a4030");
    sky.addColorStop(1, "#1a2a1e");
    world.fillStyle = sky;
    world.fillRect(0, 0, W, H);

    world.save();
    world.globalAlpha = 0.18;
    world.fillStyle = isVolcanic ? "#b06030" : "#d8e8e0";
    for (let i = 0; i < 5; i++) {
      const cx = ((i * 220 - t * 0.07) % W + W) % W;
      drawCloud(cx, 55 + (i * 37) % 80, 80 + (i * 23) % 60);
    }
    world.restore();

    world.save();
    world.globalAlpha = 0.26;
    world.fillStyle = isVolcanic ? "#906040" : "#c2d4cc";
    for (let i = 0; i < 7; i++) {
      const cx = ((i * 165 - t * 0.22) % W + W) % W;
      drawCloud(cx, 140 + (i * 29) % 100, 55 + (i * 17) % 40);
    }
    world.restore();
  } else {
    const isSand = state.disaster?.name.includes("Sand") || state.disaster?.name.includes("Meteor");
    const sky = world.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, isSand ? "#2a1c0e" : "#1a3040");
    sky.addColorStop(0.7, isSand ? "#3a2814" : "#1e3a24");
    sky.addColorStop(1, "#243024");
    world.fillStyle = sky;
    world.fillRect(0, 0, W, H);

    world.save();
    world.globalAlpha = 0.36;
    world.fillStyle = "#1e2e22";
    for (let i = 0; i < 12; i++) {
      const mx = ((i * 138 - t * 0.06) % W + W) % W;
      const mh = 60 + (i * 37) % 80;
      const mw = 90 + (i * 29) % 70;
      world.beginPath();
      world.moveTo(mx - mw / 2, H);
      world.lineTo(mx, terrainY(0) - mh);
      world.lineTo(mx + mw / 2, H);
      world.closePath();
      world.fill();
    }
    world.restore();

    world.save();
    world.globalAlpha = 0.54;
    world.fillStyle = "#283826";
    for (let i = 0; i < 9; i++) {
      const mx = ((i * 190 - t * 0.28) % W + W) % W;
      const mh = 40 + (i * 23) % 50;
      const mw = 110 + (i * 41) % 80;
      world.beginPath();
      world.moveTo(mx - mw / 2, H);
      world.lineTo(mx, terrainY(0) - mh);
      world.lineTo(mx + mw / 2, H);
      world.closePath();
      world.fill();
    }
    world.restore();
  }

  if (state.disaster) {
    world.save();
    world.globalAlpha = 0.28 + Math.sin(state.score * 0.08) * 0.08;
    const d = state.disaster;
    world.strokeStyle = d.name.includes("Thunder") || d.name.includes("Lightning") ? "#f7e58a"
      : d.name.includes("Sand") ? "#c8a060"
      : d.name.includes("Ash") || d.name.includes("Meteor") ? "#8a7060"
      : "#b8c8c4";
    world.lineWidth = 1.5;
    for (let i = 0; i < 18; i++) {
      const x = ((i * 88 + state.score * 14) % W + W) % W;
      const y = ((i * 43 + state.score * 6) % H + H) % H;
      world.beginPath();
      world.moveTo(x, y);
      world.lineTo(x - 34 + (d.wind || 0) * 90, y + 22);
      world.stroke();
    }
    world.restore();
  }
}

function drawCloud(cx, cy, r) {
  world.beginPath();
  world.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  world.arc(cx + r * 0.48, cy - r * 0.14, r * 0.38, 0, Math.PI * 2);
  world.arc(cx - r * 0.38, cy + r * 0.08, r * 0.32, 0, Math.PI * 2);
  world.fill();
}

function drawTerrain(W, H) {
  if (state.vehicle.type === "space") return;
  const offset = state.terrainOffset;
  world.beginPath();
  world.moveTo(0, H);
  for (let x = 0; x <= W; x += 10) world.lineTo(x, terrainY(x + offset));
  world.lineTo(W, H);
  world.closePath();
  const isFlood = state.disaster?.name === "Flood";
  world.fillStyle = isFlood ? "#1a3a4a" : state.vehicle.type === "ground" ? "#394232" : "#26382f";
  world.fill();

  if (state.vehicle.type === "ground") {
    world.beginPath();
    for (let x = 0; x <= W; x += 10) {
      x === 0 ? world.moveTo(0, terrainY(offset)) : world.lineTo(x, terrainY(x + offset));
    }
    world.strokeStyle = "#4a5c42";
    world.lineWidth = 2;
    world.stroke();

    drawGroundRocks(W, offset, isFlood);
  }
}

function drawGroundRocks(W, offset, isFlood) {
  if (isFlood) return;
  const isMeteor = state.disaster?.name.includes("Meteor");
  const isSand   = state.disaster?.name.includes("Sand");

  // Deterministic rock placement using offset as seed driver
  // 20 rocks placed in a repeating 2400-unit world strip
  const STRIP = 2400;
  const ROCK_COUNT = 20;
  for (let i = 0; i < ROCK_COUNT; i++) {
    const seed = i * 137.5;
    const worldX = ((seed * 11.3) % STRIP);
    const screenX = ((worldX - (offset % STRIP)) % STRIP + STRIP) % STRIP;
    if (screenX > W + 40 || screenX < -40) continue;

    const ty = terrainY(screenX + offset);
    const rw = 8 + (seed * 7.1) % 24;
    const rh = 5 + (seed * 4.3) % 12;
    const sides = 4 + Math.floor((seed * 2.7) % 4);
    const angle = (seed * 0.8) % (Math.PI * 2);

    world.save();
    world.translate(screenX, ty - rh * 0.5);
    world.rotate(angle);
    world.beginPath();
    for (let s = 0; s < sides; s++) {
      const a = (s / sides) * Math.PI * 2;
      const rx = Math.cos(a) * rw;
      const ry = Math.sin(a) * rh;
      s === 0 ? world.moveTo(rx, ry) : world.lineTo(rx, ry);
    }
    world.closePath();
    world.fillStyle = isMeteor ? "#5a4832" : isSand ? "#7a6848" : "#3a4838";
    world.strokeStyle = isMeteor ? "#3a2e20" : "#2a3228";
    world.lineWidth = 1.5;
    world.fill();
    world.stroke();
    world.restore();
  }

  // Scattered small pebbles (16 per strip, tiny)
  for (let i = 0; i < 16; i++) {
    const seed = i * 97.3 + 500;
    const worldX = ((seed * 9.7) % STRIP);
    const screenX = ((worldX - (offset % STRIP)) % STRIP + STRIP) % STRIP;
    if (screenX > W + 10 || screenX < -10) continue;
    const ty = terrainY(screenX + offset);
    world.beginPath();
    world.arc(screenX, ty - 2, 2 + (seed * 1.3) % 3, 0, Math.PI * 2);
    world.fillStyle = isSand ? "#8a7858" : "#303c2e";
    world.fill();
  }
}

function drawPickupsAndDebris() {
  state.pickups.forEach(p => {
    world.save();
    world.translate(p.x, p.y);
    world.fillStyle = p.color;
    world.strokeStyle = "#101311";
    world.lineWidth = 3;
    world.beginPath();
    world.arc(0, 0, p.r, 0, Math.PI * 2);
    world.fill();
    world.stroke();
    world.fillStyle = "#101311";
    world.font = "700 12px system-ui";
    world.textAlign = "center";
    world.textBaseline = "middle";
    world.fillText(p.type === "coin" ? "$" : p.type === "repair" ? "+" : "F", 0, 1);
    world.restore();
  });

  state.debris.forEach(d => {
    world.save();
    world.translate(d.x, d.y);
    world.rotate((state.score + d.x) * 0.03);
    world.fillStyle = "#8d8275";
    world.strokeStyle = "#302b26";
    world.lineWidth = 3;
    world.beginPath();
    world.moveTo(-d.r, -d.r * 0.4);
    world.lineTo(-d.r * 0.1, -d.r);
    world.lineTo(d.r, -d.r * 0.15);
    world.lineTo(d.r * 0.42, d.r);
    world.lineTo(-d.r * 0.7, d.r * 0.62);
    world.closePath();
    world.fill();
    world.stroke();
    world.restore();
  });
}

// --- Vehicle drawing ---

function drawVehicle() {
  const v = state.vehicle;
  const damaged = state.failedPart !== null;
  const hpRatio = state.hp / state.maxHp;
  const bodyColor = damaged ? "#f46a55" : hpRatio < 0.35 ? "#d4624a" : "#58c4b8";

  world.save();
  world.translate(state.x, state.y);
  world.rotate(state.angle);
  world.lineWidth = 3;
  world.strokeStyle = "#0d1210";
  world.lineCap = "round";
  world.lineJoin = "round";

  if (v.id === "car")        drawCar(bodyColor);
  else if (v.id === "bike")  drawBike(bodyColor);
  else if (v.id === "truck") drawTruck(bodyColor);
  else if (v.id === "airplane")   drawAirplane(bodyColor);
  else if (v.id === "jet")        drawJet(bodyColor);
  else if (v.id === "helicopter") drawHelicopter(bodyColor);
  else                            drawSpaceship(bodyColor);

  if (state.repairOverlay?.strokes.length > 0) {
    const scale = 0.165;
    const ox = -26, oy = -18;
    world.save();
    world.strokeStyle = "#1a1a1a";
    world.lineWidth = 1.5;
    world.globalAlpha = 0.72;
    state.repairOverlay.strokes.forEach(stroke => {
      if (stroke.length < 2) return;
      world.beginPath();
      world.moveTo(stroke[0].x * scale + ox, stroke[0].y * scale + oy);
      for (let i = 1; i < stroke.length; i++) world.lineTo(stroke[i].x * scale + ox, stroke[i].y * scale + oy);
      world.stroke();
    });
    world.restore();
  }

  if (damaged) {
    world.save();
    world.strokeStyle = "#f46a55";
    world.lineWidth = 2;
    world.globalAlpha = 0.55 + Math.sin(performance.now() * 0.014) * 0.45;
    world.beginPath();
    world.arc(0, 0, 68, 0, Math.PI * 2);
    world.stroke();
    world.restore();
  }

  world.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawCar(color) {
  world.fillStyle = color;
  roundRect(world, -46, -18, 92, 28, 6);
  world.fill(); world.stroke();
  world.fillStyle = "#c8dede";
  roundRect(world, -22, -40, 46, 24, 4);
  world.fill(); world.stroke();
  world.fillStyle = "rgba(160,220,230,0.5)";
  world.fillRect(-19, -37, 18, 18);
  world.fillRect(3, -37, 18, 18);
  drawWheel(-32, 14, 13);
  drawWheel(32, 14, 13);
}

function drawBike(color) {
  world.fillStyle = color;
  world.beginPath();
  world.moveTo(28, -12);
  world.lineTo(-24, -6);
  world.lineTo(-24, 6);
  world.lineTo(28, 4);
  world.closePath();
  world.fill(); world.stroke();
  world.save();
  world.strokeStyle = "#b0b8b0";
  world.lineWidth = 4;
  world.beginPath();
  world.moveTo(22, -12);
  world.lineTo(22, -22);
  world.stroke();
  world.restore();
  drawWheel(-22, 14, 15);
  drawWheel(24, 14, 15);
}

function drawTruck(color) {
  world.fillStyle = color;
  roundRect(world, -46, -24, 50, 38, 5);
  world.fill(); world.stroke();
  world.fillStyle = "rgba(160,220,230,0.5)";
  world.fillRect(-40, -20, 36, 14);
  world.fillStyle = "#3a4a3a";
  world.fillRect(6, -16, 56, 30);
  world.strokeRect(6, -16, 56, 30);
  drawWheel(-28, 18, 13);
  drawWheel(-10, 18, 13);
  drawWheel(34, 18, 13);
  drawWheel(50, 18, 13);
}

function drawAirplane(color) {
  world.fillStyle = color;
  world.beginPath();
  world.moveTo(60, 0);
  world.lineTo(18, -13);
  world.lineTo(-50, -9);
  world.lineTo(-62, 0);
  world.lineTo(-50, 9);
  world.lineTo(18, 13);
  world.closePath();
  world.fill(); world.stroke();

  world.fillStyle = "#48b0a4";
  world.beginPath();
  world.moveTo(8, -13);
  world.lineTo(-28, -60);
  world.lineTo(-46, -56);
  world.lineTo(-18, -13);
  world.closePath();
  world.fill(); world.stroke();
  world.beginPath();
  world.moveTo(8, 13);
  world.lineTo(-28, 60);
  world.lineTo(-46, 56);
  world.lineTo(-18, 13);
  world.closePath();
  world.fill(); world.stroke();

  world.fillStyle = "#f5b84b";
  world.beginPath();
  world.moveTo(-52, 0);
  world.lineTo(-64, -24);
  world.lineTo(-56, 0);
  world.closePath();
  world.fill();

  world.fillStyle = "#2a2a2a";
  world.fillRect(-16, -21, 28, 9);
  world.fillRect(-16, 12, 28, 9);

  world.fillStyle = "rgba(160,240,255,0.5)";
  world.beginPath();
  world.ellipse(26, 0, 13, 8, 0, 0, Math.PI * 2);
  world.fill();
}

function drawJet(color) {
  const throttle = readInput().throttle;
  world.save();
  world.globalAlpha = 0.7;
  const glow = world.createRadialGradient(-56, 0, 0, -56, 0, 24 + throttle * 16);
  glow.addColorStop(0, "#f5b84b");
  glow.addColorStop(0.5, "#f46a55");
  glow.addColorStop(1, "transparent");
  world.fillStyle = glow;
  world.beginPath();
  world.arc(-56, 0, 24 + throttle * 16, 0, Math.PI * 2);
  world.fill();
  world.restore();

  world.fillStyle = color;
  world.beginPath();
  world.moveTo(64, 0);
  world.lineTo(-38, -20);
  world.lineTo(-56, 0);
  world.lineTo(-38, 20);
  world.closePath();
  world.fill(); world.stroke();

  world.fillStyle = "#48b0a4";
  world.beginPath();
  world.moveTo(18, -6);
  world.lineTo(-30, -50);
  world.lineTo(-42, -46);
  world.lineTo(-8, -6);
  world.closePath();
  world.fill();
  world.beginPath();
  world.moveTo(18, 6);
  world.lineTo(-30, 50);
  world.lineTo(-42, 46);
  world.lineTo(-8, 6);
  world.closePath();
  world.fill();

  world.fillStyle = "rgba(160,240,255,0.55)";
  world.beginPath();
  world.ellipse(28, 0, 13, 8, 0, 0, Math.PI * 2);
  world.fill();
}

function drawHelicopter(color) {
  world.fillStyle = "#4ab0a6";
  world.beginPath();
  world.moveTo(-34, -5);
  world.lineTo(-88, -1);
  world.lineTo(-88, 7);
  world.lineTo(-34, 9);
  world.closePath();
  world.fill(); world.stroke();

  world.fillStyle = "#f5b84b";
  world.beginPath();
  world.moveTo(-86, 3);
  world.lineTo(-96, -16);
  world.lineTo(-82, -10);
  world.closePath();
  world.fill();

  world.fillStyle = color;
  world.beginPath();
  world.ellipse(-2, 0, 40, 20, 0, 0, Math.PI * 2);
  world.fill(); world.stroke();

  world.fillStyle = "rgba(160,240,255,0.5)";
  world.beginPath();
  world.ellipse(12, -4, 17, 13, 0, 0, Math.PI * 2);
  world.fill();

  world.save();
  world.strokeStyle = "#2a3830";
  world.lineWidth = 4;
  world.beginPath();
  world.moveTo(-30, 22); world.lineTo(28, 22);
  world.stroke();
  world.beginPath();
  world.moveTo(-26, 22); world.lineTo(-22, 14);
  world.stroke();
  world.beginPath();
  world.moveTo(24, 22); world.lineTo(20, 14);
  world.stroke();
  world.restore();

  world.save();
  world.strokeStyle = "#c0d0c0";
  world.lineWidth = 5;
  world.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    const a = state.rotorAngle + (i * Math.PI * 2) / 3;
    world.beginPath();
    world.moveTo(0, -4);
    world.lineTo(Math.cos(a) * 70, Math.sin(a) * 70 - 4);
    world.stroke();
  }
  world.lineWidth = 3;
  for (let i = 0; i < 2; i++) {
    const a = state.rotorAngle * 2 + i * Math.PI;
    world.beginPath();
    world.moveTo(-88, 3);
    world.lineTo(-88 + Math.cos(a) * 15, 3 + Math.sin(a) * 15);
    world.stroke();
  }
  world.restore();
}

function drawSpaceship(color) {
  const throttle = readInput().throttle;
  world.save();
  world.globalAlpha = 0.62;
  const glow = world.createRadialGradient(-52, 0, 0, -52, 0, 20 + throttle * 12);
  glow.addColorStop(0, "#58c4b8");
  glow.addColorStop(0.55, "#4848d8");
  glow.addColorStop(1, "transparent");
  world.fillStyle = glow;
  world.beginPath();
  world.arc(-52, 0, 20 + throttle * 12, 0, Math.PI * 2);
  world.fill();
  world.restore();

  world.fillStyle = color;
  world.beginPath();
  world.moveTo(58, 0);
  world.lineTo(22, -16);
  world.lineTo(-34, -22);
  world.lineTo(-52, -9);
  world.lineTo(-52, 9);
  world.lineTo(-34, 22);
  world.lineTo(22, 16);
  world.closePath();
  world.fill(); world.stroke();

  world.fillStyle = "#486888";
  world.beginPath();
  world.moveTo(0, -22);
  world.lineTo(-18, -50);
  world.lineTo(-36, -44);
  world.lineTo(-28, -22);
  world.closePath();
  world.fill();
  world.beginPath();
  world.moveTo(0, 22);
  world.lineTo(-18, 50);
  world.lineTo(-36, 44);
  world.lineTo(-28, 22);
  world.closePath();
  world.fill();

  world.fillStyle = "#c8b84a";
  world.fillRect(-26, -56, 16, 7);
  world.fillRect(-26, 49, 16, 7);

  world.fillStyle = "rgba(160,240,255,0.6)";
  world.beginPath();
  world.ellipse(26, 0, 15, 10, 0, 0, Math.PI * 2);
  world.fill();
}

function drawWheel(x, y, r) {
  world.save();
  world.translate(x, y);
  world.rotate(state.wheelAngle);
  world.beginPath();
  world.arc(0, 0, r, 0, Math.PI * 2);
  world.fillStyle = "#161918";
  world.fill(); world.stroke();
  world.strokeStyle = "#f5b84b";
  world.lineWidth = 2;
  world.beginPath();
  world.moveTo(-r * 0.55, 0); world.lineTo(r * 0.55, 0);
  world.moveTo(0, -r * 0.55); world.lineTo(0, r * 0.55);
  world.stroke();
  world.beginPath();
  world.arc(0, 0, r * 0.28, 0, Math.PI * 2);
  world.fillStyle = "#f5b84b";
  world.fill();
  world.lineWidth = 3;
  world.strokeStyle = "#0d1210";
  world.restore();
}

// --- HUD & UI ---

function updateHud() {
  document.querySelector("#runCoins").textContent = Math.floor(state.runCoins);
  document.querySelector("#score").textContent = Math.floor(state.score);
  document.querySelector("#hp").textContent = Math.max(0, Math.floor(state.hp));
  document.querySelector("#partHealth").textContent = Math.max(0, Math.floor(state.partHealth));
  document.querySelector("#fuel").textContent = Math.max(0, Math.floor(state.fuel));
  document.querySelector("#heat").textContent = Math.max(0, Math.floor(state.heat));
  document.querySelector("#disaster").textContent = state.disaster ? state.disaster.name : "Clear";
  document.querySelector("#eventLog").textContent = state.event;
}

function updateRepairText() {
  const title = document.querySelector("#repairTitle");
  const hint = document.querySelector("#repairHint");
  if (!state || !state.failedPart) {
    title.textContent = "Repair Ready";
    hint.textContent = "Draw when a part fails.";
    document.querySelector("#repairResult").textContent = "No active failure.";
    return;
  }
  title.textContent = `${state.failedPart} failed`;
  hint.textContent = `Draw the ${shapeExpectation(state.failedPart)} fast. Shape quality matters.`;
  document.querySelector("#repairResult").textContent = "Sketch a replacement, then install it.";
  clearDrawing();
}

function clearDrawing() {
  strokes = [];
  currentStroke = [];
  draw.fillStyle = "#f2ead7";
  draw.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
  draw.strokeStyle = "#171717";
  draw.lineWidth = 6;
  draw.lineCap = "round";
  draw.lineJoin = "round";
  drawRepairGuide();
}

function drawRepairGuide() {
  if (!state || !state.failedPart) return;
  const part = state.failedPart;
  draw.save();
  draw.strokeStyle = "rgba(30,30,30,0.22)";
  draw.fillStyle = "rgba(30,30,30,0.06)";
  draw.lineWidth = 8;
  draw.setLineDash([12, 10]);
  draw.lineCap = "round";
  draw.lineJoin = "round";

  if (part.includes("wheel") || part.includes("gear") || part.includes("reactor")) {
    draw.beginPath(); draw.arc(160, 120, 62, 0, Math.PI * 2); draw.stroke();
    draw.beginPath(); draw.arc(160, 120, 24, 0, Math.PI * 2); draw.stroke();
  } else if (part.includes("pipe") || part.includes("axle") || part.includes("fuel") || part.includes("oxygen")) {
    draw.beginPath();
    draw.moveTo(52, 140);
    draw.bezierCurveTo(96, 70, 212, 70, 268, 128);
    draw.stroke();
  } else if (part.includes("wing") || part.includes("rotor") || part.includes("solar")) {
    draw.beginPath();
    draw.moveTo(42, 138); draw.lineTo(278, 82); draw.lineTo(228, 150); draw.lineTo(78, 166);
    draw.closePath(); draw.stroke(); draw.fill();
  } else if (part.includes("thruster") || part.includes("nozzle")) {
    draw.beginPath();
    draw.moveTo(96, 72); draw.lineTo(228, 120); draw.lineTo(96, 168);
    draw.closePath(); draw.stroke();
  } else {
    draw.strokeRect(78, 66, 164, 112);
  }

  draw.setLineDash([]);
  draw.fillStyle = "rgba(30,30,30,0.35)";
  draw.font = "700 18px system-ui";
  draw.textAlign = "center";
  draw.fillText(part.toUpperCase(), 160, 220);
  draw.restore();
}

function pointerPos(event) {
  const rect = drawCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * drawCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * drawCanvas.height
  };
}

function scoreDrawing() {
  const points = strokes.flat();
  if (points.length < 8) return 0;

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const bw = maxX - minX;
  const bh = maxY - minY;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  // Base coverage and stroke density (always count)
  const coverageScore = Math.min(1, (bw * bh) / 14000);
  const strokeScore   = Math.min(1, points.length / 85);

  const part = state?.failedPart || "";
  let shapeScore = 0.5; // default for unrecognised parts

  if (part.includes("wheel") || part.includes("gear") || part.includes("reactor")) {
    // Expect a round shape: points should be roughly equidistant from centroid
    const dists = points.map(p => Math.hypot(p.x - cx, p.y - cy));
    const avgR = dists.reduce((a, b) => a + b, 0) / dists.length;
    const variance = dists.reduce((a, d) => a + Math.abs(d - avgR), 0) / dists.length;
    const circularity = Math.max(0, 1 - variance / Math.max(avgR, 1));
    // Also check aspect ratio — a circle has equal width and height
    const aspect = Math.min(bw, bh) / Math.max(bw, bh, 1);
    shapeScore = circularity * 0.6 + aspect * 0.4;

  } else if (part.includes("pipe") || part.includes("axle") || part.includes("oxygen") || part.includes("fuel pipe") || part.includes("chain")) {
    // Expect an elongated shape: width much greater than height (or vice versa)
    const elongation = Math.max(bw, bh) / Math.max(Math.min(bw, bh), 1);
    shapeScore = Math.min(1, elongation / 4); // 4:1 ratio = perfect

  } else if (part.includes("wing") || part.includes("rotor") || part.includes("solar") || part.includes("stabilizer") || part.includes("rudder")) {
    // Expect a wide flat shape — high width-to-height ratio, good coverage
    const flatness = bw / Math.max(bh, 1);
    shapeScore = Math.min(1, flatness / 3.5);

  } else if (part.includes("thruster") || part.includes("nozzle") || part.includes("jet nozzle")) {
    // Expect a triangular shape — check that points cluster at two ends with a point in the middle-ish
    // Simple heuristic: bounding box is taller than wide and coverage is decent on both sides
    const triangularity = Math.min(bw, bh) / Math.max(bw, bh, 1);
    // Invert — a triangle should have some asymmetry
    shapeScore = Math.max(0.2, 1 - triangularity * 0.6);

  } else if (part.includes("spring") || part.includes("armor") || part.includes("shield") || part.includes("heat") || part.includes("reactor coil")) {
    // Expect a chunky blocky shape — roughly square bounding box with good fill
    const squareness = Math.min(bw, bh) / Math.max(bw, bh, 1);
    shapeScore = squareness * 0.7 + coverageScore * 0.3;

  } else if (part.includes("propeller") || part.includes("antenna") || part.includes("gear")) {
    // Multi-arm shapes — just reward stroke density and coverage
    shapeScore = strokeScore * 0.6 + coverageScore * 0.4;
  }

  shapeScore = clamp(shapeScore, 0, 1);
  const final = coverageScore * 0.35 + strokeScore * 0.25 + shapeScore * 0.40;
  return Math.max(0.15, Math.min(1, final));
}

function shapeExpectation(part) {
  if (!part) return "replacement";
  if (part.includes("wheel") || part.includes("gear") || part.includes("reactor")) return "circle (wheel)";
  if (part.includes("pipe") || part.includes("axle") || part.includes("oxygen") || part.includes("chain")) return "long tube or pipe";
  if (part.includes("wing") || part.includes("rotor") || part.includes("solar") || part.includes("rudder")) return "wide flat shape";
  if (part.includes("thruster") || part.includes("nozzle")) return "triangle (nozzle)";
  if (part.includes("spring") || part.includes("armor") || part.includes("shield")) return "solid block";
  return "replacement part";
}

function getShapeHint(part) {
  if (!part) return "";
  if (part.includes("wheel") || part.includes("gear") || part.includes("reactor")) return "Draw a rounder circle.";
  if (part.includes("pipe") || part.includes("axle") || part.includes("oxygen") || part.includes("chain")) return "Draw a longer line or tube.";
  if (part.includes("wing") || part.includes("rotor") || part.includes("solar") || part.includes("rudder")) return "Draw wider and flatter.";
  if (part.includes("thruster") || part.includes("nozzle")) return "Draw a pointed triangle shape.";
  if (part.includes("spring") || part.includes("armor") || part.includes("shield")) return "Draw a solid blocky shape.";
  return "Cover more of the guide shape.";
}

function installRepair() {
  if (!state || !state.failedPart) {
    document.querySelector("#repairResult").textContent = "Nothing is broken yet.";
    return;
  }
  const quality = scoreDrawing();
  if (quality <= 0) {
    document.querySelector("#repairResult").textContent = "Draw more of the part before installing.";
    return;
  }
  const repairBoost = 1 + (state.levels.repair - 1) * 0.12;
  state.repairQuality = Math.min(1, quality * repairBoost);
  state.repairOverlay = { strokes: JSON.parse(JSON.stringify(strokes)), part: state.failedPart };
  state.partHealth = 60 + state.repairQuality * 58;
  state.hp = Math.min(state.maxHp, state.hp + 10 + state.repairQuality * 18);
  state.runCoins += 12 + state.repairQuality * 26;
  state.shakeAmount += 3;
  emitSparks(state.x, state.y, 5);
  state.event = `${state.failedPart} patched at ${Math.round(state.repairQuality * 100)}%.`;
  const pct = Math.round(state.repairQuality * 100);
  const grade = pct >= 85 ? "Excellent" : pct >= 65 ? "Good" : pct >= 42 ? "Fair" : "Rough";
  const partHint = getShapeHint(state.repairOverlay.part);
  document.querySelector("#repairResult").textContent = `${grade} repair — ${pct}% quality. +${Math.floor(12 + state.repairQuality * 26)} coins. ${pct < 65 ? partHint : ""}`;
  state.failedPart = null;
  clearDrawing();
  updateRepairText();
}

function healVehicle() {
  if (!state) return;
  const cost = 35;
  if (state.runCoins < cost) {
    document.querySelector("#repairResult").textContent = "Need 35 run coins to heal.";
    return;
  }
  state.runCoins -= cost;
  state.hp = Math.min(state.maxHp, state.hp + 32);
  state.event = "Emergency heal applied.";
  document.querySelector("#repairResult").textContent = "Emergency heal applied.";
}

function endRun() {
  state.over = true;
  cancelAnimationFrame(animationId);
  touchControls.classList.add("hidden");
  const earned = Math.floor(state.runCoins + state.score * 0.18);
  const previousBest = bestScores[state.vehicle.id] || 0;
  const isRecord = state.score > previousBest;
  if (isRecord) bestScores[state.vehicle.id] = Math.floor(state.score);
  bank += earned;
  saveProgress();
  document.querySelector("#runSummary").textContent =
    `Score ${Math.floor(state.score)}${isRecord ? " · new best!" : ""} · earned ${earned} coins. Spend them on upgrades and launch again.`;
  gameOver.classList.remove("hidden");
  renderGarage();
}

// --- Drawing canvas events ---

drawCanvas.addEventListener("pointerdown", event => {
  drawing = true;
  currentStroke = [pointerPos(event)];
});

drawCanvas.addEventListener("pointermove", event => {
  if (!drawing) return;
  const pos = pointerPos(event);
  const last = currentStroke[currentStroke.length - 1];
  currentStroke.push(pos);
  draw.beginPath();
  draw.moveTo(last.x, last.y);
  draw.lineTo(pos.x, pos.y);
  draw.stroke();
});

window.addEventListener("pointerup", () => {
  if (!drawing) return;
  drawing = false;
  if (currentStroke.length) strokes.push(currentStroke);
  currentStroke = [];
});

window.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
  keys.add(key);
});

window.addEventListener("keyup", event => keys.delete(event.key.toLowerCase()));

document.querySelector("#clearDraw").addEventListener("click", clearDrawing);
document.querySelector("#installDraw").addEventListener("click", installRepair);
document.querySelector("#healButton").addEventListener("click", healVehicle);
document.querySelector("#startButton").addEventListener("click", startRun);
document.querySelector("#backToGarage").addEventListener("click", () => {
  gameOver.classList.add("hidden");
  game.classList.add("hidden");
  garage.classList.remove("hidden");
});

document.querySelectorAll(".upgrade-button").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.upgrade;
    const levels = getLevels();
    const cost = upgradeCost(levels[key]);
    if (bank < cost) return;
    bank -= cost;
    levels[key] += 1;
    saveProgress();
    renderGarage();
  });
});

// Mobile touch controls
const touchMap = { "tc-up": "w", "tc-down": "s", "tc-left": "a", "tc-right": "d", "tc-boost": " " };
Object.entries(touchMap).forEach(([id, key]) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("pointerdown", e => { e.preventDefault(); keys.add(key); });
  btn.addEventListener("pointerup",   e => { e.preventDefault(); keys.delete(key); });
  btn.addEventListener("pointerleave", () => keys.delete(key));
});

clearDrawing();
renderGarage();
