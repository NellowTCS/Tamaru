"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  destroyVirtualTrackball: () => destroyVirtualTrackball,
  hideVirtualTrackball: () => hideVirtualTrackball,
  initVirtualTrackball: () => initVirtualTrackball,
  updateVirtualTrackballConfig: () => updateVirtualTrackballConfig
});
module.exports = __toCommonJS(main_exports);

// node_modules/@nisoku/satori/dist/satori.mjs
var M = class {
  constructor(e) {
    this.config = e;
  }
  eventTimestamps = [];
  buffer = [];
  droppedCount = 0;
  sampledCount = 0;
  /**
   * Check if an event should be allowed through
   * Returns: { allowed: boolean, sampled?: boolean }
   */
  shouldAllow(e) {
    if (!this.config.enabled)
      return { allowed: true, sampled: false };
    const t = Date.now();
    if (this.eventTimestamps = this.eventTimestamps.filter((r) => t - r < 1e3), this.eventTimestamps.length < this.config.maxEventsPerSecond)
      return this.eventTimestamps.push(t), { allowed: true, sampled: false };
    switch (this.config.strategy) {
      case "drop":
        return this.droppedCount++, { allowed: false, sampled: false };
      case "sample":
        return Math.random() < this.config.samplingRate ? (this.eventTimestamps.push(t), this.sampledCount++, { allowed: true, sampled: true }) : (this.droppedCount++, { allowed: false, sampled: false });
      case "buffer":
        return this.buffer.length < (this.config.bufferSize || 100) ? this.buffer.push(e) : this.droppedCount++, { allowed: false, sampled: false };
      default:
        return { allowed: true, sampled: false };
    }
  }
  /**
   * Get buffered events and clear the buffer
   */
  flushBuffer() {
    const e = [...this.buffer];
    return this.buffer = [], e;
  }
  /**
   * Get current rate (events per second)
   */
  getCurrentRate() {
    const e = Date.now();
    return this.eventTimestamps = this.eventTimestamps.filter((t) => e - t < 1e3), this.eventTimestamps.length;
  }
  /**
   * Get statistics
   */
  getStats() {
    return {
      dropped: this.droppedCount,
      sampled: this.sampledCount,
      buffered: this.buffer.length,
      currentRate: this.getCurrentRate()
    };
  }
  /**
   * Reset statistics
   */
  reset() {
    this.eventTimestamps = [], this.buffer = [], this.droppedCount = 0, this.sampledCount = 0;
  }
  /**
   * Update configuration
   */
  updateConfig(e) {
    this.config = { ...this.config, ...e };
  }
};
function g(s, e, t = /* @__PURE__ */ new WeakMap()) {
  if (s === e) return true;
  if (typeof s == "number" && typeof e == "number")
    return Number.isNaN(s) && Number.isNaN(e) ? true : s === e;
  if (s === null || e === null || s === void 0 || e === void 0) return s === e;
  if (typeof s != typeof e || typeof s != "object") return false;
  const i = s, r = e;
  if (t.has(i))
    return t.get(i) === r;
  if (t.set(i, r), s instanceof Date && e instanceof Date)
    return s.getTime() === e.getTime();
  if (s instanceof Date || e instanceof Date) return false;
  if (s instanceof RegExp && e instanceof RegExp)
    return s.source === e.source && s.flags === e.flags;
  if (s instanceof RegExp || e instanceof RegExp) return false;
  if (s instanceof Map && e instanceof Map) {
    if (s.size !== e.size) return false;
    for (const [c, l] of s)
      if (!e.has(c) || !g(l, e.get(c), t)) return false;
    return true;
  }
  if (s instanceof Map || e instanceof Map) return false;
  if (s instanceof Set && e instanceof Set) {
    if (s.size !== e.size) return false;
    const c = Array.from(s), l = Array.from(e);
    for (const u of c) {
      let d = false;
      for (const h of l)
        if (g(u, h, t)) {
          d = true;
          break;
        }
      if (!d) return false;
    }
    return true;
  }
  if (s instanceof Set || e instanceof Set) return false;
  if (Array.isArray(s) && Array.isArray(e)) {
    if (s.length !== e.length) return false;
    const c = Object.keys(s).filter((h) => /^\d+$/.test(h)).map(Number), l = Object.keys(e).filter((h) => /^\d+$/.test(h)).map(Number);
    if (c.length !== l.length) return false;
    for (const h of c)
      if (!l.includes(h)) return false;
    for (let h = 0; h < s.length; h++) {
      const T = Object.prototype.hasOwnProperty.call(s, h), $ = Object.prototype.hasOwnProperty.call(e, h);
      if (T !== $ || T && !g(s[h], e[h], t)) return false;
    }
    const u = Object.keys(s).filter((h) => !/^\d+$/.test(h)), d = Object.keys(e).filter((h) => !/^\d+$/.test(h));
    if (u.length !== d.length) return false;
    for (const h of u)
      if (!Object.prototype.hasOwnProperty.call(e, h) || !g(s[h], e[h], t)) return false;
    return true;
  }
  if (Array.isArray(s) !== Array.isArray(e)) return false;
  const n = s, o = e, a = Object.keys(n), f = Object.keys(o);
  if (a.length !== f.length) return false;
  for (const c of a)
    if (!Object.prototype.hasOwnProperty.call(o, c) || !g(n[c], o[c], t)) return false;
  return true;
}
function p(s, e = /* @__PURE__ */ new WeakMap()) {
  if (s == null || typeof s != "object") return s;
  const t = s;
  if (e.has(t))
    return e.get(t);
  if (s instanceof Date)
    return new Date(s.getTime());
  if (s instanceof RegExp)
    return new RegExp(s.source, s.flags);
  if (s instanceof Map) {
    const r = /* @__PURE__ */ new Map();
    e.set(t, r);
    for (const [n, o] of s)
      r.set(p(n, e), p(o, e));
    return r;
  }
  if (s instanceof Set) {
    const r = /* @__PURE__ */ new Set();
    e.set(t, r);
    for (const n of s)
      r.add(p(n, e));
    return r;
  }
  if (Array.isArray(s)) {
    const r = [];
    e.set(t, r);
    for (let n = 0; n < s.length; n++)
      Object.prototype.hasOwnProperty.call(s, n) && (r[n] = p(s[n], e));
    for (const n of Object.keys(s))
      /^\d+$/.test(n) || (r[n] = p(s[n], e));
    return r;
  }
  const i = {};
  e.set(t, i);
  for (const r of Object.keys(s))
    i[r] = p(s[r], e);
  return i;
}
function b(s, e = /* @__PURE__ */ new WeakSet()) {
  return s === null ? "null" : s === void 0 ? "undefined" : typeof s == "string" ? `s:${s}` : typeof s == "number" ? Number.isNaN(s) ? "n:NaN" : `n:${s}` : typeof s == "boolean" ? `b:${s}` : typeof s != "object" ? String(s) : e.has(s) ? "[Circular]" : (e.add(s), s instanceof Date ? `d:${s.getTime()}` : s instanceof RegExp ? `r:${s.source}:${s.flags}` : s instanceof Map ? `m:{${Array.from(s.entries()).map(([r, n]) => `${b(r, e)}=>${b(n, e)}`).sort().join(",")}}` : s instanceof Set ? `set:{${Array.from(s).map((r) => b(r, e)).sort().join(",")}}` : Array.isArray(s) ? `a:[${s.map((r, n) => Object.prototype.hasOwnProperty.call(s, n) ? b(r, e) : "<empty>").join(",")}]` : `o:{${Object.entries(s).sort(([i], [r]) => i.localeCompare(r)).map(([i, r]) => `${i}:${b(r, e)}`).join(",")}}`);
}
var F = class {
  constructor(e) {
    this.config = e;
  }
  cache = /* @__PURE__ */ new Map();
  deduplicatedCount = 0;
  /**
   * Compute a deduplication key for an entry based on configured fields
   */
  computeDedupKey(e) {
    const t = [];
    for (const i of this.config.fields)
      switch (i) {
        case "message":
          t.push(`m:${e.message}`);
          break;
        case "scope":
          t.push(`s:${e.scope}`);
          break;
        case "level":
          t.push(`l:${e.level}`);
          break;
        case "tags":
          t.push(`t:${e.tags.sort().join(",")}`);
          break;
        case "state":
          e.state && t.push(`st:${b(e.state)}`);
          break;
      }
    return t.join("|");
  }
  /**
   * Check if an event is a duplicate
   * Returns: { isDuplicate: boolean, originalId?: string, duplicateCount: number }
   */
  isDuplicate(e) {
    if (!this.config.enabled)
      return { isDuplicate: false, duplicateCount: 0 };
    const t = Date.now(), i = this.computeDedupKey(e);
    this.cleanExpired(t);
    const r = this.cache.get(i);
    return r && t - r.timestamp < this.config.windowMs ? (r.count++, this.deduplicatedCount++, { isDuplicate: true, duplicateCount: r.count }) : (this.cache.set(i, {
      hash: i,
      timestamp: t,
      count: 1
    }), this.cache.size > this.config.maxCacheSize && this.evictOldest(), { isDuplicate: false, duplicateCount: 1 });
  }
  /**
   * Clean expired entries from cache
   */
  cleanExpired(e) {
    for (const [t, i] of this.cache.entries())
      e - i.timestamp >= this.config.windowMs && this.cache.delete(t);
  }
  /**
   * Evict oldest entries when cache is full
   */
  evictOldest() {
    let e = null, t = 1 / 0;
    for (const [i, r] of this.cache.entries())
      r.timestamp < t && (t = r.timestamp, e = i);
    e && this.cache.delete(e);
  }
  /**
   * Get statistics
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      deduplicatedCount: this.deduplicatedCount
    };
  }
  /**
   * Reset the deduplicator
   */
  reset() {
    this.cache.clear(), this.deduplicatedCount = 0;
  }
  /**
   * Update configuration
   */
  updateConfig(e) {
    this.config = { ...this.config, ...e };
  }
};
var I = class {
  constructor(e, t = {}) {
    this.config = e, this.events = t;
  }
  state = "closed";
  failureCount = 0;
  successCount = 0;
  lastFailureTime = 0;
  totalFailures = 0;
  totalSuccesses = 0;
  /**
   * Execute a function with circuit breaker protection
   */
  async execute(e) {
    if (!this.config.enabled)
      return e();
    if (!this.canExecute())
      throw new L("Circuit breaker is open");
    try {
      const t = await e();
      return this.recordSuccess(), t;
    } catch (t) {
      throw this.recordFailure(
        t instanceof Error ? t : new Error(String(t))
      ), t;
    }
  }
  /**
   * Execute synchronously with circuit breaker protection
   */
  executeSync(e) {
    if (!this.config.enabled)
      return e();
    if (!this.canExecute())
      throw new L("Circuit breaker is open");
    try {
      const t = e();
      return this.recordSuccess(), t;
    } catch (t) {
      throw this.recordFailure(
        t instanceof Error ? t : new Error(String(t))
      ), t;
    }
  }
  /**
   * Check if execution is allowed
   */
  canExecute() {
    return this.state === "closed" ? true : this.state === "open" ? Date.now() - this.lastFailureTime >= this.config.resetTimeout ? (this.transitionTo("half-open"), true) : false : true;
  }
  /**
   * Record a successful execution
   */
  recordSuccess() {
    this.totalSuccesses++, this.events.onSuccess?.(this.successCount + 1), this.state === "half-open" ? (this.successCount++, this.successCount >= this.config.successThreshold && this.transitionTo("closed")) : this.state === "closed" && (this.failureCount = 0);
  }
  /**
   * Record a failed execution
   */
  recordFailure(e) {
    this.totalFailures++, this.failureCount++, this.lastFailureTime = Date.now(), this.events.onFailure?.(e, this.failureCount), this.state === "half-open" ? this.transitionTo("open") : this.state === "closed" && this.failureCount >= this.config.failureThreshold && this.transitionTo("open");
  }
  /**
   * Transition to a new state
   */
  transitionTo(e) {
    const t = this.state;
    this.state = e, e === "closed" ? (this.failureCount = 0, this.successCount = 0, this.events.onClose?.()) : e === "open" ? (this.successCount = 0, this.events.onOpen?.()) : e === "half-open" && (this.successCount = 0, this.events.onHalfOpen?.()), this.events.onStateChange?.(e, t);
  }
  /**
   * Get current state
   */
  getState() {
    return this.state;
  }
  /**
   * Get statistics
   */
  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses,
      lastFailureTime: this.lastFailureTime
    };
  }
  /**
   * Manually reset the circuit breaker
   */
  reset() {
    this.transitionTo("closed"), this.failureCount = 0, this.successCount = 0, this.totalFailures = 0, this.totalSuccesses = 0, this.lastFailureTime = 0;
  }
  /**
   * Force the circuit open (for testing/manual intervention)
   */
  forceOpen() {
    this.transitionTo("open"), this.lastFailureTime = Date.now();
  }
  /**
   * Force the circuit closed (for testing/manual intervention)
   */
  forceClose() {
    this.transitionTo("closed");
  }
};
var L = class extends Error {
  constructor(e) {
    super(e), this.name = "CircuitOpenError";
  }
};
var C = class {
  startTime;
  totalPublished = 0;
  totalDropped = 0;
  totalSampled = 0;
  totalDeduplicated = 0;
  recentEvents = [];
  loggerCount = 0;
  watcherCount = 0;
  subscriberCount = 0;
  bufferSize = 0;
  circuitState = "closed";
  // For tracking events per second
  eventTimestamps = [];
  // Historical snapshots for trending
  snapshots = [];
  maxSnapshots = 60;
  // Keep last 60 snapshots (e.g., 1 per second = 1 minute)
  constructor() {
    this.startTime = Date.now();
  }
  /**
   * Record a published event
   */
  recordPublished() {
    this.totalPublished++;
    const e = Date.now();
    this.eventTimestamps.push(e), this.eventTimestamps = this.eventTimestamps.filter((t) => e - t < 1e3);
  }
  /**
   * Record a dropped event
   */
  recordDropped() {
    this.totalDropped++;
  }
  /**
   * Record a sampled event
   */
  recordSampled() {
    this.totalSampled++;
  }
  /**
   * Record a deduplicated event
   */
  recordDeduplicated() {
    this.totalDeduplicated++;
  }
  /**
   * Update logger count
   */
  setLoggerCount(e) {
    this.loggerCount = e;
  }
  /**
   * Update watcher count
   */
  setWatcherCount(e) {
    this.watcherCount = e;
  }
  /**
   * Update subscriber count
   */
  setSubscriberCount(e) {
    this.subscriberCount = e;
  }
  /**
   * Update buffer size
   */
  setBufferSize(e) {
    this.bufferSize = e;
  }
  /**
   * Update circuit state
   */
  setCircuitState(e) {
    this.circuitState = e;
  }
  /**
   * Get current events per second
   */
  getEventsPerSecond() {
    const e = Date.now();
    return this.eventTimestamps = this.eventTimestamps.filter((t) => e - t < 1e3), this.eventTimestamps.length;
  }
  /**
   * Get current bus metrics
   */
  getBusMetrics() {
    return {
      totalPublished: this.totalPublished,
      totalDropped: this.totalDropped,
      totalSampled: this.totalSampled,
      totalDeduplicated: this.totalDeduplicated,
      eventsPerSecond: this.getEventsPerSecond(),
      bufferSize: this.bufferSize,
      subscriberCount: this.subscriberCount
    };
  }
  /**
   * Get full Satori metrics
   */
  getMetrics() {
    return {
      bus: this.getBusMetrics(),
      loggerCount: this.loggerCount,
      watcherCount: this.watcherCount,
      circuitState: this.circuitState,
      uptime: Date.now() - this.startTime
    };
  }
  /**
   * Take a snapshot for historical tracking
   */
  takeSnapshot() {
    const e = {
      timestamp: Date.now(),
      bus: this.getBusMetrics(),
      loggerCount: this.loggerCount,
      watcherCount: this.watcherCount,
      circuitState: this.circuitState,
      uptime: Date.now() - this.startTime
    };
    return this.snapshots.push(e), this.snapshots.length > this.maxSnapshots && (this.snapshots = this.snapshots.slice(-this.maxSnapshots)), e;
  }
  /**
   * Get historical snapshots
   */
  getSnapshots() {
    return [...this.snapshots];
  }
  /**
   * Get average events per second over time
   */
  getAverageEventsPerSecond() {
    return this.snapshots.length === 0 ? 0 : this.snapshots.reduce(
      (t, i) => t + i.bus.eventsPerSecond,
      0
    ) / this.snapshots.length;
  }
  /**
   * Reset all metrics
   */
  reset() {
    this.startTime = Date.now(), this.totalPublished = 0, this.totalDropped = 0, this.totalSampled = 0, this.totalDeduplicated = 0, this.eventTimestamps = [], this.snapshots = [];
  }
};
var k = {
  enabled: false,
  maxEventsPerSecond: 1e3,
  samplingRate: 0.1,
  strategy: "sample",
  bufferSize: 100
};
var B = {
  enabled: false,
  windowMs: 5e3,
  fields: ["message", "scope", "level"],
  maxCacheSize: 1e3
};
var E = {
  enabled: false,
  failureThreshold: 5,
  resetTimeout: 3e4,
  successThreshold: 3
};
var y = {
  enableCallsite: true,
  enableEnvInfo: true,
  enableStateSnapshot: false,
  enableCausalLinks: true,
  enableMetrics: true,
  enableConsole: true,
  stateSelectors: [],
  maxBufferSize: 1e3,
  logLevel: "info",
  appVersion: "1.0.0",
  pollingInterval: 250,
  // More reasonable default
  customLevels: [],
  rateLimiting: k,
  deduplication: B,
  circuitBreaker: E
};
var R = class {
  subscribers = [];
  middleware = [];
  buffer = [];
  maxBufferSize;
  rateLimiter;
  deduplicator;
  circuitBreaker;
  metrics;
  enableMetrics;
  constructor(e = {}) {
    typeof e == "number" && (e = { maxBufferSize: e }), this.maxBufferSize = e.maxBufferSize || 1e3, this.enableMetrics = e.enableMetrics ?? true, this.rateLimiter = new M({
      ...k,
      ...e.rateLimiting
    }), this.deduplicator = new F({
      ...B,
      ...e.deduplication
    }), this.circuitBreaker = new I(
      {
        ...E,
        ...e.circuitBreaker
      },
      {
        onStateChange: (t) => {
          this.enableMetrics && this.metrics.setCircuitState(t);
        }
      }
    ), this.metrics = new C();
  }
  publish(e) {
    if (!e.__internal?.isReplay && !e.skipDedup && this.deduplicator.isDuplicate(e).isDuplicate) {
      this.enableMetrics && this.metrics.recordDeduplicated();
      return;
    }
    if (!e.__internal?.isReplay && !e.skipRateLimit) {
      const t = this.rateLimiter.shouldAllow(e);
      if (!t.allowed) {
        this.enableMetrics && this.metrics.recordDropped();
        return;
      }
      t.sampled && (e.__internal = e.__internal || {}, e.__internal.sampled = true, this.enableMetrics && this.metrics.recordSampled());
    }
    try {
      this.circuitBreaker.executeSync(() => {
        this.doPublish(e);
      }), this.enableMetrics && (this.metrics.recordPublished(), this.metrics.setBufferSize(this.buffer.length), this.metrics.setSubscriberCount(this.subscribers.length));
    } catch {
      this.enableMetrics && this.metrics.recordDropped();
    }
  }
  doPublish(e) {
    let t = 0;
    const i = () => {
      if (t >= this.middleware.length) {
        this.subscribers.forEach((n) => n(e)), this.addToBuffer(e);
        return;
      }
      const r = this.middleware[t];
      t++, r(e, i);
    };
    i();
  }
  subscribe(e) {
    return this.subscribers.push(e), this.enableMetrics && this.metrics.setSubscriberCount(this.subscribers.length), () => {
      const t = this.subscribers.indexOf(e);
      t >= 0 && (this.subscribers.splice(t, 1), this.enableMetrics && this.metrics.setSubscriberCount(this.subscribers.length));
    };
  }
  use(e) {
    this.middleware.push(e);
  }
  getReplayBuffer() {
    return [...this.buffer];
  }
  getMetrics() {
    return this.metrics.getBusMetrics();
  }
  /**
   * Get the rate limiter instance for advanced configuration
   */
  getRateLimiter() {
    return this.rateLimiter;
  }
  /**
   * Get the deduplicator instance for advanced configuration
   */
  getDeduplicator() {
    return this.deduplicator;
  }
  /**
   * Get the circuit breaker instance for advanced configuration
   */
  getCircuitBreaker() {
    return this.circuitBreaker;
  }
  /**
   * Clear the event buffer
   */
  clearBuffer() {
    this.buffer.length = 0, this.enableMetrics && this.metrics.setBufferSize(0);
  }
  /**
   * Reset all state
   */
  reset() {
    this.buffer.length = 0, this.middleware.length = 0, this.rateLimiter.reset(), this.deduplicator.reset(), this.circuitBreaker.reset(), this.metrics.reset();
  }
  addToBuffer(e) {
    this.buffer.push(e), this.buffer.length > this.maxBufferSize && this.buffer.shift();
  }
};
var A = 0;
var N = Date.now().toString(36);
function O() {
  return `${N}-${++A}`;
}
function z() {
  return Date.now();
}
function j(s = 2) {
  try {
    const e = new Error().stack;
    if (!e) return;
    const i = e.split(`
`)[s];
    if (!i) return;
    const r = i.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) || i.match(/at\s+(.+?):(\d+):(\d+)/);
    if (r) {
      const [, n, o, a, f] = r;
      return `${o}:${a}:${f}${n ? ` (${n})` : ""}`;
    }
    return i.trim();
  } catch {
    return;
  }
}
function P() {
  return typeof globalThis < "u" && "Deno" in globalThis ? "deno" : typeof globalThis < "u" && "Bun" in globalThis ? "bun" : typeof globalThis < "u" && "caches" in globalThis && typeof globalThis.caches == "object" && !("window" in globalThis) ? "cloudflare-workers" : typeof globalThis < "u" && "EdgeRuntime" in globalThis ? "edge" : typeof window < "u" && typeof document < "u" ? "browser" : typeof process < "u" && process.versions && process.versions.node ? "node" : "unknown";
}
function V(s) {
  const e = P(), t = {
    platform: e,
    appVersion: s.appVersion
  };
  switch (e) {
    case "browser":
      typeof navigator < "u" && (t.userAgent = navigator.userAgent), typeof window < "u" && (t.url = window.location?.href, typeof document < "u" && (t.referrer = document.referrer));
      break;
    case "node":
      typeof process < "u" && (t.nodeVersion = process.version, t.arch = process.arch, process.env.NODE_ENV && (t.nodeEnv = process.env.NODE_ENV));
      break;
    case "deno":
      try {
        const i = globalThis.Deno;
        i?.version && (t.denoVersion = i.version.deno, t.v8Version = i.version.v8, t.typescriptVersion = i.version.typescript), i?.build && (t.os = i.build.os, t.arch = i.build.arch);
      } catch {
      }
      break;
    case "bun":
      try {
        const i = globalThis.Bun;
        i?.version && (t.bunVersion = i.version), i?.revision && (t.bunRevision = i.revision);
      } catch {
      }
      break;
    case "cloudflare-workers":
      t.runtime = "cloudflare-workers";
      break;
    case "edge":
      try {
        const i = globalThis.EdgeRuntime;
        t.edgeRuntime = i;
      } catch {
      }
      break;
  }
  return t;
}
function _(s) {
  if (!s.stateSelectors || s.stateSelectors.length === 0)
    return;
  const e = {};
  for (let t = 0; t < s.stateSelectors.length; t++) {
    const i = s.stateSelectors[t], r = typeof i == "function" ? i : i.selector, n = typeof i == "function" ? `selector_${t}` : i.name || `selector_${t}`;
    try {
      const o = r();
      o != null && (e[n] = p(o));
    } catch (o) {
      e[`${n}_error`] = o instanceof Error ? o.message : String(o);
    }
  }
  return Object.keys(e).length > 0 ? e : void 0;
}
var W = class {
  nodes = /* @__PURE__ */ new Map();
  scopeLastEvent = /* @__PURE__ */ new Map();
  globalLastEvent;
  maxNodes = 1e4;
  /**
   * Add a new event to the causal graph
   */
  addEvent(e, t, i) {
    const r = {
      eventId: e,
      scope: t,
      timestamp: Date.now(),
      causes: i || [],
      effects: []
    };
    if (i)
      for (const n of i) {
        const o = this.nodes.get(n);
        o && o.effects.push(e);
      }
    this.nodes.set(e, r), this.scopeLastEvent.set(t, e), this.globalLastEvent = e, this.nodes.size > this.maxNodes && this.pruneOldest(Math.floor(this.maxNodes * 0.1));
  }
  /**
   * Get the causal link for a new event
   */
  getCausalLink(e, t) {
    return t || this.scopeLastEvent.get(e) || this.globalLastEvent;
  }
  /**
   * Get all causes (direct and transitive) for an event
   */
  getCauses(e, t = 1 / 0) {
    const i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), n = (o, a) => {
      if (r.has(o) || a > t) return;
      r.add(o);
      const f = this.nodes.get(o);
      if (f)
        for (const c of f.causes)
          i.add(c), n(c, a + 1);
    };
    return n(e, 0), Array.from(i);
  }
  /**
   * Get all effects (direct and transitive) for an event
   */
  getEffects(e, t = 1 / 0) {
    const i = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), n = (o, a) => {
      if (r.has(o) || a > t) return;
      r.add(o);
      const f = this.nodes.get(o);
      if (f)
        for (const c of f.effects)
          i.add(c), n(c, a + 1);
    };
    return n(e, 0), Array.from(i);
  }
  /**
   * Get the causal chain from root to an event
   */
  getCausalChain(e) {
    const t = [];
    let i = e;
    const r = /* @__PURE__ */ new Set();
    for (; i && !r.has(i); ) {
      r.add(i), t.unshift(i);
      const n = this.nodes.get(i);
      if (!n || n.causes.length === 0) break;
      i = n.causes[0];
    }
    return t;
  }
  /**
   * Get node information
   */
  getNode(e) {
    return this.nodes.get(e);
  }
  /**
   * Check if two events are causally related
   */
  areCausallyRelated(e, t) {
    const i = this.getCauses(e), r = this.getEffects(e);
    return i.includes(t) || r.includes(t);
  }
  /**
   * Get events in the same scope
   */
  getEventsByScope(e) {
    const t = [];
    for (const [i, r] of this.nodes)
      r.scope === e && t.push(i);
    return t;
  }
  /**
   * Prune oldest nodes to stay within memory limits
   */
  pruneOldest(e) {
    const t = Array.from(this.nodes.entries()).sort(([, i], [, r]) => i.timestamp - r.timestamp).slice(0, e);
    for (const [i] of t) {
      const r = this.nodes.get(i);
      if (r) {
        for (const n of r.causes) {
          const o = this.nodes.get(n);
          o && (o.effects = o.effects.filter((a) => a !== i));
        }
        for (const n of r.effects) {
          const o = this.nodes.get(n);
          o && (o.causes = o.causes.filter((a) => a !== i));
        }
      }
      this.nodes.delete(i);
    }
  }
  /**
   * Clear all causal links
   */
  clear() {
    this.nodes.clear(), this.scopeLastEvent.clear(), this.globalLastEvent = void 0;
  }
  /**
   * Get statistics about the causal graph
   */
  getStats() {
    let e = 0, t = 0;
    for (const r of this.nodes.values())
      e += r.causes.length, t += r.effects.length;
    const i = this.nodes.size || 1;
    return {
      nodeCount: this.nodes.size,
      avgCauses: e / i,
      avgEffects: t / i
    };
  }
};
var m = new W();
var x = /* @__PURE__ */ new Map();
function K(s, e) {
  return m.getCausalLink(s, e);
}
function H(s, e, t) {
  m.addEvent(e, s, t), x.set(s, e);
}
function G(s, e, t) {
  const i = O(), r = z(), n = [...s.inheritedTags || [], ...s.options?.tags || []], o = {
    id: i,
    timestamp: r,
    level: s.level,
    scope: s.scope,
    message: s.message,
    tags: n,
    cause: s.inheritedCause || s.options?.cause,
    causeEventId: s.inheritedCauseEventId || s.options?.causeEventId,
    suggest: s.options?.suggest
  };
  if (s.options?.state && (o.state = { ...s.options.state }), e.enableCallsite && !o.__internal?.isReplay && (o.callsite = j(4)), e.enableEnvInfo && !o.__internal?.isReplay && (o.env = V(e)), e.enableStateSnapshot && !o.__internal?.isReplay) {
    const a = _(e);
    a && (o.state = { ...o.state, ...a });
  }
  if (e.enableCausalLinks && !o.__internal?.isReplay) {
    const a = K(s.scope, t);
    a && (o.previousEventId = a);
  }
  return o;
}
var U = class {
  constructor(e, t) {
    this.logger = e, this.config = t, this.circuitBreaker = new I(
      {
        ...E,
        enabled: t.circuitBreaker?.enabled ?? false,
        ...t.circuitBreaker
      },
      {
        onOpen: () => {
          this.logger.warn(
            "WatcherEngine circuit breaker opened: too many errors",
            {
              tags: ["watcher", "circuit-breaker"]
            }
          );
        },
        onClose: () => {
          this.logger.info("WatcherEngine circuit breaker closed: recovered", {
            tags: ["watcher", "circuit-breaker"]
          });
        }
      }
    );
  }
  watchers = /* @__PURE__ */ new Map();
  whenHandlers = /* @__PURE__ */ new Map();
  circuitBreaker;
  disposed = false;
  watch(e, t) {
    if (this.disposed)
      throw new Error("WatcherEngine has been disposed");
    const i = this.generateId(), r = typeof e == "function" ? e : () => e, n = {
      id: i,
      getValue: r,
      label: t,
      lastValue: void 0,
      errorCount: 0,
      disposed: false
    }, o = () => {
      if (!(n.disposed || this.disposed))
        try {
          this.circuitBreaker.executeSync(() => {
            const f = r();
            if (!g(f, n.lastValue)) {
              const c = t || `watch_${i}`;
              let l;
              if (typeof f == "object" && f !== null)
                l = `${c}: state changed`;
              else {
                const u = this.formatValue(n.lastValue), d = this.formatValue(f);
                l = `${c}: ${u} -> ${d}`;
              }
              this.logger.info(l, {
                tags: ["watch"],
                state: {
                  [`${c}_prev`]: p(n.lastValue),
                  [`${c}_current`]: p(f)
                }
              }), n.lastValue = p(f);
            }
            n.errorCount = 0;
          });
        } catch (f) {
          n.errorCount++, (n.errorCount <= 3 || n.errorCount % 10 === 0) && this.logger.error(
            `Watch error for ${t || i} (count: ${n.errorCount})`,
            {
              tags: ["watch", "error"],
              state: {
                error: f instanceof Error ? f.message : String(f)
              }
            }
          ), n.errorCount >= 50 && (this.logger.error(
            `Watch ${t || i} disposed due to repeated errors`,
            {
              tags: ["watch", "error", "auto-disposed"]
            }
          ), this.disposeWatcher(i));
        }
    };
    o();
    const a = setInterval(o, this.config.pollingInterval || 250);
    return n.intervalId = a, this.watchers.set(i, n), {
      dispose: () => this.disposeWatcher(i)
    };
  }
  when(e, t, i) {
    if (this.disposed)
      throw new Error("WatcherEngine has been disposed");
    const r = this.generateId(), n = typeof e == "function" ? e : () => e, o = {
      id: r,
      getValue: n,
      predicate: t,
      onTrigger: i,
      lastValue: void 0,
      intervalId: null,
      errorCount: 0,
      disposed: false
    }, f = setInterval(() => {
      if (!(o.disposed || this.disposed))
        try {
          this.circuitBreaker.executeSync(() => {
            const c = n(), l = o.lastValue !== void 0 ? p(o.lastValue) : void 0, u = p(c);
            t(l, u) && i(u, l), o.lastValue = u, o.errorCount = 0;
          });
        } catch (c) {
          o.errorCount++, (o.errorCount <= 3 || o.errorCount % 10 === 0) && this.logger.error(
            `When condition error for ${r} (count: ${o.errorCount})`,
            {
              tags: ["when", "error"],
              state: {
                error: c instanceof Error ? c.message : String(c)
              }
            }
          ), o.errorCount >= 50 && (this.logger.error(
            `When handler ${r} disposed due to repeated errors`,
            {
              tags: ["when", "error", "auto-disposed"]
            }
          ), this.disposeWhenHandler(r));
        }
    }, this.config.pollingInterval || 250);
    return o.intervalId = f, this.whenHandlers.set(r, o), {
      dispose: () => this.disposeWhenHandler(r)
    };
  }
  disposeWatcher(e) {
    const t = this.watchers.get(e);
    t && (t.disposed = true, t.intervalId && clearInterval(t.intervalId), this.watchers.delete(e));
  }
  disposeWhenHandler(e) {
    const t = this.whenHandlers.get(e);
    t && (t.disposed = true, t.intervalId && clearInterval(t.intervalId), this.whenHandlers.delete(e));
  }
  generateId() {
    return Math.random().toString(36).substring(2, 11);
  }
  formatValue(e) {
    return e === void 0 ? "undefined" : e === null ? "null" : typeof e == "string" ? `"${e}"` : typeof e == "number" || typeof e == "boolean" ? String(e) : Array.isArray(e) ? `Array(${e.length})` : typeof e == "object" ? `Object(${Object.keys(e).length} keys)` : String(e);
  }
  /**
   * Get the number of active watchers
   */
  getWatcherCount() {
    return this.watchers.size + this.whenHandlers.size;
  }
  /**
   * Get circuit breaker state
   */
  getCircuitState() {
    return this.circuitBreaker.getState();
  }
  /**
   * Dispose all watchers and clean up
   */
  dispose() {
    this.disposed || (this.disposed = true, this.watchers.forEach((e) => {
      e.disposed = true, e.intervalId && clearInterval(e.intervalId);
    }), this.whenHandlers.forEach((e) => {
      e.disposed = true, e.intervalId && clearInterval(e.intervalId);
    }), this.watchers.clear(), this.whenHandlers.clear());
  }
  /**
   * Check if the engine has been disposed
   */
  isDisposed() {
    return this.disposed;
  }
};
var q = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
var v = class _v {
  constructor(e, t, i, r) {
    if (this.scope = e, this.config = t, this.bus = i, this.lastEventId = r, this.watcherEngine = new U(this, t), this.levelSeverities = { ...q }, t.customLevels)
      for (const n of t.customLevels)
        this.levelSeverities[n.name] = n.severity;
  }
  inheritedTags = [];
  inheritedCause;
  inheritedCauseEventId;
  watcherEngine;
  disposed = false;
  levelSeverities;
  event(e, t) {
    this.log("info", e, t);
  }
  info(e, t) {
    this.log("info", e, t);
  }
  warn(e, t) {
    this.log("warn", e, t);
  }
  error(e, t) {
    this.log("error", e, t);
  }
  debug(e, t) {
    this.log("debug", e, t);
  }
  /**
   * Log with any level (built-in or custom)
   */
  log(e, t, i) {
    if (this.disposed) {
      console.warn(
        `Attempted to log on disposed logger (scope: ${this.scope})`
      );
      return;
    }
    e in this.levelSeverities || (console.warn(`Unknown log level: ${e}, defaulting to info`), e = "info");
    const r = this.config.logLevel || "info", n = this.levelSeverities[r] ?? 1;
    if ((this.levelSeverities[e] ?? 1) < n)
      return;
    const a = G(
      {
        level: e,
        scope: this.scope,
        message: t,
        options: i,
        inheritedTags: this.inheritedTags,
        inheritedCause: this.inheritedCause,
        inheritedCauseEventId: this.inheritedCauseEventId
      },
      this.config,
      this.lastEventId
    ), f = this.inheritedCauseEventId ? [this.inheritedCauseEventId] : void 0;
    H(this.scope, a.id, f), this.lastEventId = a.id, this.bus.publish(a);
  }
  tag(...e) {
    const t = new _v(
      this.scope,
      this.config,
      this.bus,
      this.lastEventId
    );
    return t.inheritedTags = [...this.inheritedTags, ...e], t.inheritedCause = this.inheritedCause, t.inheritedCauseEventId = this.inheritedCauseEventId, t;
  }
  causedBy(e) {
    const t = new _v(
      this.scope,
      this.config,
      this.bus,
      this.lastEventId
    );
    return t.inheritedTags = [...this.inheritedTags], typeof e == "string" ? t.inheritedCause = e : (t.inheritedCause = e.message, t.inheritedCauseEventId = e.id), t;
  }
  watch(e, t) {
    if (this.disposed)
      throw new Error(
        `Cannot create watch on disposed logger (scope: ${this.scope})`
      );
    return this.watcherEngine.watch(e, t);
  }
  when(e, t, i) {
    if (this.disposed)
      throw new Error(
        `Cannot create when handler on disposed logger (scope: ${this.scope})`
      );
    return this.watcherEngine.when(e, t, i);
  }
  /**
   * Get the number of active watchers on this logger
   */
  getWatcherCount() {
    return this.watcherEngine.getWatcherCount();
  }
  /**
   * Dispose this logger and all its watchers
   */
  dispose() {
    this.disposed || (this.disposed = true, this.watcherEngine.dispose());
  }
  /**
   * Check if this logger has been disposed
   */
  isDisposed() {
    return this.disposed;
  }
};
var S = ["debug", "info", "warn", "error"];
function D(s) {
  const e = [], t = [];
  if (s.enableCallsite !== void 0 && typeof s.enableCallsite != "boolean" && e.push("enableCallsite must be a boolean"), s.enableEnvInfo !== void 0 && typeof s.enableEnvInfo != "boolean" && e.push("enableEnvInfo must be a boolean"), s.enableStateSnapshot !== void 0 && typeof s.enableStateSnapshot != "boolean" && e.push("enableStateSnapshot must be a boolean"), s.enableCausalLinks !== void 0 && typeof s.enableCausalLinks != "boolean" && e.push("enableCausalLinks must be a boolean"), s.stateSelectors !== void 0 && (Array.isArray(s.stateSelectors) ? s.stateSelectors.forEach((i, r) => {
    typeof i != "function" && e.push(`stateSelectors[${r}] must be a function`);
  }) : e.push("stateSelectors must be an array")), s.maxBufferSize !== void 0 && (typeof s.maxBufferSize != "number" ? e.push("maxBufferSize must be a number") : s.maxBufferSize < 1 ? e.push("maxBufferSize must be at least 1") : s.maxBufferSize > 1e5 && t.push(
    "maxBufferSize is very large (>100000), this may cause memory issues"
  )), s.logLevel !== void 0 && (S.includes(s.logLevel) || e.push(`logLevel must be one of: ${S.join(", ")}`)), s.appVersion !== void 0 && typeof s.appVersion != "string" && e.push("appVersion must be a string"), s.pollingInterval !== void 0 && (typeof s.pollingInterval != "number" ? e.push("pollingInterval must be a number") : s.pollingInterval < 10 ? e.push("pollingInterval must be at least 10ms") : s.pollingInterval < 50 && t.push(
    "pollingInterval is very low (<50ms), this may impact performance"
  )), s.rateLimiting !== void 0)
    if (typeof s.rateLimiting != "object" || s.rateLimiting === null)
      e.push("rateLimiting must be an object");
    else {
      const i = s.rateLimiting;
      i.enabled !== void 0 && typeof i.enabled != "boolean" && e.push("rateLimiting.enabled must be a boolean"), i.maxEventsPerSecond !== void 0 && (typeof i.maxEventsPerSecond != "number" ? e.push("rateLimiting.maxEventsPerSecond must be a number") : i.maxEventsPerSecond < 1 && e.push("rateLimiting.maxEventsPerSecond must be at least 1")), i.samplingRate !== void 0 && (typeof i.samplingRate != "number" ? e.push("rateLimiting.samplingRate must be a number") : (i.samplingRate < 0 || i.samplingRate > 1) && e.push("rateLimiting.samplingRate must be between 0 and 1"));
    }
  if (s.deduplication !== void 0)
    if (typeof s.deduplication != "object" || s.deduplication === null)
      e.push("deduplication must be an object");
    else {
      const i = s.deduplication;
      if (i.enabled !== void 0 && typeof i.enabled != "boolean" && e.push("deduplication.enabled must be a boolean"), i.windowMs !== void 0 && (typeof i.windowMs != "number" ? e.push("deduplication.windowMs must be a number") : i.windowMs < 100 && e.push("deduplication.windowMs must be at least 100ms")), i.fields !== void 0)
        if (!Array.isArray(i.fields))
          e.push("deduplication.fields must be an array");
        else {
          const r = ["message", "scope", "level", "tags", "state"];
          i.fields.forEach((n, o) => {
            typeof n != "string" ? e.push(`deduplication.fields[${o}] must be a string`) : r.includes(n) || e.push(
              `deduplication.fields[${o}] "${n}" is not a valid field. Valid fields: ${r.join(", ")}`
            );
          });
        }
    }
  if (s.customLevels !== void 0)
    if (!Array.isArray(s.customLevels))
      e.push("customLevels must be an array");
    else {
      const i = /* @__PURE__ */ new Set(), r = ["log", "event"];
      s.customLevels.forEach((n, o) => {
        typeof n.name != "string" || n.name.trim() === "" ? e.push(`customLevels[${o}].name must be a non-empty string`) : (i.has(n.name) && e.push(
          `customLevels[${o}].name "${n.name}" is a duplicate`
        ), i.add(n.name), r.includes(n.name.toLowerCase()) && e.push(
          `customLevels[${o}].name "${n.name}" is a reserved method name`
        ), S.includes(n.name) && t.push(
          `customLevels[${o}].name "${n.name}" shadows a built-in level`
        )), typeof n.severity != "number" && e.push(`customLevels[${o}].severity must be a number`);
      });
    }
  return {
    valid: e.length === 0,
    errors: e,
    warnings: t
  };
}
var J = class {
  buffer = [];
  flushTimer = null;
  config;
  constructor(e) {
    this.config = e, e.enabled && e.flushInterval && this.startAutoFlush();
  }
  /**
   * Add an entry to the persistence buffer
   */
  add(e) {
    this.config.enabled && (this.buffer.push(e), this.config.batchSize && this.buffer.length >= this.config.batchSize && this.flush());
  }
  /**
   * Flush the buffer to the adapter
   */
  async flush() {
    if (this.buffer.length === 0) return;
    const e = [...this.buffer];
    this.buffer = [];
    try {
      await this.config.adapter.write(e);
    } catch (t) {
      throw this.buffer.length < 1e4 && (this.buffer = [...e, ...this.buffer]), t;
    }
  }
  /**
   * Start auto-flush timer
   */
  startAutoFlush() {
    this.flushTimer || (this.flushTimer = setInterval(() => {
      this.flush().catch(console.error);
    }, this.config.flushInterval));
  }
  /**
   * Stop auto-flush and close adapter
   */
  async close() {
    this.flushTimer && (clearInterval(this.flushTimer), this.flushTimer = null), await this.flush(), await this.config.adapter.close?.();
  }
  /**
   * Get buffer size
   */
  getBufferSize() {
    return this.buffer.length;
  }
};
function Ie(s = {}) {
  const e = D(s);
  if (!e.valid)
    throw new Error(
      `Invalid Satori configuration:
${e.errors.join(`
`)}`
    );
  e.warnings.length > 0 && console.warn("Satori configuration warnings:", e.warnings);
  const t = {
    ...y,
    ...s,
    // Merge nested configs properly
    rateLimiting: { ...y.rateLimiting, ...s.rateLimiting },
    deduplication: { ...y.deduplication, ...s.deduplication },
    circuitBreaker: {
      ...y.circuitBreaker,
      ...s.circuitBreaker
    }
  }, i = new R({
    maxBufferSize: t.maxBufferSize,
    rateLimiting: t.rateLimiting,
    deduplication: t.deduplication,
    circuitBreaker: t.circuitBreaker,
    enableMetrics: t.enableMetrics
  });
  !(typeof process < "u" && process.env?.NODE_ENV === "test") && t.enableConsole !== false && typeof console < "u" && i.subscribe((l) => {
    const u = l.level;
    (console[u === "debug" ? "log" : u] ?? console.log)(`[${l.scope}] ${l.message}`, l);
  });
  const n = new v("root", t, i), o = /* @__PURE__ */ new Map();
  o.set("root", n);
  let a = null;
  t.persistence?.enabled && (a = new J(t.persistence), i.subscribe((l) => {
    a?.add(l);
  }));
  const f = new C(), c = Date.now();
  return {
    config: t,
    bus: i,
    rootLogger: n,
    createLogger(l) {
      const u = new v(l, t, i);
      return o.set(l, u), f.setLoggerCount(o.size), u;
    },
    getMetrics() {
      let l = 0;
      for (const u of o.values())
        u.isDisposed() || (l += u.getWatcherCount());
      return f.setWatcherCount(l), {
        bus: i.getMetrics(),
        loggerCount: o.size,
        watcherCount: l,
        circuitState: i.getCircuitBreaker().getState(),
        uptime: Date.now() - c
      };
    },
    async flush() {
      a && await a.flush();
    },
    dispose() {
      for (const u of o.values())
        u.dispose();
      o.clear();
      const l = i.getReplayBuffer?.();
      l && (l.length = 0), i.reset(), a && a.close().catch(console.error);
    }
  };
}

