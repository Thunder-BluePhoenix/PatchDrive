const vehicles = [
  { id: "car",        name: "Scout Car",    type: "ground", mass: 1.10, thrust: 0.50, grip: 0.86, lift: 0,     drag: 0.018, stability: 0.80, armor: 1.00, unlockCost: 0 },
  { id: "bike",       name: "Ridge Bike",   type: "ground", mass: 0.72, thrust: 0.62, grip: 0.78, lift: 0,     drag: 0.020, stability: 0.52, armor: 0.70, unlockCost: 0 },
  { id: "truck",      name: "Iron Truck",   type: "ground", mass: 1.70, thrust: 0.42, grip: 0.90, lift: 0,     drag: 0.024, stability: 0.95, armor: 1.45, unlockCost: 0 },
  { id: "buggy",      name: "Dune Buggy",   type: "ground", mass: 0.88, thrust: 0.70, grip: 0.80, lift: 0,     drag: 0.019, stability: 0.65, armor: 0.78, unlockCost: 600,  parts: ["wheel", "gear", "axle", "spring", "armor plate"] },
  { id: "airplane",   name: "Aero Wing",    type: "air",    mass: 1.05, thrust: 0.62, grip: 0.20, lift: 0.055, drag: 0.014, stability: 0.72, armor: 0.82, unlockCost: 0 },
  { id: "jet",        name: "Storm Jet",    type: "air",    mass: 1.20, thrust: 0.88, grip: 0.16, lift: 0.052, drag: 0.018, stability: 0.64, armor: 0.78, unlockCost: 0 },
  { id: "helicopter", name: "Patch Copter", type: "air",    mass: 1.00, thrust: 0.50, grip: 0.10, lift: 0.072, drag: 0.022, stability: 0.58, armor: 0.84, unlockCost: 800 },
  { id: "spaceship",  name: "Orbit Scrap",  type: "space",  mass: 1.25, thrust: 0.55, grip: 0,    lift: 0,     drag: 0.003, stability: 0.46, armor: 0.90, unlockCost: 0 },
  { id: "orbital",    name: "Void Runner",  type: "space",  mass: 0.95, thrust: 0.72, grip: 0,    lift: 0,     drag: 0.002, stability: 0.54, armor: 0.72, unlockCost: 1200, parts: ["thruster", "shield panel", "oxygen pipe", "solar panel", "reactor coil"] }
];

const disasters = {
  ground: [
    { name: "Earthquake",    wind:  0.00, shake: 0.95, friction: 0.95, damage: 6 },
    { name: "Flood",         wind:  0.00, shake: 0.10, friction: 0.62, damage: 4 },
    { name: "Sandstorm",     wind: -0.13, shake: 0.20, friction: 0.74, damage: 5 },
    { name: "Meteor Shower", wind:  0.04, shake: 0.40, friction: 1.00, damage: 9 },
    { name: "Landslide",     wind:  0.06, shake: 0.80, friction: 0.70, damage: 7 },
    { name: "Ice Storm",     wind: -0.08, shake: 0.25, friction: 0.40, damage: 5, special: "ice" },
    { name: "Tornado",       wind: -0.45, shake: 0.90, friction: 0.80, damage: 8 },
    { name: "Mud Surge",     wind:  0.00, shake: 0.15, friction: 0.50, damage: 4 }
  ],
  air: [
    { name: "Thunderstorm",  wind: -0.20, shake: 0.70, friction: 1, damage: 7 },
    { name: "Turbulence",    wind:  0.16, shake: 1.00, friction: 1, damage: 5 },
    { name: "Volcanic Ash",  wind: -0.06, shake: 0.24, friction: 1, damage: 8 },
    { name: "Cyclone",       wind: -0.32, shake: 0.85, friction: 1, damage: 9 },
    { name: "Lightning",     wind:  0.00, shake: 0.50, friction: 1, damage: 10, special: "lightning" },
    { name: "Engine Icing",  wind: -0.05, shake: 0.10, friction: 1, damage: 6,  special: "engine_ice" },
    { name: "Air Debris",    wind:  0.10, shake: 0.30, friction: 1, damage: 6,  special: "debris_heavy" }
  ],
  space: [
    { name: "Asteroid Field",   wind:  0.02, shake: 0.65, friction: 1, damage: 9 },
    { name: "Solar Flare",      wind: -0.08, shake: 0.30, friction: 1, damage: 8 },
    { name: "Gravity Well",     wind:  0.00, shake: 0.55, friction: 1, damage: 6 },
    { name: "Debris Storm",     wind:  0.18, shake: 0.70, friction: 1, damage: 7 },
    { name: "Radiation Burst",  wind:  0.00, shake: 0.20, friction: 1, damage: 10, special: "radiation" },
    { name: "Oxygen Leak",      wind:  0.00, shake: 0.10, friction: 1, damage: 5,  special: "fuel_drain" },
    { name: "Plasma Surge",     wind:  0.15, shake: 0.60, friction: 1, damage: 8,  special: "overheat" }
  ]
};

const partByType = {
  ground: ["wheel", "gear", "axle", "spring", "armor plate"],
  air:    ["wing patch", "rotor blade", "rudder", "jet nozzle", "fuel pipe"],
  space:  ["thruster", "shield panel", "oxygen pipe", "solar panel", "reactor coil"]
};

const typeUpgrades = {
  ground: [
    { key: "tireGrip",   label: "Tire Grip",   desc: "+grip per level"    },
    { key: "suspension", label: "Suspension",  desc: "-impact damage"      },
    { key: "autoRepair", label: "Auto-Repair", desc: "Slow part self-heal" }
  ],
  air: [
    { key: "liftBoost",      label: "Lift",        desc: "+lift force per level" },
    { key: "fuelEfficiency", label: "Fuel Eff",    desc: "-fuel use per level"   },
    { key: "autoRepair",     label: "Auto-Repair", desc: "Slow part self-heal"   }
  ],
  space: [
    { key: "thrusterPower",  label: "Thrusters",   desc: "+thrust per level"     },
    { key: "shieldStrength", label: "Shield",      desc: "-hazard damage"        },
    { key: "autoRepair",     label: "Auto-Repair", desc: "Slow part self-heal"   }
  ]
};

// --- Biomes ---
const biomes = {
  ground: [
    { name: "Plains",      scoreStart: 0,    groundColor: "#394232", skyTop: "#1a3040", skyBot: "#1e3a24", rockColor: "#3a4838" },
    { name: "Desert",      scoreStart: 500,  groundColor: "#5a4828", skyTop: "#2a1c0e", skyBot: "#3a2814", rockColor: "#7a6040" },
    { name: "Ice Fields",  scoreStart: 1100, groundColor: "#7ab4c8", skyTop: "#183048", skyBot: "#243848", rockColor: "#9ac4d8" },
    { name: "City Rubble", scoreStart: 1900, groundColor: "#3a3830", skyTop: "#1c1c20", skyBot: "#242424", rockColor: "#5a5850" },
    { name: "Volcanic",    scoreStart: 2900, groundColor: "#2e1408", skyTop: "#2a0808", skyBot: "#1a0808", rockColor: "#6a2808" }
  ],
  air: [
    { name: "Low Clouds",  scoreStart: 0,    skyTop: "#173c48", skyBot: "#2a4030" },
    { name: "Storm Layer", scoreStart: 600,  skyTop: "#141824", skyBot: "#1a2230" },
    { name: "High Alt",    scoreStart: 1400, skyTop: "#080c20", skyBot: "#101828" },
    { name: "Space Edge",  scoreStart: 2400, skyTop: "#050818", skyBot: "#0a0c1a" }
  ],
  space: [
    { name: "Near Orbit",    scoreStart: 0,    nebulaColor: "#4a2878", starDensity: 80 },
    { name: "Asteroid Belt", scoreStart: 700,  nebulaColor: "#784428", starDensity: 50 },
    { name: "Deep Space",    scoreStart: 1600, nebulaColor: "#284878", starDensity: 120 },
    { name: "Nebula Core",   scoreStart: 2800, nebulaColor: "#782848", starDensity: 160 }
  ]
};

// --- Boss events ---
const bossEvents = {
  ground: {
    name: "Mega Tornado",
    phases: [
      { label: "Approaching",  wind: -0.25, shake: 0.5,  friction: 0.7,  damage: 5,  duration: 8  },
      { label: "Direct Hit",   wind: -0.65, shake: 1.2,  friction: 0.55, damage: 12, duration: 10 },
      { label: "Aftermath",    wind: -0.1,  shake: 0.35, friction: 0.8,  damage: 4,  duration: 7  }
    ]
  },
  air: {
    name: "Storm Front",
    phases: [
      { label: "Rolling In",   wind: -0.3,  shake: 0.6,  friction: 1, damage: 6,  duration: 7,  special: "lightning" },
      { label: "Full Force",   wind: -0.5,  shake: 1.1,  friction: 1, damage: 14, duration: 10, special: "lightning" },
      { label: "Passing",      wind: -0.15, shake: 0.45, friction: 1, damage: 5,  duration: 6  }
    ]
  },
  space: {
    name: "Colossal Asteroid",
    phases: [
      { label: "Incoming",     wind: 0.06, shake: 0.4,  friction: 1, damage: 7,  duration: 8,  special: "debris_heavy" },
      { label: "Impact Zone",  wind: 0.12, shake: 1.3,  friction: 1, damage: 15, duration: 9,  special: "debris_heavy" },
      { label: "Debris Field", wind: 0.08, shake: 0.5,  friction: 1, damage: 6,  duration: 8,  special: "radiation" }
    ]
  }
};

