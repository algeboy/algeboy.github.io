/**
 * TOC Compass Widget
 * Concentric brass rings navigation for a Quarto book.
 *
 * DATA MODEL  ─────────────────────────────────────────────────────
 *   Ring 0 (centre button):  Curry–Howard–Lambek correspondence
 *   Ring 1 (inner ring):     Deductive, Inductive, Abductive reasoning
 *   Ring 2 (outer ring):     the four topic folders in that branch
 *
 * ADDING CONTENT  ─────────────────────────────────────────────────
 * Each topic landing page uses a Quarto listing, so new QMD files placed in a
 * topic folder appear there automatically. TopicMap.qmd remains the editorial
 * overview for labels, icons, and descriptions.
 *
 * ─────────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  /* ── Configuration ──────────────────────────────────────────── */

  // Quarto records the path from the current page back to the project root.
  // Using it keeps navigation correct from both root and nested pages and when
  // the book is deployed below a domain sub-path.
  const ROOT_URL = document.querySelector('meta[name="quarto:offset"]')?.content || "./";
  const CURRY_HOWARD_URL = ROOT_URL + "Deduct/01/Curry-Howard-Lambek.html";

  /**
   * Reasoning branches (ring 1). Order determines clockwise placement.
   *   icon  – Font Awesome class string (fa-solid fa-xxx)
   *   label – short label shown on the button
   *   title – tooltip / popup text
   *   href  – link to the branch landing page
   *   id    – key used to look up topic folders in TOPICS
   */
  const PARTS = [
    { id: "deduct", icon: "fa-table-tennis", label: "D", title: "Deductive Reasoning", href: ROOT_URL + "Deduct/index.html" },
    { id: "induct", icon: "fa-tower-cell", label: "I", title: "Inductive Reasoning", href: ROOT_URL + "Induct/index.html" },
    { id: "abduct", icon: "fa-car-burst", label: "A", title: "Abductive Reasoning", href: ROOT_URL + "Abduct/index.html" },
  ];

  /**
   * Topic-folder landing pages per reasoning branch (ring 2).
   */
  const TOPICS = {
    deduct: [
      { title: "Logical Library", icon: "fa-gamepad", href: ROOT_URL + "Deduct/01/index.html" },
      { title: "Logical Operators", icon: "fa-flag", href: ROOT_URL + "Deduct/02/index.html" },
      { title: "Types of Data", icon: "fa-screwdriver-wrench", href: ROOT_URL + "Deduct/03/index.html" },
      { title: "Subsets and Partitions", icon: "fa-address-card", href: ROOT_URL + "Deduct/04/index.html" },
    ],
    induct: [
      { title: "Pattern Making and Matching", icon: "fa-code-branch", href: ROOT_URL + "Induct/05/index.html" },
      { title: "Relations", icon: "fa-users", href: ROOT_URL + "Induct/06/index.html" },
      { title: "Default and Dynamic Judgment", icon: "fa-kiwi-bird", href: ROOT_URL + "Induct/07/index.html" },
      { title: "Probability", icon: "fa-dice", href: ROOT_URL + "Induct/08/index.html" },
    ],
    abduct: [
      { title: "Approximation and Clustering", icon: "fa-taxi", href: ROOT_URL + "Abduct/09/index.html" },
      { title: "Measurement", icon: "fa-ruler-combined", href: ROOT_URL + "Abduct/10/index.html" },
      { title: "Features and Integrals", icon: "fa-umbrella-beach", href: ROOT_URL + "Abduct/11/index.html" },
      { title: "Machine Learning and Derivatives", icon: "fa-bullseye", href: ROOT_URL + "Abduct/12/index.html" },
    ],
  };

  /* ── Geometry ───────────────────────────────────────────────── */
  const CX = 260, CY = 260;          // SVG centre (matches viewBox 520×520)
  const R_CENTER   = 38;             // centre button radius
  const R1_INNER   = 78;             // ring 1 inner edge
  const R1_OUTER   = 138;            // ring 1 outer edge  (ring width = 60)
  const R2_INNER   = 148;            // ring 2 inner edge
  const R2_OUTER   = 230;            // ring 2 outer edge  (ring width = 82)
  const BTN_R1     = 22;             // half-width of a ring-1 button
  const BTN_R2     = 18;             // half-width of a ring-2 button
  const DEFAULT_CENTER_ICON = "fa-solid fa-house";

  /* ── Page heading icon ─────────────────────────────────────── */

  function isFontAwesomeClass(className) {
    return /^fa-[a-z0-9-]+$/i.test(className);
  }

  function normaliseIconClasses(classNames) {
    const classes = Array.from(classNames || []).filter(isFontAwesomeClass);
    if (!classes.length) return null;

    if (!classes.some(className =>
      className === "fa-solid" || className === "fa-regular" || className === "fa-brands"
    )) {
      classes.unshift("fa-solid");
    }
    return classes.join(" ");
  }

  /**
   * Return the icon declared on the page's first content heading.
   *
   * The Font Awesome filter adds data-fa-icon to decorated headings.  Reading
   * that data first makes this independent of the filter's presentation
   * markup; the nested-icon lookup supports pages rendered before that data
   * hook was added.  A house remains the useful fallback for pages without a
   * heading icon.
   */
  function pageHeadingIcon() {
    const content = document.querySelector("#quarto-document-content") ||
      document.querySelector("main.content") || document.querySelector("main") || document.body;
    const heading = content.querySelector("h1, h2, h3, h4, h5, h6");
    if (!heading) return DEFAULT_CENTER_ICON;

    const declared = normaliseIconClasses((heading.dataset.faIcon || "").split(/\s+/));
    if (declared) return declared;

    const renderedIcon = heading.querySelector("i[class*='fa-']");
    return normaliseIconClasses(renderedIcon ? renderedIcon.classList : []) || DEFAULT_CENTER_ICON;
  }

  function appendFontAwesomeIcon(parent, classes, size) {
    const foreignObject = document.createElementNS(SVG_NS, "foreignObject");
    foreignObject.setAttribute("x", CX - R_CENTER);
    foreignObject.setAttribute("y", CY - R_CENTER);
    foreignObject.setAttribute("width", R_CENTER * 2);
    foreignObject.setAttribute("height", R_CENTER * 2);
    foreignObject.style.pointerEvents = "none";

    const iconContainer = document.createElement("div");
    iconContainer.style.cssText = `
      width:100%; height:100%; display:flex; align-items:center;
      justify-content:center; color:#3b1800; font-size:${size}px;
      pointer-events:none;
    `;
    const icon = document.createElement("i");
    icon.className = classes;
    icon.setAttribute("aria-hidden", "true");
    iconContainer.appendChild(icon);
    foreignObject.appendChild(iconContainer);
    parent.appendChild(foreignObject);
  }

  function appendFontAwesomeIconAt(parent, classes, x, y, radius, size) {
    if (!classes) return;
    const foreignObject = document.createElementNS(SVG_NS, "foreignObject");
    foreignObject.setAttribute("x", x - radius);
    foreignObject.setAttribute("y", y - radius);
    foreignObject.setAttribute("width", radius * 2);
    foreignObject.setAttribute("height", radius * 2);
    foreignObject.style.pointerEvents = "none";

    const iconContainer = document.createElement("div");
    iconContainer.style.cssText = `
      width:100%; height:100%; display:flex; align-items:center;
      justify-content:center; color:#3b1800; font-size:${size}px;
      pointer-events:none;
    `;
    const icon = document.createElement("i");
    icon.className = classes;
    icon.setAttribute("aria-hidden", "true");
    iconContainer.appendChild(icon);
    foreignObject.appendChild(iconContainer);
    parent.appendChild(foreignObject);
  }

  /* ── Sound ──────────────────────────────────────────────────── */
  let audioCtx = null;
  function playClick() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const t   = audioCtx.currentTime;
      const dur = 0.045;   // very short — just a tick

      // Master envelope: instant attack, quick exponential decay
      const master = audioCtx.createGain();
      master.gain.setValueAtTime(0.12, t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      master.connect(audioCtx.destination);

      // White-noise burst gives the "tick" body
      const bufLen = Math.ceil(audioCtx.sampleRate * dur);
      const buffer = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
      const data   = buffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise  = audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Band-pass at ~2 kHz shapes the noise into a woody "clack"
      const bp = audioCtx.createBiquadFilter();
      bp.type            = "bandpass";
      bp.frequency.value = 2200;
      bp.Q.value         = 1.8;

      // Low-shelf cut removes any boominess below 300 Hz
      const ls = audioCtx.createBiquadFilter();
      ls.type            = "lowshelf";
      ls.frequency.value = 300;
      ls.gain.value      = -12;

      noise.connect(ls);
      ls.connect(bp);
      bp.connect(master);
      noise.start(t);
      noise.stop(t + dur);
    } catch (_) { /* audio not available */ }
  }

  /* ── SVG helpers ────────────────────────────────────────────── */
  const SVG_NS = "http://www.w3.org/2000/svg";

  function svgEl(tag, attrs, parent) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (parent) parent.appendChild(el);
    return el;
  }

  /** Convert polar coords (r from centre, angle in degrees, 0=top, CW) to SVG xy */
  function polar(r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  }

  /** Create a circular arc path for a "wedge ring" sector */
  function arcPath(rInner, rOuter, startDeg, endDeg) {
    const s1 = polar(rOuter, startDeg), e1 = polar(rOuter, endDeg);
    const s2 = polar(rInner, endDeg),   e2 = polar(rInner, startDeg);
    const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;
    return [
      `M ${s1.x} ${s1.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
      `L ${s2.x} ${s2.y}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
      "Z",
    ].join(" ");
  }

  /* ── Build SVG ──────────────────────────────────────────────── */
  let activePart = null;   // currently expanded part id
  let svg = null;
  let ring2Group = null;
  let focusView = null;
  let focusedPointerCloseTimer = null;
  let focusedRestorePosition = null;
  let focusedTrigger = null;
  let focusedGlobalWire = null;

  function buildCompass() {
    const container = document.getElementById("toc-compass");
    if (!container) return;

    // Build SVG element
    svg = svgEl("svg", {
      viewBox: "0 0 520 520",
      xmlns: SVG_NS,
    }, container);

    // ── Defs: gradients, filters ───────────────────────────────
    const defs = svgEl("defs", {}, svg);

    // Brass radial gradient for ring backgrounds
    const brassGrad = svgEl("radialGradient", {
      id: "brassGradient", cx: "50%", cy: "50%", r: "50%",
      gradientUnits: "userSpaceOnUse",
      cx: CX, cy: CY, r: R2_OUTER,
    }, defs);
    [
      { offset: "0%",   color: "#f5e4a0", opacity: "1" },
      { offset: "40%",  color: "#c8960a", opacity: "1" },
      { offset: "80%",  color: "#8B6914", opacity: "1" },
      { offset: "100%", color: "#5a3a00", opacity: "1" },
    ].forEach(s => {
      const stop = svgEl("stop", { offset: s.offset }, brassGrad);
      stop.style.stopColor = s.color;
      stop.style.stopOpacity = s.opacity;
    });

    // Brass gradient for individual buttons (radial, relative)
    const brassBtnGrad = svgEl("radialGradient", {
      id: "brassBtn", cx: "35%", cy: "30%", r: "65%",
    }, defs);
    [
      { offset: "0%",   color: "#fff5c0", opacity: "1" },
      { offset: "50%",  color: "#d4a017", opacity: "1" },
      { offset: "100%", color: "#6b4c00", opacity: "1" },
    ].forEach(s => {
      const stop = svgEl("stop", { offset: s.offset }, brassBtnGrad);
      stop.style.stopColor = s.color;
      stop.style.stopOpacity = s.opacity;
    });

    // Brass gradient for centre button
    const brassCentreGrad = svgEl("radialGradient", {
      id: "brassCenterGrad", cx: "35%", cy: "30%", r: "65%",
    }, defs);
    [
      { offset: "0%",   color: "#fffbe0", opacity: "1" },
      { offset: "45%",  color: "#e8b020", opacity: "1" },
      { offset: "100%", color: "#5a3300", opacity: "1" },
    ].forEach(s => {
      const stop = svgEl("stop", { offset: s.offset }, brassCentreGrad);
      stop.style.stopColor = s.color;
      stop.style.stopOpacity = s.opacity;
    });

    // ── Decorative ring backgrounds ────────────────────────────
    // Outer ring area fill (brass sheen)
    svgEl("circle", {
      cx: CX, cy: CY, r: R2_OUTER,
      fill: "url(#brassGradient)", opacity: "0.18",
    }, svg);

    // Ring groove circles
    [R_CENTER + 3, R1_INNER - 4, R1_OUTER + 4, R2_INNER - 4, R2_OUTER + 4].forEach(r => {
      svgEl("circle", {
        cx: CX, cy: CY, r,
        fill: "none", stroke: "#7a5200", "stroke-width": "1.5", opacity: "0.55",
      }, svg);
    });

    // ── Ring 2 placeholder group (chapters – shown on expand) ─
    ring2Group = svgEl("g", { id: "compass-ring2", opacity: "0" }, svg);

    // ── Ring 1 buttons (parts 01–12) ──────────────────────────
    const ring1Group = svgEl("g", { id: "compass-ring1" }, svg);
    const n = PARTS.length;
    const step = 360 / n;

    PARTS.forEach((part, i) => {
      const angle = i * step;   // 0 = top, clockwise
      const r     = (R1_INNER + R1_OUTER) / 2;
      const { x, y } = polar(r, angle);

      const g = svgEl("g", { class: "compass-btn", "data-part": part.id }, ring1Group);
      svgEl("circle", { cx: x, cy: y, r: BTN_R1 }, g);

      // FA icon as foreignObject (HTML) for correct rendering
      const fo = document.createElementNS(SVG_NS, "foreignObject");
      fo.setAttribute("x", x - BTN_R1);
      fo.setAttribute("y", y - BTN_R1);
      fo.setAttribute("width",  BTN_R1 * 2);
      fo.setAttribute("height", BTN_R1 * 2);
      fo.style.pointerEvents = "none";
      const iconDiv = document.createElement("div");
      iconDiv.style.cssText = `
        width:100%; height:100%;
        display:flex; align-items:center; justify-content:center;
        font-size:14px; color:#3b1800;
        pointer-events:none;
      `;
      iconDiv.innerHTML = `<i class="fa-solid ${part.icon}"></i>`;
      fo.appendChild(iconDiv);
      g.appendChild(fo);

      g.addEventListener("mouseenter", e => onPartHover(e, part, i));
      g.addEventListener("mouseleave", hideTooltip);
      g.addEventListener("click", e => { e.stopPropagation(); onPartClick(part, i); });
    });

    // ── Centre button ──────────────────────────────────────────
    const centreIcon = pageHeadingIcon();
    const centre = svgEl("g", {
      id: "compass-center",
      role: "button",
      tabindex: "0",
      "aria-label": "Open the Curry–Howard–Lambek correspondence",
    }, svg);
    svgEl("circle", { cx: CX, cy: CY, r: R_CENTER }, centre);
    appendFontAwesomeIcon(centre, centreIcon, 24);

    centre.addEventListener("mouseenter", e => {
      playClick();
      showTooltip(e, "Curry–Howard–Lambek correspondence");
    });
    centre.addEventListener("mouseleave", hideTooltip);
    centre.addEventListener("click", e => { e.stopPropagation(); onCentreClick(); });
    centre.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      onCentreClick();
    });
  }

  /* ── Ring 2 (chapters) rendering ───────────────────────────── */

  function renderRing2(partId, partIndex) {
    // Clear previous ring 2 content
    while (ring2Group.firstChild) ring2Group.removeChild(ring2Group.firstChild);

    const chapters = TOPICS[partId] || [];
    if (chapters.length === 0) {
      ring2Group.setAttribute("opacity", "0");
      return;
    }

    const n = chapters.length;

    // Angular step: just large enough so buttons don't overlap on ring 2.
    // Button diameter at ring-2 radius ≈ 2*BTN_R2, arc between centres must
    // be > that.  arcLen = r * θ  →  θ_min = 2*BTN_R2 / r_ring2 (radians).
    const r_ring2   = (R2_INNER + R2_OUTER) / 2;
    const minStepRad = (2 * BTN_R2 + 4) / r_ring2;  // +4 px gap
    const stepDeg   = Math.max(minStepRad * 180 / Math.PI, 14); // at least 14°

    // Start exactly at the hovered part's angle so the user barely needs to
    // move the mouse outward to reach the first (most likely) chapter.
    const partAngle = (partIndex / PARTS.length) * 360;
    // Centre the cluster on partAngle so the user can sweep left or right
    const halfSpan  = ((n - 1) / 2) * stepDeg;
    const startAngle = partAngle - halfSpan;

    chapters.forEach((ch, i) => {
      const angle = startAngle + i * stepDeg;
      const r = (R2_INNER + R2_OUTER) / 2;
      const { x, y } = polar(r, angle);

      const g = svgEl("g", { class: "compass-btn compass-btn-ch" }, ring2Group);
      svgEl("circle", { cx: x, cy: y, r: BTN_R2 }, g);

      const topicIcon = normaliseIconClasses(ch.icon.split(/\s+/));
      appendFontAwesomeIconAt(g, topicIcon, x, y, BTN_R2, 12);

      g.addEventListener("mouseenter", e => {
        playClick();
        showTooltip(e, ch.title);
      });
      g.addEventListener("mouseleave", hideTooltip);
      g.addEventListener("click", e => {
        e.stopPropagation();
        navigate(ch.href);
      });
    });

    ring2Group.setAttribute("opacity", "1");
  }

  function clearRing2() {
    while (ring2Group.firstChild) ring2Group.removeChild(ring2Group.firstChild);
    ring2Group.setAttribute("opacity", "0");
  }

  /* ── Event handlers ─────────────────────────────────────────── */

  function onPartHover(e, part, index) {
    playClick();
    showTooltip(e, part.title);
    // If no part is active yet, preview ring2 on hover
    if (activePart === null) {
      renderRing2(part.id, index);
    }
  }

  function onPartClick(part, index) {
    if (activePart === part.id) {
      // Second click → navigate
      navigate(part.href);
    } else {
      activePart = part.id;
      renderRing2(part.id, index);
    }
  }

  function onCentreClick() {
    navigate(CURRY_HOWARD_URL);
  }

  function navigate(href) {
    window.location.href = href;
  }

  /* ── Tooltip ─────────────────────────────────────────────────── */
  let tooltip = null;

  function showTooltip(e, text) {
    if (!tooltip) return;
    tooltip.textContent = text;
    tooltip.style.display = "block";
    positionTooltip(e);
  }

  function positionTooltip(e) {
    if (!tooltip) return;
    const x = e.clientX + 14;
    const y = e.clientY - 28;
    tooltip.style.left = Math.min(x, window.innerWidth  - tooltip.offsetWidth  - 8) + "px";
    tooltip.style.top  = Math.max(8, y) + "px";
  }

  function hideTooltip() {
    if (tooltip) tooltip.style.display = "none";
  }

  /* ── Local tree focus ───────────────────────────────────────── */

  function focusNode(item, role) {
    const element = document.createElement(item.current ? "span" : "a");
    element.className = `compass-focus-node compass-focus-node--${role}`;
    if (item.current) {
      element.setAttribute("aria-current", "page");
    } else {
      element.href = item.href;
    }
    element.setAttribute("aria-label", item.label);
    element.title = item.label;

    const badge = document.createElement("span");
    badge.className = "fa-brass-icon compass-focus-node__badge";
    badge.setAttribute("aria-hidden", "true");
    const icon = document.createElement("i");
    icon.className = normaliseIconClasses(String(item.icon || "fa-compass").split(/\s+/)) || "fa-solid fa-compass";
    badge.appendChild(icon);
    element.appendChild(badge);

    const label = document.createElement("span");
    label.className = "compass-focus-node__label";
    label.textContent = item.label;
    element.appendChild(label);

    element.addEventListener("mouseenter", event => {
      playClick();
      showTooltip(event, item.label);
    });
    element.addEventListener("mouseleave", hideTooltip);
    element.addEventListener("focus", () => {
      const rect = element.getBoundingClientRect();
      showTooltip({ clientX: rect.right, clientY: rect.top + rect.height / 2 }, item.label);
    });
    element.addEventListener("blur", hideTooltip);
    return element;
  }

  function focusLayer(className) {
    const layer = document.createElement("div");
    layer.className = className;
    return layer;
  }

  function setFocusPosition(node, x, y) {
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
  }

  function focusBadgePoint(node, viewRect) {
    const badge = node.querySelector(".compass-focus-node__badge") || node;
    const rect = badge.getBoundingClientRect();
    return {
      x: rect.left - viewRect.left + rect.width / 2,
      y: rect.top - viewRect.top + rect.height / 2,
      radius: Math.max(rect.width, rect.height) / 2,
    };
  }

  function wireEndpoint(from, to, fromRadius, toRadius) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy) || 1;
    return {
      start: {
        x: from.x + dx * fromRadius / distance,
        y: from.y + dy * fromRadius / distance,
      },
      end: {
        x: to.x - dx * toRadius / distance,
        y: to.y - dy * toRadius / distance,
      },
    };
  }

  function copperWirePath(from, to, relationship) {
    const points = wireEndpoint(from, to, from.radius, to.radius);
    const verticalBend = Math.max(20, Math.abs(points.end.y - points.start.y) * 0.38);
    // Parent wires fan gently downward; child wires fan gently outward.  Both
    // terminate below the brass badges, never through their icon faces.
    const controlY1 = relationship === "parent"
      ? points.start.y + verticalBend
      : points.start.y + verticalBend * 0.7;
    const controlY2 = relationship === "parent"
      ? points.end.y - verticalBend * 0.48
      : points.end.y - verticalBend;
    return `M ${points.start.x.toFixed(2)} ${points.start.y.toFixed(2)} ` +
      `C ${points.start.x.toFixed(2)} ${controlY1.toFixed(2)}, ` +
      `${points.end.x.toFixed(2)} ${controlY2.toFixed(2)}, ` +
      `${points.end.x.toFixed(2)} ${points.end.y.toFixed(2)}`;
  }

  function appendCopperWire(wireLayer, from, to, relationship, edge) {
    const d = copperWirePath(from, to, relationship);
    // The two strokes give each connector a brass rim and a warm copper core.
    // The SVG layer is below the node layers, so even a focused badge remains
    // completely unobscured.
    for (const className of ["compass-focus-wire--rim", "compass-focus-wire--core"]) {
      const path = svgEl("path", { d, class: `compass-focus-wire ${className}`, "data-edge": edge }, wireLayer);
      path.setAttribute("aria-hidden", "true");
    }
  }

  // The local field is a close-up of the book tree, while the persistent
  // corner compass is its always-available root reference.  This second SVG
  // lives in viewport coordinates so a parent badge can be visibly wired
  // back to that permanent control even when the local field is in the body
  // of a long page.
  function globalBadgePoint(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      radius: Math.max(rect.width, rect.height) / 2,
    };
  }

  function globalCopperWirePath(from, to) {
    const points = wireEndpoint(from, to, from.radius, to.radius);
    const horizontalDistance = Math.abs(points.end.x - points.start.x);
    const verticalDistance = Math.abs(points.end.y - points.start.y);
    // Leave the permanent compass on a shallow diagonal, then ease into the
    // parent badge.  Limiting the handles avoids an exaggerated loop when a
    // local trigger is close to the upper-left corner.
    const handle = Math.max(34, Math.min(180, horizontalDistance * 0.45 + verticalDistance * 0.12));
    const direction = points.end.x >= points.start.x ? 1 : -1;
    return `M ${points.start.x.toFixed(2)} ${points.start.y.toFixed(2)} ` +
      `C ${(points.start.x + direction * handle).toFixed(2)} ${points.start.y.toFixed(2)}, ` +
      `${(points.end.x - direction * handle * 0.52).toFixed(2)} ${points.end.y.toFixed(2)}, ` +
      `${points.end.x.toFixed(2)} ${points.end.y.toFixed(2)}`;
  }

  function removeFocusedGlobalWire() {
    focusedGlobalWire?.remove();
    focusedGlobalWire = null;
  }

  function drawFocusedGlobalWire() {
    removeFocusedGlobalWire();
    const topology = focusView?.__compassTopology;
    const permanentTrigger = document.getElementById("toc-compass-trigger");
    if (!topology?.parent || !permanentTrigger?.isConnected) return;

    const parentBadge = topology.parent.querySelector(".compass-focus-node__badge") || topology.parent;
    const parentRect = parentBadge.getBoundingClientRect();
    const triggerRect = permanentTrigger.getBoundingClientRect();
    if (!parentRect.width || !parentRect.height || !triggerRect.width || !triggerRect.height) return;

    const wire = document.createElementNS(SVG_NS, "svg");
    wire.id = "compass-local-global-wire";
    wire.classList.add("compass-local-global-wire");
    wire.setAttribute("aria-hidden", "true");
    wire.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    wire.setAttribute("width", String(window.innerWidth));
    wire.setAttribute("height", String(window.innerHeight));

    // Start at the permanent compass so the trace reads as an extension of
    // that control, ending at the local view's explicit parent node.
    const d = globalCopperWirePath(globalBadgePoint(permanentTrigger), globalBadgePoint(parentBadge));
    for (const className of ["compass-local-global-wire--rim", "compass-local-global-wire--core"]) {
      const path = svgEl("path", { d, class: className }, wire);
      path.setAttribute("aria-hidden", "true");
    }
    document.body.appendChild(wire);
    focusedGlobalWire = wire;
  }

  function drawFocusedTopology() {
    if (!focusView?.__compassTopology) return;
    const topology = focusView.__compassTopology;
    const viewRect = focusView.getBoundingClientRect();
    if (!viewRect.width || !viewRect.height) return;

    let wireLayer = focusView.querySelector(".compass-focus-wires");
    if (!wireLayer) {
      wireLayer = document.createElementNS(SVG_NS, "svg");
      wireLayer.classList.add("compass-focus-wires");
      wireLayer.setAttribute("aria-hidden", "true");
      focusView.prepend(wireLayer);
    }
    wireLayer.replaceChildren();
    wireLayer.setAttribute("viewBox", `0 0 ${viewRect.width} ${viewRect.height}`);
    wireLayer.setAttribute("width", String(viewRect.width));
    wireLayer.setAttribute("height", String(viewRect.height));

    const parentPoint = topology.parent ? focusBadgePoint(topology.parent, viewRect) : null;
    const centerPoint = focusBadgePoint(topology.center, viewRect);
    const siblingPoints = topology.siblings.map(node => ({ node, point: focusBadgePoint(node, viewRect) }));
    const childPoints = topology.children.map(node => ({ node, point: focusBadgePoint(node, viewRect) }));

    if (parentPoint) {
      appendCopperWire(wireLayer, parentPoint, centerPoint, "parent", "parent:center");
      siblingPoints.forEach(({ node, point }, index) => {
        appendCopperWire(wireLayer, parentPoint, point, "parent", `parent:sibling-${index + 1}`);
      });
    }
    childPoints.forEach(({ point }, index) => {
      appendCopperWire(wireLayer, centerPoint, point, "child", `center:child-${index + 1}`);
    });
    wireLayer.dataset.edgeCount = String((parentPoint ? 1 + siblingPoints.length : 0) + childPoints.length);
    drawFocusedGlobalWire();
  }

  function layoutFocusedTopology() {
    if (!focusView?.__compassTopology) return;
    const topology = focusView.__compassTopology;
    const rect = focusView.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (!width || !height) return;

    const centerX = width / 2;
    const centerY = height * 0.46;
    const before = topology.before;
    const after = topology.after;
    const largestSide = Math.max(before.length, after.length, 1);
    const siblingStep = Math.min(76, (width / 2 - 42) / largestSide);
    const siblingArcRadius = Math.max(width * 0.94, 240);
    const arcY = xOffset => centerY - (siblingArcRadius - Math.sqrt(Math.max(0, siblingArcRadius ** 2 - xOffset ** 2)));

    if (topology.parent) setFocusPosition(topology.parent, centerX, height * 0.15);
    setFocusPosition(topology.center, centerX, centerY);
    before.forEach((node, index) => {
      const offset = -siblingStep * (before.length - index);
      setFocusPosition(node, centerX + offset, arcY(offset));
    });
    after.forEach((node, index) => {
      const offset = siblingStep * (index + 1);
      setFocusPosition(node, centerX + offset, arcY(offset));
    });

    const children = topology.children;
    if (children.length) {
      const childInset = Math.min(58, width * 0.14);
      const childSpan = Math.max(1, width - childInset * 2);
      const childArcRadius = Math.max(width * 0.82, 220);
      const childBaseY = height * 0.80;
      children.forEach((node, index) => {
        const x = children.length === 1
          ? centerX
          : childInset + childSpan * index / (children.length - 1);
        const offset = x - centerX;
        // A low circular arc: central children sit a little farther down,
        // while outer children rise toward the edge of the local field.
        const y = childBaseY - (childArcRadius - Math.sqrt(Math.max(0, childArcRadius ** 2 - offset ** 2)));
        setFocusPosition(node, x, y);
      });
    }
    drawFocusedTopology();
  }

  function clearFocusedCompass() {
    window.clearTimeout(focusedPointerCloseTimer);
    focusedPointerCloseTimer = null;
    removeFocusedGlobalWire();
    if (focusView) {
      focusView.remove();
      focusView = null;
    }
    if (svg) svg.style.display = "";
    const container = document.getElementById("toc-compass");
    container?.classList.remove("compass-local-focus");
    if (container && focusedRestorePosition) {
      container.style.left = focusedRestorePosition.left;
      container.style.top = focusedRestorePosition.top;
      container.style.transform = focusedRestorePosition.transform;
      focusedRestorePosition = null;
    }
    focusedTrigger = null;
  }

  function positionFocusedCompass(container, anchor) {
    const rect = anchor?.getBoundingClientRect?.();
    if (!rect) return;

    // The selected node lives at 46% of the local field.  Put that node over
    // the inline trigger, then keep the complete popup within the viewport on
    // small screens and near an edge.
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const margin = 8;
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    const wantedLeft = targetX - width / 2;
    const wantedTop = targetY - height * 0.46;
    const left = Math.max(margin, Math.min(wantedLeft, window.innerWidth - width - margin));
    const top = Math.max(margin, Math.min(wantedTop, window.innerHeight - height - margin));

    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
    container.style.transform = "none";
  }

  function openFocusedCompass(context, options = {}) {
    const container = document.getElementById("toc-compass");
    if (!container || !context?.center) return;
    clearFocusedCompass();
    focusedRestorePosition = {
      left: container.style.left,
      top: container.style.top,
      transform: container.style.transform,
    };
    focusedTrigger = options.anchor || null;
    if (svg) svg.style.display = "none";
    container.classList.add("compass-local-focus");

    focusView = document.createElement("div");
    focusView.className = "compass-focus-view";
    focusView.setAttribute("role", "navigation");
    focusView.setAttribute("aria-label", `Compass centered on ${context.center.label}`);

    const parentLayer = focusLayer("compass-focus-parent");
    const siblingLayer = focusLayer("compass-focus-level");
    const childLayer = focusLayer("compass-focus-children");
    const parent = context.parent ? focusNode(context.parent, "parent") : null;
    const before = (context.before || []).map(item => focusNode(item, "sibling"));
    const center = focusNode(context.center, "center");
    const after = (context.after || []).map(item => focusNode(item, "sibling"));
    const children = (context.children || []).map(item => focusNode(item, "child"));

    if (parent) parentLayer.appendChild(parent);
    siblingLayer.append(...before, center, ...after);
    childLayer.append(...children);
    focusView.append(parentLayer, siblingLayer, childLayer);
    // Keep the structural information beside the rendered buttons.  The SVG
    // wire layer is calculated from their actual layout coordinates below.
    focusView.__compassTopology = { parent, before, center, after, siblings: [...before, ...after], children };
    container.appendChild(focusView);
    openCompass({ local: true });
    positionFocusedCompass(container, focusedTrigger);
    layoutFocusedTopology();
    window.requestAnimationFrame(layoutFocusedTopology);
  }

  // A local compass is a hover-disclosed field.  Leaving that field closes it,
  // while keyboard focus keeps it available.
  function scheduleFocusedPointerClose() {
    const container = document.getElementById("toc-compass");
    if (!container?.classList.contains("compass-local-focus")) return;
    window.clearTimeout(focusedPointerCloseTimer);
    focusedPointerCloseTimer = window.setTimeout(() => {
      const active = document.activeElement;
      if (container.matches(":hover") || focusedTrigger?.matches(":hover") ||
          container.contains(active) || focusedTrigger === active) return;
      closeCompass();
    }, 180);
  }

  function cancelFocusedPointerClose() {
    window.clearTimeout(focusedPointerCloseTimer);
    focusedPointerCloseTimer = null;
  }

  /* ── Open / close ────────────────────────────────────────────── */

  function openCompass(options = {}) {
    // The full navigation compass remains modal.  A declarative inline
    // compass is intentionally a small local guide, so it must leave the
    // document visible and readable behind it.
    document.getElementById("toc-compass-backdrop").classList.toggle("open", !options.local);
    document.getElementById("toc-compass").classList.add("open");
  }

  function closeCompass() {
    document.getElementById("toc-compass-backdrop").classList.remove("open");
    document.getElementById("toc-compass").classList.remove("open");
    activePart = null;
    clearRing2();
    clearFocusedCompass();
    hideTooltip();
  }

  /* ── Responsive trigger placement ───────────────────────────── */

  // Quarto keeps the sidebar in the DOM even while its responsive collapse is
  // active.  Measuring its rendered width is therefore more reliable than
  // testing for the element alone (and also covers a reader collapsing the
  // sidebar on a wide screen).
  function sidebarIsVisible() {
    const sidebar = document.getElementById("quarto-sidebar");
    if (!sidebar || !sidebar.isConnected) return false;
    const style = window.getComputedStyle(sidebar);
    const rect = sidebar.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 140;
  }

  function mobilePane() {
    let pane = document.getElementById("toc-compass-mobile-pane");
    if (!pane) {
      pane = document.createElement("nav");
      pane.id = "toc-compass-mobile-pane";
      pane.setAttribute("aria-label", "Book navigation");
      document.body.prepend(pane);
    }
    return pane;
  }

  function placeTrigger() {
    const trigger = document.getElementById("toc-compass-trigger");
    if (!trigger) return;

    const sidebar = document.getElementById("quarto-sidebar");
    const title = sidebar?.querySelector(".sidebar-header .sidebar-title");
    // At Quarto's lg breakpoint the sidebar is a persistent left column.  A
    // narrow sidebar is an overlay, so the dedicated pane remains the stable
    // mobile navigator even if that overlay is temporarily opened.
    const hasPersistentSidebar = window.matchMedia("(min-width: 992px)").matches && sidebarIsVisible();
    if (title && hasPersistentSidebar) {
      title.parentElement.insertBefore(trigger, title);
      document.body.classList.remove("toc-compass-mobile-active");
    } else {
      mobilePane().appendChild(trigger);
      document.body.classList.add("toc-compass-mobile-active");
    }
    // The local-popup trace is anchored to this element, whose parent changes
    // at Quarto's responsive breakpoint and after custom sidebar setup.
    if (focusView) window.requestAnimationFrame(drawFocusedGlobalWire);
  }

  function watchTriggerPlacement() {
    placeTrigger();

    const schedulePlacement = () => window.requestAnimationFrame(placeTrigger);
    window.addEventListener("resize", schedulePlacement, { passive: true });
    // The custom sidebar replaces Quarto's static chapter tree asynchronously.
    // Move the persistent compass into its new header once that replacement is
    // complete (or leave it in the mobile pane on narrow screens).
    document.addEventListener("custom-book-sidebar-ready", schedulePlacement);

    // Bootstrap changes classes on the sidebar while toggling it.  This keeps
    // the compass beside the book title whenever that title is actually
    // visible, while retaining the mobile pane when the sidebar closes.
    const sidebar = document.getElementById("quarto-sidebar");
    if (sidebar) {
      new MutationObserver(schedulePlacement).observe(sidebar, {
        attributes: true,
        attributeFilter: ["class", "style", "aria-hidden"],
        subtree: true,
      });
    }
  }

  /* ── Drag ─────────────────────────────────────────────────────── */

  function enableDrag(el) {
    let isDragging = false, ox = 0, oy = 0, startX = 0, startY = 0;

    el.addEventListener("mousedown", e => {
      if (el.classList.contains("compass-local-focus")) return;
      // Only drag if clicking the SVG background (not a button)
      if (e.target.closest(".compass-btn") || e.target.closest("#compass-center")) return;
      isDragging = true;
      el.classList.add("dragging");
      const rect = el.getBoundingClientRect();
      ox = rect.left + rect.width  / 2;
      oy = rect.top  + rect.height / 2;
      startX = e.clientX;
      startY = e.clientY;
      e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left      = (ox + dx) + "px";
      el.style.top       = (oy + dy) + "px";
      el.style.transform = "translate(-50%, -50%)";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      el.classList.remove("dragging");
    });
  }

  /* ── Init ─────────────────────────────────────────────────────── */

  function init() {
    // Inject markup if not already in the page
    if (!document.getElementById("toc-compass-trigger")) {
      // Trigger button (corner icon)
      const trigger = document.createElement("button");
      trigger.id = "toc-compass-trigger";
      trigger.title = "Open navigation compass";
      trigger.setAttribute("aria-label", "Open navigation compass");
      trigger.innerHTML = `<i class="fa-solid fa-compass"></i>`;
      document.body.appendChild(trigger);

      // Backdrop
      const backdrop = document.createElement("div");
      backdrop.id = "toc-compass-backdrop";
      document.body.appendChild(backdrop);

      // Compass container
      const compass = document.createElement("div");
      compass.id = "toc-compass";
      compass.innerHTML = `<div id="compass-close" title="Close">✕</div>`;
      document.body.appendChild(compass);

      // Tooltip
      const tt = document.createElement("div");
      tt.id = "compass-tooltip";
      document.body.appendChild(tt);
    }

    tooltip = document.getElementById("compass-tooltip");

    // Build the SVG
    buildCompass();

    // Wire events
    document.getElementById("toc-compass-trigger")
      .addEventListener("click", () => { clearFocusedCompass(); openCompass(); });
    document.getElementById("compass-close")
      .addEventListener("click", e => { e.stopPropagation(); closeCompass(); });
    document.getElementById("toc-compass-backdrop")
      .addEventListener("click", closeCompass);

    // Tooltip follows mouse anywhere in compass
    const compassElement = document.getElementById("toc-compass");
    compassElement.addEventListener("mousemove", positionTooltip);
    compassElement.addEventListener("mouseenter", cancelFocusedPointerClose);
    compassElement.addEventListener("mouseleave", scheduleFocusedPointerClose);

    // A focused local field belongs to a particular inline point in the document.
    // Re-anchor it on a viewport resize, and dismiss it when the reader
    // resumes scrolling so it never becomes a floating obstruction to prose.
    window.addEventListener("resize", () => {
      if (compassElement.classList.contains("compass-local-focus")) {
        positionFocusedCompass(compassElement, focusedTrigger);
        layoutFocusedTopology();
      }
    }, { passive: true });
    window.addEventListener("scroll", () => {
      if (compassElement.classList.contains("compass-local-focus")) closeCompass();
    }, { passive: true });

    // Drag
    enableDrag(document.getElementById("toc-compass"));

    watchTriggerPlacement();

    // Keep the global compass closed on every page, including the home page.
    // Readers open it intentionally with its persistent trigger; local
    // `.compass` controls disclose their own focused navigation field.

    // Declarative `.compass` triggers use this public bridge to open the same
    // overlay at an arbitrary point in the book tree.
    window.BookCompass = Object.freeze({
      open: openCompass,
      openFocused: openFocusedCompass,
      scheduleFocusedClose: scheduleFocusedPointerClose,
      close: closeCompass,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
