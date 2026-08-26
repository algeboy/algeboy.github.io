/* Shared, testable activation rules for circuit-board anchors. */
(() => {
  "use strict";

  function publishedUrl(value, baseURI) {
    const target = new URL(value, baseURI);
    // The circuit records QMD source keys, while readers must always receive
    // Quarto's published HTML artifact. Keep directory/index paths intact.
    target.pathname = target.pathname.replace(/\.qmd$/i, ".html");
    return target;
  }

  function internalTarget(event, link, baseURI, origin) {
    if (!link || link.target === "_blank" || event.defaultPrevented) return null;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
    let target;
    try { target = publishedUrl(link.href, baseURI); } catch { return null; }
    return target.origin === origin ? target : null;
  }

  globalThis.HomepageCircuitNavigation = Object.freeze({ publishedUrl, internalTarget });
})();