// --- Loadouts ---
const loadouts = [
  { id: "none",      label: "Standard",       desc: "No bonus — balanced run" },
  { id: "hull",      label: "Reinforced Hull", desc: "Start with +25 max HP"  },
  { id: "tank",      label: "Full Tank",       desc: "Start with 130% fuel and slower burn" },
  { id: "tools",     label: "Sharp Tools",     desc: "First repair scores +25%" },
  { id: "veteran",   label: "Veteran Parts",   desc: "No part failure for first 20 seconds" }
];

// Saved custom part sketches (persist across sessions)
let savedParts = JSON.parse(localStorage.getItem("patchdrive-saved-parts") || "[]");

const missionPool = [
  { desc: "Survive 3 disasters",       key: "disasterCount",  target: 3,   reward: 130 },
  { desc: "Complete 4 repairs",        key: "repairCount",    target: 4,   reward: 110 },
  { desc: "Travel 1000 distance",      key: "score",          target: 1000, reward: 90 },
  { desc: "Collect 6 pickups",         key: "pickupCount",    target: 6,   reward: 100 },
  { desc: "Land a 90%+ quality repair",key: "perfectRepair",  target: 1,   reward: 160 },
  { desc: "Survive 2 minutes",         key: "time",           target: 120, reward: 110 },
  { desc: "Boost for 15 seconds",      key: "boostTime",      target: 15,  reward: 100 },
  { desc: "Survive 5 disasters",       key: "disasterCount",  target: 5,   reward: 200 },
  { desc: "Complete 6 repairs",        key: "repairCount",    target: 6,   reward: 180 },
  { desc: "Travel 2500 distance",      key: "score",          target: 2500, reward: 150 }
];

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
let unlockedVehicles = new Set(JSON.parse(localStorage.getItem("patchdrive-unlocks") || '["car","bike","truck","airplane","jet","spaceship"]'));
let paused = false;
let selectedLoadout = "none";
let gameMode = "normal"; // "normal" = auto-pilot + tap pickups | "hell" = manual + auto-collect
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
  const v = vehicles.find(v => v.id === id);
  const type = v?.type || "ground";
  const typeDefaults = Object.fromEntries((typeUpgrades[type] || []).map(u => [u.key, 1]));
  upgrades[id] ||= {};
  const defaults = { engine: 1, armor: 1, stability: 1, repair: 1, ...typeDefaults };
  for (const k of Object.keys(defaults)) {
    if (!(k in upgrades[id])) upgrades[id][k] = defaults[k];
  }
  return upgrades[id];
}

function saveProgress() {
  localStorage.setItem("patchdrive-bank", String(bank));
  localStorage.setItem("patchdrive-upgrades", JSON.stringify(upgrades));
  localStorage.setItem("patchdrive-best-scores", JSON.stringify(bestScores));
  localStorage.setItem("patchdrive-unlocks", JSON.stringify([...unlockedVehicles]));
}

// --- Garage UI ---

function renderGarage() {
  document.querySelector("#bankCoins").textContent = bank;
  vehicleGrid.innerHTML = "";
  vehicles.forEach(vehicle => {
    const locked = !unlockedVehicles.has(vehicle.id);
    const button = document.createElement("button");
    button.className = `vehicle-card ${vehicle.id === selectedVehicleId ? "selected" : ""} ${locked ? "locked" : ""}`;
    button.innerHTML = `<strong>${vehicle.name}</strong><span class="vc-type">${vehicle.type.toUpperCase()}</span><span class="vc-stats">${locked ? `Unlock: ${vehicle.unlockCost} coins` : `Mass ${vehicle.mass.toFixed(1)} · Stability ${Math.round(vehicle.stability * 100)}`}</span>`;
    button.addEventListener("click", () => {
      if (locked) {
        if (bank >= vehicle.unlockCost) {
          bank -= vehicle.unlockCost;
          unlockedVehicles.add(vehicle.id);
          saveProgress();
          selectedVehicleId = vehicle.id;
          renderGarage();
        }
        return;
      }
      selectedVehicleId = vehicle.id;
      renderGarage();
    });
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
    document.querySelector(`#${key}Cost`).textContent = `${cost}`;
    const btn = document.querySelector(`[data-upgrade="${key}"]`);
    btn.title = `Upgrade for ${cost} coins`;
    btn.disabled = bank < cost;
  });

  // Type-specific upgrades
  const typeGrid = document.querySelector("#typeUpgradeGrid");
  const typeLabel = document.querySelector("#typeUpgradeLabel");
  typeGrid.innerHTML = "";
  const tUpgrades = typeUpgrades[vehicle.type] || [];
  typeLabel.style.display = tUpgrades.length ? "" : "none";
  tUpgrades.forEach(u => {
    const level = levels[u.key] || 1;
    const cost = upgradeCost(level);
    const btn = document.createElement("button");
    btn.className = "upgrade-button";
    btn.dataset.upgrade = u.key;
    btn.title = u.desc;
    btn.disabled = bank < cost;
    btn.innerHTML = `<span>${u.label} <em>${cost}</em></span><strong>${level}</strong>`;
    btn.addEventListener("click", () => {
      if (bank < cost) return;
      bank -= cost;
      levels[u.key] = (levels[u.key] || 1) + 1;
      saveProgress();
      renderGarage();
    });
    typeGrid.appendChild(btn);
  });
}

function upgradeCost(level) { return 80 + level * level * 45; }

// --- Run ---

function getBiome() {
  if (!state) return biomes.ground[0];
  const list = biomes[state.vehicle.type] || biomes.ground;
  let b = list[0];
  for (const zone of list) {
    if (state.score >= zone.scoreStart) b = zone;
  }
  return b;
}

function startRun() {
  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  const levels = getLevels();
  const loadout = loadouts.find(l => l.id === (selectedLoadout || "none"));

  const baseHp  = 100 + (levels.armor - 1) * 18 + (loadout.id === "hull" ? 25 : 0);
  const baseFuel = loadout.id === "tank" ? 130 : 100;

  state = {
    vehicle, levels,
    hp: baseHp, maxHp: baseHp,
    partHealth: 100,
    score: 0, runCoins: 0,
    x: 170,
    y: vehicle.type === "ground" ? terrainY(170) - 30 : 220,
    vx: 2.2, vy: 0, angle: 0, spin: 0,
    terrainOffset: 0,
    disaster: null, disasterTimer: 9,
    nextFailure: loadout.id === "veteran" ? 25 : 5,
    pickupTimer: 1.4, debrisTimer: 3,
    pickups: [], debris: [],
    particles: [],
    shakeAmount: 0,
    repairOverlay: null,
    wheelAngle: 0,
    rotorAngle: 0,
    fuel: baseFuel, heat: 0,
    event: "Systems online.",
    failedPart: null,
    repairQuality: 1,
    last: performance.now(),
    over: false,
    loadout: loadout.id,
    firstRepairDone: false,
    // biome
    biomeName: "",
    // boss
    bossEvent: null,
    bossTimer: 900 + Math.random() * 200,
    // checkpoint
    checkpointNext: 700,
    checkpointShown: new Set(),
    atCheckpoint: false,
    // auto-repair
    autoRepairLevel: levels.autoRepair || 1,
    // stats
    disasterCount: 0,
    repairCount: 0,
    pickupCount: 0,
    bestRepairQuality: 0,
    boostTime: 0,
    time: 0,
    // mission
    mission: pickMission()
  };
  garage.classList.add("hidden");
  game.classList.remove("hidden");
  gameOver.classList.add("hidden");
  paused = false;
  // In normal mode: vehicle is auto-piloted, no touch D-pad needed
  if ("ontouchstart" in window && gameMode === "hell") touchControls.classList.remove("hidden");
  else touchControls.classList.add("hidden");
  // Update control hint and mode badge
  const hint = document.querySelector("#controlHint");
  const badge = document.querySelector("#modeBadge");
  if (hint) hint.childNodes[0].textContent = gameMode === "normal"
    ? "Auto-pilot active · Draw broken parts · Tap pickups on screen "
    : "W/Up thrust · A/D balance · S brake · Space boost · P pause ";
  if (badge) {
    badge.textContent = gameMode === "normal" ? "Normal" : "Hell 🔥";
    badge.className = gameMode === "normal" ? "mode-badge" : "mode-badge hell";
  }
  clearDrawing();
  updateRepairText();
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(loop);
  SFX.startEngine(v.id);
}

