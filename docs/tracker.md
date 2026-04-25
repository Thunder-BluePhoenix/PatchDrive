---
title: PatchDrive — Progress Tracker
updated: 2026-04-25
---

# PatchDrive Progress Tracker

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 1 | MVP | ✅ Done | Playable browser prototype shipped |
| 2 | Polish & Feel | 🔶 Sound Remaining | All done except sound effects (doing last) |
| 3 | Content Expansion | 🔲 Planned | More vehicles, upgrades, disasters, missions |
| 4 | Depth & Replayability | 🔲 Planned | Procedural world, boss events, loadouts |
| 5 | Launch & Community | 🔲 Planned | Menus, daily runs, leaderboard, itch.io |

---

## Phase 2 — Polish & Feel

### Visuals
- [x] Improve vehicle art (distinct per vehicle)
- [x] Visible damage effects on vehicle (smoke + color shift + damage ring)
- [x] Installed repairs shown on vehicle (sketch overlay)
- [x] Animated disaster effects (sky color tint + streaks)
- [x] Animated wheels and helicopter rotor

### Feedback
- [ ] Sound effects (impacts, repairs, disasters, pickups)
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
- [ ] More vehicles per category
- [ ] Unlockable vehicle classes
- [ ] Vehicle-specific parts lists

### Upgrades
- [ ] Ground upgrades (grip, suspension, brakes, torque, chassis)
- [ ] Air upgrades (lift, thrust, wing, fuel efficiency, turbulence)
- [ ] Space upgrades (thruster, shield, oxygen, reactor, heat tiles)
- [ ] Universal upgrades (durability, canvas size, heal efficiency, coin multiplier)

### Disasters
- [ ] Disaster warning indicators
- [ ] Full ground hazard set
- [ ] Full air hazard set
- [ ] Full space hazard set

### Missions
- [ ] Per-run missions
- [ ] Bonus coin rewards for mission completion

### UI
- [ ] In-run pause menu
- [ ] Post-run summary screen

---

## Phase 4 — Depth & Replayability

- [ ] Procedural world generation
- [ ] Biome zone transitions
- [ ] Boss-like disaster events
- [ ] Improved drawing recognition
- [ ] Saved custom parts
- [ ] Vehicle loadouts
- [ ] Checkpoint garages mid-run
- [ ] Self-repair system

---

## Phase 5 — Launch & Community

- [ ] Polished start menu
- [ ] Settings screen
- [ ] Daily challenge runs
- [ ] Leaderboards
- [ ] Shareable score cards
- [ ] PWA packaging
- [ ] itch.io release
