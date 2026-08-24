/* Switchable schematic, breadboard, and conventional sidebar navigation. */
(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const MODE_KEY = "book-sidebar-navigation-mode";

  function siteRoot() {
    const offset = document.querySelector('meta[name="quarto:offset"]')?.content || "./";
    return new URL(offset, document.baseURI);
  }

  function relativePage(root) {
    const page = decodeURIComponent(location.pathname);
    const base = decodeURIComponent(root.pathname);
    return page.startsWith(base) ? page.slice(base.length) : page.replace(/^\//, "");
  }

  function cpuHeader(root) {
    const link = document.createElement("a");
    link.className = "sidebar-circuit-cpu";
    link.href = new URL("00/preface.html", root).href;
    link.setAttribute("aria-label", "Read the preface to 5000 Years of Modern Computing");
    link.innerHTML = `
      <span class="sidebar-circuit-cpu__face">
        <span class="sidebar-circuit-cpu__icon" aria-hidden="true"><i class="fa-solid fa-building-columns"></i></span>
        <span class="sidebar-circuit-cpu__title">5000 Years of<br>Modern Computing</span>
        <span class="sidebar-circuit-cpu__mark">CC BY 4.0</span>
      </span>`;
    return link;
  }

  function homepageHint() {
    const hint = document.createElement("aside");
    hint.className = "sidebar-circuit-hint";
    hint.setAttribute("aria-label", "A short reflection on navigating the circuit map");
    const flynnQuote = "Try to picture clusters of information as they moved through the fronteir... I kept dreaming of a world I'd never see... and then...";
    hint.innerHTML = `
      <div class="sidebar-circuit-hint__teleprompter" role="note" aria-label="${flynnQuote}">
        <div class="sidebar-circuit-hint__quote-track" aria-hidden="true">
          <p class="sidebar-circuit-hint__quote">${flynnQuote}</p>
        </div>
      </div>
      <p class="sidebar-circuit-hint__credit">— Kevin Flynn</p>
      <div class="sidebar-circuit-hint__landscape" aria-hidden="true">
        <span class="sidebar-circuit-hint__mountains"></span>
        <span class="sidebar-circuit-hint__road"></span>
        <span class="sidebar-circuit-hint__grid"></span>
      </div>`;
    const control = window.NavigationScore?.createControl?.() || scoreUnavailable();
    control.classList.add("navigation-score--hint");
    hint.appendChild(control);
    return hint;
  }

  function scoreUnavailable() {
    const status = document.createElement("p");
    status.className = "navigation-score navigation-score--unavailable";
    status.textContent = "SCORE CONTROLS LOADING";
    return status;
  }

  function svg(name, attributes = {}) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function canonicalSource(value) {
    return decodeURIComponent(String(value || ""))
      .replace(/^\.?\//, "")
      .replace(/\\/g, "/")
      .replace(/\.html(?=$|[?#])/, ".qmd")
      .replace(/[?#].*$/, "");
  }

  function sourceHref(source, root) {
    return new URL(canonicalSource(source).replace(/\.qmd$/, ".html"), root).href;
  }

  function currentSource(root) {
    return canonicalSource(relativePage(root));
  }

  function nodeIsCurrent(source, current) {
    const candidate = canonicalSource(source);
    if (candidate === current) return true;
    if (!candidate.endsWith("/index.qmd")) return false;
    return current.startsWith(candidate.replace(/index\.qmd$/, ""));
  }

  function nodeIsFolder(source) {
    return /(?:^|\/)index\.qmd$/i.test(canonicalSource(source));
  }

  async function loadText(root, path) {
    const response = await fetch(new URL(path, root), { cache: "no-cache" });
    if (!response.ok) throw new Error(`${path} returned ${response.status}`);
    return response.text();
  }

  async function loadCircuitIcons(root) {
    try {
      const response = await fetch(new URL("quarto-runtime/assets/book-navigation.json", root), { cache: "no-cache" });
      if (!response.ok) return new Map();
      const manifest = await response.json();
      return new Map((manifest.pages || [])
        .map(page => [canonicalSource(page.source), page.titleIcon || page.icon])
        .filter(([, icon]) => icon));
    } catch (_) {
      return new Map();
    }
  }

  function parseCircuit(source) {
    const nodes = new Map();
    const links = new Map();
    const edges = [];
    const groups = new Map();
    const groupStack = [];
    const nodePattern = /^\s*([A-Za-z][\w-]*)\s*\[\s*["']([^"']+)["']\s*\]\s*$/;
    const clickPattern = /^\s*click\s+([A-Za-z][\w-]*)\s+(?:href\s+)?["']([^"']+\.qmd)["'](?:\s+["'][^"']*["'])?\s*$/;
    const edgePattern = /^\s*([A-Za-z][\w-]*)\s*(-->|==>|-\.->|=\.=>)\s*(?:\|\s*([^|]+?)\s*\|\s*)?([A-Za-z][\w-]*)\s*$/;
    const subgraphPattern = /^subgraph\s+([A-Za-z][\w-]*)(?:\s*\[\s*["']([^"']+)["']\s*\])?\s*$/i;
    const kinds = { "==>": "survey", "-->": "details", "-.->": "detour", "=.=>": "exception" };
    String(source || "").split(/\r?\n/).forEach((original, index) => {
      const line = original.replace(/%%.*$/, "").trim();
      if (!line) return;
      if (/^```(?:mermaid)?\s*$/i.test(line) || /^(?:flowchart|graph)\s+/i.test(line) || /^(?:linkStyle|classDef|class|style)\s+/i.test(line) || /^direction\b/i.test(line)) return;
      const subgraph = line.match(subgraphPattern);
      if (subgraph) {
        const id = subgraph[1];
        const label = (subgraph[2] || id).trim();
        if (nodes.has(id)) throw new Error(`book-circuit.md line ${index + 1} redeclares ${id}`);
        nodes.set(id, { id, label, source: null, groupId: null });
        groups.set(id, { id, label, members: [] });
        groupStack.push(id);
        return;
      }
      if (/^end$/i.test(line)) {
        if (!groupStack.length) throw new Error(`book-circuit.md line ${index + 1} closes a subgraph that was not opened`);
        groupStack.pop();
        return;
      }
      const node = line.match(nodePattern);
      if (node) {
        const groupId = groupStack.at(-1) || null;
        nodes.set(node[1], { id: node[1], label: node[2].trim(), source: null, groupId });
        if (groupId) groups.get(groupId).members.push(node[1]);
        return;
      }
      const click = line.match(clickPattern);
      if (click) {
        links.set(click[1], click[2].trim());
        return;
      }
      const edge = line.match(edgePattern);
      if (edge) {
        edges.push({ from: edge[1], to: edge[4], operator: edge[2], kind: kinds[edge[2]], label: edge[3]?.trim() || null });
        return;
      }
      throw new Error(`book-circuit.md line ${index + 1} is not recognized Mermaid circuit syntax: ${original}`);
    });
    const aliases = new Map([...groups.values()].map(group => [group.label, group.id]));
    const resolveId = id => nodes.has(id) ? id : aliases.get(id) || id;
    links.forEach((path, originalId) => {
      const id = resolveId(originalId);
      if (!nodes.has(id)) throw new Error(`Mermaid click links undeclared node ${originalId}`);
      nodes.get(id).source = path;
    });
    nodes.forEach(node => {
      if (!node.source) throw new Error(`Mermaid node ${node.id} needs a click link to its project-root QMD file`);
    });
    edges.forEach(edge => {
      edge.from = resolveId(edge.from);
      edge.to = resolveId(edge.to);
      if (!nodes.has(edge.from) || !nodes.has(edge.to)) {
        throw new Error(`Circuit edge ${edge.from} ${edge.operator} ${edge.to} uses an undeclared node`);
      }
    });
    return { nodes, edges, groups };
  }

  function sidebarTopology(graph) {
    const surveyEdges = graph.edges.filter(edge => edge.kind === "survey");
    if (!surveyEdges.length) throw new Error("The circuit needs at least one ==> Survey edge");
    const surveyTargets = new Set(surveyEdges.map(edge => edge.to));
    const first = surveyEdges.find(edge => !surveyTargets.has(edge.from)) || surveyEdges[0];
    const survey = [];
    const seen = new Set();
    let cursor = first.from;
    while (cursor && !seen.has(cursor)) {
      seen.add(cursor);
      survey.push(graph.nodes.get(cursor));
      cursor = surveyEdges.find(edge => edge.from === cursor)?.to || null;
    }
    const surveyIds = new Set(survey.map(node => node.id));
    const branchEdges = graph.edges.filter(edge => edge.kind === "detour" || edge.kind === "details");
    const nextBranchEdge = fromId => branchEdges
      .filter(edge => edge.from === fromId)
      .sort((left, right) => Number(right.kind === "details") - Number(left.kind === "details"))[0] || null;
    const branches = [];
    survey.slice(1).forEach(fromNode => {
      const firstEdge = nextBranchEdge(fromNode.id);
      if (!firstEdge) return;
      const nodes = [];
      const visited = new Set([fromNode.id]);
      let edge = firstEdge;
      let destination = null;
      while (edge && !visited.has(edge.to)) {
        if (surveyIds.has(edge.to)) {
          destination = graph.nodes.get(edge.to);
          break;
        }
        visited.add(edge.to);
        nodes.push(graph.nodes.get(edge.to));
        edge = nextBranchEdge(edge.to);
      }
      if (!nodes.length) return;
      branches.push({ from: fromNode, to: destination, nodes, label: firstEdge.label || `${fromNode.label} details`, terminal: !destination });
    });
    if (survey.length < 2) throw new Error("The Survey circuit needs an entry node and at least one reading node");
    const surveyConnections = surveyEdges
      .filter(edge => surveyIds.has(edge.from) && surveyIds.has(edge.to))
      .map(edge => ({ from: graph.nodes.get(edge.from), to: graph.nodes.get(edge.to) }));
    return { survey, surveyConnections, branches };
  }

  function circuitNode(spec, position, root, current, kind, icons) {
    const link = document.createElement("a");
    link.className = `sidebar-schematic-node sidebar-schematic-node--${kind}`;
    if (nodeIsFolder(spec.source)) link.classList.add("sidebar-schematic-node--folder");
    if (nodeIsCurrent(spec.source, current)) link.classList.add("is-current");
    link.href = sourceHref(spec.source, root);
    link.style.setProperty("--x", `${position.x}px`);
    link.style.setProperty("--y", `${position.y}px`);
    const icon = document.createElement("i");
    icon.className = icons.get(canonicalSource(spec.source)) || (nodeIsFolder(spec.source) ? "fa-solid fa-folder-tree" : "fa-solid fa-file-lines");
    icon.classList.add("sidebar-schematic-node__icon");
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "sidebar-schematic-node__label";
    label.textContent = spec.label;
    link.append(icon, label);
    link.title = spec.label;
    return link;
  }

  function circuitSubgraph(spec, members, position, root, current, icons) {
    const group = document.createElement("section");
    group.className = "sidebar-schematic-subgraph";
    group.style.setProperty("--x", `${position.x}px`);
    group.style.setProperty("--y", `${position.y}px`);
    group.setAttribute("aria-label", `${spec.label} circuit board`);

    const outline = document.createElement("span");
    outline.className = "sidebar-schematic-subgraph__outline";
    outline.setAttribute("aria-hidden", "true");
    const label = document.createElement("a");
    label.className = "sidebar-schematic-subgraph__label";
    label.href = sourceHref(spec.source, root);
    label.textContent = spec.label;
    label.title = `Open ${spec.label}`;
    group.append(outline, label);

    members.forEach((member, index) => {
      const link = document.createElement("a");
      link.className = "sidebar-schematic-subgraph__member";
      if (nodeIsCurrent(member.source, current)) link.classList.add("is-current");
      link.href = sourceHref(member.source, root);
      link.style.setProperty("--member-y", `${12 + index * 36}px`);
      const icon = document.createElement("i");
      icon.className = icons.get(canonicalSource(member.source)) || (nodeIsFolder(member.source) ? "fa-solid fa-folder-tree" : "fa-solid fa-file-lines");
      icon.classList.add("sidebar-schematic-subgraph__icon");
      icon.setAttribute("aria-hidden", "true");
      const memberLabel = document.createElement("span");
      memberLabel.className = "sidebar-schematic-subgraph__member-label";
      memberLabel.textContent = member.label;
      link.append(icon, memberLabel);
      link.title = member.label;
      group.appendChild(link);
    });
    return group;
  }

  function wire(svgRoot, path, kind, label) {
    const element = svg("path", {
      d: path,
      class: `sidebar-schematic-wire sidebar-schematic-wire--${kind}`
    });
    const title = svg("title");
    title.textContent = label;
    element.appendChild(title);
    svgRoot.appendChild(element);
  }

  function resistor(svgRoot, x, y, label) {
    const group = svg("g", { class: "sidebar-schematic-resistor" });
    const title = svg("title");
    title.textContent = `${label}: higher-resistance detail path`;
    group.append(
      title,
      svg("path", { d: `M ${x} ${y} L ${x + 12} ${y - 12} L ${x + 24} ${y} L ${x + 36} ${y - 12} L ${x + 48} ${y} L ${x + 60} ${y - 12} L ${x + 72} ${y}` })
    );
    svgRoot.appendChild(group);
  }

  function diode(svgRoot, x, y, angle, kind, label) {
    const group = svg("g", { class: `sidebar-schematic-diode sidebar-schematic-diode--${kind}`, transform: `translate(${x} ${y}) rotate(${angle})` });
    const title = svg("title");
    title.textContent = `${label}: intended direction of travel`;
    group.append(
      title,
      svg("path", { d: "M -7 -6 L 3 0 L -7 6 Z" }),
      svg("path", { d: "M 6 -7 L 6 7" })
    );
    svgRoot.appendChild(group);
  }

  function pnpPorts(position, sourceHeight = 48) {
    const baseX = 84;
    const baseY = position.y + sourceHeight + 12;
    return {
      baseX,
      baseY,
      baseEntryY: baseY - 12,
      emitterX: baseX - 24,
      emitterY: baseY + 24,
      collectorX: baseX + 24,
      collectorY: baseY + 24
    };
  }

  function pnpTransition(svgRoot, ports, label) {
    const { baseX: x, baseY: y } = ports;
    const group = svg("g", { class: "sidebar-schematic-pnp" });
    const title = svg("title");
    title.textContent = `${label}: PNP branch selector; the left-pointing emitter arrow marks the preferred Survey path`;
    group.append(
      title,
      svg("path", { class: "sidebar-schematic-pnp__base", d: `M ${x} ${y - 12} L ${x} ${y + 12}` }),
      svg("path", { class: "sidebar-schematic-pnp__emitter", d: `M ${x - 6} ${y + 6} L ${x - 24} ${y + 24}` }),
      svg("path", { class: "sidebar-schematic-pnp__collector", d: `M ${x + 6} ${y + 6} L ${x + 24} ${y + 24}` }),
      svg("path", { class: "sidebar-schematic-pnp__arrow", d: `M ${x - 24} ${y + 24} L ${x - 14} ${y + 18} L ${x - 14} ${y + 30} Z` })
    );
    svgRoot.appendChild(group);
  }

  function schematicLegend() {
    const legend = document.createElement("div");
    legend.className = "sidebar-schematic-key";
    legend.setAttribute("aria-label", "Circuit key");
    [
      ["survey", "Survey"],
      ["detour", "Detail detour"],
      ["ground", "Grounded example"],
      ["exception", "Opinion / exception"]
    ].forEach(([kind, label]) => {
      const item = document.createElement("span");
      item.className = "sidebar-schematic-key__item";
      item.innerHTML = `<i class="sidebar-schematic-key__line sidebar-schematic-key__line--${kind}" aria-hidden="true"></i>${label}`;
      legend.appendChild(item);
    });
    return legend;
  }

  function installSchematicExpansion(panel) {
    const expandedClass = "sidebar-schematic-expanded";
    const sidebar = panel.closest("#quarto-sidebar") || panel.parentElement;
    const drawing = panel.querySelector(".sidebar-schematic-drawing");
    const heading = panel.querySelector(".sidebar-schematic-heading");
    let drag = null;
    let fitTimer = null;
    let pointerInteracted = false;
    const leaveFitView = () => {
      if (fitTimer) window.clearTimeout(fitTimer);
      panel.classList.remove("is-fit");
      panel.style.removeProperty("--schematic-fit-scale");
    };
    const centerCurrentComponent = () => {
      const current = panel.querySelector(".sidebar-schematic-node.is-current");
      if (!current) return;
      const panelBounds = panel.getBoundingClientRect();
      const nodeBounds = current.getBoundingClientRect();
      panel.scrollBy({
        top: nodeBounds.top - panelBounds.top - (panel.clientHeight - nodeBounds.height) / 2,
        left: nodeBounds.left - panelBounds.left - (panel.clientWidth - nodeBounds.width) / 2,
        behavior: "auto"
      });
    };
    const expand = (center = true) => {
      leaveFitView();
      document.body.classList.add(expandedClass);
      if (center) {
        requestAnimationFrame(() => requestAnimationFrame(centerCurrentComponent));
        setTimeout(centerCurrentComponent, 190);
      }
    };
    const showWholeDiagram = () => {
      document.body.classList.remove(expandedClass);
      leaveFitView();
      fitTimer = window.setTimeout(() => {
        const availableWidth = panel.clientWidth - 16;
        const availableHeight = panel.clientHeight - (heading?.offsetHeight || 0) - 16;
        const scale = Math.min(1, availableWidth / drawing.offsetWidth, availableHeight / drawing.offsetHeight);
        panel.style.setProperty("--schematic-fit-scale", String(Math.max(scale, 0.1)));
        panel.classList.add("is-fit");
        panel.scrollTo({ left:0, top:0, behavior:"auto" });
      }, 190);
    };
    const collapse = event => {
      if (event?.relatedTarget && panel.contains(event.relatedTarget)) return;
      document.body.classList.remove(expandedClass);
    };
    const collapseForPointer = () => {
      const focused = document.activeElement;
      if (pointerInteracted && focused instanceof HTMLElement && panel.contains(focused)) focused.blur();
      if (!pointerInteracted && panel.contains(document.activeElement)) return;
      pointerInteracted = false;
      collapse();
    };
    const collapseIfPointerOutside = event => {
      if (event.target instanceof Node && sidebar?.contains(event.target)) return;
      collapseForPointer();
    };
    panel.addEventListener("pointerenter", expand);
    panel.addEventListener("focusin", expand);
    panel.addEventListener("focusout", collapse);
    sidebar?.addEventListener("pointerdown", () => { pointerInteracted = true; }, { capture:true, passive:true });
    sidebar?.addEventListener("pointerleave", collapseForPointer);
    document.addEventListener("pointermove", collapseIfPointerOutside, { passive:true });
    window.addEventListener("blur", () => {
      pointerInteracted = false;
      collapse();
    });
    drawing.addEventListener("pointerdown", event => {
      if (event.button !== 0 || event.target.closest?.("a")) return;
      expand(false);
      drag = { pointerId:event.pointerId, x:event.clientX, y:event.clientY };
      drawing.setPointerCapture(event.pointerId);
      panel.classList.add("is-dragging");
      event.preventDefault();
    });
    drawing.addEventListener("pointermove", event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      panel.scrollLeft -= event.clientX - drag.x;
      panel.scrollTop -= event.clientY - drag.y;
      drag.x = event.clientX;
      drag.y = event.clientY;
    });
    const stopDragging = event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      if (drawing.hasPointerCapture(event.pointerId)) drawing.releasePointerCapture(event.pointerId);
      drag = null;
      panel.classList.remove("is-dragging");
    };
    drawing.addEventListener("pointerup", stopDragging);
    drawing.addEventListener("pointercancel", stopDragging);
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape" || panel.hidden || event.target.matches?.("input,textarea,select")) return;
      showWholeDiagram();
      event.preventDefault();
    });
  }

  function installSidebarHoverSounds(sidebar) {
    const selector = ".sidebar-circuit-cpu,.sidebar-schematic-node,.sidebar-schematic-subgraph a,.sidebar-circuit-modes__button";
    let active = null;
    sidebar.addEventListener("pointerdown", () => { void window.NavigationScore?.primeHoverAudio?.(); }, { capture:true, passive:true });
    sidebar.addEventListener("pointerover", event => {
      const target = event.target.closest?.(selector);
      if (!target || target === active || !sidebar.contains(target)) return;
      active = target;
      const kind = target.classList.contains("sidebar-schematic-node--folder") ? "folder" : target.matches("button") ? "control" : "node";
      window.NavigationScore?.sidebarHover?.(kind);
    });
    sidebar.addEventListener("pointerout", event => {
      const target = event.target.closest?.(selector);
      if (target === active && !target.contains(event.relatedTarget)) active = null;
    });
  }

  async function schematicPanel(root) {
    const panel = document.createElement("section");
    panel.className = "sidebar-circuit-panel sidebar-circuit-panel--schematic";
    panel.dataset.mode = "schematic";
    panel.setAttribute("aria-label", "Reading circuit schematic");
    const heading = document.createElement("div");
    heading.className = "sidebar-schematic-heading";
    heading.innerHTML = `<strong>READING CIRCUIT</strong><span>Survey loop + higher-resistance details</span>`;
    panel.appendChild(heading);

    const [circuitSource, icons] = await Promise.all([loadText(root, "book-circuit.md"), loadCircuitIcons(root)]);
    const graph = parseCircuit(circuitSource);
    const topology = sidebarTopology(graph);
    const current = currentSource(root);
    const drawing = document.createElement("div");
    drawing.className = "sidebar-schematic-drawing";
    const schematicWidth = 430;
    const surveyNodeHeight = node => graph.groups.has(node.id) ? 120 : 48;
    const surveyEntryY = (node, position) => position.y + (graph.groups.has(node.id) ? 12 : 0);
    const detailLayout = (branch, fromY, sourceHeight) => {
      let cursorY = fromY + sourceHeight + 12;
      return branch.nodes.map(node => {
        const subgraph = graph.groups.get(node.id);
        if (subgraph) {
          const item = {
            node,
            subgraph,
            members: subgraph.members.map(id => graph.nodes.get(id)),
            position: { x:252, y:cursorY },
            entryX:276,
            entryY:cursorY + 24,
            centerX:276,
            centerY:cursorY + 96,
            leftX:264,
            exitY:cursorY + 108,
            bottomY:cursorY + 120
          };
          cursorY += 144;
          return item;
        }
        const item = {
          node,
          subgraph:null,
          members:null,
          position: { x:276, y:cursorY + 12 },
          entryX:288,
          entryY:cursorY + 24,
          centerX:288,
          centerY:cursorY + 24,
          leftX:276,
          exitY:cursorY + 36,
          bottomY:cursorY + 36
        };
        cursorY += 48;
        return item;
      });
    };
    const branchSpan = branch => {
      const last = detailLayout(branch, 0, surveyNodeHeight(branch.from)).at(-1);
      return Math.max(216, (last?.centerY || 180) + 36);
    };
    const positions = new Map();
    positions.set(topology.survey[0].id, { x: 60, y: 24 });
    positions.set(topology.survey[1].id, { x: 60, y: 96 });
    topology.survey.slice(1, -1).forEach((node, index) => {
      const next = topology.survey[index + 2];
      if (positions.has(next.id)) return;
      const branch = topology.branches.find(candidate => candidate.from.id === node.id);
      positions.set(next.id, { x: 60, y: positions.get(node.id).y + (branch ? branchSpan(branch) : surveyNodeHeight(node) + 24) });
    });
    const finalBranchBottom = Math.max(...topology.branches.map(branch =>
      detailLayout(branch, positions.get(branch.from.id).y, surveyNodeHeight(branch.from)).at(-1)?.bottomY || 0));
    const drawingHeight = Math.max(504, finalBranchBottom + 96);
    const wires = svg("svg", { viewBox: `0 0 ${schematicWidth} ${drawingHeight}`, "aria-hidden": "true" });
    drawing.appendChild(wires);
    drawing.style.height = `${drawingHeight}px`;
    wires.style.height = `${drawingHeight}px`;
    topology.survey.forEach(node => {
      const subgraph = graph.groups.get(node.id);
      const position = positions.get(node.id);
      if (subgraph) {
        subgraph.members.slice(0, -1).forEach((_, memberIndex) => {
          const fromY = position.y + 36 + memberIndex * 36;
          const toY = position.y + 48 + memberIndex * 36;
          wire(wires, `M 84 ${fromY} L 84 ${toY}`, "detour", `${node.label} internal reading path`);
        });
      }
      drawing.appendChild(subgraph
        ? circuitSubgraph(node, subgraph.members.map(id => graph.nodes.get(id)), position, root, current, icons)
        : circuitNode(node, position, root, current, "survey", icons));
    });

    topology.surveyConnections.forEach((connection, connectionIndex) => {
      const fromPosition = positions.get(connection.from.id);
      const toPosition = positions.get(connection.to.id);
      const branch = topology.branches.find(candidate => candidate.from.id === connection.from.id);
      const fromHeight = surveyNodeHeight(connection.from);
      const targetEntryY = surveyEntryY(connection.to, toPosition);
      const ports = branch ? pnpPorts(fromPosition, fromHeight) : null;
      if (toPosition.y > fromPosition.y) {
        if (ports) {
          pnpTransition(wires, ports, branch.label);
          wire(wires, `M ${ports.baseX} ${fromPosition.y + fromHeight} L ${ports.baseX} ${ports.baseEntryY}`, "survey", `${connection.from.label} enters the PNP base`);
          wire(wires, `M ${ports.emitterX} ${ports.emitterY} L ${ports.emitterX} ${targetEntryY - 12} L 84 ${targetEntryY - 12} L 84 ${targetEntryY}`, "survey", `${connection.from.label} to ${connection.to.label}`);
          diode(wires, ports.emitterX, (ports.emitterY + targetEntryY - 12) / 2, 90, "survey", `${connection.from.label} to ${connection.to.label}`);
        } else {
          wire(wires, `M 84 ${fromPosition.y + fromHeight} L 84 ${targetEntryY}`, "survey", `${connection.from.label} to ${connection.to.label}`);
          diode(wires, 84, (fromPosition.y + fromHeight + targetEntryY) / 2, 90, "survey", `${connection.from.label} to ${connection.to.label}`);
        }
      } else {
        const returnX = 12 + connectionIndex * 12;
        if (ports) {
          pnpTransition(wires, ports, branch.label);
          wire(wires, `M ${ports.baseX} ${fromPosition.y + fromHeight} L ${ports.baseX} ${ports.baseEntryY}`, "survey", `${connection.from.label} enters the PNP base`);
          wire(wires, `M ${ports.emitterX} ${ports.emitterY} L ${returnX} ${ports.emitterY} L ${returnX} ${targetEntryY + 24} L 60 ${targetEntryY + 24}`, "survey", `${connection.from.label} returns to ${connection.to.label}`);
        } else {
          wire(wires, `M 60 ${fromPosition.y + fromHeight / 2} L ${returnX} ${fromPosition.y + fromHeight / 2} L ${returnX} ${targetEntryY + 24} L 60 ${targetEntryY + 24}`, "survey", `${connection.from.label} returns to ${connection.to.label}`);
        }
        diode(wires, returnX, (fromPosition.y + toPosition.y + 48) / 2, -90, "survey", `${connection.from.label} returns to ${connection.to.label}`);
      }
    });
    topology.branches.forEach((branch, branchIndex) => {
      const fromPosition = positions.get(branch.from.id);
      const toPosition = branch.to ? positions.get(branch.to.id) : null;
      const sourceHeight = surveyNodeHeight(branch.from);
      const details = detailLayout(branch, fromPosition.y, sourceHeight);
      const firstDetail = details[0];
      const finalDetail = details.at(-1);
      const ports = pnpPorts(fromPosition, sourceHeight);
      const { collectorX, collectorY } = ports;
      wire(wires, `M ${collectorX} ${collectorY} L 144 ${collectorY}`, "detour", branch.label);
      resistor(wires, 144, collectorY, branch.label);
      wire(wires, `M 216 ${collectorY} L ${firstDetail.entryX} ${collectorY} L ${firstDetail.entryX} ${firstDetail.entryY}`, "detour", branch.label);
      details.forEach((detail, detailIndex) => {
        if (detail.subgraph) {
          detail.members.slice(0, -1).forEach((_, memberIndex) => {
            const fromY = detail.position.y + 36 + memberIndex * 36;
            const toY = detail.position.y + 48 + memberIndex * 36;
            wire(wires, `M 276 ${fromY} L 276 ${toY}`, "detour", `${detail.node.label} internal reading path`);
          });
          drawing.appendChild(circuitSubgraph(detail.node, detail.members, detail.position, root, current, icons));
        } else {
          drawing.appendChild(circuitNode(detail.node, detail.position, root, current, "detail", icons));
        }
        const nextDetail = details[detailIndex + 1];
        if (nextDetail) {
          wire(wires, `M ${detail.centerX} ${detail.exitY} L ${detail.centerX} ${nextDetail.entryY} L ${nextDetail.entryX} ${nextDetail.entryY}`, "detour", `${branch.label} continues to ${nextDetail.node.label}`);
        }
      });
      if (!toPosition) {
        wire(wires, `M ${finalDetail.centerX} ${finalDetail.exitY} L ${finalDetail.centerX} ${finalDetail.exitY + 24}`, "detour", `${branch.label} ends at an open circuit terminal`);
      } else if (toPosition.y > fromPosition.y) {
        const approachX = 108;
        const approachY = finalDetail.centerY;
        const targetX = 60;
        const targetY = finalDetail.centerY + approachX - targetX;
        wire(wires, `M ${finalDetail.leftX} ${finalDetail.centerY} L 132 ${finalDetail.centerY}`, "detour", `${branch.label} leaves the final detail component`);
        diode(wires, 120, finalDetail.centerY, 180, "detour", `${branch.label} rejoins ${branch.to.label}`);
        wire(wires, `M ${approachX} ${approachY} L ${targetX} ${targetY}`, "detour", `${branch.label} enters ${branch.to.label}`);
      } else {
        const laneX = 420 - branchIndex * 12;
        const inletY = toPosition.y + 24;
        wire(wires, `M ${finalDetail.centerX} ${finalDetail.exitY} L ${laneX} ${finalDetail.exitY} L ${laneX} ${inletY} L 108 ${inletY}`, "detour", `${branch.label} rejoins the survey circuit`);
        diode(wires, 120, inletY, 180, "detour", `${branch.label} rejoins ${branch.to.label}`);
      }
    });

    drawing.appendChild(schematicLegend());
    panel.appendChild(drawing);
    return panel;
  }

  function boardPanel(root) {
    const panel = document.createElement("section");
    panel.className = "sidebar-circuit-panel sidebar-circuit-panel--board sidebar-circuit-window";
    panel.dataset.mode = "board";
    panel.setAttribute("aria-label", "Physical breadboard navigation");
    let loaded = false;
    panel.load = () => {
      if (loaded) return;
      loaded = true;
      const frame = document.createElement("iframe");
      const circuitUrl = new URL("index.html", root);
      circuitUrl.searchParams.set("circuit-window", "1");
      circuitUrl.searchParams.set("focus", relativePage(root));
      frame.className = "sidebar-circuit-frame";
      frame.src = circuitUrl.href;
      frame.title = "Draggable breadboard map centered on the current page";
      frame.loading = "eager";
      frame.setAttribute("referrerpolicy", "same-origin");
      panel.appendChild(frame);
    };
    return panel;
  }

  function modeControl(panels, board) {
    const control = document.createElement("div");
    control.className = "sidebar-circuit-modes";
    control.setAttribute("role", "tablist");
    control.setAttribute("aria-label", "Sidebar navigation view");
    const labels = { schematic: "Circuit", board: "Board", contents: "Contents" };
    const buttons = new Map();
    const setMode = mode => {
      panels.forEach(panel => {
        const active = panel.dataset.mode === mode;
        panel.hidden = !active;
        panel.setAttribute("aria-hidden", String(!active));
      });
      buttons.forEach((button, key) => {
        const active = key === mode;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      if (mode === "board") board.load();
      try { localStorage.setItem(MODE_KEY, mode); } catch (_) { /* preference is optional */ }
    };
    Object.entries(labels).forEach(([mode, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sidebar-circuit-modes__button";
      button.textContent = label;
      button.setAttribute("role", "tab");
      button.addEventListener("click", () => setMode(mode));
      buttons.set(mode, button);
      control.appendChild(button);
    });
    let initial = "schematic";
    try {
      const saved = localStorage.getItem(MODE_KEY);
      if (labels[saved]) initial = saved;
    } catch (_) { /* preference is optional */ }
    setMode(initial);
    return control;
  }

  async function init() {
    if (new URLSearchParams(location.search).has("circuit-window")) return;
    const sidebar = document.getElementById("quarto-sidebar");
    const header = sidebar?.querySelector(".sidebar-header");
    const search = sidebar?.querySelector(".sidebar-search")?.parentElement;
    const menu = sidebar?.querySelector(".sidebar-menu-container");
    if (!sidebar || !header || !search || !menu) return;

    const root = siteRoot();
    header.replaceChildren(cpuHeader(root));
    search.classList.add("sidebar-circuit-search");
    sidebar.classList.add("sidebar-circuit-navigation");
    installSidebarHoverSounds(sidebar);
    document.body.classList.add("has-sidebar-circuit-cpu");
    if (document.body.classList.contains("homepage")) {
      sidebar.classList.add("sidebar-circuit-navigation--home");
      search.insertAdjacentElement("afterend", homepageHint());
      document.dispatchEvent(new CustomEvent("custom-book-sidebar-ready"));
      return;
    }

    const navigator = document.createElement("section");
    navigator.className = "sidebar-circuit-navigator";
    navigator.setAttribute("aria-label", "Book navigation modes");
    const board = boardPanel(root);
    const contents = document.createElement("section");
    contents.className = "sidebar-circuit-panel sidebar-circuit-panel--contents";
    contents.dataset.mode = "contents";
    contents.setAttribute("aria-label", "Conventional table of contents");
    menu.replaceWith(navigator);
    contents.appendChild(menu);
    let schematic;
    try {
      schematic = await schematicPanel(root);
      installSchematicExpansion(schematic);
    } catch (error) {
      schematic = document.createElement("section");
      schematic.className = "sidebar-circuit-panel sidebar-circuit-panel--error";
      schematic.dataset.mode = "schematic";
      schematic.textContent = "Book circuit is unavailable. Use Contents to continue navigating.";
      console.error("Sidebar circuit could not load", error);
    }
    const panels = [schematic, board, contents];
    navigator.append(modeControl(panels, board), ...panels);
    document.body.classList.add("has-sidebar-circuit-window");
    document.dispatchEvent(new CustomEvent("custom-book-sidebar-ready"));
  }

  window.SidebarCircuitNavigation = Object.freeze({ parseCircuit, sidebarTopology });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})();