function loop(now) {
  if (!state || state.over) return;
  if (paused) { state.last = now; animationId = requestAnimationFrame(loop); return; }
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
  const disasterForce = state.bossEvent
    ? state.bossEvent.phases[state.bossEvent.phase]
    : (state.disaster || { wind: 0, shake: 0, friction: 1, damage: 0 });
  const engineBoost = 1 + (levels.engine - 1) * 0.12;
  const stabilityBoost = 1 + (levels.stability - 1) * 0.13;
  const qualityPenalty = 1.25 - state.repairQuality * 0.45;
  const gripBonus    = v.type === "ground" ? (levels.tireGrip   || 1) * 0.04 - 0.04 : 0;
  const suspBonus    = v.type === "ground" ? (levels.suspension || 1) * 0.05 - 0.05 : 0;
  const liftBonus    = v.type === "air"    ? (levels.liftBoost  || 1) * 0.006 - 0.006 : 0;
  const fuelSave     = v.type === "air"    ? (levels.fuelEfficiency || 1) * 0.06 - 0.06 : 0;
  const thrustBonus  = v.type === "space"  ? (levels.thrusterPower  || 1) * 0.06 - 0.06 : 0;
  const shieldBonus  = v.type === "space"  ? (levels.shieldStrength || 1) * 0.05 - 0.05 : 0;
  const isIced       = disasterForce.special === "ice";
  const engineMult   = disasterForce.special === "engine_ice" ? 0.55 : 1;
  const input = gameMode === "normal" ? autoInput() : readInput();
  const boost = input.boost && state.fuel > 4 && state.heat < 92 ? 1.45 : 1;
  SFX.updateEngine(input.throttle, boost, state.vx);
  const throttle = state.fuel > 0 ? input.throttle : 0.18;
  const speedPressure = Math.min(1.8, Math.max(0, state.vx - 2) * 0.05);

  state.score += dt * (10 + Math.abs(state.vx) * 2);
  state.runCoins += dt * 2.4;
  state.terrainOffset += state.vx * 70 * dt;
  state.disasterTimer -= dt;
  state.nextFailure -= dt;
  state.pickupTimer -= dt;
  state.debrisTimer -= dt;
  state.fuel -= dt * (0.9 + throttle * boost * 2.2) * (1 - fuelSave);
  if (disasterForce.special === "fuel_drain") state.fuel -= dt * 3.5;
  state.heat += dt * (throttle * boost * 9 + Math.abs(state.spin) * 2 + speedPressure);
  if (disasterForce.special === "overheat") state.heat += dt * 12;
  state.heat -= dt * (v.type === "space" ? 3.2 : 5.1);
  state.fuel = clamp(state.fuel, 0, 100);
  state.heat = clamp(state.heat, 0, 100);
  state.wheelAngle += state.vx * dt * 3.5;
  state.rotorAngle += dt * (8 + throttle * 14);
  state.shakeAmount = Math.max(0, state.shakeAmount - dt * 24);
  state.time += dt;
  if (input.boost && state.fuel > 4 && state.heat < 92) state.boostTime += dt;

  if (state.disasterTimer <= 0) {
    const list = disasters[v.type];
    state.disaster = list[Math.floor(Math.random() * list.length)];
    state.disasterTimer = Math.max(5, 10 - state.score * 0.002) + Math.random() * 7;
    const shieldMult = 1 - shieldBonus;
    const dmg = state.disaster.damage / (v.armor + (levels.armor - 1) * 0.22) * shieldMult;
    state.hp -= dmg;
    state.shakeAmount += state.disaster.shake * 12;
    emitSparks(state.x, vcy(), Math.ceil(state.disaster.shake * 8));
    state.event = `${state.disaster.name} incoming.`;
    state.disasterCount++;
    updateMission();
    SFX.playDisasterStart();
    // Special instant effects
    if (state.disaster.special === "lightning") {
      state.hp -= 8 * shieldMult;
      state.heat = Math.min(100, state.heat + 20);
      state.shakeAmount += 10;
    }
    if (state.disaster.special === "radiation") {
      state.hp -= 12 * shieldMult;
      state.shakeAmount += 8;
    }
  }

  if (state.disaster && state.disasterTimer < 3) state.disaster = null;

  if (state.nextFailure <= 0 && !state.failedPart) {
    const parts = partByType[v.type];
    state.failedPart = parts[Math.floor(Math.random() * parts.length)];
    state.partHealth = 28 + Math.random() * 22;
    state.nextFailure = Math.max(6, 12 - state.score * 0.002) + Math.random() * 8;
    state.shakeAmount += 6;
    emitSparks(state.x, vcy(), 10);
    state.event = `${state.failedPart} failed. Draw a fix.`;
    SFX.playPartFailure();
    updateRepairText();
  }

  if (state.pickupTimer <= 0) spawnPickup();
  if ((state.disaster || state.bossEvent) && state.debrisTimer <= 0) spawnDebris();

  // Biome transition notification
  const curBiome = getBiome();
  if (curBiome.name !== state.biomeName) {
    state.biomeName = curBiome.name;
    state.event = `Entering ${curBiome.name}.`;
    SFX.playBiomeTransition();
  }

  // Boss event tick
  state.bossTimer -= dt;
  if (!state.bossEvent && state.bossTimer <= 0) triggerBoss();
  if (state.bossEvent) updateBoss(dt);

  // Checkpoint check
  if (state.score >= state.checkpointNext && !state.checkpointShown.has(state.checkpointNext) && !state.bossEvent) {
    state.checkpointShown.add(state.checkpointNext);
    state.checkpointNext += 700;
    openCheckpoint();
    return; // skip this frame's physics
  }

  // Auto-repair (self-repair upgrade)
  const arLevel = state.autoRepairLevel || 1;
  if (arLevel > 1 && state.fuel > 8 && state.failedPart) {
    const rate = (arLevel - 1) * 0.5;
    state.partHealth = Math.min(100, state.partHealth + rate * dt);
    state.fuel -= rate * 0.06 * dt;
  }

  const shake = Math.sin(performance.now() * 0.018) * disasterForce.shake;

  if (v.type === "ground") {
    // Sample terrain at front and rear axle positions so both wheels touch
    const AXLE_HALF = v.id === "truck" ? 38 : v.id === "buggy" ? 36 : v.id === "bike" ? 25 : 30;
    const off = state.terrainOffset;
    const frontTY = terrainY(state.x + off + AXLE_HALF);
    const rearTY  = terrainY(state.x + off - AXLE_HALF);
    const groundY = (frontTY + rearTY) * 0.5;                        // midpoint y = vehicle ref point
    const terrainSlope = Math.atan2(frontTY - rearTY, AXLE_HALF * 2); // slope angle from rear→front
    const gravity = 0.62 * v.mass;
    const friction = (v.grip + gripBonus) * disasterForce.friction * (isIced ? 0.4 : 1);
    state.vx += v.thrust * engineBoost * engineMult * friction * throttle * boost * dt * 9;
    if (input.brake) state.vx *= 1 - 2.2 * dt * friction;
    state.vx *= 1 - (v.drag + (1 - friction) * 0.05) * qualityPenalty;
    state.vy += gravity;
    if (state.y >= groundY) {
      const impact = Math.max(0, state.vy - 7);
      const reducedImpact = impact * (1 - suspBonus);
      if (reducedImpact > 3) { state.shakeAmount += reducedImpact * 0.9; emitSparks(state.x, vcy(), Math.ceil(reducedImpact * 0.6)); SFX.playImpact(reducedImpact * 0.25); }
      state.hp -= reducedImpact * 0.35 / v.armor;
      state.y = groundY;
      state.vy *= -0.12;
      // Smoothly align vehicle angle to terrain slope — makes both wheels touch the ground line
      state.angle += (terrainSlope - state.angle) * 0.24;
      state.spin *= 0.65;
      state.spin += (input.turn * 0.036 + shake * 0.018) / stabilityBoost;
    }
  } else if (v.type === "air") {
    const flightThrottle = input.thrusting ? throttle : 0.22;
    const liftInput = v.id === "helicopter" ? 0.35 + flightThrottle * 0.85 : 0.25 + flightThrottle * 0.9;
    const baseLift = v.id === "helicopter" ? (v.lift + liftBonus) * 6.1 : Math.max(0.2, state.vx) * (v.lift + liftBonus) * 3.2;
    const lift = baseLift * liftInput;
    const descent = input.brake ? 0.42 : 0;
    const groundY = terrainY(state.x + state.terrainOffset);
    state.vx += (v.thrust * engineBoost * engineMult * flightThrottle * boost + disasterForce.wind) * dt * 7;
    state.vy += (0.34 * v.mass - lift + descent) * dt * 3.4 + shake * 0.02;
    state.vx *= 1 - v.drag * qualityPenalty;
    state.vy *= 0.985;
    state.spin += (input.turn * 0.035 + disasterForce.wind * 0.025 + shake * 0.01 - state.angle * 0.018) / stabilityBoost;
    if (state.y >= groundY) {
      const impact = Math.max(0, state.vy - 4.2);
      if (impact > 1.5) { state.shakeAmount += impact * 1.4; emitSparks(state.x, vcy(), Math.ceil(impact)); }
      state.hp -= impact * 1.8 / v.armor;
      state.y = groundY;
      state.vy *= -0.1;
      state.vx *= 0.82;
      state.spin += (state.angle > 0 ? 0.025 : -0.025) + input.turn * 0.02;
      if (impact > 1.2) state.event = "Hard landing damaged the frame.";
    }
  } else {
    state.vx += ((v.thrust + thrustBonus) * engineBoost * throttle * boost + disasterForce.wind) * dt * 5;
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
    if (Math.random() < dt * 4) emitSmoke(state.x, vcy() - 20, 2);
    state.event = "Engine overheating.";
  }

  const hpRatio = state.hp / state.maxHp;
  if (hpRatio < 0.6 && Math.random() < dt * (0.6 - hpRatio) * 10) {
    emitSmoke(state.x + (Math.random() - 0.5) * 28, vcy() - 10, hpRatio < 0.3 ? 2 : 1);
  }

  updatePickupsAndDebris(dt);
  updateParticles(dt);
  updateMission();

  if (state.y < 40 || state.y > worldCanvas.height - 24 || Math.abs(state.angle) > 1.5) {
    state.hp -= dt * 18;
  }

  state.hp = Math.min(state.maxHp, state.hp);
  if (state.hp <= 0 || state.partHealth <= 0) endRun();

  // Low HP warning beep
  state._lowHpBeepTimer = (state._lowHpBeepTimer || 0) - dt;
  if (state.hp / state.maxHp < 0.25 && state._lowHpBeepTimer <= 0) {
    SFX.playLowHpBeep();
    state._lowHpBeepTimer = 0.85;
  }

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

function autoInput() {
  if (!state) return { throttle: 0.9, brake: 0, turn: 0, boost: false, thrusting: true };
  const v = state.vehicle;
  const angleCorrect = clamp(-state.angle * 5 - state.spin * 2.5, -1, 1);
  let turn = angleCorrect;
  let thrusting = true;
  let brake = 0;
  const autoBoost = state.fuel > 65 && state.heat < 50 && !state.failedPart;

  if (v.type === "air") {
    // Altitude control: thrusting=true → more lift → climb; brake → descent force → descend
    // turn only controls spin/angle here — keep vehicle level
    const targetY = worldCanvas.height * 0.40;
    const yErr = state.y - targetY; // + means below target → need to climb
    const needClimb   = yErr > 30;
    const needDescend = yErr < -30;
    thrusting = !needDescend;
    brake = needDescend ? 0.65 : 0;
    turn = angleCorrect; // keep wings level
  } else if (v.type === "space") {
    // Space physics: vy += turn * 0.018, so use turn to control vertical position
    // Negative turn → decreases vy → vehicle moves up
    const targetY = worldCanvas.height * 0.42;
    const yErr = state.y - targetY; // + = below target, need to go up = negative vy = negative turn
    const velDamp = state.vy * 12;
    const vertControl = clamp((-yErr * 0.068 - velDamp * 0.042), -1, 1);
    turn = vertControl; // this also affects spin but that's acceptable
  } else {
    // Ground: terrain slope alignment in physics handles tilt automatically.
    // Only nudge forward lean when a steep rise is detected ahead.
    const lookAheadY = terrainY(state.x + state.terrainOffset + 130);
    const rise = state.y - lookAheadY; // + = terrain rising ahead of vehicle
    turn = rise > 50 ? 0.18 : 0;
  }

  return { throttle: 1.0, brake, turn, boost: autoBoost, thrusting };
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// Visual center y — ground vehicles draw upward from state.y (wheel bottom), body center ~30px up
function vcy() { return state ? state.y - (state.vehicle?.type === "ground" ? 30 : 0) : 0; }

// --- Boss Events ---

function triggerBoss() {
  const template = bossEvents[state.vehicle.type];
  if (!template) return;
  state.bossEvent = {
    name: template.name,
    phases: template.phases,
    phase: 0,
    phaseTimer: template.phases[0].duration,
    active: true
  };
  state.disaster = null;
  state.disasterTimer = 999;
  state.bossTimer = 1200 + Math.random() * 400;
  state.shakeAmount += 14;
  emitSparks(state.x, vcy(), 16);
  state.event = `BOSS: ${template.name}!`;
  SFX.playBossStart();
}

function updateBoss(dt) {
  const boss = state.bossEvent;
  boss.phaseTimer -= dt;
  const phase = boss.phases[boss.phase];

  // Constant HP drain from boss
  const dmg = phase.damage * 0.025;
  state.hp -= dmg * dt;
  state.shakeAmount = Math.max(state.shakeAmount, phase.shake * 6);

  // Extra debris during heavy phases
  if (boss.phase >= 1 && state.debrisTimer <= 0) spawnDebris();

  if (boss.phaseTimer <= 0) {
    boss.phase++;
    if (boss.phase >= boss.phases.length) {
      // Boss done
      state.bossEvent = null;
      state.disasterTimer = 6;
      state.runCoins += 80;
      state.disasterCount++;
      updateMission();
      state.event = `${boss.name} defeated! +80 coins.`;
    } else {
      boss.phaseTimer = boss.phases[boss.phase].duration;
      state.event = `${boss.name} — ${boss.phases[boss.phase].label}`;
      state.shakeAmount += 10;
      emitSparks(state.x, vcy(), 12);
    }
  }
}

// --- Checkpoint ---

function openCheckpoint() {
  paused = true;
  SFX.playCheckpoint();
  const el = document.querySelector("#checkpoint");
  document.querySelector("#cpScore").textContent = Math.floor(state.score);
  document.querySelector("#cpHp").textContent = `${Math.max(0, Math.floor(state.hp))} / ${state.maxHp}`;
  document.querySelector("#cpCoins").textContent = Math.floor(state.runCoins);
  document.querySelector("#cpHealCost").textContent = "50";
  document.querySelector("#cpFixCost").textContent = "30";
  document.querySelector("#cpHealBtn").disabled = state.runCoins < 50 || state.hp >= state.maxHp;
  document.querySelector("#cpFixBtn").disabled  = state.runCoins < 30 || !state.failedPart;
  el.classList.remove("hidden");
}

function closeCheckpoint() {
  paused = false;
  document.querySelector("#checkpoint").classList.add("hidden");
}

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
    // Hell mode: auto-collect on proximity. Normal mode: player must tap the pickup.
    if (gameMode === "hell" && distance(p.x, p.y, state.x, state.y) < p.r + 42) {
      collectPickup(p); return false;
    }
    return p.x > -80;
  });

  state.debris = state.debris.filter(d => {
    if (distance(d.x, d.y, state.x, state.y) < d.r + 36) {
      state.hp -= (12 + d.r * 0.6) / (state.vehicle.armor + (state.levels.armor - 1) * 0.25);
      state.spin += d.vx > -100 ? 0.16 : -0.16;
      state.shakeAmount += 7;
      emitSparks(state.x, vcy(), 12);
      state.event = "Debris impact.";
      SFX.playDebrisHit();
      return false;
    }
    return d.x > -100 && d.y < worldCanvas.height + 100;
  });
}