// src/logger.ts
var satori = Ie({
  logLevel: "info",
  rateLimiting: { enabled: true, maxEventsPerSecond: 100 }
});
var mainLogger = satori.createLogger("tamaru:main");
var physicsLogger = satori.createLogger("tamaru:physics");
var scrollLogger = satori.createLogger("tamaru:scroll");
var interactionLogger = satori.createLogger("tamaru:interaction");
var stickLogger = satori.createLogger("tamaru:stick");
satori.bus.subscribe((event) => {
  const meta = event.state ? `
> State: ${JSON.stringify(event.state)}` : "";
  if (event.level === "error") {
    console.error(
      `[${event.level.toUpperCase()}] ${event.scope}: ${event.message}${meta}`
    );
  } else if (event.level === "warn") {
    console.warn(
      `[${event.level.toUpperCase()}] ${event.scope}: ${event.message}${meta}`
    );
  } else {
    console.log(
      `[${event.level.toUpperCase()}] ${event.scope}: ${event.message}${meta}`
    );
  }
});

// styles/styles.css
var styles_default = `#vt-widget-container {
    position: fixed;
    z-index: 999999;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    pointer-events: none;
    transition: left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), width 0.3s ease, height 0.3s ease;
}

#vt-widget-container.is-dragging {
    transition: width 0.3s ease, height 0.3s ease !important;
}

#vt-controls {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0px) scale(0.8);
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
    z-index: 20;
}

#vt-trackball-area,
#vt-controls,
#vt-controls .vt-btn,
#vt-viewport,
#vt-mini-icon {
    pointer-events: auto;
}

#vt-controls.vt-controls-visible {
    opacity: 1;
    transform: translate(-50%, -36px) scale(1);
    pointer-events: auto;
}

#vt-widget-container.vt-stick-mode {
    left: 50vw !important;
    top: 50vh !important;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 99999999;
}

#vt-widget-container.vt-stick-mode #vt-controls {
    display: none !important;
}

.vt-btn {
    width: 30px;
    height: 30px;
    background: #1e293b;
    color: #fff;
    border: 1px solid #475569;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

#vt-drag-handle {
    cursor: grab;
}

#vt-drag-handle:active {
    cursor: grabbing;
}

#vt-trackball-area {
    position: relative;
    width: 120px;
    height: 120px;
    background: #1a1a1a;
    border-radius: 50%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.1), inset 0 -2px 5px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

#vt-viewport {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    z-index: 10;
    cursor: grab;
    touch-action: none;
}

#vt-viewport:active {
    cursor: grabbing;
}

#vt-sphere {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--vt-sphereColor);
}

#vt-texture {
    position: absolute;
    top: -50px;
    left: -50px;
    right: -50px;
    bottom: -50px;
    background-color: var(--vt-textureColor);
    /* I know inline SVG bad but i want to bundle everything in one file 
    and this is the only way to do it without adding extra files 
    or like vite shenanigans */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.3'/%3E%3C/svg%3E");
    background-size: 150px 150px;
    background-position: 0px 0px;
    transition: background-position 0.1s linear;
}

#vt-shading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle at 30px 30px, var(--vt-shadingLight) 0%, transparent 50%, var(--vt-shadingDark) 100%);
    box-shadow: inset -10px -10px 20px var(--vt-shadingDark), inset 0 0 10px var(--vt-shadingDark), inset 5px 5px 10px var(--vt-shadingLight);
}

#vt-widget-container.vt-mini {
    width: 48px;
    height: 48px;
}

#vt-widget-container.vt-mini #vt-trackball-area {
    width: 48px;
    height: 48px;
    cursor: pointer;
}

#vt-widget-container.vt-mini #vt-sphere,
#vt-widget-container.vt-mini #vt-viewport {
    display: none;
}

#vt-mini-icon {
    display: none;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle at 30% 30%, var(--vt-miniIcon), var(--vt-sphereColor));
    border-radius: 50%;
    box-shadow: 0 0 8px var(--vt-glow), inset -2px -2px 4px rgba(0, 0, 0, 0.5);
}

#vt-widget-container.vt-mini #vt-mini-icon {
    display: block;
}`;

