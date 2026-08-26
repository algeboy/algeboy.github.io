/* Mermaid-style topic adjacency rendered as an accessible circuit map.
 * `.compass` elements remain triggers for inline-compass.js; `.circuit`
 * elements are the author-facing topic graph widget.
 */
(() => {
  "use strict";

  const EDGE = /([A-Za-z][\w-]*)(?:\.(\d+)(?:-(\d+))?)?(?:\s*\[\s*["']([^"']+)["']\s*\])?\s*(-\.->|=\.=>|==>|-->)\s*(?:\|\s*([^|]+?)\s*\|\s*)?([A-Za-z][\w-]*)(?:\.(\d+)(?:-(\d+))?)?(?:\s*\[\s*["']([^"']+)["']\s*\])?/g;
  const POSITIONED_NODE = /(\*)?\s*([A-Za-z][\w-]*)\s*\[\s*["']([^"']+)["']\s*\]\s*@\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g;
  const NODE_WIDTH = 170;
  const NODE_HEIGHT = 80;
  const PINS_PER_SIDE = 8;
  const PIN_COUNT = PINS_PER_SIDE * 2;
  const JACKET_PATH_LENGTH = 100;
  const END_GAP = 4;
  const JACKET_DASH = JACKET_PATH_LENGTH - END_GAP * 2;
  const JACKET_PATTERN = `0 ${END_GAP} ${JACKET_DASH} ${END_GAP}`;
  // Reader-facing circuit drawing parameters. `orthogonal` routes every wire
  // on the dotted grid with straight horizontal and vertical segments. Set
  // `neighboringRoute` to `curved` and raise `cornerRadius` to restore softer
  // jumper-wire geometry without changing authored circuit edges.
  const CIRCUIT_DESIGN = Object.freeze({
    neighboringRoute: "orthogonal",
    cornerRadius: 0
  });
  const WIRE_TYPES = Object.freeze({
    "-->": { kind: "survey", label: "Survey" },
    "==>": { kind: "details", label: "Details" },
    "-.->": { kind: "detour", label: "Detour" },
    "=.=>": { kind: "rant", label: "Rant" }
  });
  // A coordinate is a component slot. Both dimensions are exact multiples of
  // the ten-pixel breadboard pitch, while leaving enough room for a chip.
  const X_UNIT = 230;
  const Y_UNIT = 120;

  function normaliseSource(value) {
    return String(value || "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
      .replace(/[–—−]\s*>/g, "-->").replace(/−/g, "-").replace(/\u00a0/g, " ").trim();
  }

  function parse(source) {
    const text = normaliseSource(source);
    const activeIds = new Set([...text.matchAll(/\*([A-Za-z][\w-]*)/g)].map(match => match[1]));
    const nodes = new Map();
    const edges = [];
    const errors = [];
    let match;
    POSITIONED_NODE.lastIndex = 0;
    while ((match = POSITIONED_NODE.exec(text))) {
      const [, activeMarker, id, path, x, y] = match;
      nodes.set(id, { id, path: path.trim(), order: nodes.size, active: Boolean(activeMarker) || activeIds.has(id), coordinate: { x: Number(x), y: Number(y) } });
    }
    EDGE.lastIndex = 0;
    while ((match = EDGE.exec(text))) {
      const [, from, fromStart, fromEnd, fromPath, operator, authorLabel, to, toStart, toEnd, toPath] = match;
      if (!nodes.has(from)) nodes.set(from, { id: from, path: null, order: nodes.size, active: activeIds.has(from) });
      if (!nodes.has(to)) nodes.set(to, { id: to, path: null, order: nodes.size, active: activeIds.has(to) });
      if (fromPath) nodes.get(from).path = fromPath.trim();
      if (toPath) nodes.get(to).path = toPath.trim();
      const expand = (start, end) => {
        if (!start) return [null];
        const first = Number(start), last = end ? Number(end) : first;
        const step = first <= last ? 1 : -1;
        return Array.from({ length: Math.abs(last - first) + 1 }, (_, index) => first + index * step);
      };
      const fromPins = expand(fromStart, fromEnd);
      const toPins = expand(toStart, toEnd);
      if (fromPins.length !== toPins.length) {
        errors.push(`wire ranges must contain the same number of pins: ${from}.${fromStart}${fromEnd ? `-${fromEnd}` : ""} ${operator} ${to}.${toStart}${toEnd ? `-${toEnd}` : ""}`);
        continue;
      }
      const wireType = WIRE_TYPES[operator];
      fromPins.forEach((fromPin, index) => edges.push({
        from,
        to,
        fromPin,
        toPin: toPins[index],
        operator,
        kind: wireType.kind,
        label: wireType.label,
        authorLabel: authorLabel?.trim() || null
      }));
    }
    return { nodes: [...nodes.values()], edges, errors };
  }

  function layout(graph) {
    const explicitlyPositioned = graph.nodes.filter(node => node.coordinate);
    if (explicitlyPositioned.length) {
      const minX = Math.min(...explicitlyPositioned.map(node => node.coordinate.x));
      const maxY = Math.max(...explicitlyPositioned.map(node => node.coordinate.y));
      const positioned = new Map();
      graph.nodes.forEach((node, fallbackIndex) => {
        const coordinate = node.coordinate || { x: minX + fallbackIndex, y: maxY - 1 };
        const x = 30 + (coordinate.x - minX) * X_UNIT;
        // Browser coordinates grow downward, so subtract mathematical y from
        // the graph's maximum y: positive y is visibly up, negative y down.
        const y = 60 + (maxY - coordinate.y) * Y_UNIT;
        positioned.set(node.id, { ...node, rank: coordinate.x, row: -coordinate.y, x, y });
      });
      return positioned;
    }

    const ranks = new Map();
    const rows = new Map();
    const outgoing = new Map(graph.nodes.map(node => [node.id, []]));
    graph.edges.forEach(edge => outgoing.get(edge.from)?.push(edge.to));

    // A topic map commonly contains return edges, so it is a graph rather
    // than a DAG. Lay out the first-declared node as the root of a directed
    // breadth-first spanning tree. Back/cross edges do not create new ranks;
    // they are routed separately by edgePath().
    const occupied = new Map();
    const placeComponent = (root, initialRow) => {
      ranks.set(root, 0);
      rows.set(root, initialRow);
      if (!occupied.has(0)) occupied.set(0, new Set());
      occupied.get(0).add(initialRow);
      const queue = [root];
      while (queue.length) {
        const source = queue.shift();
        const nextRank = ranks.get(source) + 1;
        for (const target of outgoing.get(source) || []) {
          if (ranks.has(target)) continue;
          if (!occupied.has(nextRank)) occupied.set(nextRank, new Set());
          const used = occupied.get(nextRank);
          let row = rows.get(source);
          while (used.has(row)) row += 1;
          ranks.set(target, nextRank);
          rows.set(target, row);
          used.add(row);
          queue.push(target);
        }
      }
    };

    if (graph.nodes.length) placeComponent(graph.nodes[0].id, 0);
    graph.nodes.forEach(node => {
      if (ranks.has(node.id)) return;
      const rootRows = occupied.get(0) || new Set();
      let row = 0;
      while (rootRows.has(row)) row += 1;
      placeComponent(node.id, row);
    });

    const positioned = new Map();
    graph.nodes.forEach(node => {
      const rank = ranks.get(node.id);
      const row = rows.get(node.id);
      // The extra top margin leaves room for the compass-style rollover
      // tooltip without clipping it against the board edge.
      positioned.set(node.id, { ...node, rank, row, x: 30 + rank * 230, y: 60 + row * 120 });
    });
    return positioned;
  }

  function siteRoot() {
    const offset = document.querySelector('meta[name="quarto:offset"]')?.content || "./";
    return new URL(offset, document.baseURI);
  }

  async function navigation() {
    const response = await fetch(new URL("quarto-runtime/assets/book-navigation.json", siteRoot()), { cache: "no-cache" });
    if (!response.ok) throw new Error(`Navigation manifest returned ${response.status}`);
    return response.json();
  }

  function homepageNavigator(widget) {
    const homepage = new URL("index.html", siteRoot());
    homepage.searchParams.set("circuit-window", "1");
    // The homepage resolves this URL to its existing component and applies
    // the same current-path illumination it uses for the sidebar board.
    homepage.searchParams.set("focus", window.location.href);

    widget.textContent = "";
    widget.className = "topic-graph topic-graph--homepage-navigator";
    widget.setAttribute("role", "group");
    widget.setAttribute("aria-label", "Homepage navigator centered on this page");
    const frame = document.createElement("iframe");
    frame.className = "topic-graph__homepage-frame";
    frame.src = homepage.href;
    frame.title = "Homepage navigator centered on this page";
    frame.loading = "eager";
    frame.setAttribute("referrerpolicy", "same-origin");
    widget.appendChild(frame);
  }

  function installHomepageNavigatorNavigation() {
    window.addEventListener("message", event => {
      if (event.origin !== location.origin || event.data?.type !== "homepage-navigate") return;
      let target;
      try { target = new URL(event.data.href, location.href); } catch { return; }
      if (target.origin !== location.origin) return;
      target.pathname = target.pathname.replace(/\.qmd$/i, ".html");
      window.location.assign(target.href);
    });
  }

  function automaticGraph(manifest, currentHref = window.location.href) {
    const currentUrl = new URL(currentHref, document.baseURI);
    const comparablePath = pathname => decodeURIComponent(pathname).replace(/index\.html$/, "").replace(/\/$/, "");
    const current = manifest.pages.find(entry =>
      comparablePath(new URL(entry.href, siteRoot()).pathname) === comparablePath(currentUrl.pathname));
    if (!current) return { nodes: [], edges: [], errors: ["the current page is not present in the navigation manifest"] };

    const folders = new Map(manifest.folders.map(folder => [folder.key, folder]));
    const indexByDirectory = new Map(manifest.pages.filter(page => page.isIndex).map(page => [page.directory, page]));
    const rootIndex = indexByDirectory.get("");
    const parentPages = [];
    let parentKey = current.isIndex ? folders.get(current.directory)?.parent : current.directory;
    while (parentKey != null) {
      const page = parentKey === "" ? rootIndex : indexByDirectory.get(parentKey);
      if (page && page.source !== current.source) parentPages.push(page);
      if (parentKey === "") break;
      parentKey = folders.get(parentKey)?.parent ?? "";
    }
    parentPages.reverse();

    const neighborhoodKey = current.directory;
    const siblingPages = manifest.pages.filter(page => page.directory === neighborhoodKey && !page.isIndex);
    const childFolders = manifest.folders
      .filter(folder => folder.parent === neighborhoodKey)
      .sort((a, b) => a.order - b.order);
    const stem = source => source.split("/").pop().replace(/\.qmd$/, "");
    const segment = key => key.split("/").pop();
    const landingForFolder = folder => siblingPages
      .filter(page => stem(page.source) === segment(folder.key) || stem(page.source).startsWith(`${segment(folder.key)}-`))
      .sort((a, b) => a.order - b.order)[0] || null;
    const landingPairs = childFolders
      .map(folder => ({ folder, page: landingForFolder(folder) }))
      .filter(pair => pair.page);
    const hasNumberedFolderTopology = landingPairs.length > 0;
    const displayedFolders = hasNumberedFolderTopology ? landingPairs.map(pair => pair.folder) : childFolders;
    const peerPages = hasNumberedFolderTopology
      ? [...new Map([...landingPairs.map(pair => pair.page), current].map(page => [page.source, page])).values()].sort((a, b) => a.order - b.order)
      : [current];
    const neighbors = hasNumberedFolderTopology ? [] : siblingPages
      .filter(page => page.source !== current.source)
      .sort((a, b) => Math.abs(a.order - current.order) - Math.abs(b.order - current.order) || a.order - b.order)
      .slice(0, 8)
      .sort((a, b) => a.order - b.order);

    // A real folder index supplies its own title, icon, and destination. Until
    // one exists, keep the public landing file in place and let the folder
    // component fall back to its name and first child page. This preserves
    // stable citations while still representing the refinement relationship.
    const virtualEntries = displayedFolders.map(folder => {
      const indexPage = indexByDirectory.get(folder.key);
      const firstChild = manifest.pages
        .filter(page => page.directory === folder.key && !page.isIndex)
        .sort((a, b) => a.order - b.order)[0];
      if (indexPage) return indexPage;
      return {
        source: `@folder/${folder.key}`,
        href: folder.href || firstChild?.href || "index.html",
        title: folder.title || segment(folder.key),
        titleIcon: folder.titleIcon || null,
        icon: folder.icon || "fa-solid fa-folder-tree",
        directory: folder.key,
        order: folder.order,
        isIndex: true
      };
    });

    const nodes = [];
    const nodeBySource = new Map();
    const addNode = (entry, coordinate, active) => {
      const node = {
        id: `auto-${nodes.length + 1}`,
        path: entry.source,
        order: nodes.length,
        active,
        coordinate
      };
      nodes.push(node);
      nodeBySource.set(entry.source, node);
      return node;
    };
    parentPages.forEach((page, index) => addNode(page, { x: 0, y: parentPages.length - index - 1 }, true));
    const peerTop = Math.floor((peerPages.length - 1) / 2);
    peerPages.forEach((page, index) => addNode(page, { x: 1, y: peerTop - index }, page.source === current.source));
    const currentNode = nodeBySource.get(current.source);
    const neighborTop = Math.floor((neighbors.length - 1) / 2);
    neighbors.forEach((page, index) => addNode(page, { x: 2, y: neighborTop - index }, false));
    const folderNodes = new Map();
    displayedFolders.forEach(folder => {
      const entry = virtualEntries.find(candidate => candidate.directory === folder.key && candidate.isIndex);
      const landing = landingForFolder(folder);
      const landingNode = landing ? nodeBySource.get(landing.source) : null;
      const node = addNode(entry, { x: 2, y: landingNode?.coordinate.y ?? 0 }, false);
      folderNodes.set(folder.key, node);
    });

    const usedPins = new Map(nodes.map(node => [node.id, new Set()]));
    const takePin = (node, preferences) => {
      const used = usedPins.get(node.id);
      const pin = preferences.find(candidate => !used.has(candidate)) || Array.from({ length: PIN_COUNT }, (_, index) => index + 1).find(candidate => !used.has(candidate));
      if (pin) used.add(pin);
      return pin || null;
    };
    const edges = [];
    const connect = (from, to, operator, fromPins, toPins) => {
      if (!from || !to) return;
      const type = WIRE_TYPES[operator];
      edges.push({
        from: from.id,
        to: to.id,
        fromPin: takePin(from, fromPins),
        toPin: takePin(to, toPins),
        operator,
        kind: type.kind,
        label: type.label,
        authorLabel: null
      });
    };

    // Green vertical jumpers show continuity within each column.
    parentPages.slice(0, -1).forEach((page, index) =>
      connect(nodeBySource.get(page.source), nodeBySource.get(parentPages[index + 1].source), "-->", [9,10,11,12], [1,2,3,4]));
    peerPages.slice(0, -1).forEach((page, index) =>
      connect(nodeBySource.get(page.source), nodeBySource.get(peerPages[index + 1].source), "-->", [9,10,11,12], [1,2,3,4]));
    neighbors.slice(0, -1).forEach((page, index) =>
      connect(nodeBySource.get(page.source), nodeBySource.get(neighbors[index + 1].source), "-->", [9,10,11,12], [1,2,3,4]));

    // The current topic reaches outward in red and returns to its immediate
    // parent in green. Active LEDs mark the entire current ancestry path.
    const immediateParent = parentPages.length ? nodeBySource.get(parentPages[parentPages.length - 1].source) : null;
    connect(currentNode, immediateParent, "-->", [1,2,3,4,9,10], [16,15,14,13,8,7]);
    neighbors.forEach((page, index) => {
      const neighbor = nodeBySource.get(page.source);
      const above = neighbor.coordinate.y >= currentNode.coordinate.y;
      connect(
        currentNode,
        neighbor,
        "==>",
        above ? [8,7,6,5,16,15,14,13] : [16,15,14,13,8,7,6,5],
        above ? [1,2,3,4,9,10,11,12] : [9,10,11,12,1,2,3,4]
      );
    });
    landingPairs.forEach(({ folder, page }) =>
      connect(nodeBySource.get(page.source), folderNodes.get(folder.key), "-.->", [5,6,7,8,13,14,15,16], [1,2,3,4,9,10,11,12]));
    return { nodes, edges, entries: virtualEntries, errors: [] };
  }

  function canonicalSource(value) {
    return decodeURIComponent(String(value || "")).replace(/^\.\//, "").replace(/\\/g, "/")
      .replace(/\.html(?=$|[?#])/, ".qmd").replace(/[?#].*$/, "");
  }

  function dynamicMathTitle(value) {
    return String(value || "").replace(/(^|[^\\])\$([^$\n]+)\$/g, (_, prefix, math) => `${prefix}\\(${math}\\)`);
  }

  function svg(name, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function appendWireLayers(wires, route, edge, markerEnd) {
    const copperD = route.copperD || route.d;
    const jacketD = route.jacketD || route.d;
    const typeClass = `topic-graph-wire--${edge.kind}`;
    // The full copper path reaches the package pin. The jacket starts at the
    // existing route socket and its normalized dash leaves equal bare ends on
    // every straight, rounded, Bezier, and range-expanded connection.
    wires.appendChild(svg("path", { d: copperD, class: "topic-graph-wire topic-graph-wire--copper" }));
    wires.appendChild(svg("path", {
      d: jacketD,
      class: `topic-graph-wire topic-graph-wire--jacket ${typeClass}`,
      pathLength: JACKET_PATH_LENGTH,
      "stroke-dasharray": JACKET_PATTERN,
      markerEnd
    }));
    wires.appendChild(svg("path", {
      d: jacketD,
      class: `topic-graph-wire topic-graph-wire--highlight ${typeClass}`,
      pathLength: JACKET_PATH_LENGTH,
      "stroke-dasharray": JACKET_PATTERN,
      transform: "translate(0 -2)"
    }));
  }

  function nodeElement(node, entry) {
    const link = document.createElement("a");
    link.className = `topic-graph-node${node.active ? " topic-graph-node--active" : ""}`;
    link.href = new URL(entry.href, siteRoot()).href;
    link.style.left = `${node.x}px`;
    link.style.top = `${node.y}px`;
    link.setAttribute("aria-label", `${entry.title}.${node.active ? " Marked active." : ""} Open related topic.`);
    const badge = document.createElement("span");
    badge.className = "fa-brass-icon topic-graph-node__badge";
    badge.dataset.led = node.active ? "on" : "off";
    badge.setAttribute("aria-hidden", "true");
    const icon = document.createElement("i");
    icon.className = entry.titleIcon || entry.icon || "fa-solid fa-book-open";
    badge.appendChild(icon);
    const title = document.createElement("span");
    title.className = "topic-graph-node__title";
    title.textContent = dynamicMathTitle(entry.title);
    for (let pin = 1; pin <= PIN_COUNT; pin += 1) {
      const point = pinPoint(node, pin);
      const lead = document.createElement("span");
      lead.className = `topic-graph-node__pin topic-graph-node__pin--${point.side}`;
      // Absolute children are positioned from the chip's inner border edge.
      // Subtract the 2px package border so the lead centre and SVG socket use
      // the exact same board coordinate.
      lead.style.left = `${point.x - node.x - 2}px`;
      lead.setAttribute("aria-hidden", "true");
      link.appendChild(lead);
    }
    link.append(badge, title);
    return link;
  }

  function edgePath(from, to) {
    const x1 = from.x + NODE_WIDTH, y1 = from.y + (NODE_HEIGHT / 2), x2 = to.x, y2 = to.y + (NODE_HEIGHT / 2);
    if (x2 > x1) {
      const middle = Math.round((x1 + x2) / 20) * 20;
      return { d: `M ${x1} ${y1} H ${middle} V ${y2} H ${x2}`, x: middle, y: Math.round((y1 + y2) / 2) };
    }
    const lane = Math.max(y1, y2) + 50;
    return { d: `M ${x1} ${y1} H ${x1 + 20} V ${lane} H ${x2 - 20} V ${y2} H ${x2}`, x: Math.round((x1 + x2) / 2), y: lane };
  }

  function pinPoint(node, pin) {
    if (!pin) return null;
    const top = pin <= PINS_PER_SIDE;
    const index = top ? pin - 1 : pin - PINS_PER_SIDE - 1;
    return {
      x: node.x + 15 + (index * 20),
      y: top ? node.y - 10 : node.y + NODE_HEIGHT + 10,
      side: top ? "top" : "bottom"
    };
  }

  function wirePoint(point) {
    if (!point) return null;
    return { ...point, y: point.y + (point.side === "top" ? -10 : 10) };
  }

  function chipsAdjacent(from, to) {
    if (!from.coordinate || !to.coordinate) return false;
    return Math.abs(from.coordinate.x - to.coordinate.x) + Math.abs(from.coordinate.y - to.coordinate.y) === 1;
  }

  function directBezierPath(start, end) {
    const jacketStart = wirePoint(start);
    const jacketEnd = wirePoint(end);
    const span = Math.hypot(jacketEnd.x - jacketStart.x, jacketEnd.y - jacketStart.y);
    const reach = Math.max(40, Math.min(100, span * 0.42));
    const control1 = {
      x: jacketStart.x,
      y: jacketStart.y + (start.side === "top" ? -reach : reach)
    };
    const control2 = {
      x: jacketEnd.x,
      y: jacketEnd.y + (end.side === "top" ? -reach : reach)
    };
    const curve = `M ${jacketStart.x} ${jacketStart.y} C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${jacketEnd.x} ${jacketEnd.y}`;
    const samples = Array.from({ length: 25 }, (_, index) => {
      const t = index / 24, u = 1 - t;
      return {
        x: Math.round((u ** 3 * jacketStart.x + 3 * u ** 2 * t * control1.x + 3 * u * t ** 2 * control2.x + t ** 3 * jacketEnd.x) / 10) * 10,
        y: Math.round((u ** 3 * jacketStart.y + 3 * u ** 2 * t * control1.y + 3 * u * t ** 2 * control2.y + t ** 3 * jacketEnd.y) / 10) * 10
      };
    });
    return {
      copperD: `M ${start.x} ${start.y} L ${jacketStart.x} ${jacketStart.y} C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${jacketEnd.x} ${jacketEnd.y} L ${end.x} ${end.y}`,
      jacketD: curve,
      samples
    };
  }

  function pointBlocked(point, obstacles) {
    return obstacles.some(box => point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom);
  }

  function gridRoute(start, end, obstacles, bounds, occupied = new Set()) {
    const directions = [
      { name: "right", dx: 10, dy: 0 },
      { name: "down", dx: 0, dy: 10 },
      { name: "left", dx: -10, dy: 0 },
      { name: "up", dx: 0, dy: -10 }
    ];
    const stateKey = state => `${state.x},${state.y},${state.direction || "start"}`;
    const coordinateKey = point => `${point.x},${point.y}`;
    const open = [{ ...start, direction: null, cost: 0, score: 0 }];
    const costs = new Map([[stateKey(open[0]), 0]]);
    const previous = new Map();
    let goalState = null;

    while (open.length) {
      open.sort((a, b) => a.score - b.score);
      const current = open.shift();
      if (current.x === end.x && current.y === end.y) {
        goalState = current;
        break;
      }
      for (const direction of directions) {
        const next = {
          x: current.x + direction.dx,
          y: current.y + direction.dy,
          direction: direction.name
        };
        if (next.x < bounds.left || next.x > bounds.right || next.y < bounds.top || next.y > bounds.bottom) continue;
        if (pointBlocked(next, obstacles) && coordinateKey(next) !== coordinateKey(end)) continue;
        const bend = current.direction && current.direction !== direction.name ? 0.35 : 0;
        const coordinate = coordinateKey(next);
        const adjacentUse = directions.reduce((uses, nearby) =>
          uses + (occupied.has(`${next.x + nearby.dx},${next.y + nearby.dy}`) ? 1 : 0), 0);
        // Never forbid a crossing outright: dense graphs may require one.
        // Sharing a lane is much more expensive than taking a nearby free
        // breadboard row, and adjacency gets a smaller spacing penalty.
        const wirePenalty = (occupied.has(coordinate) ? 12 : 0) + adjacentUse * 0.2;
        const cost = current.cost + 1 + bend + wirePenalty;
        const key = stateKey(next);
        if (cost >= (costs.get(key) ?? Infinity)) continue;
        costs.set(key, cost);
        previous.set(key, current);
        const distance = (Math.abs(end.x - next.x) + Math.abs(end.y - next.y)) / 10;
        open.push({ ...next, cost, score: cost + distance });
      }
    }
    if (!goalState) return [start, end];

    const route = [];
    let cursor = goalState;
    while (cursor) {
      route.push({ x: cursor.x, y: cursor.y });
      cursor = previous.get(stateKey(cursor));
    }
    route.reverse();
    return route.filter((point, index, points) => {
      if (index === 0 || index === points.length - 1) return true;
      const before = points[index - 1], after = points[index + 1];
      return !((before.x === point.x && point.x === after.x) || (before.y === point.y && point.y === after.y));
    });
  }

  function reserveRoute(points, occupied) {
    points.slice(0, -1).forEach((point, index) => {
      const next = points[index + 1];
      const dx = Math.sign(next.x - point.x) * 10;
      const dy = Math.sign(next.y - point.y) * 10;
      let x = point.x, y = point.y;
      occupied.add(`${x},${y}`);
      while (x !== next.x || y !== next.y) {
        x += dx;
        y += dy;
        occupied.add(`${x},${y}`);
      }
    });
  }

  function seededRandom(seedText) {
    let state = 2166136261;
    for (const character of seedText) {
      state ^= character.charCodeAt(0);
      state = Math.imul(state, 16777619);
    }
    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function decorationLayer(graph, width, height, obstacles, occupiedWires, chipRows) {
    const layer = document.createElement("div");
    layer.className = "topic-graph__parts";
    layer.setAttribute("aria-hidden", "true");
    const signature = graph.nodes.map(node => `${node.id}:${node.coordinate?.x},${node.coordinate?.y}`).join("|");
    const random = seededRandom(signature);
    const occupiedParts = new Set();
    const targetCount = Math.max(3, Math.min(10, Math.round((width * height) / 70000)));
    const bandSets = ["red-black-green", "green-red-black", "black-green-red"];

    for (let attempt = 0; attempt < 400 && layer.childElementCount < targetCount; attempt += 1) {
      const horizontal = random() >= 0.5;
      const span = 40;
      const x = 10 + Math.floor(random() * Math.max(1, (width - (horizontal ? span : 20)) / 10)) * 10;
      const randomY = 10 + Math.floor(random() * Math.max(1, (height - (horizontal ? 20 : span)) / 10)) * 10;
      // Vertical parts are useful only when they bridge the breadboard's
      // separated terminal zones. Centre their four-hole span on a trench;
      // horizontal parts remain on an ordinary uninterrupted row.
      const trenchCenter = chipRows[Math.floor(random() * chipRows.length)];
      const y = horizontal ? randomY : trenchCenter - (span / 2);
      const cells = Array.from({ length: 5 }, (_, index) => ({
        x: x + (horizontal ? index * 10 : 0),
        y: y + (horizontal ? 0 : index * 10)
      }));
      const hitsChip = cells.some(point => pointBlocked(point, obstacles));
      const hitsTrench = horizontal && cells.some(point => chipRows.some(center => Math.abs(point.y - center) <= 5));
      const hitsWire = cells.some(point => occupiedWires.has(`${point.x},${point.y}`));
      const hitsPart = cells.some(point => occupiedParts.has(`${point.x},${point.y}`));
      if (hitsChip || hitsTrench || hitsWire || hitsPart) continue;

      const type = random() < 0.5 ? "resistor" : "diode";
      const part = document.createElement("span");
      part.className = `topic-graph-part topic-graph-part--${type} topic-graph-part--${horizontal ? "horizontal" : "vertical"}`;
      if (type === "resistor") part.classList.add(`topic-graph-part--${bandSets[Math.floor(random() * bandSets.length)]}`);
      part.style.left = `${x}px`;
      part.style.top = `${y}px`;
      layer.appendChild(part);
      cells.forEach(point => occupiedParts.add(`${point.x},${point.y}`));
    }
    return layer;
  }

  function roundedPath(points, radiusLimit = CIRCUIT_DESIGN.cornerRadius) {
    if (points.length < 2) return "";
    if (radiusLimit <= 0) {
      return points.slice(1).reduce(
        (path, point) => `${path} L ${point.x} ${point.y}`,
        `M ${points[0].x} ${points[0].y}`
      );
    }
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let index = 1; index < points.length - 1; index += 1) {
      const before = points[index - 1], corner = points[index], after = points[index + 1];
      const incoming = Math.hypot(corner.x - before.x, corner.y - before.y);
      const outgoing = Math.hypot(after.x - corner.x, after.y - corner.y);
      // Give jumper wire a generous three-hole bend. Short approach segments
      // automatically reduce the radius so a curve never overshoots a pin or
      // an obstacle-routing waypoint.
      const radius = Math.min(radiusLimit, incoming / 2, outgoing / 2);
      const enter = {
        x: corner.x - ((corner.x - before.x) / incoming) * radius,
        y: corner.y - ((corner.y - before.y) / incoming) * radius
      };
      const leave = {
        x: corner.x + ((after.x - corner.x) / outgoing) * radius,
        y: corner.y + ((after.y - corner.y) / outgoing) * radius
      };
      path += ` L ${enter.x} ${enter.y} Q ${corner.x} ${corner.y} ${leave.x} ${leave.y}`;
    }
    const last = points[points.length - 1];
    return `${path} L ${last.x} ${last.y}`;
  }

  function pinnedEdgePath(from, fromPin, to, toPin, obstacles, bounds, occupied) {
    const start = pinPoint(from, fromPin);
    const end = pinPoint(to, toPin);
    if (!start || !end) return edgePath(from, to);
    if (chipsAdjacent(from, to) && CIRCUIT_DESIGN.neighboringRoute === "curved") {
      return directBezierPath(start, end);
    }
    const jacketStart = wirePoint(start);
    const jacketEnd = wirePoint(end);
    const points = gridRoute(jacketStart, jacketEnd, obstacles, bounds, occupied);
    const path = roundedPath(points);
    const middle = points[Math.floor(points.length / 2)];
    return {
      copperD: `M ${start.x} ${start.y} L ${jacketStart.x} ${jacketStart.y} ${path.replace(/^M\s+[^ ]+\s+[^ ]+/, "")} L ${end.x} ${end.y}`,
      jacketD: path,
      points,
      x: middle.x,
      y: middle.y
    };
  }

  function render(widget, graph, manifest) {
    const bySource = new Map([...manifest.pages, ...(graph.entries || [])].map(entry => [canonicalSource(entry.source), entry]));
    const unresolved = graph.nodes.filter(node => !node.path || !bySource.has(canonicalSource(node.path)));
    if (unresolved.length) {
      widget.className = "topic-graph topic-graph--error";
      widget.textContent = `Topic graph cannot resolve: ${unresolved.map(node => node.path || node.id).join(", ")}`;
      return;
    }
    if (graph.errors.length) {
      widget.className = "topic-graph topic-graph--error";
      widget.textContent = `Topic graph wiring error — ${graph.errors.join("; ")}`;
      return;
    }
    const pinUses = new Map();
    const invalidPins = [];
    graph.edges.forEach(edge => {
      [[edge.from, edge.fromPin], [edge.to, edge.toPin]].forEach(([node, pin]) => {
        if (pin == null) return;
        if (pin < 1 || pin > PIN_COUNT) {
          invalidPins.push(`${node}.${pin}`);
          return;
        }
        const key = `${node}.${pin}`;
        pinUses.set(key, (pinUses.get(key) || 0) + 1);
      });
    });
    const duplicatePins = [...pinUses.entries()].filter(([, uses]) => uses > 1).map(([pin]) => pin);
    if (invalidPins.length || duplicatePins.length) {
      widget.className = "topic-graph topic-graph--error";
      const messages = [];
      if (invalidPins.length) messages.push(`pins must be between 1 and ${PIN_COUNT}: ${invalidPins.join(", ")}`);
      if (duplicatePins.length) messages.push(`pins are already connected: ${duplicatePins.join(", ")}`);
      widget.textContent = `Topic graph wiring error — ${messages.join("; ")}`;
      return;
    }
    const positions = layout(graph);
    const width = Math.max(260, ...[...positions.values()].map(node => node.x + NODE_WIDTH + 30));
    const height = Math.max(180, ...[...positions.values()].map(node => node.y + NODE_HEIGHT + 60));
    const obstacles = [...positions.values()].map(node => ({
      left: node.x - 10,
      right: node.x + NODE_WIDTH + 10,
      top: node.y - 10,
      bottom: node.y + NODE_HEIGHT + 10
    }));
    const routeBounds = { left: 5, right: width - 5, top: 0, bottom: height - 10 };
    widget.textContent = "";
    widget.className = "topic-graph";
    widget.setAttribute("role", "group");
    widget.setAttribute("aria-label", "Related topics circuit map");
    const canvas = document.createElement("div");
    canvas.className = "topic-graph__canvas";
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const chipRows = [...new Set([...positions.values()].map(node => node.y + (NODE_HEIGHT / 2)))];
    chipRows.forEach(center => {
      const trench = document.createElement("span");
      trench.className = "topic-graph__trench";
      trench.style.top = `${center - 5}px`;
      trench.setAttribute("aria-hidden", "true");
      canvas.appendChild(trench);
    });
    const wires = svg("svg", {
      class: "topic-graph__wires",
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      "aria-hidden": "true"
    });
    const defs = svg("defs");
    const markerRoot = `topic-graph-arrow-${Math.random().toString(36).slice(2)}`;
    Object.values(WIRE_TYPES).forEach(type => {
      const marker = svg("marker", { id: `${markerRoot}-${type.kind}`, markerWidth: 8, markerHeight: 8, refX: 7, refY: 4, orient: "auto", markerUnits: "strokeWidth" });
      marker.appendChild(svg("path", { d: "M 0 0 L 8 4 L 0 8 z", class: `topic-graph-arrow topic-graph-wire--${type.kind}` }));
      defs.appendChild(marker);
    });
    wires.appendChild(defs);
    const relations = document.createElement("ul");
    relations.className = "visually-hidden";
    const occupiedWires = new Set();
    graph.edges.forEach(edge => {
      const from = positions.get(edge.from), to = positions.get(edge.to);
      const route = pinnedEdgePath(from, edge.fromPin, to, edge.toPin, obstacles, routeBounds, occupiedWires);
      if (route.points) reserveRoute(route.points, occupiedWires);
      if (route.samples) route.samples.forEach(point => occupiedWires.add(`${point.x},${point.y}`));
      appendWireLayers(wires, route, edge, `url(#${markerRoot}-${edge.kind})`);
      const item = document.createElement("li");
      item.textContent = dynamicMathTitle(`${bySource.get(canonicalSource(from.path)).title}: ${edge.label} → ${bySource.get(canonicalSource(to.path)).title}`);
      relations.appendChild(item);
    });
    canvas.appendChild(decorationLayer(graph, width, height, obstacles, occupiedWires, chipRows));
    positions.forEach(node => canvas.appendChild(nodeElement(node, bySource.get(canonicalSource(node.path)))));
    canvas.appendChild(wires);
    widget.append(canvas, relations);
    window.typesetDynamicMath?.([widget]);
  }

  async function init() {
    const widgets = [...document.querySelectorAll(".circuit")].filter(widget =>
      widget.textContent.trim() || widget.classList.contains("this") || widget.hasAttribute("this") || widget.hasAttribute("data-this"));
    if (!widgets.length) return;
    const automaticWidgets = widgets.filter(widget =>
      widget.classList.contains("this") || widget.hasAttribute("this") || widget.hasAttribute("data-this"));
    automaticWidgets.forEach(homepageNavigator);
    installHomepageNavigatorNavigation();
    const authoredWidgets = widgets.filter(widget => !automaticWidgets.includes(widget));
    if (!authoredWidgets.length) return;
    let manifest;
    try { manifest = await navigation(); }
    catch {
      authoredWidgets.forEach(widget => { widget.className = "topic-graph topic-graph--error"; widget.textContent = "Topic graph metadata is unavailable in this preview."; });
      return;
    }
    authoredWidgets.forEach(widget => {
      const graph = parse(widget.textContent);
      if (!graph.edges.length) {
        widget.className = "topic-graph topic-graph--error";
        widget.textContent = graph.errors.length
          ? `Topic graph cannot load this neighborhood: ${graph.errors.join("; ")}`
          : "Topic graph contains no neighboring topics or valid adjacency expressions.";
      } else render(widget, graph, manifest);
    });
  }

  window.TopicGraphWidget = Object.freeze({
    parse,
    layout,
    normaliseSource,
    pinPoint,
    wirePoint,
    chipsAdjacent,
    directBezierPath,
    gridRoute,
    reserveRoute,
    decorationLayer,
    roundedPath,
    pinnedEdgePath,
    appendWireLayers,
    automaticGraph,
    design: CIRCUIT_DESIGN,
    pinCount: PIN_COUNT,
    wireTypes: WIRE_TYPES
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