function collectPickup(p) {
  emitCoinPop(p.x, p.y);
  SFX.playPickup(p.type);
  state.pickupCount++;
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

function terrainY(x) {
  if (!state) return 375 + Math.sin(x * 0.011) * 34 + Math.sin(x * 0.031) * 12;
  const b = getBiome();
  // Biome modifies amplitude and frequency for visual variety
  const ampScale  = b.name === "Desert" ? 0.6 : b.name === "Ice Fields" ? 0.45 : b.name === "City Rubble" ? 1.4 : b.name === "Volcanic" ? 1.6 : 1;
  const freqScale = b.name === "City Rubble" ? 1.6 : b.name === "Volcanic" ? 1.4 : 1;
  const amp  = 34 * ampScale;
  const freq = 0.011 * freqScale;
  return 375 + Math.sin(x * freq) * amp + Math.sin(x * freq * 2.8) * (amp * 0.36);
}

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

  if (state.bossEvent) drawBossHud(W);
}

function drawBossHud(W) {
  const boss = state.bossEvent;
  const phase = boss.phases[boss.phase];
  const totalDuration = boss.phases.reduce((s, p) => s + p.duration, 0);
  const elapsed = boss.phases.slice(0, boss.phase).reduce((s, p) => s + p.duration, 0)
    + (phase.duration - boss.phaseTimer);
  const progress = Math.min(1, elapsed / totalDuration);

  // Boss bar background
  world.save();
  world.fillStyle = "rgba(0,0,0,0.55)";
  world.fillRect(W / 2 - 180, 10, 360, 44);
  world.strokeStyle = "#f46a55";
  world.lineWidth = 1.5;
  world.strokeRect(W / 2 - 180, 10, 360, 44);

  // Boss name
  world.fillStyle = "#f46a55";
  world.font = "700 13px system-ui";
  world.textAlign = "center";
  world.fillText(`BOSS — ${boss.name.toUpperCase()} — ${phase.label.toUpperCase()}`, W / 2, 26);

  // Progress bar
  world.fillStyle = "#2a1010";
  world.fillRect(W / 2 - 160, 32, 320, 14);
  world.fillStyle = `hsl(${10 + progress * 20},90%,${45 + Math.sin(performance.now() * 0.01) * 8}%)`;
  world.fillRect(W / 2 - 160, 32, 320 * (1 - progress), 14);
  world.strokeStyle = "#f46a55";
  world.lineWidth = 1;
  world.strokeRect(W / 2 - 160, 32, 320, 14);

  // Phase dots
  boss.phases.forEach((_, i) => {
    world.beginPath();
    world.arc(W / 2 - 20 + i * 20, 53, 4, 0, Math.PI * 2);
    world.fillStyle = i <= boss.phase ? "#f46a55" : "#4a2020";
    world.fill();
  });
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
    const biome = getBiome();
    const isSand = state.disaster?.name.includes("Sand") || state.disaster?.name.includes("Meteor");
    const isBoss = !!state.bossEvent;
    const skyTop = isBoss ? "#1a0a08" : isSand ? "#2a1c0e" : (biome.skyTop || "#1a3040");
    const skyBot = isBoss ? "#2a1008" : isSand ? "#3a2814" : (biome.skyBot || "#1e3a24");
    const sky = world.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, skyTop);
    sky.addColorStop(0.7, skyBot);
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
  const biome   = state.vehicle.type === "ground" ? getBiome() : null;
  const groundCol = isFlood ? "#1a3a4a" : (biome?.groundColor || (state.vehicle.type === "ground" ? "#394232" : "#26382f"));
  world.fillStyle = groundCol;
  world.fill();

  if (state.vehicle.type === "ground") {
    world.beginPath();
    for (let x = 0; x <= W; x += 10) {
      x === 0 ? world.moveTo(0, terrainY(offset)) : world.lineTo(x, terrainY(x + offset));
    }
    // Surface line color per biome
    const lineCol = biome?.name === "Ice Fields" ? "#a8d0e0"
      : biome?.name === "Desert"     ? "#7a6040"
      : biome?.name === "City Rubble"? "#5a5850"
      : biome?.name === "Volcanic"   ? "#6a2808"
      : "#4a5c42";
    world.strokeStyle = lineCol;
    world.lineWidth = 2;
    world.stroke();

    drawGroundRocks(W, offset, isFlood, biome);

    // Boss visual overlay — fire cracks in Volcanic, ice sheen in Ice Fields
    if (state.bossEvent) {
      world.save();
      world.globalAlpha = 0.3 + Math.sin(state.score * 0.2) * 0.15;
      world.strokeStyle = "#ff4808";
      world.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const cx = ((i * 140 + state.score * 8) % W + W) % W;
        const cy = terrainY(cx + offset) - 4;
        world.beginPath();
        world.moveTo(cx, cy);
        world.lineTo(cx + 30, cy - 18);
        world.lineTo(cx + 50, cy - 6);
        world.stroke();
      }
      world.restore();
    }
  }
}

