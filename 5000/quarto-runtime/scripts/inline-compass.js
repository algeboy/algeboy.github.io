/* Declarative trigger for the shared compass overlay.
 *
 * The local compass reads the same source manifest as the custom sidebar. It
 * deliberately does not inspect Quarto's generated navigation DOM, so it
 * continues to describe the complete configured topology even while sidebar
 * folders are lazily expanded.
 */
(() => {
  "use strict";

  function siteRoot() {
    const offset = document.querySelector('meta[name="quarto:offset"]')?.content || "./";
    return new URL(offset, document.baseURI);
  }

  function keyFor(url) {
    const root = siteRoot();
    if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return null;
    let key = decodeURIComponent(url.pathname.slice(root.pathname.length)).replace(/^\/+/, "");
    if (!key || key.endsWith("/")) key += "index.html";
    return key;
  }

  function urlFor(value) {
    if (!value || value === "this") return new URL(location.href);
    const source = value.replace(/\.qmd(?=$|[?#])/, ".html");
    const base = /^(?:\.\.?\/|\/)/.test(source) ? document.baseURI : siteRoot();
    return new URL(source, base);
  }

  function canonicalKey(value) {
    const url = value instanceof URL ? value : new URL(value, document.baseURI);
    url.hash = "";
    url.search = "";
    return keyFor(url);
  }

  async function loadNavigation() {
    if (window.CustomBookNavigation?.load) return window.CustomBookNavigation.load();
    const response = await fetch(new URL("quarto-runtime/assets/book-navigation.json", siteRoot()), { cache: "no-cache" });
    if (!response.ok) throw new Error(`Navigation manifest returned ${response.status}`);
    return response.json();
  }

  function parentFor(entry, byKey) {
    if (entry.key === "index.html") return null;
    const parts = entry.source.split("/");
    parts.pop();
    while (parts.length) {
      const candidate = `${parts.join("/")}/index.html`;
      if (candidate !== entry.key && byKey.has(candidate)) return candidate;
      parts.pop();
    }
    return byKey.has("index.html") ? "index.html" : null;
  }

  function item(entry, current = false) {
    return {
      label: entry.title,
      href: new URL(entry.href, siteRoot()).href,
      icon: entry.titleIcon || entry.icon || "fa-solid fa-compass",
      current,
    };
  }

  function contextFor(center, entries, byKey) {
    const parentKey = parentFor(center, byKey);
    const parent = parentKey ? byKey.get(parentKey) : null;
    const siblings = parent
      ? entries.filter(entry => entry.key !== center.key && parentFor(entry, byKey) === parentKey)
      : [];
    const children = entries.filter(entry => parentFor(entry, byKey) === center.key);
    return {
      parent: parent ? item(parent) : null,
      before: siblings.filter(entry => entry.order < center.order).map(entry => item(entry)),
      center: item(center, true),
      after: siblings.filter(entry => entry.order > center.order).map(entry => item(entry)),
      children: children.map(entry => item(entry)),
    };
  }

  function makeTrigger(widget, getContext) {
    const initialContext = getContext();
    if (!initialContext) return false;
    widget.textContent = "";
    widget.className = "compass compass-inline-trigger";
    widget.setAttribute("role", "button");
    widget.setAttribute("tabindex", "0");
    widget.setAttribute("aria-label", `Open compass centered on ${initialContext.center.label}`);
    widget.title = `Open compass centered on ${initialContext.center.label}`;
    widget.innerHTML = '<i class="fa-solid fa-compass" aria-hidden="true"></i>';

    const open = () => {
      const context = getContext();
      if (context) window.BookCompass?.openFocused(context, { anchor: widget });
    };
    widget.addEventListener("mouseenter", open);
    widget.addEventListener("mouseleave", () => window.BookCompass?.scheduleFocusedClose?.());
    widget.addEventListener("focus", open);
    widget.addEventListener("click", open);
    widget.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      open();
    });
    return true;
  }

  async function init() {
    // `.compass` and the historical `.compas` alias retain the focused
    // compass behavior. Topic adjacency is authored with `.circuit`.
    const widgets = [...document.querySelectorAll(".compass, .compas")];
    if (!widgets.length) return;
    let navigation;
    try {
      navigation = await loadNavigation();
    } catch {
      widgets.forEach(widget => {
        widget.textContent = "Compass navigation is unavailable in this preview.";
        widget.classList.add("compass-inline-trigger--unresolved");
      });
      return;
    }
    const entries = navigation.pages
      .filter(entry => entry.key && entry.title && !entry.key.split("/").some(segment => segment.startsWith("_")))
      .sort((left, right) => left.order - right.order);
    const byKey = new Map(entries.map(entry => [entry.key, entry]));
    widgets.forEach(widget => {
      const target = canonicalKey(urlFor(widget.getAttribute("center") || widget.dataset.center));
      const getContext = () => {
        const center = byKey.get(target);
        return center ? contextFor(center, entries, byKey) : null;
      };
      if (!makeTrigger(widget, getContext)) {
        widget.textContent = "Compass target is not in the book navigation.";
        widget.classList.add("compass-inline-trigger--unresolved");
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
