/*
 * Local, versioned reader-progress store.
 *
 * This module deliberately has no DOM dependency: the page tracker and the
 * circuit renderer can share it without making either one the source of
 * truth.  It is also safe to load in previews where localStorage is blocked.
 */
(function(global) {
  "use strict";

  const VERSION = 1;
  const STORAGE_KEY = "book-reader-progress";
  const COMPONENT_KEY = /^(?!.*(?:^|\/)\.\.?\/)[A-Za-z0-9][A-Za-z0-9._ -]*(?:\/[A-Za-z0-9][A-Za-z0-9._ -]*)*\.qmd$/;

  function canonicalComponentKey(value) {
    const key = decodeURIComponent(String(value || ""))
      .trim()
      .replace(/\\/g, "/")
      .replace(/^\.\//, "")
      .replace(/\.html(?=$|[?#])/, ".qmd")
      .replace(/[?#].*$/, "");
    if (!COMPONENT_KEY.test(key)) throw new Error("A component key must be a project-relative .qmd path");
    return key;
  }

  function timestamp(now) {
    return (now || (() => new Date())).call(null).toISOString();
  }

  function emptyDocument(now) {
    return { version: VERSION, updatedAt: timestamp(now), components: {} };
  }

  function validTimestamp(value) {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
  }

  function validateEntry(value, key) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Invalid progress entry for ${key}`);
    if (value.status !== "read" && value.status !== "unread") throw new Error(`Invalid progress status for ${key}`);
    if (value.reason !== "automatic" && value.reason !== "manual") throw new Error(`Invalid progress reason for ${key}`);
    if (!validTimestamp(value.updatedAt)) throw new Error(`Invalid progress timestamp for ${key}`);
    return { status: value.status, reason: value.reason, updatedAt: value.updatedAt };
  }

  function validateDocument(value, manifest) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Progress import must be an object");
    if (value.version !== VERSION) throw new Error(`Unsupported reader-progress version: ${value.version}`);
    if (!validTimestamp(value.updatedAt)) throw new Error("Progress import needs an updatedAt timestamp");
    if (!value.components || typeof value.components !== "object" || Array.isArray(value.components)) throw new Error("Progress import needs a components object");
    const components = {};
    Object.entries(value.components).forEach(([rawKey, entry]) => {
      const key = canonicalComponentKey(rawKey);
      if (manifest && !manifest.has(key)) throw new Error(`Progress import contains a component outside this circuit: ${key}`);
      components[key] = validateEntry(entry, key);
    });
    return { version: VERSION, updatedAt: value.updatedAt, components };
  }

  function isRead(entry) {
    return entry && entry.status === "read";
  }

  function mergeEntries(left, right) {
    if (!left) return right;
    if (!right) return left;
    // An explicit manual choice takes precedence over an automatic signal.
    if (left.reason === "manual" && right.reason !== "manual") return left;
    if (right.reason === "manual" && left.reason !== "manual") return right;
    // With equal authority, preserve a completed component; otherwise newest wins.
    if (left.status !== right.status) return isRead(left) ? left : right;
    return Date.parse(left.updatedAt) >= Date.parse(right.updatedAt) ? left : right;
  }

  function mergeDocuments(left, right, manifest) {
    const first = validateDocument(left, manifest);
    const second = validateDocument(right, manifest);
    const components = {};
    new Set([...Object.keys(first.components), ...Object.keys(second.components)]).forEach((key) => {
      components[key] = mergeEntries(first.components[key], second.components[key]);
    });
    return {
      version: VERSION,
      updatedAt: Date.parse(first.updatedAt) >= Date.parse(second.updatedAt) ? first.updatedAt : second.updatedAt,
      components
    };
  }

  function create(options) {
    const settings = options || {};
    const manifest = settings.manifest ? new Set(Array.from(settings.manifest, canonicalComponentKey)) : null;
    const storage = settings.storage || (() => {
      try { return global.localStorage; } catch (_) { return null; }
    })();
    const storageKey = settings.storageKey || STORAGE_KEY;
    const now = settings.now;
    let document = emptyDocument(now);

    function assertKnown(rawKey) {
      const key = canonicalComponentKey(rawKey);
      if (manifest && !manifest.has(key)) throw new Error(`Component is outside this circuit: ${key}`);
      return key;
    }

    function save() {
      document.updatedAt = timestamp(now);
      try { storage?.setItem?.(storageKey, JSON.stringify(document)); } catch (_) { /* local progress remains in memory */ }
      return snapshot();
    }

    function load() {
      let raw;
      try { raw = storage?.getItem?.(storageKey); } catch (_) { return snapshot(); }
      if (!raw) return snapshot();
      try { document = validateDocument(JSON.parse(raw), manifest); } catch (_) { document = emptyDocument(now); }
      return snapshot();
    }

    function snapshot() {
      return JSON.parse(JSON.stringify(document));
    }

    function set(rawKey, status, reason) {
      const key = assertKnown(rawKey);
      document.components[key] = { status, reason: reason || "manual", updatedAt: timestamp(now) };
      save();
      return get(key);
    }

    function get(rawKey) {
      const key = assertKnown(rawKey);
      const entry = document.components[key];
      return entry ? Object.assign({ key }, entry) : null;
    }

    function list(scope) {
      const prefix = scope?.section ? assertSection(scope.section) : null;
      const keys = manifest ? Array.from(manifest) : Object.keys(document.components);
      return keys.filter((key) => !prefix || key === prefix || key.startsWith(`${prefix}/`))
        .sort()
        .map((key) => Object.assign({ key, status: "unread", reason: null }, document.components[key] || {}));
    }

    function counts(scope) {
      const entries = list(scope);
      const read = entries.filter(isRead).length;
      const total = entries.length;
      return { total, read, unread: total - read, percent: total ? Math.round(read / total * 100) : 0 };
    }

    function assertSection(value) {
      const section = String(value || "").trim().replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/$/, "");
      if (!section || section.split("/").some((part) => !part || part === "." || part === "..")) throw new Error("A section must be a project-relative path prefix");
      return section;
    }

    function clear(scope, context) {
      const kind = scope || "all";
      if (kind === "all") document.components = {};
      else if (kind === "current") delete document.components[assertKnown(context?.component)];
      else if (kind === "section") {
        const section = assertSection(context?.section);
        Object.keys(document.components).forEach((key) => {
          if (key === section || key.startsWith(`${section}/`)) delete document.components[key];
        });
      } else throw new Error(`Unknown clear scope: ${kind}`);
      return save();
    }

    function importProgress(payload, options) {
      const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
      const incoming = validateDocument(parsed, manifest);
      document = options?.merge ? mergeDocuments(document, incoming, manifest) : incoming;
      save();
      return snapshot();
    }

    load();
    return Object.freeze({
      load, snapshot, get, list, counts, clear,
      markRead: (key, reason) => set(key, "read", reason || "manual"),
      markUnread: (key) => set(key, "unread", "manual"),
      recordAutomaticRead: (key) => set(key, "read", "automatic"),
      exportProgress: () => JSON.stringify(snapshot()),
      importProgress,
      merge: (incoming) => mergeDocuments(document, incoming, manifest)
    });
  }

  global.ReaderProgress = Object.freeze({ VERSION, STORAGE_KEY, canonicalComponentKey, validateDocument, mergeDocuments, create });
})(typeof window !== "undefined" ? window : globalThis);