function drawGroundRocks(W, offset, isFlood, biome) {
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
    world.fillStyle = biome?.rockColor || (isMeteor ? "#5a4832" : isSand ? "#7a6848" : "#3a4838");
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
  const t = performance.now();
  state.pickups.forEach(p => {
    world.save();
    world.translate(p.x, p.y);

    if (gameMode === "normal") {
      // Pulsing tap-target ring to show the pickup is clickable
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.005 + p.x);
      world.globalAlpha = 0.25 + pulse * 0.35;
      world.strokeStyle = p.color;
      world.lineWidth = 2;
      world.beginPath();
      world.arc(0, 0, p.r + 10 + pulse * 8, 0, Math.PI * 2);
      world.stroke();
      world.globalAlpha = 1;
    }

    world.fillStyle = p.color;
    world.strokeStyle = "#101311";
    world.lineWidth = 3;
    world.beginPath();
    world.arc(0, 0, gameMode === "normal" ? p.r + 4 : p.r, 0, Math.PI * 2);
    world.fill();
    world.stroke();
    world.fillStyle = "#101311";
    world.font = `700 ${gameMode === "normal" ? 14 : 12}px system-ui`;
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
  else if (v.id === "buggy") drawBuggy(bodyColor);
  else if (v.id === "airplane")   drawAirplane(bodyColor);
  else if (v.id === "jet")        drawJet(bodyColor);
  else if (v.id === "helicopter") drawHelicopter(bodyColor);
  else if (v.id === "orbital")    drawOrbital(bodyColor);
  else                            drawSpaceship(bodyColor);

  // For ground vehicles, the visual center is ~30px above y=0 (wheel bottom contact)
  const vCenterY = v.type === "ground" ? -30 : 0;

  if (state.repairOverlay?.strokes.length > 0) {
    const scale = 0.165;
    const ox = -26, oy = vCenterY - 8;
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
    world.arc(0, vCenterY, 62, 0, Math.PI * 2);
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
  const wr = 11;
  // Shadow on ground
  world.save(); world.globalAlpha = 0.18; world.fillStyle = "#000";
  world.beginPath(); world.ellipse(0, 2, 44, 5, 0, 0, Math.PI * 2); world.fill();
  world.restore();
  // Floor pan / undercarriage
  world.fillStyle = "#1a2018";
  world.fillRect(-42, -24, 84, 10);
  // Rear boot slope
  world.fillStyle = color;
  world.beginPath();
  world.moveTo(-20, -42); world.lineTo(-44, -33); world.lineTo(-44, -22); world.lineTo(-20, -22);
  world.closePath(); world.fill(); world.stroke();
  // Front hood slope
  world.beginPath();
  world.moveTo(20, -42); world.lineTo(44, -30); world.lineTo(44, -22); world.lineTo(20, -22);
  world.closePath(); world.fill(); world.stroke();
  // Main body sill
  world.fillStyle = color;
  roundRect(world, -44, -44, 88, 22, 5);
  world.fill(); world.stroke();
  // Cabin / greenhouse
  world.fillStyle = "#8ab0ae";
  world.beginPath();
  world.moveTo(-18, -44); world.lineTo(-36, -63); world.lineTo(17, -63); world.lineTo(20, -44);
  world.closePath(); world.fill(); world.stroke();
  // Rear window
  world.fillStyle = "rgba(160,220,230,0.52)";
  world.beginPath();
  world.moveTo(-15, -45); world.lineTo(-31, -61); world.lineTo(-2, -61); world.lineTo(-2, -45);
  world.closePath(); world.fill();
  // Front windshield
  world.beginPath();
  world.moveTo(2, -45); world.lineTo(2, -61); world.lineTo(15, -61); world.lineTo(18, -45);
  world.closePath(); world.fill();
  // B-pillar divider
  world.strokeStyle = "#2a3428"; world.lineWidth = 3;
  world.beginPath(); world.moveTo(-2, -45); world.lineTo(-2, -61); world.stroke();
  // Door line
  world.strokeStyle = "rgba(0,0,0,0.22)"; world.lineWidth = 1.5;
  world.beginPath(); world.moveTo(-2, -44); world.lineTo(-2, -22); world.stroke();
  // Headlight
  world.fillStyle = "#f8f8b8"; world.strokeStyle = "#b0b040"; world.lineWidth = 1.5;
  world.beginPath(); world.ellipse(43, -33, 5, 3.5, 0, 0, Math.PI * 2); world.fill(); world.stroke();
  // DRL strip
  world.fillStyle = "rgba(255,255,180,0.7)";
  world.fillRect(37, -26, 7, 2);
  // Taillight
  world.fillStyle = "#f46a55"; world.strokeStyle = "#902828"; world.lineWidth = 1.5;
  world.beginPath(); world.ellipse(-43, -33, 4, 3.5, 0, 0, Math.PI * 2); world.fill(); world.stroke();
  // Wheels — centers at y=-wr so bottoms sit at y=0 (ground level)
  world.lineWidth = 3; world.strokeStyle = "#0d1210";
  drawWheel(-30, -wr, wr);
  drawWheel(30, -wr, wr);
}

function drawBike(color) {
  const wr = 13;
  // Shadow
  world.save(); world.globalAlpha = 0.15; world.fillStyle = "#000";
  world.beginPath(); world.ellipse(2, 2, 34, 4, 0, 0, Math.PI * 2); world.fill();
  world.restore();
  // Rear swing arm
  world.strokeStyle = "#364434"; world.lineWidth = 4;
  world.beginPath(); world.moveTo(-24, -wr); world.lineTo(-4, -26); world.stroke();
  // Front fork (angled)
  world.beginPath(); world.moveTo(24, -wr); world.lineTo(16, -30); world.stroke();
  world.beginPath(); world.moveTo(26, -wr); world.lineTo(18, -30); world.stroke();
  // Main backbone frame tube
  world.strokeStyle = "#2a3228"; world.lineWidth = 5;
  world.beginPath(); world.moveTo(-4, -26); world.lineTo(16, -30); world.stroke();
  // Sub-frame to seat
  world.lineWidth = 3;
  world.beginPath(); world.moveTo(-4, -26); world.lineTo(-10, -40); world.stroke();
  world.beginPath(); world.moveTo(16, -30); world.lineTo(-10, -40); world.stroke();
  // Engine block
  world.fillStyle = "#282e26"; world.strokeStyle = "#0d1210"; world.lineWidth = 2;
  roundRect(world, -8, -34, 18, 12, 3);
  world.fill(); world.stroke();
  // Exhaust pipe
  world.strokeStyle = "#686868"; world.lineWidth = 4;
  world.beginPath(); world.moveTo(-8, -28); world.bezierCurveTo(-18, -28, -24, -22, -26, -16); world.stroke();
  world.fillStyle = "#484848";
  world.beginPath(); world.ellipse(-26, -15, 5, 3, -0.3, 0, Math.PI * 2); world.fill();
  // Fuel tank
  world.fillStyle = color; world.strokeStyle = "#0d1210"; world.lineWidth = 3;
  roundRect(world, -4, -48, 22, 14, 5);
  world.fill(); world.stroke();
  // Fairing / nose
  world.fillStyle = color;
  world.beginPath();
  world.moveTo(14, -48); world.lineTo(26, -38); world.lineTo(24, -28); world.lineTo(14, -30);
  world.closePath(); world.fill(); world.stroke();
  // Windscreen
  world.fillStyle = "rgba(160,220,230,0.55)";
  world.beginPath();
  world.moveTo(16, -46); world.lineTo(25, -37); world.lineTo(23, -30); world.lineTo(15, -32);
  world.closePath(); world.fill();
  // Seat
  world.fillStyle = "#1a1e18";
  roundRect(world, -14, -50, 18, 6, 3);
  world.fill();
  // Rider torso + helmet
  world.fillStyle = "#1c2418";
  world.beginPath(); world.ellipse(2, -54, 6, 9, -0.15, 0, Math.PI * 2); world.fill();
  world.beginPath(); world.arc(2, -65, 6, 0, Math.PI * 2); world.fill();
  // Helmet visor
  world.fillStyle = "rgba(160,220,230,0.5)";
  world.beginPath(); world.arc(4, -65, 4, Math.PI * 1.1, Math.PI * 1.9); world.fill();
  // Handlebar
  world.strokeStyle = "#c0c8c0"; world.lineWidth = 3;
  world.beginPath(); world.moveTo(12, -44); world.lineTo(20, -42); world.stroke();
  // Headlight
  world.fillStyle = "#f8f8b8"; world.strokeStyle = "#b0b040"; world.lineWidth = 1.5;
  world.beginPath(); world.ellipse(25, -38, 5, 4, 0, 0, Math.PI * 2); world.fill(); world.stroke();
  // Wheels
  world.lineWidth = 3; world.strokeStyle = "#0d1210";
  drawWheel(-24, -wr, wr);
  drawWheel(26, -wr, wr);
}

function drawTruck(color) {
  const wr = 12;
  // Shadow
  world.save(); world.globalAlpha = 0.18; world.fillStyle = "#000";
  world.beginPath(); world.ellipse(0, 2, 58, 6, 0, 0, Math.PI * 2); world.fill();
  world.restore();
  // Cargo box body
  world.fillStyle = "#384036"; world.strokeStyle = "#0d1210"; world.lineWidth = 3;
  roundRect(world, -58, -50, 68, 38, 3);
  world.fill(); world.stroke();
  // Cargo ribs (vertical reinforcements)
  world.strokeStyle = "rgba(0,0,0,0.28)"; world.lineWidth = 1.5;
  [-42, -28, -12].forEach(x => {
    world.beginPath(); world.moveTo(x, -50); world.lineTo(x, -12); world.stroke();
  });
  // Cargo top rail
  world.strokeStyle = "#4a5248"; world.lineWidth = 3;
  world.beginPath(); world.moveTo(-58, -50); world.lineTo(10, -50); world.stroke();
  // Cab (front section — right side = front direction)
  world.fillStyle = color; world.strokeStyle = "#0d1210"; world.lineWidth = 3;
  roundRect(world, 10, -68, 50, 56, 6);
  world.fill(); world.stroke();
  // Cab window strip
  world.fillStyle = "#8ab0ae"; world.strokeStyle = "#0d1210"; world.lineWidth = 2;
  roundRect(world, 14, -64, 42, 28, 4);
  world.fill(); world.stroke();
  // Windshield glass
  world.fillStyle = "rgba(160,220,230,0.5)";
  world.fillRect(16, -62, 38, 24);
  // Cab lower panel
  world.fillStyle = "#243028"; world.strokeStyle = "#0d1210";
  world.fillRect(10, -24, 50, 12);
  // Chrome front bumper
  world.fillStyle = "#707870";
  roundRect(world, 52, -22, 10, 10, 3);
  world.fill(); world.stroke();
  // Headlights (two stacked)
  world.fillStyle = "#f8f8b8"; world.strokeStyle = "#b0b040"; world.lineWidth = 1.5;
  world.beginPath(); world.ellipse(59, -50, 5, 4, 0, 0, Math.PI * 2); world.fill(); world.stroke();
  world.beginPath(); world.ellipse(59, -38, 5, 4, 0, 0, Math.PI * 2); world.fill(); world.stroke();
  // Air intake grille
  world.strokeStyle = "#2a3028"; world.lineWidth = 2;
  [0, 4, 8].forEach(dy => {
    world.beginPath(); world.moveTo(58, -58 + dy); world.lineTo(62, -58 + dy); world.stroke();
  });
  // Exhaust stack
  world.strokeStyle = "#606860"; world.lineWidth = 5;
  world.beginPath(); world.moveTo(18, -68); world.lineTo(18, -88); world.stroke();
  world.fillStyle = "#404840";
  world.beginPath(); world.ellipse(18, -88, 5, 3, 0, 0, Math.PI * 2); world.fill();
  // Taillights
  world.fillStyle = "#f46a55"; world.strokeStyle = "#902828"; world.lineWidth = 1.5;
  world.beginPath(); world.ellipse(-57, -44, 3, 5, 0, 0, Math.PI * 2); world.fill(); world.stroke();
  world.beginPath(); world.ellipse(-57, -30, 3, 5, 0, 0, Math.PI * 2); world.fill(); world.stroke();
  // Side marker
  world.fillStyle = "#f5b84b";
  world.beginPath(); world.arc(-58, -18, 3, 0, Math.PI * 2); world.fill();
  // Wheels — front axle and two rear axles
  world.lineWidth = 3; world.strokeStyle = "#0d1210";
  drawWheel(38, -wr, wr);       // front
  drawWheel(-22, -wr, wr);      // rear-front
  drawWheel(-38, -wr, wr);      // rear-rear
}

function drawBuggy(color) {
  const wr = 15;
  // Shadow
  world.save(); world.globalAlpha = 0.18; world.fillStyle = "#000";
  world.beginPath(); world.ellipse(0, 2, 48, 6, 0, 0, Math.PI * 2); world.fill();
  world.restore();
  // Main roll cage tubes
  world.strokeStyle = "#4a5848"; world.lineWidth = 5;
  // Outer frame loop (rectangle)
  world.beginPath();
  world.moveTo(-36, -wr); world.lineTo(-36, -58);
  world.lineTo(36, -58); world.lineTo(36, -wr);
  world.stroke();
  // Diagonal X bracing
  world.lineWidth = 3;
  world.strokeStyle = "#3a4838";
  world.beginPath(); world.moveTo(-36, -58); world.lineTo(36, -wr); world.stroke();
  world.beginPath(); world.moveTo(36, -58); world.lineTo(-36, -wr); world.stroke();
  // Mid horizontal bar
  world.strokeStyle = "#4a5848"; world.lineWidth = 4;
  world.beginPath(); world.moveTo(-36, -36); world.lineTo(36, -36); world.stroke();
  // Front skid plate / bumper
  world.fillStyle = "#384036"; world.strokeStyle = "#0d1210"; world.lineWidth = 2;
  roundRect(world, 30, -28, 14, 14, 4);
  world.fill(); world.stroke();
  // Floor pan
  world.fillStyle = "#242e22";
  roundRect(world, -34, -32, 68, 20, 3);
  world.fill(); world.stroke();
  // Seat and body panel
  world.fillStyle = color; world.strokeStyle = "#0d1210"; world.lineWidth = 3;
  roundRect(world, -26, -50, 52, 20, 4);
  world.fill(); world.stroke();
  // Dashboard
  world.fillStyle = "#1a2018";
  world.fillRect(10, -50, 16, 8);
  // Steering wheel
  world.strokeStyle = "#888"; world.lineWidth = 2;
  world.beginPath(); world.arc(8, -48, 6, 0, Math.PI * 2); world.stroke();
  world.beginPath(); world.moveTo(8, -42); world.lineTo(8, -54); world.stroke();
  // Driver helmet
  world.fillStyle = "#1c2418";
  world.beginPath(); world.arc(-4, -54, 8, 0, Math.PI * 2); world.fill();
  world.fillStyle = "rgba(160,220,230,0.5)";
  world.beginPath(); world.arc(-2, -54, 5.5, Math.PI * 1.1, Math.PI * 1.9); world.fill();
  // Headlights bar
  world.fillStyle = "#f8f8b8"; world.strokeStyle = "#b0b040"; world.lineWidth = 1.5;
  world.fillRect(36, -30, 8, 4);
  world.beginPath(); world.ellipse(42, -28, 5, 4, 0, 0, Math.PI * 2); world.fill(); world.stroke();
  // Engine vents
  world.strokeStyle = "rgba(0,0,0,0.3)"; world.lineWidth = 1.5;
  [-18, -10, -2].forEach(x => {
    world.beginPath(); world.moveTo(x, -32); world.lineTo(x, -14); world.stroke();
  });
  // Big off-road wheels with more gap
  world.lineWidth = 3; world.strokeStyle = "#0d1210";
  drawWheel(-36, -wr, wr);
  drawWheel(36, -wr, wr);
}

function drawOrbital(color) {
  const throttle = readInput().throttle;
  // Twin engine glows
  world.save();
  world.globalAlpha = 0.6;
  [-10, 10].forEach(dy => {
    const g = world.createRadialGradient(-48, dy, 0, -48, dy, 14 + throttle * 10);
    g.addColorStop(0, "#58ffcc");
    g.addColorStop(0.5, "#2080ff");
    g.addColorStop(1, "transparent");
    world.fillStyle = g;
    world.beginPath();
    world.arc(-48, dy, 14 + throttle * 10, 0, Math.PI * 2);
    world.fill();
  });
  world.restore();
  // Sleek wedge hull
  world.fillStyle = color;
  world.beginPath();
  world.moveTo(62, 0);
  world.lineTo(30, -12);
  world.lineTo(-20, -16);
  world.lineTo(-46, -8);
  world.lineTo(-50, 0);
  world.lineTo(-46, 8);
  world.lineTo(-20, 16);
  world.lineTo(30, 12);
  world.closePath();
  world.fill(); world.stroke();
  // Fin wings (compact)
  world.fillStyle = "#486888";
  world.beginPath();
  world.moveTo(-10, -16); world.lineTo(-22, -40); world.lineTo(-38, -36); world.lineTo(-24, -16);
  world.closePath(); world.fill();
  world.beginPath();
  world.moveTo(-10, 16); world.lineTo(-22, 40); world.lineTo(-38, 36); world.lineTo(-24, 16);
  world.closePath(); world.fill();
  // Engine nacelles
  world.fillStyle = "#2a3840";
  world.fillRect(-50, -12, 14, 8);
  world.fillRect(-50, 4, 14, 8);
  // Cockpit strip
  world.fillStyle = "rgba(160,255,220,0.6)";
  world.beginPath();
  world.ellipse(32, 0, 18, 7, 0, 0, Math.PI * 2);
  world.fill();
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
  // Outer tire
  world.beginPath(); world.arc(0, 0, r, 0, Math.PI * 2);
  world.fillStyle = "#181c18"; world.fill(); world.stroke();
  // Tire sidewall inner ring
  world.beginPath(); world.arc(0, 0, r - 2.5, 0, Math.PI * 2);
  world.strokeStyle = "#2a2e28"; world.lineWidth = 1.5; world.stroke();
  // Rim base
  world.beginPath(); world.arc(0, 0, r * 0.56, 0, Math.PI * 2);
  world.fillStyle = "#424840"; world.fill();
  // 5 spokes
  world.strokeStyle = "#c4c8be"; world.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    world.beginPath();
    world.moveTo(Math.cos(a) * r * 0.15, Math.sin(a) * r * 0.15);
    world.lineTo(Math.cos(a) * r * 0.54, Math.sin(a) * r * 0.54);
    world.stroke();
  }
  // Center hub cap
  world.beginPath(); world.arc(0, 0, r * 0.18, 0, Math.PI * 2);
  world.fillStyle = "#d0c858"; world.fill();
  world.lineWidth = 3; world.strokeStyle = "#0d1210";
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

  const disEl = document.querySelector("#disaster");
  const warning = !state.disaster && state.disasterTimer < 2.5;
  if (warning) {
    disEl.textContent = "! WARNING";
    disEl.parentElement.classList.add("hud-warn");
  } else {
    disEl.textContent = state.disaster ? state.disaster.name : "Clear";
    disEl.parentElement.classList.remove("hud-warn");
  }

  document.querySelector("#eventLog").textContent = state.event;

  const m = state.mission;
  const mEl = document.querySelector("#missionDisplay");
  if (m) {
    const current = getMissionProgress();
    const pct = Math.min(100, Math.floor((current / m.target) * 100));
    mEl.textContent = m.done
      ? `Mission complete! +${m.reward} coins`
      : `Mission: ${m.desc} [${current}/${m.target}]`;
    mEl.classList.toggle("mission-done", m.done);
  }
}

function getMissionProgress() {
  if (!state?.mission) return 0;
  const m = state.mission;
  switch (m.key) {
    case "disasterCount":  return state.disasterCount;
    case "repairCount":    return state.repairCount;
    case "score":          return Math.floor(state.score);
    case "pickupCount":    return state.pickupCount;
    case "perfectRepair":  return state.bestRepairQuality >= 0.9 ? 1 : 0;
    case "time":           return Math.floor(state.time);
    case "boostTime":      return Math.floor(state.boostTime);
    case "runCoins":       return Math.floor(state.runCoins);
    default:               return 0;
  }
}

function updateMission() {
  if (!state?.mission || state.mission.done) return;
  const progress = getMissionProgress();
  if (progress >= state.mission.target) {
    state.mission.done = true;
    state.runCoins += state.mission.reward;
    state.event = `Mission complete! +${state.mission.reward} coins.`;
    SFX.playMissionComplete();
  }
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

// --- Saved Parts ---

function saveCurrentPart() {
  if (strokes.length === 0) return;
  const name = document.querySelector("#savedPartName").value.trim() || "Part";
  if (savedParts.length >= 6) savedParts.shift();
  savedParts.push({ name: name.slice(0, 16), strokes: JSON.parse(JSON.stringify(strokes)) });
  localStorage.setItem("patchdrive-saved-parts", JSON.stringify(savedParts));
  document.querySelector("#savedPartName").value = "";
  renderSavedParts();
}

function loadSavedPart(index) {
  const part = savedParts[index];
  if (!part) return;
  strokes = JSON.parse(JSON.stringify(part.strokes));
  // Re-render onto draw canvas
  draw.fillStyle = "#f2ead7";
  draw.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
  draw.strokeStyle = "#171717";
  draw.lineWidth = 6;
  draw.lineCap = "round";
  draw.lineJoin = "round";
  drawRepairGuide();
  strokes.forEach(stroke => {
    if (stroke.length < 2) return;
    draw.beginPath();
    draw.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) draw.lineTo(stroke[i].x, stroke[i].y);
    draw.stroke();
  });
}

function deleteSavedPart(index) {
  savedParts.splice(index, 1);
  localStorage.setItem("patchdrive-saved-parts", JSON.stringify(savedParts));
  renderSavedParts();
}

function renderSavedParts() {
  const container = document.querySelector("#savedPartsList");
  if (!container) return;
  container.innerHTML = "";
  savedParts.forEach((part, i) => {
    const row = document.createElement("div");
    row.className = "saved-part-row";
    row.innerHTML = `<button class="sp-load" title="Load '${part.name}'">${part.name}</button><button class="sp-del" title="Delete">x</button>`;
    row.querySelector(".sp-load").addEventListener("click", () => loadSavedPart(i));
    row.querySelector(".sp-del").addEventListener("click", () => deleteSavedPart(i));
    container.appendChild(row);
  });
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
  const toolBonus = (state.loadout === "tools" && !state.firstRepairDone) ? 1.25 : 1;
  state.firstRepairDone = true;
  state.repairQuality = Math.min(1, quality * repairBoost * toolBonus);
  SFX.playInstallRepair(state.repairQuality);
  state.repairOverlay = { strokes: JSON.parse(JSON.stringify(strokes)), part: state.failedPart };
  state.repairCount++;
  state.bestRepairQuality = Math.max(state.bestRepairQuality, state.repairQuality);
  state.partHealth = 60 + state.repairQuality * 58;
  state.hp = Math.min(state.maxHp, state.hp + 10 + state.repairQuality * 18);
  state.runCoins += 12 + state.repairQuality * 26;
  state.shakeAmount += 3;
  emitSparks(state.x, vcy(), 5);
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
  paused = false;
  SFX.stopEngine();
  cancelAnimationFrame(animationId);
  touchControls.classList.add("hidden");
  document.querySelector("#pauseMenu").classList.add("hidden");

  const missionBonus = state.mission?.done ? state.mission.reward : 0;
  const earned = Math.floor(state.runCoins + state.score * 0.18 + missionBonus);
  const previousBest = bestScores[state.vehicle.id] || 0;
  const isRecord = state.score > previousBest;
  if (isRecord) bestScores[state.vehicle.id] = Math.floor(state.score);
  bank += earned;
  saveProgress();

  document.querySelector("#runSummary").textContent =
    `Score ${Math.floor(state.score)}${isRecord ? " · new best!" : ""} · earned ${earned} coins.`;

  const statsEl = document.querySelector("#runStats");
  const bestPct = Math.round(state.bestRepairQuality * 100);
  const mText = state.mission
    ? (state.mission.done ? `${state.mission.desc} — DONE (+${state.mission.reward})` : `${state.mission.desc} — missed`)
    : "—";
  statsEl.innerHTML = `
    <div class="stat-row"><span>Distance</span><strong>${Math.floor(state.score)}</strong></div>
    <div class="stat-row"><span>Time survived</span><strong>${Math.floor(state.time)}s</strong></div>
    <div class="stat-row"><span>Disasters survived</span><strong>${state.disasterCount}</strong></div>
    <div class="stat-row"><span>Repairs made</span><strong>${state.repairCount}</strong></div>
    <div class="stat-row"><span>Best repair quality</span><strong>${bestPct}%</strong></div>
    <div class="stat-row"><span>Pickups collected</span><strong>${state.pickupCount}</strong></div>
    <div class="stat-row mission-row"><span>Mission</span><strong>${mText}</strong></div>
    <div class="stat-row total-row"><span>Coins earned</span><strong>${earned}</strong></div>
  `;

  saveToLeaderboard(Math.floor(state.score), state.vehicle.id, Math.floor(state.time));
  gameOver.classList.remove("hidden");
  renderGarage();
}

// --- Drawing canvas events ---

// Normal mode: tap/click on worldCanvas to collect pickups
worldCanvas.addEventListener("pointerdown", e => {
  if (!state || state.over || paused || gameMode !== "normal") return;
  const rect = worldCanvas.getBoundingClientRect();
  const scaleX = worldCanvas.width / rect.width;
  const scaleY = worldCanvas.height / rect.height;
  const cx = (e.clientX - rect.left) * scaleX;
  const cy = (e.clientY - rect.top) * scaleY;
  // Generous hit radius for finger touch
  const hitR = 36;
  let collected = false;
  state.pickups = state.pickups.filter(p => {
    if (!collected && distance(cx, cy, p.x, p.y) < p.r + hitR) {
      collectPickup(p);
      collected = true;
      return false;
    }
    return true;
  });
});

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
  if (currentStroke.length) { strokes.push(currentStroke); SFX.playDrawStroke(); }
  currentStroke = [];
});

