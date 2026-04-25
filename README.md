# PatchDrive

> Survive disasters. Draw emergency parts. Keep rolling.

PatchDrive is a browser-based endless survival game. Pick a machine, drive through escalating disasters, and when parts fail — draw replacements by hand to keep going. The quality of your drawing directly affects your repair.

---

## Play

No install needed. Serve the folder over HTTP and open `index.html`:

```bash
# Python (built into macOS / Linux)
cd PatchDrive
python3 -m http.server 3000
# → open http://localhost:3000
```

```bash
# Node
npx serve PatchDrive
```

> **Why a server?** The Web Audio API is blocked on `file://` URLs. Everything else works without one, but sound won't initialize.

---

## Game Modes

| Mode | Controls | Pickups |
|------|----------|---------|
| **Normal** | Vehicle drives itself (auto-pilot) | Tap / click on screen to collect |
| **Hell 🔥** | Full manual keyboard + touch | Auto-collect on contact |

Select your mode in the Garage before starting a run.

---

## Controls (Hell Mode / Manual)

| Key | Action |
|-----|--------|
| `W` / `↑` | Thrust / fly up |
| `S` / `↓` | Brake / descend |
| `A` / `←` `D` / `→` | Balance / steer |
| `Space` | Boost (burns fuel + heat) |
| `P` / `Esc` | Pause |

**Mobile:** D-pad and Boost button appear automatically on touch devices (Hell mode only).

---

## How to Play

1. **Choose a vehicle** in the Garage. Ground, air, and space machines handle very differently.
2. **Pick a loadout** — Hull for extra HP, Tank for more fuel, Tools for a first-repair bonus, Veteran for a grace period before the first part fails.
3. **Start the run.** Your vehicle scrolls right endlessly while disasters strike.
4. **When a part fails** the repair panel activates. Follow the guide shape and draw the replacement part. Shape quality (circle, tube, wing, triangle, block) determines repair quality — better drawing = more HP restored + more coins.
5. **Collect pickups** — coins 💰, repair kits ➕, fuel cells ⚡. In Normal mode, tap them on screen.
6. **Survive as far as possible.** Earn bank coins to spend on upgrades between runs.

---

## Vehicles

### Ground
| Vehicle | Style |
|---------|-------|
| Scout Car | Balanced all-rounder |
| Ridge Bike | Fast and light, fragile |
| Iron Truck | Slow, very durable |
| Dune Buggy *(unlock: 600 coins)* | Agile, open-frame off-road |

### Air
| Vehicle | Style |
|---------|-------|
| Aero Wing | Stable fixed-wing flier |
| Storm Jet | High speed, harder to control |
| Patch Copter *(unlock: 800 coins)* | Hover capable, unique rotor mechanics |

### Space
| Vehicle | Style |
|---------|-------|
| Orbit Scrap | Classic space survivor |
| Void Runner *(unlock: 1200 coins)* | Twin-engine fast interceptor |

---

## Drawing System

When a part fails, a dashed guide appears on the repair canvas. Draw over it before clicking **Install**.

| Part | Expected Shape | Scoring |
|------|----------------|---------|
| Wheel / Gear / Reactor | Circle | Circularity + aspect ratio |
| Pipe / Axle / Oxygen line | Long tube | Elongation ratio |
| Wing / Rotor / Solar panel | Wide flat shape | Width-to-height ratio |
| Thruster / Nozzle | Triangle | Pointed asymmetry |
| Armor / Shield / Spring | Solid block | Squareness + coverage |

A **quality score (0–100%)** is given on install. Higher quality = more HP restored + more coins + better part durability.

**Tip:** Save your best drawings with a name using the Saved Parts panel. Load them instantly next time that part fails.

---

## Upgrades

Spend bank coins between runs on:

**Universal** — Engine, Armor, Stability, Repair quality  
**Ground** — Tire Grip, Suspension, Auto-Repair  
**Air** — Lift, Fuel Efficiency, Auto-Repair  
**Space** — Thruster Power, Shield Strength, Auto-Repair

Auto-Repair slowly restores part health during a run at the cost of fuel.

---

## Systems

### Biomes
Each vehicle type moves through multiple biomes as your score grows. Biomes change sky, terrain color, and amplitude. Ground biomes: Plains → Desert → Ice Fields → City Rubble → Volcanic. Air: Low Clouds → Storm Layer → High Altitude → Space Edge. Space: Near Orbit → Asteroid Belt → Deep Space → Nebula Core.

### Boss Events
Every ~1200 score a boss appears — Mega Tornado (ground), Storm Front (air), Colossal Asteroid (space). Bosses have 3 escalating phases shown via a health bar on the canvas. Defeating a boss gives +80 coins.

### Checkpoints
Every 700 score a checkpoint garage pauses the run. Options: Full Heal (50 coins), Replace Broken Part (30 coins), or Continue free.

### Missions
Each run has one mission (e.g. "Survive 3 disasters", "Land a 90%+ repair", "Travel 2500 distance"). Completing it gives a coin bonus.

### Daily Challenge
One fixed vehicle + mission per calendar day (same for everyone). Find it in the Garage.

---

## Phase 5 Features

| Feature | Description |
|---------|-------------|
| Splash screen | Animated intro with bobbing logo |
| Settings | Volume slider + controls reference |
| How to Play | In-game guide overlay |
| Daily Challenge | Date-seeded run, same vehicle + mission each day |
| Leaderboard | Your top scores across all vehicles (localStorage) |
| Share Card | Downloads a PNG score card after each run |

---

## Project Structure

```
PatchDrive/
├── index.html       # Single-page layout — all UI sections
├── styles.css       # Dark theme, responsive grid
├── game.js          # All game logic (~2100 lines)
├── sounds.js        # Web Audio API sound engine (procedural, no files)
├── assets/
│   └── patchdrive-icon.svg
└── docs/
    ├── tracker.md   # Phase progress tracker
    ├── motto.md
    ├── phase-1-mvp.md
    ├── phase-2-polish.md
    ├── phase-3-content.md
    ├── phase-4-depth.md
    └── phase-5-launch.md
```

**No framework. No build step. No dependencies.**  
Vanilla JS + Canvas 2D + Web Audio API. Runs in any modern browser.

---

## Tech Notes

- **Rendering** — Canvas 2D API, `requestAnimationFrame` loop with delta-time
- **Physics** — Custom 2D physics: gravity, lift, drag, friction, spin, terrain collision with two-point slope alignment
- **Sound** — All sounds are synthesized at runtime via Web Audio API (oscillators, noise buffers, filters, envelopes). No audio files.
- **Drawing recognition** — Geometric heuristics per part type (circularity, elongation, flatness, triangularity, squareness)
- **Persistence** — `localStorage` for bank coins, upgrades, best scores, unlocked vehicles, saved parts, leaderboard
- **Auto-pilot (Normal mode)** — PD controller for angle stabilization; air uses lift/brake toggling for altitude; space uses turn-impulse for vertical position; ground samples terrain at both axle positions for slope alignment

---

## License

MIT — see [LICENSE](LICENSE).