// src/domManager.ts
function createWidgetContainer() {
  const container = document.createElement("div");
  container.id = "vt-widget-container";
  container.innerHTML = `
    <div id="vt-controls">
      <div id="vt-stick-btn" class="vt-btn" title="Stick to Cursor">\u2316</div>
      <div id="vt-drag-handle" class="vt-btn" title="Drag to move">\u2725</div>
      <div id="vt-toggle-btn" class="vt-btn" title="Toggle Size">-</div>
    </div>
    <div id="vt-trackball-area">
      <div id="vt-sphere">
        <div id="vt-texture"></div>
        <div id="vt-shading"></div>
      </div>
      <div id="vt-viewport"></div>
      <div id="vt-mini-icon"></div>
    </div>
  `;
  return container;
}
function injectStyleTag(styles) {
  if (!document.getElementById("vt-styles")) {
    const style = document.createElement("style");
    style.id = "vt-styles";
    style.textContent = styles;
    document.head.appendChild(style);
  }
  if (!document.getElementById("vt-scrollbar-hide")) {
    const hideStyle = document.createElement("style");
    hideStyle.id = "vt-scrollbar-hide";
    hideStyle.textContent = `
      [data-vt-hide-scrollbar="1"] {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      [data-vt-hide-scrollbar="1"]::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
        display: none !important;
        background: transparent;
      }
    `;
    document.head.appendChild(hideStyle);
  }
}