window.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
  if (key === "escape" || key === "p") {
    if (state && !state.over) togglePause();
    return;
  }
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

// Checkpoint buttons
document.querySelector("#cpContinueBtn").addEventListener("click", () => closeCheckpoint());
document.querySelector("#cpHealBtn").addEventListener("click", () => {
  if (!state || state.runCoins < 50) return;
  state.runCoins -= 50;
  state.hp = state.maxHp;
  state.event = "Full repair at checkpoint.";
  document.querySelector("#cpHp").textContent = `${state.maxHp} / ${state.maxHp}`;
  document.querySelector("#cpHealBtn").disabled = true;
});
document.querySelector("#cpFixBtn").addEventListener("click", () => {
  if (!state || state.runCoins < 30 || !state.failedPart) return;
  state.runCoins -= 30;
  state.failedPart = null;
  state.partHealth = 100;
  clearDrawing();
  updateRepairText();
  document.querySelector("#cpFixBtn").disabled = true;
  state.event = "Broken part replaced at checkpoint.";
});

// Saved parts
document.querySelector("#savePartBtn")?.addEventListener("click", saveCurrentPart);

// Loadout picker
document.querySelectorAll(".loadout-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedLoadout = btn.dataset.loadout;
    document.querySelectorAll(".loadout-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

function togglePause() {
  paused = !paused;
  const menu = document.querySelector("#pauseMenu");
  if (paused) {
    menu.classList.remove("hidden");
    document.querySelector("#pauseInfo").textContent =
      `Score ${Math.floor(state.score)} · Run coins ${Math.floor(state.runCoins)}`;
  } else {
    menu.classList.add("hidden");
  }
}

document.querySelector("#resumeButton").addEventListener("click", () => togglePause());
document.querySelector("#quitRunButton").addEventListener("click", () => {
  paused = false;
  document.querySelector("#pauseMenu").classList.add("hidden");
  endRun();
});

// --- Phase 5: Leaderboard, Daily Challenge, Settings, Share ---

let leaderboard = JSON.parse(localStorage.getItem("patchdrive-leaderboard") || "{}");

function saveToLeaderboard(score, vehicleId, time) {
  const today = new Date().toISOString().slice(0, 10);
  leaderboard[vehicleId] = leaderboard[vehicleId] || [];
  leaderboard[vehicleId].push({ score, time, date: today });
  leaderboard[vehicleId].sort((a, b) => b.score - a.score);
  leaderboard[vehicleId] = leaderboard[vehicleId].slice(0, 5);
  localStorage.setItem("patchdrive-leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
  const modal = document.querySelector("#leaderboardModal");
  const body = document.querySelector("#leaderboardBody");
  const allEntries = [];
  vehicles.forEach(v => {
    (leaderboard[v.id] || []).forEach(e => {
      allEntries.push({ ...e, vehicleName: v.name, vehicleId: v.id });
    });
  });
  allEntries.sort((a, b) => b.score - a.score);

  if (allEntries.length === 0) {
    body.innerHTML = '<p style="color:var(--muted);text-align:center;margin:18px 0">No runs yet. Hit the road!</p>';
  } else {
    body.innerHTML = allEntries.slice(0, 12).map((e, i) =>
      `<div class="stat-row${i === 0 ? " total-row" : ""}">
        <span>${i + 1}. ${e.vehicleName} <em style="font-style:normal;color:var(--muted);font-size:11px">${e.date}</em></span>
        <strong>${e.score}</strong>
      </div>`
    ).join("");
  }
  modal.classList.remove("hidden");
}

// Seeded RNG for daily challenge (mulberry32)
function seededRNG(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function getDailyDate() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function startDailyChallenge() {
  const seed = getDailyDate();
  const rng = seededRNG(seed);
  const availableVehicles = vehicles.filter(v => unlockedVehicles.has(v.id));
  if (availableVehicles.length === 0) return;
  const pickedVehicle = availableVehicles[Math.floor(rng() * availableVehicles.length)];
  const pickedMission = missionPool[Math.floor(rng() * missionPool.length)];
  selectedVehicleId = pickedVehicle.id;
  selectedLoadout = "none";

  // Mark UI
  document.querySelectorAll(".vehicle-card").forEach(c => c.classList.remove("selected"));
  document.querySelectorAll(".loadout-btn").forEach(b => {
    b.classList.toggle("selected", b.dataset.loadout === "none");
  });

  // Inject daily mission override into startRun
  _dailyMissionOverride = pickedMission;
  startRun();
  _dailyMissionOverride = null;

  const todayKey = `patchdrive-daily-${getDailyDate()}`;
  localStorage.setItem(todayKey + "-vehicle", pickedVehicle.id);
}

let _dailyMissionOverride = null;

function pickMission() {
  if (_dailyMissionOverride) return { ..._dailyMissionOverride, current: 0, done: false };
  const m = missionPool[Math.floor(Math.random() * missionPool.length)];
  return { ...m, current: 0, done: false };
}

function shareRun() {
  if (!state) return;
  const W = 640, H = 320;
  const offCanvas = document.createElement("canvas");
  offCanvas.width = W; offCanvas.height = H;
  const c = offCanvas.getContext("2d");

  // Background
  const bg = c.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#101311"); bg.addColorStop(1, "#1a201c");
  c.fillStyle = bg; c.fillRect(0, 0, W, H);

  // Border
  c.strokeStyle = "#f5b84b"; c.lineWidth = 2;
  c.strokeRect(2, 2, W - 4, H - 4);

  // Logo text
  c.font = "800 42px system-ui, sans-serif";
  c.fillStyle = "#f5b84b"; c.textAlign = "left";
  c.fillText("PatchDrive", 28, 54);

  // Vehicle + score
  c.font = "700 18px system-ui, sans-serif";
  c.fillStyle = "#eef4ec";
  c.fillText(`${state.vehicle.name}  ·  Score ${Math.floor(state.score)}`, 28, 90);

  // Date
  c.font = "600 13px system-ui, sans-serif";
  c.fillStyle = "#aab6aa";
  c.fillText(new Date().toLocaleDateString(), 28, 114);

  // Stats grid
  const stats = [
    ["Distance", Math.floor(state.score)],
    ["Time", `${Math.floor(state.time)}s`],
    ["Disasters", state.disasterCount],
    ["Repairs", state.repairCount],
    ["Best Quality", `${Math.round(state.bestRepairQuality * 100)}%`],
    ["Pickups", state.pickupCount]
  ];
  const cols = 3;
  stats.forEach(([label, val], i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 28 + col * 200;
    const y = 160 + row * 62;
    c.fillStyle = "#242b26";
    c.beginPath(); c.roundRect(x, y, 186, 50, 6); c.fill();
    c.font = "600 11px system-ui, sans-serif"; c.fillStyle = "#aab6aa";
    c.fillText(label.toUpperCase(), x + 12, y + 18);
    c.font = "800 20px system-ui, sans-serif"; c.fillStyle = "#eef4ec";
    c.fillText(String(val), x + 12, y + 40);
  });

  // Mission result
  if (state.mission) {
    c.font = "600 13px system-ui, sans-serif";
    c.fillStyle = state.mission.done ? "#7fd36b" : "#aab6aa";
    c.fillText(state.mission.done ? `✓ Mission: ${state.mission.desc}` : `Mission: ${state.mission.desc} — missed`, 28, 298);
  }

  // Download
  const link = document.createElement("a");
  link.download = `patchdrive-run-${Math.floor(state.score)}.png`;
  link.href = offCanvas.toDataURL("image/png");
  link.click();
}

// Settings
function showSettings() {
  document.querySelector("#settingsModal").classList.remove("hidden");
  document.querySelector("#volumeSlider").value = Math.round(SFX.getVolume() * 100);
}

// Daily challenge badge update
function updateDailyBadge() {
  const btn = document.querySelector("#dailyBtn");
  if (!btn) return;
  const todayKey = `patchdrive-daily-${getDailyDate()}-score`;
  const todayScore = localStorage.getItem(todayKey);
  btn.textContent = todayScore ? `Daily ✓ (${todayScore})` : "Daily Challenge";
}

// Event listeners for Phase 5 UI
// Mode picker
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    gameMode = btn.dataset.mode;
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

document.querySelector("#dailyBtn")?.addEventListener("click", () => { SFX.init(); SFX.resume(); startDailyChallenge(); updateDailyBadge(); });
document.querySelector("#leaderboardBtn")?.addEventListener("click", showLeaderboard);
document.querySelector("#closeLeaderboard")?.addEventListener("click", () => document.querySelector("#leaderboardModal").classList.add("hidden"));
document.querySelector("#settingsBtn")?.addEventListener("click", showSettings);
document.querySelector("#closeSettings")?.addEventListener("click", () => document.querySelector("#settingsModal").classList.add("hidden"));
document.querySelector("#howToPlayBtn")?.addEventListener("click", () => document.querySelector("#howToPlayModal").classList.remove("hidden"));
document.querySelector("#closeHowToPlay")?.addEventListener("click", () => document.querySelector("#howToPlayModal").classList.add("hidden"));
document.querySelector("#shareRunBtn")?.addEventListener("click", shareRun);
document.querySelector("#volumeSlider")?.addEventListener("input", e => {
  SFX.setVolume(Number(e.target.value) / 100);
  const val = document.querySelector("#volumeVal");
  if (val) val.textContent = e.target.value + "%";
});
document.querySelector("#playSplash")?.addEventListener("click", () => {
  SFX.init(); SFX.resume();
  document.querySelector("#splashScreen").classList.add("hidden");
});

// Init
updateDailyBadge();
clearDrawing();
renderGarage();
renderSavedParts();
