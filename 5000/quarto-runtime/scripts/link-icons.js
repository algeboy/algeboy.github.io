(() => {
  "use strict";

  const iconClass = /\bfa-[a-z0-9-]+\b/gi;
  const families = new Set(["fa-solid", "fa-regular", "fa-brands"]);

  function normaliseIcon(value) {
    const classes = (value.match(iconClass) || []).map(item => item.toLowerCase());
    if (!classes.some(item => families.has(item))) classes.unshift("fa-solid");
    return classes.some(item => !families.has(item)) ? classes.join(" ") : null;
  }

  function siteRoot() {
    const offset = document.querySelector('meta[name="quarto:offset"]')?.content || "./";
    return new URL(offset, document.baseURI);
  }

  function manifestKey(url) {
    const root = siteRoot();
    if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return null;
    return decodeURIComponent(url.pathname.slice(root.pathname.length)).replace(/^\/+/, "") || "index.html";
  }

  function iconForSection(hash) {
    if (!hash) return null;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return null;
    return normaliseIcon(target.dataset.faIcon || target.querySelector("i[class*='fa-']")?.className || "");
  }

  // Brass link badges identify landing pages only.  In the published book,
  // those are the rendered index.qmd pages (the root page is the one
  // exception and is represented by `/`).  Chapter, section, breadcrumb,
  // pagination, and ordinary prose links should remain plain links.
  function isIndexPage(url) {
    const pathname = url.pathname.replace(/\/+$/, "");
    return pathname === "" || pathname.endsWith("/index.html");
  }

  function isTopIndexHeading(url) {
    if (!url.hash) return true;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    return target?.tagName?.toLowerCase() === "h1";
  }

  // Keep the root page in Quarto's DOM (the compass and other navigation
  // helpers can still inspect the complete book tree), but omit its single
  // sidebar row.  Comparing resolved URLs avoids brittle selectors for the
  // several relative forms Quarto may emit (./index.html, index.html, etc.).
  function hideRootSidebarEntry() {
    const root = siteRoot();
    const rootPath = root.pathname.replace(/\/+$/, "") || "/";
    document.querySelectorAll("#quarto-sidebar a.sidebar-link[href]").forEach(anchor => {
      let target;
      try { target = new URL(anchor.getAttribute("href"), document.baseURI); } catch { return; }
      const targetPath = target.pathname.replace(/\/+$/, "") || "/";
      const isRoot = target.origin === root.origin &&
        (targetPath === rootPath || targetPath === `${rootPath}/index.html` ||
         (rootPath === "/" && targetPath === "/index.html"));
      if (!isRoot) return;
      const row = anchor.closest("li.sidebar-item") || anchor.parentElement;
      row?.classList.add("sidebar-root-page-entry");
    });
  }

  // Older renders used a single `contents: auto` sidebar, which made TopicMap
  // a root row.  The project configuration now declares the Appendix
  // explicitly.  Retain this small compatibility migration only for a
  // genuinely direct root row; never pull TopicMap out of a configured
  // Appendix section.
  function moveTopicMapToAppendix() {
    const rootList = document.querySelector("#quarto-sidebar .sidebar-menu-container > ul");
    if (!rootList) return;

    const topicMapItem = Array.from(rootList.children).find(item => {
      const anchor = item.querySelector(":scope > .sidebar-item-container > a.sidebar-link[href]");
      if (!anchor) return false;
      try { return manifestKey(new URL(anchor.getAttribute("href"), document.baseURI)) === "TopicMap.html"; }
      catch { return false; }
    });
    if (!topicMapItem) return;

    const appendix = document.createElement("li");
    appendix.className = "sidebar-item sidebar-item-section sidebar-appendix-section";

    const heading = document.createElement("div");
    heading.className = "sidebar-item-container";
    const label = document.createElement("span");
    label.className = "sidebar-item-text sidebar-link text-start";
    label.textContent = "Appendix";
    heading.appendChild(label);

    const items = document.createElement("ul");
    items.className = "collapse list-unstyled sidebar-section depth1 show";
    items.appendChild(topicMapItem);

    appendix.append(heading, items);
    rootList.appendChild(appendix);
  }

  function decorate(anchor, icon) {
    if (!icon || anchor.dataset.contentIconBound === "true") return;
    const badge = document.createElement("span");
    badge.className = "fa-brass-icon fa-brass-link-icon";
    badge.setAttribute("aria-hidden", "true");
    const glyph = document.createElement("i");
    glyph.className = icon;
    badge.appendChild(glyph);
    const label = anchor.querySelector(".chapter-title, .sidebar-item-text, .nav-page-text") || anchor;
    label.insertBefore(badge, label.firstChild);
    anchor.dataset.contentIconBound = "true";
  }

  function decorateLinks(manifest) {
    const selector = "#quarto-sidebar a.sidebar-link[href], .quarto-page-breadcrumbs a[href], .pagination-link[href], main a[href]";
    document.querySelectorAll(selector).forEach(anchor => {
      const raw = anchor.getAttribute("href");
      if (!raw) return;
      let target;
      try { target = new URL(raw, document.baseURI); } catch { return; }
      if (!/^https?:$/.test(target.protocol) || target.origin !== location.origin) return;
      if (!isIndexPage(target) || !isTopIndexHeading(target)) return;

      const entry = manifest[manifestKey(target)];
      if (anchor.matches("#quarto-sidebar a.sidebar-link")) {
        // Sidebar entries should show only metadata the author explicitly
        // provided as `title-icon`; do not add inherited or default icons.
        decorate(anchor, entry?.titleIcon || null);
        return;
      }

      const samePage = target.pathname === location.pathname;
      decorate(anchor, (samePage ? iconForSection(target.hash) : null) || entry?.icon || null);
    });
  }

  async function init() {
    hideRootSidebarEntry();
    moveTopicMapToAppendix();
    try {
      const response = await fetch(new URL("quarto-runtime/assets/content-icon-map.json", siteRoot()), { cache: "no-cache" });
      if (response.ok) decorateLinks(await response.json());
    } catch {
      // Standalone previews without a book manifest remain usable.
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
