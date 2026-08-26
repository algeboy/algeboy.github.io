/*
 * An original procedural navigation score.  It deliberately uses no sampled
 * music, melodies, samples, or external audio.  Its uneven clock, shifting
 * timbres, and slowly moving drone are all created with Web Audio primitives.
 */
(() => {
  "use strict";

  const isCircuitWindow = new URLSearchParams(location.search).has("circuit-window") && window.self !== window.top;
  if (isCircuitWindow) {
    const notifyParent = action => {
      try { window.top.postMessage({ type:"navigation-score", action }, location.origin); } catch { /* Parent may be unavailable in a standalone preview. */ }
    };
    document.addEventListener("pointerdown", () => notifyParent("resume"), { capture:true, passive:true });
    document.addEventListener("keydown", event => {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) notifyParent("resume");
    }, { capture:true });
    document.addEventListener("click", event => {
      if (event.target.closest?.("a.home-circuit-cpu,a.home-circuit-author,a.home-circuit-branch,a.home-circuit-unit,a.home-circuit-page,a.home-circuit-folder")) notifyParent("pulse");
    }, { capture:true });
    return;
  }

  const STORAGE_KEY = "5000-navigation-score-enabled";
  const controls = new Set();
  let context = null;
  let master = null;
  let drone = [];
  let scheduler = null;
  let nextEvent = 0;
  let step = 0;
  let phrase = 0;
  let desired = false;
  let suspendedByVisibility = false;
  const audioContext = window.AudioContext || window.webkitAudioContext;
  let unavailable = !audioContext;
  const tempo = 92;
  const secondsPerPulse = 60 / tempo;
  const root = 55;
  // Short/long cells deliberately do not sum to a familiar bar.  Each phrase
  // takes a different offset through them, so the clock has a recognizable
  // character without settling into a loop.
  const clockCells = [0.43, 0.71, 0.29, 0.57, 0.36, 0.64, 0.48, 0.82, 0.33, 0.55, 0.39];
  const pitchFields = [
    [0, 1, 7, 10, 14, 17],
    [0, 3, 8, 10, 15, 19],
    [0, 2, 6, 11, 13, 18],
    [0, 5, 7, 12, 16, 20]
  ];
  let randomState = ((Date.now() ^ Math.floor(performance.now() * 1000)) >>> 0) || 0x6d2b79f5;

  function random() {
    // A local generator avoids an externally visible global random sequence
    // while making every listening session take a distinct route.
    randomState ^= randomState << 13;
    randomState ^= randomState >>> 17;
    randomState ^= randomState << 5;
    return (randomState >>> 0) / 4294967296;
  }

  function isHomepage() {
    return document.body?.classList.contains("homepage");
  }

  // The score is opt-out for a first visit.  A saved explicit mute is the only
  // stored value that disables it; the browser still requires a real gesture
  // before any AudioContext may begin producing sound.
  try { desired = localStorage.getItem(STORAGE_KEY) !== "false"; } catch { desired = true; }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, String(desired)); } catch { /* A session-only score is still useful. */ }
  }

  function status() {
    if (unavailable) return { enabled: false, running: false, text: "SCORE UNAVAILABLE" };
    if (!desired) return { enabled: false, running: false, text: "ENABLE SCORE" };
    if (context?.state === "running") return { enabled: true, running: true, text: "SCORE ACTIVE" };
    return { enabled: true, running: false, text: "SCORE ARMED — INTERACT TO RESUME" };
  }

  function updateControls() {
    const state = status();
    controls.forEach(control => {
      const label = control.querySelector(".navigation-score__label");
      const detail = control.querySelector(".navigation-score__status");
      control.setAttribute("aria-pressed", String(state.enabled));
      control.classList.toggle("is-active", state.running);
      if (label) label.textContent = state.enabled ? "MUTE SCORE" : "ENABLE SCORE";
      if (detail) detail.textContent = state.text;
    });
    document.dispatchEvent(new CustomEvent("navigation-score-change", { detail: state }));
  }

  function gainAt(value, time) {
    const gain = context.createGain();
    gain.gain.setValueAtTime(value, time);
    return gain;
  }

  function note(time, frequency, duration, type = "triangle", volume = 0.035, colour = 1200) {
    if (!context || !master) return;
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const envelope = gainAt(0.0001, time);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.detune.setValueAtTime((random() - 0.5) * 18, time);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(colour, time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(90, colour * (0.32 + random() * 0.35)), time + duration);
    filter.Q.value = 0.7 + random() * 4.5;
    envelope.gain.exponentialRampToValueAtTime(volume, time + 0.014);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(filter).connect(envelope).connect(master);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.03);
  }

  function noiseTick(time, duration, volume, colour) {
    const length = Math.max(1, Math.ceil(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) data[index] = (random() * 2 - 1) * (1 - index / length);
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = gainAt(0.0001, time);
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(colour, time);
    filter.Q.value = 2 + random() * 9;
    envelope.gain.exponentialRampToValueAtTime(volume, time + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    source.connect(filter).connect(envelope).connect(master);
    source.start(time);
    source.stop(time + duration + 0.02);
  }

  function scheduleEvent(time) {
    const field = pitchFields[phrase % pitchFields.length];
    const interval = field[Math.floor(random() * field.length)];
    const frequency = root * 2 ** (interval / 12);
    const density = phrase % 5 === 3 ? 0.52 : 0.74;
    const duration = secondsPerPulse * (0.14 + random() * 0.46);

    if (random() < density) {
      note(time, frequency * (random() < 0.18 ? 0.5 : 2), duration, random() < 0.58 ? "triangle" : "sine", 0.012 + random() * 0.022, 320 + random() * 2400);
    }
    if (random() < 0.46) noiseTick(time + random() * secondsPerPulse * 0.08, 0.016 + random() * 0.065, 0.003 + random() * 0.011, 500 + random() * 5200);
    // Sparse sub tones make an occasional landing point, not a regular kick.
    if (step % 7 === 0 || (step % 11 === 5 && random() < 0.45)) {
      note(time, root / 2 * 2 ** ((phrase % 3) / 12), secondsPerPulse * (0.48 + random() * 0.66), "sine", 0.026, 240);
    }

    step += 1;
    if (step % clockCells.length === 0) phrase += 1;
    return secondsPerPulse * clockCells[(step + phrase * 3) % clockCells.length] * (0.9 + random() * 0.22);
  }

  function schedulerTick() {
    if (!context || context.state !== "running") return;
    while (nextEvent < context.currentTime + 0.16) {
      nextEvent += scheduleEvent(nextEvent);
    }
  }

  function buildDrone() {
    const filter = context.createBiquadFilter();
    const level = gainAt(0.019, context.currentTime);
    filter.type = "lowpass";
    filter.frequency.value = 180;
    filter.Q.value = 1.1;
    filter.connect(level).connect(master);
    const filterLfo = context.createOscillator();
    const filterDepth = gainAt(120, context.currentTime);
    filterLfo.type = "sine";
    filterLfo.frequency.value = 0.023;
    filterLfo.connect(filterDepth).connect(filter.frequency);
    filterLfo.start();
    const voices = [filterLfo];
    voices.push(...[root / 2, root].flatMap((frequency, index) => {
      const oscillator = context.createOscillator();
      const lfo = context.createOscillator();
      const lfoDepth = gainAt(index ? 5 : 9, context.currentTime);
      oscillator.type = index ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index ? -7 : 4;
      lfo.type = "sine";
      lfo.frequency.value = index ? 0.031 : 0.017;
      lfo.connect(lfoDepth).connect(oscillator.detune);
      oscillator.connect(filter);
      oscillator.start();
      lfo.start();
      return [oscillator, lfo];
    }));
    drone = voices;
  }

  async function ensureRunning() {
    if (!desired || unavailable || !audioContext) return false;
    try {
      if (!context || context.state === "closed") {
        context = new audioContext();
        master = context.createGain();
        // Still well below unity gain: the score is more present (+4.2 dB
        // from the original 0.42 setting)
        // and simultaneous bass, pulse, and drone voices retain ample
        // headroom at the destination.
        master.gain.value = 0.68;
        master.connect(context.destination);
        buildDrone();
        nextEvent = context.currentTime + 0.06;
        step = 0;
        phrase = 0;
        scheduler = window.setInterval(schedulerTick, 90);
      }
      await context.resume();
      suspendedByVisibility = false;
      updateControls();
      return context.state === "running";
    } catch (error) {
      console.warn("Navigation score could not start", error);
      unavailable = true;
      desired = false;
      persist();
      updateControls();
      return false;
    }
  }

  async function ensureHoverAudio() {
    if (unavailable || !audioContext) return false;
    try {
      if (!context || context.state === "closed") {
        context = new audioContext();
        master = context.createGain();
        master.gain.value = 0.18;
        master.connect(context.destination);
      }
      await context.resume();
      return context.state === "running";
    } catch (error) {
      console.warn("Sidebar hover audio could not start", error);
      unavailable = true;
      updateControls();
      return false;
    }
  }

  async function mute() {
    desired = false;
    persist();
    if (scheduler) window.clearInterval(scheduler);
    scheduler = null;
    drone.flat().forEach(oscillator => { try { oscillator.stop(); } catch { /* Already stopped. */ } });
    drone = [];
    if (context && context.state !== "closed") {
      try { await context.close(); } catch { /* Closing is best effort. */ }
    }
    context = null;
    master = null;
    updateControls();
  }

  async function toggle() {
    if (desired) return mute();
    desired = true;
    persist();
    await ensureRunning();
  }

  function navigationPulse() {
    if (!context || context.state !== "running" || !master) return;
    const time = context.currentTime;
    note(time, root * (3 + random() * 2), 0.12, "sine", 0.014, 700 + random() * 1700);
    if (random() < 0.7) note(time + 0.025 + random() * 0.045, root * (4 + random() * 2), 0.16, "triangle", 0.010, 1000 + random() * 2200);
  }

  function sidebarHover(kind = "node") {
    if (!context || context.state !== "running" || !master || document.hidden) return;
    const frequency = kind === "folder" ? root * 3 : kind === "control" ? root * 4 : root * 5;
    const time = context.currentTime;
    note(time, frequency, 0.055, "sine", 0.012);
    note(time + 0.018, frequency * 1.25, 0.075, "triangle", 0.008);
  }

  function createControl(options = {}) {
    const control = document.createElement("button");
    control.type = "button";
    control.className = `navigation-score${options.compact ? " navigation-score--compact" : ""}`;
    control.setAttribute("aria-pressed", "false");
    control.setAttribute("aria-label", "Enable or mute the original procedural navigation score");
    control.innerHTML = `<span class="navigation-score__lamp" aria-hidden="true"></span><span class="navigation-score__label"></span><span class="navigation-score__status" aria-live="polite"></span>`;
    control.addEventListener("click", () => { void toggle(); });
    controls.add(control);
    updateControls();
    return control;
  }

  function interaction(event) {
    if (unavailable || document.hidden) return;
    if (event.type === "keydown" && (event.metaKey || event.ctrlKey || event.altKey)) return;
    if (!isHomepage()) {
      void ensureHoverAudio();
      return;
    }
    if (!desired) return;
    void ensureRunning();
  }

  document.addEventListener("pointerdown", interaction, { capture: true, passive: true });
  document.addEventListener("keydown", interaction, { capture: true });
  document.addEventListener("click", event => {
    const link = event.target.closest?.("a.home-circuit-cpu,a.home-circuit-author,a.home-circuit-branch,a.home-circuit-unit,a.home-circuit-page,a.home-circuit-folder,.sidebar-circuit-cpu");
    if (isHomepage() && link) navigationPulse();
  }, { capture: true });
  document.addEventListener("keydown", event => {
    if (isHomepage() && (event.key === "Enter" || event.key === " ") && event.target.closest?.("a.home-circuit-cpu,a.home-circuit-author,a.home-circuit-branch,a.home-circuit-unit,a.home-circuit-page,a.home-circuit-folder,.sidebar-circuit-cpu")) navigationPulse();
  }, { capture: true });
  document.addEventListener("visibilitychange", () => {
    if (!context || context.state !== "running") return;
    if (document.hidden) {
      suspendedByVisibility = true;
      void context.suspend().then(updateControls);
    }
  });
  window.addEventListener("pagehide", () => {
    if (context?.state === "running") void context.suspend();
  }, { capture: true });
  window.addEventListener("message", event => {
    if (event.origin !== location.origin || event.data?.type !== "navigation-score") return;
    if (event.data.action === "pulse" && isHomepage()) navigationPulse();
    else if (event.data.action === "resume") void (isHomepage() ? ensureRunning() : ensureHoverAudio());
  });

  window.NavigationScore = Object.freeze({ createControl, toggle, resume: ensureRunning, primeHoverAudio: ensureHoverAudio, sidebarHover, get status() { return status(); }, get wasPausedByVisibility() { return suspendedByVisibility; } });
  updateControls();
})();
