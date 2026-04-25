---
title: PatchDrive — Progress Tracker
updated: 2026-04-25
---

# PatchDrive Progress Tracker

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 1 | MVP | ✅ Done | Playable browser prototype shipped |
| 2 | Polish & Feel | ✅ Done | All done including sound effects |
| 3 | Content Expansion | ✅ Done | More vehicles, upgrades, disasters, missions, pause, stats |
| 4 | Depth & Replayability | ✅ Done | Biomes, boss events, checkpoints, loadouts, saved parts, auto-repair |
| 5 | Launch & Community | ✅ Done | Splash screen, settings, how-to-play, daily challenge, leaderboard, share card |

---

## Phase 2 — Polish & Feel

### Visuals
- [x] Improve vehicle art (distinct per vehicle)
- [x] Visible damage effects on vehicle (smoke + color shift + damage ring)
- [x] Installed repairs shown on vehicle (sketch overlay)
- [x] Animated disaster effects (sky color tint + streaks)
- [x] Animated wheels and helicopter rotor

### Feedback
- [x] Sound effects (impacts, repairs, disasters, pickups)
- [x] Screen shake on hard impacts, debris hits, disasters
- [x] Particle effects — smoke, sparks, coin pop

### Terrain
- [x] Background parallax layers (mountains for ground, clouds for air, nebula/stars for space)
- [x] Ground rocks and pebbles (procedural, scroll with terrain, change color per disaster)

### Input
- [x] Mobile touch controls (D-pad + boost overlay)
- [x] Drawing canvas works on touch (pointer events)

### Drawing System
- [x] Per-part shape scoring — circle test for wheels/gears, elongation for pipes, flatness for wings, triangle for thrusters, blocky for armor/shields
- [x] Shape hint shown to player during repair ("Draw a circle", "Draw a long tube", etc.)
- [x] Post-repair quality feedback — grade label + coin count + improvement hint if quality is low

---

## Phase 3 — Content Expansion

### Vehicles
- [x] New vehicles: Dune Buggy (ground), Void Runner (space)
- [x] Unlock system — vehicles gated by bank coins (click locked card to buy)
- [x] Helicopter and Buggy/Orbital unlock costs set in vehicle data
- [x] Vehicle-specific parts arrays (buggy, orbital override defaults)

### Upgrades
- [x] Ground type upgrades: Tire Grip, Suspension (affects friction + impact reduction)
- [x] Air type upgrades: Lift, Fuel Efficiency
- [x] Space type upgrades: Thruster Power, Shield Strength
- [x] Type upgrade grid shown/hidden based on selected vehicle
- [x] All upgrade costs scale per level

### Disasters
- [x] Disaster warning — HUD blinks red "! WARNING" 2.5s before strike
- [x] Full ground set: Earthquake, Flood, Sandstorm, Meteor Shower, Landslide, Ice Storm, Tornado, Mud Surge
- [x] Full air set: Thunderstorm, Turbulence, Volcanic Ash, Cyclone, Lightning, Engine Icing, Air Debris
- [x] Full space set: Asteroid Field, Solar Flare, Gravity Well, Debris Storm, Radiation Burst, Oxygen Leak, Plasma Surge
- [x] Special disaster effects: ice (low friction), lightning (instant heat+hp), engine_ice (engine throttled), fuel_drain, overheat, radiation (big instant hit)

### Missions
- [x] Per-run mission picked from 10-mission pool
- [x] Mission progress shown live in run strip (middle column)
- [x] Bonus coins on completion, logged in post-run stats
- [x] Mission types: survive disasters, make repairs, travel distance, collect pickups, perfect repair, survive time, boost time

### UI
- [x] In-run pause menu (P or Escape — shows score/coins, Resume + Quit Run)
- [x] Post-run summary screen with full stats breakdown (distance, time, disasters, repairs, best quality, pickups, mission result, total coins)

---

## Phase 4 — Depth & Replayability

### World
- [x] Biome zones per vehicle type (5 ground, 4 air, 4 space) — unlock by score
- [x] Each biome changes sky gradient, ground color, terrain amplitude/frequency, rock color
- [x] Biome transition shown in event log ("Entering Desert")
- [x] Boss visual overlay in Volcanic biome (fire cracks on terrain)

### Boss Events
- [x] One boss per vehicle type — Mega Tornado (ground), Storm Front (air), Colossal Asteroid (space)
- [x] 3-phase bosses with escalating wind/shake/damage per phase
- [x] Boss health bar + phase progress shown on canvas
- [x] Boss defeated gives +80 run coins and counts as a disaster survived
- [x] Next boss triggers every ~1200 score units

### Checkpoints
- [x] Checkpoint garage every 700 score
- [x] Options: Full Heal (50 coins), Replace Broken Part (30 coins), Continue (free)
- [x] Pauses game, shows current HP/coins/score

### Loadouts
- [x] 5 loadout options chosen before each run: Standard, Hull, Tank, Tools, Veteran
- [x] Applied at run start — HP bonus, fuel bonus, repair quality bonus, or delayed first failure

### Saved Custom Parts
- [x] Save any drawn sketch with a name (max 6 slots, oldest dropped)
- [x] Saved parts shown in repair panel — click to load into the canvas
- [x] Persisted in localStorage across sessions

### Self-Repair
- [x] "Auto-Repair" upgrade available for all vehicle types (3 tiers)
- [x] Slowly restores part health when a part is broken, at cost of fuel

---

## Phase 5 — Launch & Community

- [x] Polished splash screen (animated logo, bob effect, Play button)
- [x] Settings modal (volume slider, controls reference)
- [x] How-to-play modal (mechanics, drawing tips, progression, tips)
- [x] Daily challenge (date-seeded RNG picks fixed vehicle + mission)
- [x] Local leaderboard (top scores across all vehicles, stored in localStorage)
- [x] Shareable score card (PNG download — vehicle, score, full stats)
- [ ] PWA packaging (manifest + service worker)
- [ ] itch.io release
