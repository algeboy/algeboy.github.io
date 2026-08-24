/*
 * An original procedural navigation score.  It deliberately uses no sampled
 * music, melodies, or external audio: a subdued pulse, bass interval, and
 * filtered drone are created with the browser's Web Audio primitives.
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
  let nextBeat = 0;
  let beat = 0;
  let desired = false;
  let suspendedByVisibility = false;
  const audioContext = window.AudioContext || window.webkitAudioContext;
  let unavailable = !audioContext;
  const tempo = 104;
  const secondsPerBeat = 60 / tempo;
  const pattern = [0, 7, 10, 14, 10, 7, 3, 10];
  const root = 55;

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

  function note(time, frequency, duration, type = "triangle", volume = 0.035) {
    if (!context || !master) return;
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const envelope = gainAt(0.0001, time);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(type === "sine" ? 300 : 1650, time);
    filter.Q.value = 1.4;
    envelope.gain.exponentialRampToValueAtTime(volume, time + 0.014);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(filter).connect(envelope).connect(master);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.03);
  }

  function scheduleBeat(time) {
    const interval = pattern[beat % pattern.length];
    const frequency = root * 2 ** (interval / 12);
    note(time, frequency * 2, secondsPerBeat * 0.72, "triangle", 0.030);
    if (beat % 4 === 0) note(time, root / 2, secondsPerBeat * 1.42, "sine", 0.048);
    if (beat % 8 === 6) note(time + secondsPerBeat * 0.5, frequency * 1.5, secondsPerBeat * 0.3, "sine", 0.016);
    beat += 1;
  }

  function schedulerTick() {
    if (!context || context.state !== "running") return;
    while (nextBeat < context.currentTime + 0.16) {
      scheduleBeat(nextBeat);
      nextBeat += secondsPerBeat;
    }
  }

  function buildDrone() {
    const filter = context.createBiquadFilter();
    const level = gainAt(0.019, context.currentTime);
    filter.type = "lowpass";
    filter.frequency.value = 260;
    filter.Q.value = 0.7;
    filter.connect(level).connect(master);
    drone = [root / 2, root].map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index ? -7 : 4;
      oscillator.connect(filter);
      oscillator.start();
      return oscillator;
    });
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
        nextBeat = context.currentTime + 0.06;
        beat = 0;
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
    drone.forEach(oscillator => { try { oscillator.stop(); } catch { /* Already stopped. */ } });
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
    note(time, root * 4, 0.12, "sine", 0.017);
    note(time + 0.035, root * 5, 0.16, "triangle", 0.012);
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