// src/trackball.ts
function applyMovement(state, dx, dy, scrollCallback, updateTexture2, sensitivity = 1.8) {
  const scrollSensitivity = sensitivity;
  scrollCallback(-dx * scrollSensitivity, -dy * scrollSensitivity);
  state.texPosX += dx * 1.5;
  state.texPosY += dy * 1.5;
  updateTexture2(Math.round(state.texPosX), Math.round(state.texPosY));
}
function updatePhysics(state, movementFn) {
  if (Math.abs(state.velX) >= 0.1 || Math.abs(state.velY) >= 0.1) {
    state.velX *= state.friction;
    state.velY *= state.friction;
    if (Math.abs(state.velX) < 0.1) state.velX = 0;
    if (Math.abs(state.velY) < 0.1) state.velY = 0;
    if (state.velX !== 0 || state.velY !== 0)
      movementFn(state.velX, state.velY);
  }
}
function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}
function snapToEdge(currentLeft, currentTop, containerRect, windowWidth, windowHeight, margin = 24, snapDist = 80) {
  const maxLeft = windowWidth - containerRect.width - margin;
  const maxTop = windowHeight - containerRect.height - margin;
  let left = currentLeft;
  let top = currentTop;
  if (left < snapDist) left = margin;
  if (left > maxLeft - snapDist + margin) left = maxLeft;
  if (top < snapDist) top = margin;
  if (top > maxTop - snapDist + margin) top = maxTop;
  left = clamp(left, margin, maxLeft);
  top = clamp(top, margin, maxTop);
  return { left, top };
}

