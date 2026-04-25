// PatchDrive — Web Audio sound engine (procedural synthesis, no audio files)
const SFX = (() => {
  let ctx = null;
  let masterGain = null;
  let engineOsc = null;
  let engineGain = null;
  let engineFilter = null;
  let lfoOsc = null;
  let lfoGain = null;
  let engine2Osc = null;
  let engine2Gain = null;
  let currentVehicleId = null;
  let _running = false;
  let _volume = 0.55;

  const engineParams = {
    car:        { type: "sawtooth", freq: 90,  filterFreq: 900,  filterQ: 2.2, gain: 0.10 },
    bike:       { type: "sawtooth", freq: 130, filterFreq: 1400, filterQ: 3.0, gain: 0.09 },
    truck:      { type: "sawtooth", freq: 62,  filterFreq: 650,  filterQ: 2.0, gain: 0.12 },
    buggy:      { type: "sawtooth", freq: 105, filterFreq: 1000, filterQ: 2.5, gain: 0.10 },
    airplane:   { type: "sawtooth", freq: 200, filterFreq: 2000, filterQ: 1.5, gain: 0.08 },
    jet:        { type: "sawtooth", freq: 440, filterFreq: 4000, filterQ: 1.2, gain: 0.07, harmonic: { freq: 1320, gain: 0.04 } },
    helicopter: { type: "sine",     freq: 55,  filterFreq: 600,  filterQ: 1.2, gain: 0.10, chopper: 7 },
    spaceship:  { type: "sine",     freq: 44,  filterFreq: 500,  filterQ: 1.5, gain: 0.09 },
    orbital:    { type: "sine",     freq: 72,  filterFreq: 700,  filterQ: 2.0, gain: 0.09 }
  };

  function _init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = _volume;
    masterGain.connect(ctx.destination);
  }

  function _resume() {
    if (ctx && ctx.state === "suspended") ctx.resume();
  }

  function _stop(node) {
    if (!node) return;
    try { node.stop(); } catch (_) {}
    try { node.disconnect(); } catch (_) {}
  }

  function startEngine(vehicleId) {
    _init(); _resume();
    stopEngine();
    currentVehicleId = vehicleId;
    const p = engineParams[vehicleId] || engineParams.car;

    engineFilter = ctx.createBiquadFilter();
    engineFilter.type = "lowpass";
    engineFilter.frequency.value = p.filterFreq;
    engineFilter.Q.value = p.filterQ;
    engineFilter.connect(masterGain);

    engineGain = ctx.createGain();
    engineGain.gain.value = 0;
    engineGain.connect(engineFilter);

    engineOsc = ctx.createOscillator();
    engineOsc.type = p.type;
    engineOsc.frequency.value = p.freq;
    engineOsc.connect(engineGain);

    if (p.chopper) {
      // Amplitude-modulate with LFO for rotor chop (helicopter)
      lfoOsc = ctx.createOscillator();
      lfoOsc.frequency.value = p.chopper;
      lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.055;
      lfoOsc.connect(lfoGain);
      lfoGain.connect(engineGain.gain);
      lfoOsc.start();
    }

    if (p.harmonic) {
      // Second harmonic for jet turbine whine
      engine2Gain = ctx.createGain();
      engine2Gain.gain.value = 0;
      engine2Gain.connect(masterGain);
      engine2Osc = ctx.createOscillator();
      engine2Osc.type = "sine";
      engine2Osc.frequency.value = p.harmonic.freq;
      engine2Osc.connect(engine2Gain);
      engine2Osc.start();
    }

    engineOsc.start();
    // Fade in over 0.4s to avoid click
    engineGain.gain.setValueAtTime(0, ctx.currentTime);
    engineGain.gain.linearRampToValueAtTime(p.gain * 0.7, ctx.currentTime + 0.4);
    _running = true;
  }

  function updateEngine(throttle, boost, speed) {
    if (!engineOsc || !_running) return;
    const p = engineParams[currentVehicleId] || engineParams.car;
    const t = ctx.currentTime;
    const boostMult = boost > 1 ? 1.28 : 1;
    const targetFreq = p.freq * (0.82 + throttle * 0.48 + Math.abs(speed) * 0.003) * boostMult;
    const targetGain = (p.gain * 0.65 + throttle * p.gain * 0.55 + (boost > 1 ? p.gain * 0.15 : 0));
    const targetFilter = p.filterFreq * (0.65 + throttle * 0.7 + (boost > 1 ? 0.35 : 0));
    engineOsc.frequency.setTargetAtTime(Math.min(targetFreq, p.freq * 2.2), t, 0.09);
    engineGain.gain.setTargetAtTime(Math.min(targetGain, 0.18), t, 0.09);
    engineFilter.frequency.setTargetAtTime(targetFilter, t, 0.1);

    if (engine2Osc && engine2Gain) {
      engine2Gain.gain.setTargetAtTime(throttle * 0.04 * (boost > 1 ? 1.4 : 1), t, 0.12);
    }
  }

  function stopEngine() {
    if (!engineOsc) return;
    try {
      // Fade out before stopping
      const fadeEnd = ctx.currentTime + 0.3;
      engineGain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      setTimeout(() => {
        _stop(engineOsc); _stop(engineGain); _stop(engineFilter);
        _stop(lfoOsc); _stop(lfoGain);
        _stop(engine2Osc); _stop(engine2Gain);
        engineOsc = engineGain = engineFilter = null;
        lfoOsc = lfoGain = engine2Osc = engine2Gain = null;
        _running = false;
      }, 350);
    } catch (_) { _running = false; }
  }

  function _shot(fn) {
    _init(); _resume();
    try { fn(ctx, masterGain); } catch (_) {}
  }

  function playImpact(severity = 1) {
    _shot((ctx, out) => {
      const len = Math.floor(ctx.sampleRate * 0.28);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      const decay = ctx.sampleRate * 0.07 / Math.max(severity, 0.3);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / decay);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = "lowpass";
      f.frequency.value = Math.min(600, 200 + severity * 120);
      const g = ctx.createGain(); g.gain.value = Math.min(0.32, 0.12 * severity);
      src.connect(f); f.connect(g); g.connect(out); src.start();
    });
  }

  function playDebrisHit() {
    _shot((ctx, out) => {
      const osc = ctx.createOscillator(); osc.type = "triangle";
      osc.frequency.value = 150 + Math.random() * 100;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.16, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.22);

      const len = Math.floor(ctx.sampleRate * 0.1);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
      const ns = ctx.createBufferSource(); ns.buffer = buf;
      const ng = ctx.createGain(); ng.gain.value = 0.14;
      ns.connect(ng); ng.connect(out); ns.start();
    });
  }

  function playPickup(type) {
    _shot((ctx, out) => {
      const sets = {
        coin:   [880, 1108, 1320],
        repair: [440, 554, 659],
        fuel:   [660, 784, 880]
      };
      (sets[type] || sets.coin).forEach((freq, i) => {
        const osc = ctx.createOscillator(); osc.type = "sine";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        const t = ctx.currentTime + i * 0.07;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(g); g.connect(out); osc.start(t); osc.stop(t + 0.2);
      });
    });
  }

  function playPartFailure() {
    _shot((ctx, out) => {
      const osc = ctx.createOscillator(); osc.type = "sawtooth";
      osc.frequency.setValueAtTime(340, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(72, ctx.currentTime + 0.45);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.17, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900;
      osc.connect(f); f.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.45);
    });
  }

  function playInstallRepair(quality) {
    _shot((ctx, out) => {
      const base = 280 + quality * 520;
      [1, 1.26, 1.5].forEach((mult, i) => {
        const osc = ctx.createOscillator(); osc.type = "triangle";
        osc.frequency.value = base * mult;
        const g = ctx.createGain();
        const t = ctx.currentTime + i * 0.08;
        g.gain.setValueAtTime(0.11, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(g); g.connect(out); osc.start(t); osc.stop(t + 0.28);
      });
    });
  }

  function playDisasterStart() {
    _shot((ctx, out) => {
      const len = Math.floor(ctx.sampleRate * 0.55);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.22));
      const src = ctx.createBufferSource(); src.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 180; f.Q.value = 0.7;
      const g = ctx.createGain(); g.gain.value = 0.28;
      src.connect(f); f.connect(g); g.connect(out); src.start();

      const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = 52;
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.22, ctx.currentTime);
      og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.connect(og); og.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.55);
    });
  }

  function playBossStart() {
    _shot((ctx, out) => {
      [44, 66, 110, 220].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i < 2 ? "sawtooth" : "square";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        const t = ctx.currentTime + i * 0.06;
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
        osc.connect(g); g.connect(out); osc.start(t); osc.stop(t + 0.9);
      });
    });
  }

  function playMissionComplete() {
    _shot((ctx, out) => {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator(); osc.type = "triangle";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        const t = ctx.currentTime + i * 0.11;
        g.gain.setValueAtTime(0.13, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.connect(g); g.connect(out); osc.start(t); osc.stop(t + 0.32);
      });
    });
  }

  function playCheckpoint() {
    _shot((ctx, out) => {
      [392, 494].forEach((freq, i) => {
        const osc = ctx.createOscillator(); osc.type = "sine";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        const t = ctx.currentTime + i * 0.14;
        g.gain.setValueAtTime(0.14, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
        osc.connect(g); g.connect(out); osc.start(t); osc.stop(t + 0.38);
      });
    });
  }

  function playBiomeTransition() {
    _shot((ctx, out) => {
      const osc = ctx.createOscillator(); osc.type = "sine";
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(524, ctx.currentTime + 0.45);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.setValueAtTime(0.1, ctx.currentTime + 0.35);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.65);
    });
  }

  function playLowHpBeep() {
    _shot((ctx, out) => {
      const osc = ctx.createOscillator(); osc.type = "square";
      osc.frequency.value = 880;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.055, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.09);
    });
  }

  function playDrawStroke() {
    _shot((ctx, out) => {
      const osc = ctx.createOscillator(); osc.type = "sine";
      osc.frequency.value = 180 + Math.random() * 70;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.038, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.06);
    });
  }

  function setVolume(v) {
    _volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = _volume;
  }

  function getVolume() { return _volume; }

  function init() { _init(); }
  function resume() { _resume(); }

  return {
    startEngine, updateEngine, stopEngine,
    playImpact, playDebrisHit, playPickup, playPartFailure,
    playInstallRepair, playDisasterStart, playBossStart,
    playMissionComplete, playCheckpoint, playBiomeTransition,
    playLowHpBeep, playDrawStroke, setVolume, getVolume, init, resume
  };
})();
