---
title: Phase 1 — MVP (Complete)
status: done
---

# Phase 1 — MVP

**Goal:** Ship a playable browser prototype that proves the core loop works.

## What Was Built

- Static HTML, CSS, and JavaScript — no framework
- Garage screen with vehicle selection
- Ground, air, and space vehicle categories
- Physics: gravity, friction, lift, drag, thrust, fuel, heat, stability
- Disasters per vehicle type
- Debris hazards
- Coin, fuel, and repair pickups
- Random part failures
- Repair drawing canvas with guide shapes
- Repair quality scoring (coverage, stroke, balance, size)
- Emergency heal spending run coins
- Run coins and persistent bank coins
- Upgrades: engine, armor, stability, repair
- Best score tracking per vehicle

## Controls

| Key | Action |
|-----|--------|
| W / Up | thrust / climb / accelerate |
| S / Down | brake / descend |
| A / Left | rotate or balance left |
| D / Right | rotate or balance right |
| Space | boost |
| Mouse / Touch | draw repair parts |

## Files

- `index.html` — entry point and UI
- `styles.css` — layout and HUD
- `game.js` — all game logic

## Status

MVP is complete and playable in the browser.