// src/types.ts
var DEFAULT_CONFIG = {
  sound: false,
  rollSoundLevel: 0.45,
  haptics: false,
  theme: "default",
  customTheme: {},
  scrollMode: "page",
  scrollFallback: "document",
  scrollFallbackContainer: "",
  friction: 0.92,
  sensitivity: 1.8,
  snapDistance: 80,
  size: 120,
  stickMode: true,
  stickModeTargetCycleKey: "Shift",
  stickModeCycleSnap: true
};

// themes/default.json
var default_default = {
  name: "Default",
  author: "NellowTCS",
  desc: "Standard blue theme for Tamaru.",
  sphereColor: "#0b3d6e",
  textureColor: "#1e5ba3",
  shadingLight: "rgba(255,255,255,0.5)",
  shadingDark: "rgba(0,0,0,0.8)",
  glow: "#5cabff",
  miniIcon: "#5cabff"
};

// themes/aqua.json
var aqua_default = {
  name: "Aqua",
  author: "NellowTCS",
  desc: "Aqua (macOS-like) theme.",
  sphereColor: "#1ca9e6",
  textureColor: "#5fd0ff",
  shadingLight: "rgba(255,255,255,0.6)",
  shadingDark: "rgba(0,0,0,0.7)",
  glow: "#aefbff",
  miniIcon: "#aefbff"
};

// themes/red.json
var red_default = {
  name: "Red",
  author: "NellowTCS",
  desc: "Red accent theme.",
  sphereColor: "#b91c1c",
  textureColor: "#f87171",
  shadingLight: "rgba(255,255,255,0.5)",
  shadingDark: "rgba(0,0,0,0.8)",
  glow: "#ffb4b4",
  miniIcon: "#ffb4b4"
};

// themes/glossy.json
var glossy_default = {
  name: "Glossy",
  author: "NellowTCS",
  desc: "Glossy light theme.",
  sphereColor: "#f2f4f8",
  textureColor: "#c8d0da",
  shadingLight: "rgba(255,255,255,0.95)",
  shadingDark: "rgba(8,16,30,0.64)",
  glow: "#f8fbff",
  miniIcon: "#ffffff"
};

// themes/metal.json
var metal_default = {
  name: "Metal",
  author: "NellowTCS",
  desc: "Metallic gray theme.",
  sphereColor: "#757575",
  textureColor: "#b0b0b0",
  shadingLight: "rgba(255,255,255,0.7)",
  shadingDark: "rgba(0,0,0,0.7)",
  glow: "#e0e0e0",
  miniIcon: "#e0e0e0"
};

// themes/neon.json
var neon_default = {
  name: "Neon",
  author: "NellowTCS",
  desc: "Neon theme.",
  sphereColor: "#101a3a",
  textureColor: "#1f2e66",
  shadingLight: "rgba(120,255,250,0.72)",
  shadingDark: "rgba(1,7,23,0.92)",
  glow: "#2ffcff",
  miniIcon: "#6dff88"
};

// themes/sunset.json
var sunset_default = {
  name: "Sunset",
  author: "NellowTCS",
  desc: "Dusk and sunset theme.",
  sphereColor: "#5f2d20",
  textureColor: "#c4542d",
  shadingLight: "rgba(255,220,170,0.62)",
  shadingDark: "rgba(33,12,8,0.86)",
  glow: "#ffb46a",
  miniIcon: "#ffd4ad"
};

// src/themeLoader.ts
var themes = {
  default: default_default,
  aqua: aqua_default,
  red: red_default,
  glossy: glossy_default,
  metal: metal_default,
  neon: neon_default,
  sunset: sunset_default
};
function updateTexture(texture, x2, y2) {
  texture.style.backgroundPosition = `${x2}px ${y2}px`;
}

// src/scrollEngine.ts
function markScrollbarHidden(el) {
  if (!el) return;
  el.setAttribute("data-vt-hide-scrollbar", "1");
}
function doSnapToEdge(container, currentLeft, currentTop, feedback2, snapDistance) {
  const rect = container.getBoundingClientRect();
  const pos = snapToEdge(
    currentLeft,
    currentTop,
    rect,
    window.innerWidth,
    window.innerHeight,
    24,
    typeof snapDistance === "number" ? snapDistance : void 0
  );
  container.style.left = pos.left + "px";
  container.style.top = pos.top + "px";
  feedback2("snap");
  return pos;
}
function isElementScrollable(el) {
  if (el === document.body || el === document.documentElement) {
    return document.body.scrollHeight > window.innerHeight || document.documentElement.scrollHeight > window.innerHeight || document.body.scrollWidth > window.innerWidth || document.documentElement.scrollWidth > window.innerWidth;
  }
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;
  if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight - el.clientHeight > 1) {
    return true;
  }
  if ((overflowX === "auto" || overflowX === "scroll") && el.scrollWidth - el.clientWidth > 1) {
    return true;
  }
  return false;
}
var cachedScrollableElements = null;
var domObserver = null;
function clearScrollableCache() {
  cachedScrollableElements = null;
}
function getAllScrollableElements() {
  if (cachedScrollableElements) {
    return cachedScrollableElements;
  }
  if (!domObserver && typeof window !== "undefined") {
    domObserver = new MutationObserver(clearScrollableCache);
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    });
  }
  const elements = document.querySelectorAll("*");
  const scrollableElements = [];
  elements.forEach((el) => {
    if (el instanceof HTMLElement && isElementScrollable(el)) {
      scrollableElements.push(el);
    }
  });
  cachedScrollableElements = scrollableElements;
  return scrollableElements;
}
function cycleScrollableTarget(dx, dy, currentTarget) {
  const scrollableElements = getAllScrollableElements();
  if (scrollableElements.length === 0) return null;
  let currentIndex = scrollableElements.findIndex((el) => el === currentTarget);
  if (currentIndex === -1) {
    currentIndex = -1;
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      currentIndex = (currentIndex + 1) % scrollableElements.length;
    } else {
      currentIndex = currentIndex <= 0 ? scrollableElements.length - 1 : currentIndex - 1;
    }
  } else {
    if (dy > 0) {
      currentIndex = (currentIndex + 1) % scrollableElements.length;
    } else {
      currentIndex = currentIndex <= 0 ? scrollableElements.length - 1 : currentIndex - 1;
    }
  }
  const target = scrollableElements[currentIndex];
  scrollableElements.forEach((el) => {
    if (el.style) el.style.boxShadow = "";
  });
  if (target && target.style)
    target.style.boxShadow = "inset 0 0 0 2px rgba(0, 150, 255, 0.7)";
  setTimeout(() => {
    if (target && target.style) target.style.boxShadow = "";
  }, 1e3);
  return target;
}
function findNearestScrollable(el) {
  let node = el;
  while (node && node !== document.body) {
    if (isElementScrollable(node)) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}
var stickScrollTarget = null;
function setStickScrollTarget(target) {
  stickScrollTarget = target;
}
function resolveEffectiveScrollable(target, scrollFallback, scrollFallbackContainer) {
  if (stickScrollTarget) {
    return stickScrollTarget;
  }
  const nearest = findNearestScrollable(target);
  let scrollable = nearest;
  if (!scrollable) {
    if (scrollFallback === "container" && scrollFallbackContainer) {
      const el = document.querySelector(
        scrollFallbackContainer
      );
      if (el) scrollable = el;
    } else if (scrollFallback === "document") {
      scrollable = document.scrollingElement || document.documentElement;
    } else {
      scrollable = null;
    }
  }
  return scrollable;
}
function doScroll(dx, dy, mode, target, scrollFallback = "document", scrollFallbackContainer) {
  const scrollable = resolveEffectiveScrollable(
    target,
    scrollFallback,
    scrollFallbackContainer
  );
  if (!scrollable) {
    scrollLogger.warn("No scrollable target resolved. Aborting scroll.", {
      state: { dx, dy, mode, scrollFallback }
    });
    return;
  }
  markScrollbarHidden(scrollable);
  if (scrollable === document.documentElement || scrollable === document.body) {
    markScrollbarHidden(document.documentElement);
    markScrollbarHidden(document.body);
  }
  scrollLogger.debug("Executing scroll", {
    state: { dx, dy, mode, target: scrollable.tagName }
  });
  switch (mode) {
    case "page":
      if (scrollable === document.documentElement || scrollable === document.body) {
        window.scrollBy({ left: dx, top: dy, behavior: "auto" });
      } else {
        scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
      }
      break;
    case "nearest":
      scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
      break;
    case "horizontal":
      scrollable.scrollBy({ left: dx, top: 0, behavior: "auto" });
      break;
    case "momentum":
      scrollable.scrollBy({ left: dx * 2, top: dy * 2, behavior: "smooth" });
      break;
    default:
      scrollable.scrollBy({ left: dx, top: dy, behavior: "auto" });
  }
}

// src/controlsManager.ts
function setControlsVisible(controls, visible) {
  if (visible) {
    if (!controls.classList.contains("vt-controls-visible")) {
      interactionLogger.debug("Showing controls");
      controls.classList.add("vt-controls-visible");
    }
  } else {
    if (controls.classList.contains("vt-controls-visible")) {
      interactionLogger.debug("Hiding controls");
      controls.classList.remove("vt-controls-visible");
    }
  }
}
function showControls(controls, controlsHideTimeout, setControlsVisible2) {
  if (controlsHideTimeout) {
    clearTimeout(controlsHideTimeout);
    controlsHideTimeout = null;
  }
  setControlsVisible2(controls, true);
  return controlsHideTimeout;
}
function hideControlsWithDelay(container, controls, controlsHideTimeout, setControlsVisible2) {
  if (controlsHideTimeout) clearTimeout(controlsHideTimeout);
  return setTimeout(() => {
    if (!container.matches(":hover") && !controls.matches(":hover")) {
      setControlsVisible2(controls, false);
    }
  }, 350);
}

// node_modules/tactus/dist/index.mjs
var HAPTIC_ID = "___haptic-switch___";
var HAPTIC_DURATION_MS = 10;
function isIOS$1() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }
  const iOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOSDevice || iPadOS;
}
var inputElement = null;
var labelElement = null;
var isIOS = false;
function mount() {
  if (labelElement && inputElement) return;
  isIOS = isIOS$1();
  inputElement = document.querySelector(`#${HAPTIC_ID}`);
  labelElement = document.querySelector(
    `label[for="${HAPTIC_ID}"]`
  );
  if (inputElement && labelElement) return;
  inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = HAPTIC_ID;
  inputElement.setAttribute("switch", "");
  inputElement.style.display = "none";
  document.body.appendChild(inputElement);
  labelElement = document.createElement("label");
  labelElement.htmlFor = HAPTIC_ID;
  labelElement.style.display = "none";
  document.body.appendChild(labelElement);
}
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, {
      once: true
    });
  } else {
    mount();
  }
}
function triggerHaptic(duration = HAPTIC_DURATION_MS) {
  if (typeof window === "undefined") return;
  if (isIOS) {
    if (!inputElement || !labelElement) mount();
    labelElement?.click();
  } else {
    if (navigator?.vibrate) navigator.vibrate(duration);
    else labelElement?.click();
  }
}

// src/hapticEngine.ts
var lastHapticAt = 0;
function isIOSLike() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  return /iPad|iPhone|iPod/i.test(ua) || platform === "MacIntel" && maxTouchPoints > 1;
}
function triggerHaptic2(event) {
  if (typeof document !== "undefined" && document.hidden) return;
  const minGapMs = event === "spin" ? 120 : 35;
  const now = performance.now();
  if (now - lastHapticAt < minGapMs) return;
  lastHapticAt = now;
  const patterns = {
    grab: 40,
    release: 25,
    snap: 50,
    spin: 80,
    stop: 30
  };
  const p2 = patterns[event];
  const duration = typeof p2 === "number" ? p2 : p2[0];
  try {
    if (!isIOSLike() && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(duration);
      return;
    }
    triggerHaptic(duration);
  } catch {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(duration);
    }
  }
}

// src/sound.ts
var SPIN_MIN_INTERVAL_MS = 22;
var SOUND_VAR = 0.12;
var AudioEngine = class {
  ctx = null;
  masterGain = null;
  compressor = null;
  noiseBuf = null;
  rollingBuf = null;
  // Rolling continuous sub-graph
  rollSrc = null;
  rollMidFilt = null;
  rollHiFilt = null;
  rollShaper = null;
  rollGain = null;
  rollFadeTimer = null;
  lastRollTouchAt = 0;
  lastSpinAt = 0;
  rollIsActive = false;
  getContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const w = window;
      const Ctor = globalThis.AudioContext || w.webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 24;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 3e-3;
      this.compressor.release.value = 0.22;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.42;
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }
  tryResume() {
    if (this.ctx?.state === "suspended") {
      void this.ctx.resume().catch(() => {
      });
    }
  }
  out() {
    return this.compressor;
  }
  // Utilities
  appliedRandomVariation(v2, amt = SOUND_VAR) {
    return v2 * (1 + (Math.random() - 0.5) * 2 * amt);
  }
  jitterTime(t, s = 2e-3) {
    return t + (Math.random() - 0.5) * s;
  }
  clamp01(v2) {
    return Math.max(0, Math.min(1, v2));
  }
  normSpeed(s) {
    return this.clamp01((s ?? 10) / 18);
  }
  makeShaperCurve(amount) {
    const n = 256, curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x2 = i * 2 / n - 1;
      curve[i] = (Math.PI + amount) * x2 / (Math.PI + amount * Math.abs(x2));
    }
    return curve;
  }
  ensureNoiseBuf() {
    if (this.noiseBuf || !this.ctx) return this.noiseBuf;
    const len = Math.floor(this.ctx.sampleRate * 0.5);
    const b2 = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = b2.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.85 + w * 0.15;
      d[i] = w * 0.6 + lp * 0.4;
    }
    this.noiseBuf = b2;
    return b2;
  }
  ensureRollingBuf() {
    if (this.rollingBuf || !this.ctx) return this.rollingBuf;
    const len = Math.floor(this.ctx.sampleRate * 2.2);
    const b2 = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = b2.getChannelData(0);
    let lp = 0;
    let mid = 0;
    let prevMid = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.97 + w * 0.03;
      mid = mid * 0.9 + (w - lp) * 0.1;
      const hi = 0.95 * (prevMid - mid);
      prevMid = mid;
      d[i] = lp * 0.45 + mid * 0.42 + hi * 0.13;
    }
    const fade = Math.floor(this.ctx.sampleRate * 0.04);
    for (let i = 0; i < fade; i++) {
      const t = i / fade;
      d[i] *= t;
      d[len - 1 - i] *= t;
    }
    this.rollingBuf = b2;
    return b2;
  }
  env(g2, t, peak, dur, atk = 3e-3) {
    g2.gain.setValueAtTime(1e-4, t);
    g2.gain.linearRampToValueAtTime(peak, t + atk);
    g2.gain.exponentialRampToValueAtTime(1e-4, t + dur);
  }
  noiseBurst(t, dur, peak, ftype, freq, q2 = 0.9) {
    if (!this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.ensureNoiseBuf();
    const f = this.ctx.createBiquadFilter();
    f.type = ftype;
    f.frequency.value = freq;
    f.Q.value = q2;
    const g2 = this.ctx.createGain();
    this.env(g2, t, peak, dur);
    src.connect(f);
    f.connect(g2);
    g2.connect(this.out());
    src.start(t);
    src.stop(t + dur + 0.02);
  }
  toneBurst(t, dur, peak, type, f0, f1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator(), g2 = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    }
    this.env(g2, t, peak, dur, 4e-3);
    osc.connect(g2);
    g2.connect(this.out());
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }
  // Pre-configured sounds
  playGrabSound(t) {
    this.noiseBurst(
      t,
      this.appliedRandomVariation(6e-3),
      this.appliedRandomVariation(0.22),
      "highpass",
      this.appliedRandomVariation(3200),
      this.appliedRandomVariation(0.6)
    );
    this.noiseBurst(
      t + 3e-3,
      this.appliedRandomVariation(0.045),
      this.appliedRandomVariation(0.12),
      "bandpass",
      this.appliedRandomVariation(680),
      this.appliedRandomVariation(0.7)
    );
    this.toneBurst(
      this.jitterTime(t, 1e-3),
      this.appliedRandomVariation(0.075),
      this.appliedRandomVariation(0.07),
      "sine",
      this.appliedRandomVariation(145),
      this.appliedRandomVariation(90)
    );
    this.noiseBurst(
      t + 8e-3,
      this.appliedRandomVariation(0.06),
      this.appliedRandomVariation(0.055),
      "lowpass",
      this.appliedRandomVariation(280),
      this.appliedRandomVariation(0.5)
    );
  }
  playReleaseSound(t) {
    this.noiseBurst(
      t,
      this.appliedRandomVariation(5e-3),
      this.appliedRandomVariation(0.15),
      "highpass",
      this.appliedRandomVariation(2800),
      this.appliedRandomVariation(0.55)
    );
    this.noiseBurst(
      t + 3e-3,
      this.appliedRandomVariation(0.032),
      this.appliedRandomVariation(0.085),
      "bandpass",
      this.appliedRandomVariation(600),
      this.appliedRandomVariation(0.65)
    );
    this.toneBurst(
      this.jitterTime(t, 1e-3),
      this.appliedRandomVariation(0.06),
      this.appliedRandomVariation(0.04),
      "sine",
      this.appliedRandomVariation(130),
      this.appliedRandomVariation(80)
    );
  }
  playSnapSound(t) {
    this.noiseBurst(
      t,
      this.appliedRandomVariation(4e-3),
      this.appliedRandomVariation(0.35),
      "highpass",
      this.appliedRandomVariation(5e3),
      this.appliedRandomVariation(0.5)
    );
    this.noiseBurst(
      t + 1e-3,
      this.appliedRandomVariation(0.018),
      this.appliedRandomVariation(0.22),
      "bandpass",
      this.appliedRandomVariation(1800),
      this.appliedRandomVariation(1.1)
    );
    this.toneBurst(
      this.jitterTime(t, 5e-4),
      this.appliedRandomVariation(0.055),
      this.appliedRandomVariation(0.11),
      "triangle",
      this.appliedRandomVariation(380),
      this.appliedRandomVariation(160)
    );
    this.noiseBurst(
      t + 0.012,
      this.appliedRandomVariation(0.022),
      this.appliedRandomVariation(0.09),
      "bandpass",
      this.appliedRandomVariation(1100),
      this.appliedRandomVariation(0.8)
    );
  }
  playSpinTick(t, speed) {
    const fc = 380 + speed * 560 + (Math.random() - 0.5) * 180;
    const pk = 0.028 + speed * 0.038;
    this.noiseBurst(
      t,
      this.appliedRandomVariation(9e-3),
      this.appliedRandomVariation(pk),
      "bandpass",
      fc,
      this.appliedRandomVariation(1.4)
    );
    if (Math.random() < 0.35) {
      this.toneBurst(
        this.jitterTime(t, 1e-3),
        this.appliedRandomVariation(0.012),
        this.appliedRandomVariation(0.012),
        "sine",
        this.appliedRandomVariation(200 + speed * 120)
      );
    }
  }
  playStopSound(t, speed) {
    const dur = 0.08 + speed * 0.18;
    this.noiseBurst(
      t,
      this.appliedRandomVariation(dur * 0.6),
      this.appliedRandomVariation(0.08 + speed * 0.06),
      "bandpass",
      this.appliedRandomVariation(320 + speed * 140),
      this.appliedRandomVariation(0.7)
    );
    this.toneBurst(
      this.jitterTime(t, 2e-3),
      this.appliedRandomVariation(dur * 0.9),
      this.appliedRandomVariation(0.055),
      "sine",
      this.appliedRandomVariation(95 + speed * 55),
      this.appliedRandomVariation(35)
    );
    this.noiseBurst(
      t + dur * 0.3,
      this.appliedRandomVariation(dur * 0.5),
      this.appliedRandomVariation(0.035),
      "lowpass",
      this.appliedRandomVariation(180),
      this.appliedRandomVariation(0.45)
    );
    if (speed > 0.4) {
      this.noiseBurst(
        t + dur * 0.55,
        this.appliedRandomVariation(dur * 0.35),
        this.appliedRandomVariation(0.02),
        "bandpass",
        this.appliedRandomVariation(260),
        this.appliedRandomVariation(0.6)
      );
    }
  }
  // Rolling Loop Logic
  ensureRollingLayer() {
    if (this.rollSrc || !this.ctx) return;
    this.rollSrc = this.ctx.createBufferSource();
    this.rollSrc.buffer = this.ensureRollingBuf();
    this.rollSrc.loop = true;
    this.rollSrc.playbackRate.value = 1;
    this.rollMidFilt = this.ctx.createBiquadFilter();
    this.rollMidFilt.type = "bandpass";
    this.rollMidFilt.frequency.value = 620;
    this.rollMidFilt.Q.value = 0.48;
    this.rollHiFilt = this.ctx.createBiquadFilter();
    this.rollHiFilt.type = "highshelf";
    this.rollHiFilt.frequency.value = 1800;
    this.rollHiFilt.gain.value = -2;
    this.rollShaper = this.ctx.createWaveShaper();
    this.rollShaper.curve = this.makeShaperCurve(5);
    this.rollShaper.oversample = "2x";
    this.rollGain = this.ctx.createGain();
    this.rollGain.gain.value = 1e-4;
    this.rollSrc.connect(this.rollMidFilt);
    this.rollMidFilt.connect(this.rollHiFilt);
    this.rollHiFilt.connect(this.rollShaper);
    this.rollShaper.connect(this.rollGain);
    this.rollGain.connect(this.out());
    this.rollSrc.start();
  }
  setRollLevel(level, rampSec, speed, intensity) {
    if (!this.rollGain || !this.rollMidFilt || !this.rollSrc || !this.ctx)
      return;
    const t = this.ctx.currentTime;
    const scaled = this.clamp01(level) * this.clamp01(intensity) * (0.032 + speed * 0.068);
    const gainTC = Math.max(0.01, rampSec * 0.45);
    const rateTC = Math.max(0.015, rampSec * 0.38);
    const freqTC = Math.max(0.012, rampSec * 0.35);
    this.rollGain.gain.cancelScheduledValues(t);
    this.rollGain.gain.setValueAtTime(
      Math.max(this.rollGain.gain.value, 1e-4),
      t
    );
    this.rollGain.gain.setTargetAtTime(Math.max(1e-4, scaled), t, gainTC);
    this.rollSrc.playbackRate.cancelScheduledValues(t);
    this.rollSrc.playbackRate.setValueAtTime(
      this.rollSrc.playbackRate.value,
      t
    );
    this.rollSrc.playbackRate.setTargetAtTime(0.5 + speed * 0.9, t, rateTC);
    this.rollMidFilt.frequency.cancelScheduledValues(t);
    this.rollMidFilt.frequency.setValueAtTime(
      this.rollMidFilt.frequency.value,
      t
    );
    this.rollMidFilt.frequency.setTargetAtTime(360 + speed * 760, t, freqTC);
  }
  teardownRollNodes() {
    try {
      this.rollSrc?.stop();
    } catch {
    }
    this.rollGain?.disconnect();
    this.rollSrc = null;
    this.rollGain = null;
    this.rollMidFilt = null;
    this.rollHiFilt = null;
    this.rollShaper = null;
  }
  // Public methods
  touchRollingSound(speed, intensity) {
    this.lastRollTouchAt = performance.now();
    this.rollIsActive = true;
    if (this.rollFadeTimer) clearTimeout(this.rollFadeTimer);
    this.ensureRollingLayer();
    this.setRollLevel(1, 0.045 + (1 - speed) * 0.07, speed, intensity);
    const scheduleFadeCheck = (delayMs) => {
      this.rollFadeTimer = setTimeout(
        () => {
          const idleMs = performance.now() - this.lastRollTouchAt;
          if (this.rollIsActive && idleMs < 220) {
            scheduleFadeCheck(220 - idleMs + 20);
            return;
          }
          this.rollFadeTimer = null;
          if (!this.rollIsActive) this.setRollLevel(0, 0.18, speed, intensity);
        },
        Math.max(40, delayMs)
      );
    };
    scheduleFadeCheck(220);
  }
  stopRollingSound(speed, immediate, intensity) {
    this.rollIsActive = false;
    this.lastRollTouchAt = 0;
    if (this.rollFadeTimer) {
      clearTimeout(this.rollFadeTimer);
      this.rollFadeTimer = null;
    }
    if (!this.rollGain) return;
    const fadeOut = immediate ? 0.08 : 0.2 + (1 - speed) * 0.2;
    this.setRollLevel(0, fadeOut, speed, intensity);
    setTimeout(
      () => {
        if (!this.rollIsActive) this.teardownRollNodes();
      },
      (fadeOut + 0.1) * 1e3
    );
  }
  playSound(event, config, options) {
    try {
      const c = this.getContext();
      if (!c || !this.out()) return;
      this.tryResume();
      const t = c.currentTime;
      const rollScale = this.clamp01(config?.rollSoundLevel ?? 1);
      const speed = this.normSpeed(options?.speed);
      if (event === "spin") {
        this.touchRollingSound(speed, rollScale);
        const minGap = SPIN_MIN_INTERVAL_MS + (1 - speed) * 18;
        if (performance.now() - this.lastSpinAt < minGap) return;
        this.lastSpinAt = performance.now();
      }
      switch (event) {
        case "grab":
          this.playGrabSound(t);
          break;
        case "release":
          this.playReleaseSound(t);
          this.stopRollingSound(speed, true, rollScale);
          break;
        case "snap":
          this.playSnapSound(t);
          break;
        case "spin":
          this.playSpinTick(t, speed);
          break;
        case "stop":
          this.playStopSound(t, speed);
          this.stopRollingSound(speed, false, rollScale);
          break;
      }
    } catch {
    }
  }
};
var engine = new AudioEngine();
function playSound(event, config, options) {
  engine.playSound(event, config, options);
}
function feedback(event, config, options) {
  if (config.sound) playSound(event, config, options);
  if (config.haptics) triggerHaptic2(event);
}

// src/physicsEngine.ts
function createPhysicsLoop(state, isTrackballDragging, tamaruPaused, applyMovement2, updateTexture2, config, container, feedback2) {
  let wasStopped = true;
  let lastSpinFeedbackAt = 0;
  function physicsLoop() {
    if (!tamaruPaused() && !isTrackballDragging()) {
      updatePhysics(
        state,
        (dx, dy) => applyMovement2(
          state,
          dx,
          dy,
          (dx2, dy2) => doScroll(
            dx2,
            dy2,
            config.scrollMode,
            container,
            config.scrollFallback,
            config.scrollFallbackContainer
          ),
          updateTexture2,
          config.sensitivity
        )
      );
      const speed = Math.hypot(state.velX || 0, state.velY || 0);
      if (speed > 0.8) {
        const now = performance.now();
        if (now - lastSpinFeedbackAt >= 95) {
          lastSpinFeedbackAt = now;
          feedback2("spin", speed);
        }
      }
      const stopped = state.velX === 0 && state.velY === 0;
      if (stopped && !wasStopped) {
        physicsLogger.debug("Physics engine stopped spinning");
        feedback2("stop");
      } else if (!stopped && wasStopped) {
        physicsLogger.debug("Physics engine started spinning", {
          state: { velX: state.velX, velY: state.velY }
        });
      }
      wasStopped = stopped;
    }
    requestAnimationFrame(physicsLoop);
  }
  return physicsLoop;
}

// src/stickMode.ts
function setupStickMode(stickBtn, container, options) {
  let isPointerLocked = false;
  const onMouseMove = (e) => {
    if (!isPointerLocked) return;
    options.onMove(e);
  };
  const onMouseWheel = (e) => {
    if (!isPointerLocked) return;
    options.onWheel(e);
  };
  const onPointerLockChange = () => {
    if (document.pointerLockElement === container) {
      stickLogger.info("Pointer locked. Stick mode activated.");
      isPointerLocked = true;
      document.addEventListener("mousemove", onMouseMove, false);
      document.addEventListener("wheel", onMouseWheel, { passive: false });
      options.onEnter();
    } else {
      stickLogger.info("Pointer unlocked. Stick mode deactivated.");
      isPointerLocked = false;
      document.removeEventListener("mousemove", onMouseMove, false);
      document.removeEventListener("wheel", onMouseWheel, false);
      options.onExit();
    }
  };
  document.addEventListener("pointerlockchange", onPointerLockChange, false);
  stickBtn.addEventListener("click", () => {
    if (document.pointerLockElement !== container) {
      if (typeof container.requestPointerLock !== "function") {
        stickLogger.warn("Pointer lock not supported on this device/browser.");
        return;
      }
      try {
        container.requestPointerLock();
      } catch (err) {
        stickLogger.error("Failed to request pointer lock", {
          state: { error: err }
        });
      }
    } else {
      document.exitPointerLock();
    }
  });
  return () => {
    document.removeEventListener(
      "pointerlockchange",
      onPointerLockChange,
      false
    );
    if (isPointerLocked) {
      document.exitPointerLock();
    }
  };
}

// src/app.ts
var TamaruApp = class {
  container = null;
  config;
  state;
  animationFrame = null;
  paused = false;
  isWidgetDragging = false;
  isTrackballDragging = false;
  currentLeft = 0;
  currentTop = 0;
  startLeft = 0;
  startTop = 0;
  startMouseX = 0;
  startMouseY = 0;
  tbPrevMouseX = 0;
  tbPrevMouseY = 0;
  lastPointerSpinFeedbackAt = 0;
  controlsHideTimeout = null;
  cleanupHooks = [];
  constructor(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = { texPosX: 0, texPosY: 0, velX: 0, velY: 0, friction: 0.92 };
  }
  init() {
    if (this.container) {
      mainLogger.warn("Init called but Tamaru is already mounted. Aborting.");
      return;
    }
    mainLogger.info("Initializing Tamaru...", {
      state: { config: this.config }
    });
    this.applyTheme();
    injectStyleTag(styles_default);
    this.container = createWidgetContainer();
    document.body.appendChild(this.container);
    this.currentLeft = window.innerWidth - 120 - 24;
    this.currentTop = window.innerHeight - 120 - 24;
    this.updatePosition();
    this.bindWidgetDragging();
    this.bindMiniToggle();
    this.bindTrackball();
    this.bindStickMode();
    this.bindVisibility();
    const physicsLoop = createPhysicsLoop(
      this.state,
      () => this.isTrackballDragging,
      () => this.paused,
      applyMovement,
      (x2, y2) => this.updateTextureHandler(x2, y2),
      this.config,
      this.container,
      (event, speed) => feedback(event, this.config, { speed })
    );
    this.animationFrame = requestAnimationFrame(physicsLoop);
  }
  applyTheme() {
    const themeVars = {
      ...themes[this.config.theme] || themes["default"],
      ...this.config.customTheme
    };
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      if (key !== "name" && key !== "author" && key !== "desc")
        root.style.setProperty(`--vt-${key}`, value);
    });
  }
  updatePosition() {
    if (!this.container) return;
    this.container.style.left = this.currentLeft + "px";
    this.container.style.top = this.currentTop + "px";
  }
  snapToEdgeHandler = () => {
    if (!this.container) return;
    const pos = doSnapToEdge(
      this.container,
      this.currentLeft,
      this.currentTop,
      (ev) => feedback(ev, this.config),
      this.config.snapDistance
    );
    this.currentLeft = pos.left;
    this.currentTop = pos.top;
  };
  bindWidgetDragging() {
    const handle = this.container.querySelector(
      "#vt-drag-handle"
    );
    handle.addEventListener("pointerdown", (e) => {
      this.isWidgetDragging = true;
      this.container.classList.add("is-dragging");
      this.startMouseX = e.clientX;
      this.startMouseY = e.clientY;
      this.startLeft = this.currentLeft;
      this.startTop = this.currentTop;
      handle.setPointerCapture(e.pointerId);
      e.stopPropagation();
      feedback("grab", this.config);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!this.isWidgetDragging) return;
      this.currentLeft = this.startLeft + (e.clientX - this.startMouseX);
      this.currentTop = this.startTop + (e.clientY - this.startMouseY);
      this.updatePosition();
    });
    handle.addEventListener("pointerup", (e) => {
      this.isWidgetDragging = false;
      this.container.classList.remove("is-dragging");
      handle.releasePointerCapture(e.pointerId);
      this.snapToEdgeHandler();
      feedback("release", this.config);
    });
    window.addEventListener("resize", this.snapToEdgeHandler);
    this.cleanupHooks.push(
      () => window.removeEventListener("resize", this.snapToEdgeHandler)
    );
  }
  setWidgetSize(sizePx) {
    if (!this.container) return;
    this.container.style.width = sizePx + "px";
    this.container.style.height = sizePx + "px";
    const trackballArea = this.container.querySelector(
      "#vt-trackball-area"
    );
    if (trackballArea) {
      trackballArea.style.width = sizePx + "px";
      trackballArea.style.height = sizePx + "px";
    }
    const sphere = this.container.querySelector("#vt-sphere");
    if (sphere) {
      const inner = Math.max(0, sizePx - 20);
      sphere.style.width = inner + "px";
      sphere.style.height = inner + "px";
    }
  }
  applyMiniState(mini, skipSnap = false) {
    if (!this.container) return;
    const size = this.config.size || 120;
    const targetSize = mini ? Math.max(40, Math.round(size * 0.4)) : size;
    this.container.classList.toggle("vt-mini", mini);
    const toggleBtn = this.container.querySelector(
      "#vt-toggle-btn"
    );
    if (toggleBtn) toggleBtn.textContent = mini ? "+" : "-";
    this.setWidgetSize(targetSize);
    if (!skipSnap) this.snapToEdgeHandler();
  }
  bindMiniToggle() {
    const toggleBtn = this.container.querySelector(
      "#vt-toggle-btn"
    );
    const trackballArea = this.container.querySelector(
      "#vt-trackball-area"
    );
    toggleBtn.addEventListener("click", () => {
      this.applyMiniState(!this.container.classList.contains("vt-mini"));
    });
    trackballArea.addEventListener("click", () => {
      if (this.container.classList.contains("vt-mini") && !this.container.classList.contains("vt-stick-mode")) {
        this.applyMiniState(false);
      }
    });
    const controls = this.container.querySelector(
      "#vt-controls"
    );
    const hoverIn = () => this.controlsHideTimeout = showControls(
      controls,
      this.controlsHideTimeout,
      setControlsVisible
    );
    const hoverOut = () => this.controlsHideTimeout = hideControlsWithDelay(
      this.container,
      controls,
      this.controlsHideTimeout,
      setControlsVisible
    );
    trackballArea.addEventListener("mouseenter", hoverIn);
    trackballArea.addEventListener("mouseleave", hoverOut);
    controls.addEventListener("mouseenter", hoverIn);
    controls.addEventListener("mouseleave", hoverOut);
    setControlsVisible(controls, false);
  }
  updateTextureHandler(x2, y2) {
    if (!this.container) return;
    const texture = this.container.querySelector("#vt-texture");
    updateTexture(texture, x2, y2);
  }
  bindTrackball() {
    const viewport = this.container.querySelector(
      "#vt-viewport"
    );
    viewport.addEventListener("pointerdown", (e) => {
      this.isTrackballDragging = true;
      this.tbPrevMouseX = e.clientX;
      this.tbPrevMouseY = e.clientY;
      this.state.velX = 0;
      this.state.velY = 0;
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener("pointermove", (e) => {
      if (!this.isTrackballDragging) return;
      const dx = e.clientX - this.tbPrevMouseX;
      const dy = e.clientY - this.tbPrevMouseY;
      this.state.velX = dx;
      this.state.velY = dy;
      applyMovement(
        this.state,
        dx,
        dy,
        (dx2, dy2) => doScroll(
          dx2,
          dy2,
          this.config.scrollMode,
          this.container,
          this.config.scrollFallback,
          this.config.scrollFallbackContainer
        ),
        (x2, y2) => this.updateTextureHandler(x2, y2),
        this.config.sensitivity
      );
      this.tbPrevMouseX = e.clientX;
      this.tbPrevMouseY = e.clientY;
      const speed = Math.hypot(dx, dy);
      if (speed > 10) {
        const now = performance.now();
        if (now - this.lastPointerSpinFeedbackAt >= 85) {
          this.lastPointerSpinFeedbackAt = now;
          feedback("spin", this.config, { speed });
        }
      }
    });
    viewport.addEventListener("pointerup", (e) => {
      this.isTrackballDragging = false;
      viewport.releasePointerCapture(e.pointerId);
    });
    viewport.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.state.velX += -e.deltaX * 0.2;
        this.state.velY += -e.deltaY * 0.2;
        this.state.velX = Math.max(-60, Math.min(60, this.state.velX));
        this.state.velY = Math.max(-60, Math.min(60, this.state.velY));
      },
      { passive: false }
    );
  }
  bindStickMode() {
    const stickBtn = this.container.querySelector(
      "#vt-stick-btn"
    );
    const isMobileOrCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (!this.config.stickMode || isMobileOrCoarse) {
      stickBtn.style.display = "none";
    }
    let preStickLeft = 0;
    let preStickTop = 0;
    let currentStickTarget = null;
    let lastCycleTime = 0;
    let wheelAccX = 0;
    let wheelAccY = 0;
    const CYCLE_THRESHOLD = 50;
    const cleanupStickMode = setupStickMode(stickBtn, this.container, {
      onEnter: () => {
        preStickLeft = this.currentLeft;
        preStickTop = this.currentTop;
        const size = this.config.size || 120;
        const miniSize = Math.max(40, Math.round(size * 0.4));
        this.currentLeft = (window.innerWidth - miniSize) / 2;
        this.currentTop = (window.innerHeight - miniSize) / 2;
        this.updatePosition();
        this.applyMiniState(true, true);
        this.container.classList.add("vt-stick-mode");
      },
      onExit: () => {
        this.currentLeft = preStickLeft;
        this.currentTop = preStickTop;
        this.updatePosition();
        this.container.classList.remove("vt-stick-mode");
        this.applyMiniState(false, false);
        setStickScrollTarget(null);
        currentStickTarget = null;
      },
      onMove: (e) => {
        if (!this.config.stickMode) return;
        this.state.velX += e.movementX * 0.5;
        this.state.velY += e.movementY * 0.5;
      },
      onWheel: (e) => {
        if (!this.config.stickMode) return;
        const cycleKey = this.config.stickModeTargetCycleKey || "Shift";
        const isModifierPressed = cycleKey === "Shift" && e.shiftKey || cycleKey === "Alt" && e.altKey || cycleKey === "Control" && e.ctrlKey || cycleKey === "Meta" && e.metaKey || cycleKey === "None" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey;
        if (isModifierPressed) {
          e.preventDefault();
          wheelAccX += e.deltaX;
          wheelAccY += e.deltaY;
          const now = Date.now();
          if (now - lastCycleTime > 300 && (Math.abs(wheelAccX) > CYCLE_THRESHOLD || Math.abs(wheelAccY) > CYCLE_THRESHOLD)) {
            currentStickTarget = cycleScrollableTarget(
              wheelAccX,
              wheelAccY,
              currentStickTarget
            );
            setStickScrollTarget(currentStickTarget);
            if (currentStickTarget && this.config.stickModeCycleSnap !== false) {
              currentStickTarget.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center"
              });
            }
            lastCycleTime = now;
            wheelAccX = 0;
            wheelAccY = 0;
          }
        } else {
          wheelAccX = 0;
          wheelAccY = 0;
        }
      }
    });
    this.cleanupHooks.push(cleanupStickMode);
  }
  stopInertiaAndRolling() {
    const speed = Math.hypot(this.state.velX || 0, this.state.velY || 0);
    this.state.velX = 0;
    this.state.velY = 0;
    if (speed > 0.05) feedback("stop", this.config, { speed });
  }
  bindVisibility() {
    const onVisibilityChange = () => {
      if (document.hidden) this.stopInertiaAndRolling();
    };
    const onWindowBlur = () => this.stopInertiaAndRolling();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    this.cleanupHooks.push(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
    });
  }
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    if (newConfig.theme || newConfig.customTheme) this.applyTheme();
    if (typeof newConfig.friction === "number")
      this.state.friction = this.config.friction;
    if (typeof newConfig.size === "number") {
      this.setWidgetSize(this.config.size);
      if (this.container.classList.contains("vt-mini")) {
        this.setWidgetSize(Math.max(40, Math.round(this.config.size * 0.4)));
      }
      setTimeout(this.snapToEdgeHandler, 50);
    }
  }
  destroy() {
    this.cleanupHooks.forEach((hook) => hook());
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    if (this.container) this.container.remove();
    this.container = null;
    const styleTag = document.getElementById("vt-styles");
    if (styleTag) styleTag.remove();
  }
  hide() {
    if (this.container) this.container.style.display = "none";
  }
  show() {
    if (this.container) this.container.style.display = "flex";
  }
};

// src/main.ts
var tamaruInstance = null;
function initVirtualTrackball(config) {
  if (tamaruInstance) {
    mainLogger.warn("Init called but Tamaru is already mounted. Aborting.");
    return;
  }
  tamaruInstance = new TamaruApp(config);
  tamaruInstance.init();
}
function updateVirtualTrackballConfig(newConfig) {
  if (!tamaruInstance) {
    mainLogger.warn("Failed to update config: Widget not initialized.");
    return;
  }
  mainLogger.debug("Updating config", { state: { newConfig } });
  tamaruInstance.updateConfig(newConfig);
}
function destroyVirtualTrackball() {
  if (!tamaruInstance) {
    mainLogger.warn("Destroy called but no widget is active");
    return;
  }
  mainLogger.info("Destroying widget");
  tamaruInstance.destroy();
  tamaruInstance = null;
}
function hideVirtualTrackball() {
  if (tamaruInstance) tamaruInstance.hide();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  destroyVirtualTrackball,
  hideVirtualTrackball,
  initVirtualTrackball,
  updateVirtualTrackballConfig
});
//# sourceMappingURL=main.js.map