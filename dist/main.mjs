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
    if (this.eventTimestamps = this.eventTimestamps.filter((r2) => t - r2 < 1e3), this.eventTimestamps.length < this.config.maxEventsPerSecond)
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
  const i = s, r2 = e;
  if (t.has(i))
    return t.get(i) === r2;
  if (t.set(i, r2), s instanceof Date && e instanceof Date)
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
    const r2 = /* @__PURE__ */ new Map();
    e.set(t, r2);
    for (const [n, o] of s)
      r2.set(p(n, e), p(o, e));
    return r2;
  }
  if (s instanceof Set) {
    const r2 = /* @__PURE__ */ new Set();
    e.set(t, r2);
    for (const n of s)
      r2.add(p(n, e));
    return r2;
  }
  if (Array.isArray(s)) {
    const r2 = [];
    e.set(t, r2);
    for (let n = 0; n < s.length; n++)
      Object.prototype.hasOwnProperty.call(s, n) && (r2[n] = p(s[n], e));
    for (const n of Object.keys(s))
      /^\d+$/.test(n) || (r2[n] = p(s[n], e));
    return r2;
  }
  const i = {};
  e.set(t, i);
  for (const r2 of Object.keys(s))
    i[r2] = p(s[r2], e);
  return i;
}
function b(s, e = /* @__PURE__ */ new WeakSet()) {
  return s === null ? "null" : s === void 0 ? "undefined" : typeof s == "string" ? `s:${s}` : typeof s == "number" ? Number.isNaN(s) ? "n:NaN" : `n:${s}` : typeof s == "boolean" ? `b:${s}` : typeof s != "object" ? String(s) : e.has(s) ? "[Circular]" : (e.add(s), s instanceof Date ? `d:${s.getTime()}` : s instanceof RegExp ? `r:${s.source}:${s.flags}` : s instanceof Map ? `m:{${Array.from(s.entries()).map(([r2, n]) => `${b(r2, e)}=>${b(n, e)}`).sort().join(",")}}` : s instanceof Set ? `set:{${Array.from(s).map((r2) => b(r2, e)).sort().join(",")}}` : Array.isArray(s) ? `a:[${s.map((r2, n) => Object.prototype.hasOwnProperty.call(s, n) ? b(r2, e) : "<empty>").join(",")}]` : `o:{${Object.entries(s).sort(([i], [r2]) => i.localeCompare(r2)).map(([i, r2]) => `${i}:${b(r2, e)}`).join(",")}}`);
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
    const r2 = this.cache.get(i);
    return r2 && t - r2.timestamp < this.config.windowMs ? (r2.count++, this.deduplicatedCount++, { isDuplicate: true, duplicateCount: r2.count }) : (this.cache.set(i, {
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
    for (const [i, r2] of this.cache.entries())
      r2.timestamp < t && (t = r2.timestamp, e = i);
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
      const r2 = this.middleware[t];
      t++, r2(e, i);
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
    const r2 = i.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) || i.match(/at\s+(.+?):(\d+):(\d+)/);
    if (r2) {
      const [, n, o, a, f] = r2;
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
    const i = s.stateSelectors[t], r2 = typeof i == "function" ? i : i.selector, n = typeof i == "function" ? `selector_${t}` : i.name || `selector_${t}`;
    try {
      const o = r2();
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
    const r2 = {
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
    this.nodes.set(e, r2), this.scopeLastEvent.set(t, e), this.globalLastEvent = e, this.nodes.size > this.maxNodes && this.pruneOldest(Math.floor(this.maxNodes * 0.1));
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
    const i = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Set(), n = (o, a) => {
      if (r2.has(o) || a > t) return;
      r2.add(o);
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
    const i = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Set(), n = (o, a) => {
      if (r2.has(o) || a > t) return;
      r2.add(o);
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
    const r2 = /* @__PURE__ */ new Set();
    for (; i && !r2.has(i); ) {
      r2.add(i), t.unshift(i);
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
    const i = this.getCauses(e), r2 = this.getEffects(e);
    return i.includes(t) || r2.includes(t);
  }
  /**
   * Get events in the same scope
   */
  getEventsByScope(e) {
    const t = [];
    for (const [i, r2] of this.nodes)
      r2.scope === e && t.push(i);
    return t;
  }
  /**
   * Prune oldest nodes to stay within memory limits
   */
  pruneOldest(e) {
    const t = Array.from(this.nodes.entries()).sort(([, i], [, r2]) => i.timestamp - r2.timestamp).slice(0, e);
    for (const [i] of t) {
      const r2 = this.nodes.get(i);
      if (r2) {
        for (const n of r2.causes) {
          const o = this.nodes.get(n);
          o && (o.effects = o.effects.filter((a) => a !== i));
        }
        for (const n of r2.effects) {
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
    for (const r2 of this.nodes.values())
      e += r2.causes.length, t += r2.effects.length;
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
  const i = O(), r2 = z(), n = [...s.inheritedTags || [], ...s.options?.tags || []], o = {
    id: i,
    timestamp: r2,
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
    const i = this.generateId(), r2 = typeof e == "function" ? e : () => e, n = {
      id: i,
      getValue: r2,
      label: t,
      lastValue: void 0,
      errorCount: 0,
      disposed: false
    }, o = () => {
      if (!(n.disposed || this.disposed))
        try {
          this.circuitBreaker.executeSync(() => {
            const f = r2();
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
    const r2 = this.generateId(), n = typeof e == "function" ? e : () => e, o = {
      id: r2,
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
            `When condition error for ${r2} (count: ${o.errorCount})`,
            {
              tags: ["when", "error"],
              state: {
                error: c instanceof Error ? c.message : String(c)
              }
            }
          ), o.errorCount >= 50 && (this.logger.error(
            `When handler ${r2} disposed due to repeated errors`,
            {
              tags: ["when", "error", "auto-disposed"]
            }
          ), this.disposeWhenHandler(r2));
        }
    }, this.config.pollingInterval || 250);
    return o.intervalId = f, this.whenHandlers.set(r2, o), {
      dispose: () => this.disposeWhenHandler(r2)
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
  constructor(e, t, i, r2) {
    if (this.scope = e, this.config = t, this.bus = i, this.lastEventId = r2, this.watcherEngine = new U(this, t), this.levelSeverities = { ...q }, t.customLevels)
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
    const r2 = this.config.logLevel || "info", n = this.levelSeverities[r2] ?? 1;
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
  if (s.enableCallsite !== void 0 && typeof s.enableCallsite != "boolean" && e.push("enableCallsite must be a boolean"), s.enableEnvInfo !== void 0 && typeof s.enableEnvInfo != "boolean" && e.push("enableEnvInfo must be a boolean"), s.enableStateSnapshot !== void 0 && typeof s.enableStateSnapshot != "boolean" && e.push("enableStateSnapshot must be a boolean"), s.enableCausalLinks !== void 0 && typeof s.enableCausalLinks != "boolean" && e.push("enableCausalLinks must be a boolean"), s.stateSelectors !== void 0 && (Array.isArray(s.stateSelectors) ? s.stateSelectors.forEach((i, r2) => {
    typeof i != "function" && e.push(`stateSelectors[${r2}] must be a function`);
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
          const r2 = ["message", "scope", "level", "tags", "state"];
          i.fields.forEach((n, o) => {
            typeof n != "string" ? e.push(`deduplication.fields[${o}] must be a string`) : r2.includes(n) || e.push(
              `deduplication.fields[${o}] "${n}" is not a valid field. Valid fields: ${r2.join(", ")}`
            );
          });
        }
    }
  if (s.customLevels !== void 0)
    if (!Array.isArray(s.customLevels))
      e.push("customLevels must be an array");
    else {
      const i = /* @__PURE__ */ new Set(), r2 = ["log", "event"];
      s.customLevels.forEach((n, o) => {
        typeof n.name != "string" || n.name.trim() === "" ? e.push(`customLevels[${o}].name must be a non-empty string`) : (i.has(n.name) && e.push(
          `customLevels[${o}].name "${n.name}" is a duplicate`
        ), i.add(n.name), r2.includes(n.name.toLowerCase()) && e.push(
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
function getAllScrollableElements() {
  const elements = document.querySelectorAll("*");
  const scrollableElements = [];
  elements.forEach((el) => {
    if (el instanceof HTMLElement && isElementScrollable(el)) {
      scrollableElements.push(el);
    }
  });
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
var audioCtx = null;
var masterGain = null;
var compressor = null;
var noiseBuf = null;
var rollingBuf = null;
var rollSrc = null;
var rollMidFilt = null;
var rollHiFilt = null;
var rollShaper = null;
var rollGain = null;
var rollFadeTimer = null;
var lastRollTouchAt = 0;
var lastSpinAt = 0;
var rollIsActive = false;
var SPIN_MIN_INTERVAL_MS = 22;
var SOUND_VAR = 0.12;
function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const w = window;
    const Ctor = globalThis.AudioContext || w.webkitAudioContext;
    if (!Ctor) return null;
    const c = new Ctor();
    audioCtx = c;
    compressor = c.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 4;
    compressor.attack.value = 3e-3;
    compressor.release.value = 0.22;
    masterGain = c.createGain();
    masterGain.gain.value = 0.42;
    compressor.connect(masterGain);
    masterGain.connect(c.destination);
  }
  return audioCtx;
}
function out() {
  return compressor;
}
function r(v2, amt = SOUND_VAR) {
  return v2 * (1 + (Math.random() - 0.5) * 2 * amt);
}
function jt(t, s = 2e-3) {
  return t + (Math.random() - 0.5) * s;
}
function clamp01(v2) {
  return Math.max(0, Math.min(1, v2));
}
function normSpeed(s) {
  return clamp01((s ?? 10) / 18);
}
function makeShaperCurve(amount) {
  const n = 256, curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x2 = i * 2 / n - 1;
    curve[i] = (Math.PI + amount) * x2 / (Math.PI + amount * Math.abs(x2));
  }
  return curve;
}
function ensureNoiseBuf(c) {
  if (noiseBuf) return noiseBuf;
  const len = Math.floor(c.sampleRate * 0.5);
  const b2 = c.createBuffer(1, len, c.sampleRate);
  const d = b2.getChannelData(0);
  let lp = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    lp = lp * 0.85 + w * 0.15;
    d[i] = w * 0.6 + lp * 0.4;
  }
  noiseBuf = b2;
  return b2;
}
function ensureRollingBuf(c) {
  if (rollingBuf) return rollingBuf;
  const len = Math.floor(c.sampleRate * 2.2);
  const b2 = c.createBuffer(1, len, c.sampleRate);
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
  const fade = Math.floor(c.sampleRate * 0.04);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    d[i] *= t;
    d[len - 1 - i] *= t;
  }
  rollingBuf = b2;
  return b2;
}
function env(g2, t, peak, dur, atk = 3e-3) {
  g2.gain.setValueAtTime(1e-4, t);
  g2.gain.linearRampToValueAtTime(peak, t + atk);
  g2.gain.exponentialRampToValueAtTime(1e-4, t + dur);
}
function noiseBurst(c, t, dur, peak, ftype, freq, q2 = 0.9) {
  const src = c.createBufferSource();
  src.buffer = ensureNoiseBuf(c);
  const f = c.createBiquadFilter();
  f.type = ftype;
  f.frequency.value = freq;
  f.Q.value = q2;
  const g2 = c.createGain();
  env(g2, t, peak, dur);
  src.connect(f);
  f.connect(g2);
  g2.connect(out());
  src.start(t);
  src.stop(t + dur + 0.02);
}
function toneBurst(c, t, dur, peak, type, f0, f1) {
  const osc = c.createOscillator(), g2 = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  if (f1 != null)
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  env(g2, t, peak, dur, 4e-3);
  osc.connect(g2);
  g2.connect(out());
  osc.start(t);
  osc.stop(t + dur + 0.02);
}
function playGrabSound(c, t) {
  noiseBurst(c, t, r(6e-3), r(0.22), "highpass", r(3200), r(0.6));
  noiseBurst(c, t + 3e-3, r(0.045), r(0.12), "bandpass", r(680), r(0.7));
  toneBurst(c, jt(t, 1e-3), r(0.075), r(0.07), "sine", r(145), r(90));
  noiseBurst(c, t + 8e-3, r(0.06), r(0.055), "lowpass", r(280), r(0.5));
}
function playReleaseSound(c, t) {
  noiseBurst(c, t, r(5e-3), r(0.15), "highpass", r(2800), r(0.55));
  noiseBurst(c, t + 3e-3, r(0.032), r(0.085), "bandpass", r(600), r(0.65));
  toneBurst(c, jt(t, 1e-3), r(0.06), r(0.04), "sine", r(130), r(80));
}
function playSnapSound(c, t) {
  noiseBurst(c, t, r(4e-3), r(0.35), "highpass", r(5e3), r(0.5));
  noiseBurst(c, t + 1e-3, r(0.018), r(0.22), "bandpass", r(1800), r(1.1));
  toneBurst(c, jt(t, 5e-4), r(0.055), r(0.11), "triangle", r(380), r(160));
  noiseBurst(c, t + 0.012, r(0.022), r(0.09), "bandpass", r(1100), r(0.8));
}
function playSpinTick(c, t, speed) {
  const fc = 380 + speed * 560 + (Math.random() - 0.5) * 180;
  const pk = 0.028 + speed * 0.038;
  noiseBurst(c, t, r(9e-3), r(pk), "bandpass", fc, r(1.4));
  if (Math.random() < 0.35) {
    toneBurst(
      c,
      jt(t, 1e-3),
      r(0.012),
      r(0.012),
      "sine",
      r(200 + speed * 120)
    );
  }
}
function playStopSound(c, t, speed) {
  const dur = 0.08 + speed * 0.18;
  noiseBurst(
    c,
    t,
    r(dur * 0.6),
    r(0.08 + speed * 0.06),
    "bandpass",
    r(320 + speed * 140),
    r(0.7)
  );
  toneBurst(
    c,
    jt(t, 2e-3),
    r(dur * 0.9),
    r(0.055),
    "sine",
    r(95 + speed * 55),
    r(35)
  );
  noiseBurst(
    c,
    t + dur * 0.3,
    r(dur * 0.5),
    r(0.035),
    "lowpass",
    r(180),
    r(0.45)
  );
  if (speed > 0.4) {
    noiseBurst(
      c,
      t + dur * 0.55,
      r(dur * 0.35),
      r(0.02),
      "bandpass",
      r(260),
      r(0.6)
    );
  }
}
function ensureRollingLayer(c) {
  if (rollSrc) return;
  rollSrc = c.createBufferSource();
  rollSrc.buffer = ensureRollingBuf(c);
  rollSrc.loop = true;
  rollSrc.playbackRate.value = 1;
  rollMidFilt = c.createBiquadFilter();
  rollMidFilt.type = "bandpass";
  rollMidFilt.frequency.value = 620;
  rollMidFilt.Q.value = 0.48;
  rollHiFilt = c.createBiquadFilter();
  rollHiFilt.type = "highshelf";
  rollHiFilt.frequency.value = 1800;
  rollHiFilt.gain.value = -2;
  rollShaper = c.createWaveShaper();
  rollShaper.curve = makeShaperCurve(5);
  rollShaper.oversample = "2x";
  rollGain = c.createGain();
  rollGain.gain.value = 1e-4;
  rollSrc.connect(rollMidFilt);
  rollMidFilt.connect(rollHiFilt);
  rollHiFilt.connect(rollShaper);
  rollShaper.connect(rollGain);
  rollGain.connect(out());
  rollSrc.start();
}
function setRollLevel(c, level, rampSec, speed, intensity) {
  if (!rollGain || !rollMidFilt || !rollSrc) return;
  const t = c.currentTime;
  const scaled = clamp01(level) * clamp01(intensity) * (0.032 + speed * 0.068);
  const gainTC = Math.max(0.01, rampSec * 0.45);
  const rateTC = Math.max(0.015, rampSec * 0.38);
  const freqTC = Math.max(0.012, rampSec * 0.35);
  rollGain.gain.cancelScheduledValues(t);
  rollGain.gain.setValueAtTime(Math.max(rollGain.gain.value, 1e-4), t);
  rollGain.gain.setTargetAtTime(Math.max(1e-4, scaled), t, gainTC);
  rollSrc.playbackRate.cancelScheduledValues(t);
  rollSrc.playbackRate.setValueAtTime(rollSrc.playbackRate.value, t);
  rollSrc.playbackRate.setTargetAtTime(0.5 + speed * 0.9, t, rateTC);
  rollMidFilt.frequency.cancelScheduledValues(t);
  rollMidFilt.frequency.setValueAtTime(rollMidFilt.frequency.value, t);
  rollMidFilt.frequency.setTargetAtTime(360 + speed * 760, t, freqTC);
}
function touchRollingSound(c, speed, intensity) {
  lastRollTouchAt = performance.now();
  rollIsActive = true;
  if (rollFadeTimer) {
    clearTimeout(rollFadeTimer);
    rollFadeTimer = null;
  }
  ensureRollingLayer(c);
  const attackSec = 0.045 + (1 - speed) * 0.07;
  setRollLevel(c, 1, attackSec, speed, intensity);
  const idleBeforeFadeMs = 220;
  const scheduleFadeCheck = (delayMs) => {
    rollFadeTimer = setTimeout(
      () => {
        const idleMs = performance.now() - lastRollTouchAt;
        if (rollIsActive && idleMs < idleBeforeFadeMs) {
          scheduleFadeCheck(idleBeforeFadeMs - idleMs + 20);
          return;
        }
        rollFadeTimer = null;
        if (!rollIsActive) setRollLevel(c, 0, 0.18, speed, intensity);
      },
      Math.max(40, delayMs)
    );
  };
  scheduleFadeCheck(idleBeforeFadeMs);
}
function stopRollingSound(c, speed, immediate, intensity) {
  rollIsActive = false;
  lastRollTouchAt = 0;
  if (rollFadeTimer) {
    clearTimeout(rollFadeTimer);
    rollFadeTimer = null;
  }
  if (!rollGain) return;
  const fadeOut = immediate ? 0.08 : 0.2 + (1 - speed) * 0.2;
  setRollLevel(c, 0, fadeOut, speed, intensity);
  const silenceMs = (fadeOut + 0.1) * 1e3;
  setTimeout(() => {
    if (!rollIsActive) teardownRollNodes();
  }, silenceMs);
}
function teardownRollNodes() {
  try {
    rollSrc?.stop();
  } catch {
  }
  rollGain?.disconnect();
  rollSrc = null;
  rollGain = null;
  rollMidFilt = null;
  rollHiFilt = null;
  rollShaper = null;
}
function tryResumeCtx(c) {
  if (c.state === "suspended") void c.resume().catch(() => {
  });
}
function playSound(event, config, options) {
  try {
    const c = getAudioContext();
    if (!c || !out() || !masterGain) return;
    tryResumeCtx(c);
    const t = c.currentTime;
    const rollScale = clamp01(config?.rollSoundLevel ?? 1);
    const speed = normSpeed(options?.speed);
    if (event === "spin") {
      touchRollingSound(c, speed, rollScale);
      const now = performance.now();
      const minGap = SPIN_MIN_INTERVAL_MS + (1 - speed) * 18;
      if (now - lastSpinAt < minGap) return;
      lastSpinAt = now;
    }
    switch (event) {
      case "grab":
        playGrabSound(c, t);
        break;
      case "release":
        playReleaseSound(c, t);
        stopRollingSound(c, speed, true, rollScale);
        break;
      case "snap":
        playSnapSound(c, t);
        break;
      case "spin":
        playSpinTick(c, t, speed);
        break;
      case "stop":
        playStopSound(c, t, speed);
        stopRollingSound(c, speed, false, rollScale);
        break;
    }
  } catch {
  }
}
function feedback(event, config, options) {
  if (config.sound) playSound(event, config, options);
  if (config.haptics) triggerHaptic2(event);
}

// src/physicsEngine.ts
function createPhysicsLoop(state, isTrackballDragging, tamaruPaused2, applyMovement2, updateTexture2, config, container, feedback2) {
  let wasStopped = true;
  let lastSpinFeedbackAt = 0;
  function physicsLoop() {
    if (!tamaruPaused2() && !isTrackballDragging()) {
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

// src/main.ts
var tamaruContainer = null;
var tamaruAnimationFrame = null;
var tamaruPaused = false;
var tamaruConfig = null;
var tamaruState = null;
var lastPointerSpinFeedbackAt = 0;
var cleanupVisibilityHandlers = null;
function applyThemeVars(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    if (key === "name" || key === "author" || key === "desc") return;
    root.style.setProperty(`--vt-${key}`, value);
  });
}
function initVirtualTrackball(config) {
  if (tamaruContainer) {
    mainLogger.warn("Init called but Tamaru is already mounted. Aborting.");
    return;
  }
  mainLogger.info("Initializing Tamaru...", { state: { config } });
  tamaruConfig = { ...DEFAULT_CONFIG, ...config };
  const themeVars = {
    ...themes[tamaruConfig.theme] || themes["default"],
    ...tamaruConfig.customTheme
  };
  applyThemeVars(themeVars);
  injectStyleTag(styles_default);
  const container = createWidgetContainer();
  document.body.appendChild(container);
  tamaruContainer = container;
  let currentLeft = window.innerWidth - 120 - 24;
  let currentTop = window.innerHeight - 120 - 24;
  container.style.left = currentLeft + "px";
  container.style.top = currentTop + "px";
  const dragHandle = container.querySelector("#vt-drag-handle");
  let isWidgetDragging = false;
  let startMouseX = 0, startMouseY = 0;
  let startLeft = 0, startTop = 0;
  dragHandle.addEventListener("pointerdown", (e) => {
    isWidgetDragging = true;
    container.classList.add("is-dragging");
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startLeft = currentLeft;
    startTop = currentTop;
    dragHandle.setPointerCapture(e.pointerId);
    e.stopPropagation();
    feedback("grab", tamaruConfig);
  });
  dragHandle.addEventListener("pointermove", (e) => {
    if (!isWidgetDragging) return;
    currentLeft = startLeft + (e.clientX - startMouseX);
    currentTop = startTop + (e.clientY - startMouseY);
    container.style.left = currentLeft + "px";
    container.style.top = currentTop + "px";
  });
  const snapToEdgeHandler = () => {
    const pos = doSnapToEdge(
      container,
      currentLeft,
      currentTop,
      (ev) => feedback(ev, tamaruConfig),
      tamaruConfig.snapDistance
    );
    currentLeft = pos.left;
    currentTop = pos.top;
  };
  dragHandle.addEventListener("pointerup", (e) => {
    isWidgetDragging = false;
    container.classList.remove("is-dragging");
    dragHandle.releasePointerCapture(e.pointerId);
    snapToEdgeHandler();
    feedback("release", tamaruConfig);
  });
  window.addEventListener("resize", snapToEdgeHandler);
  const toggleBtn = container.querySelector("#vt-toggle-btn");
  const trackballArea = container.querySelector(
    "#vt-trackball-area"
  );
  const setWidgetSize = (sizePx) => {
    container.style.width = sizePx + "px";
    container.style.height = sizePx + "px";
    trackballArea.style.width = sizePx + "px";
    trackballArea.style.height = sizePx + "px";
  };
  const applyMiniState = (mini, skipSnap = false) => {
    const size = tamaruConfig ? tamaruConfig.size : 120;
    const targetSize = mini ? Math.max(40, Math.round(size * 0.4)) : size;
    container.classList.toggle("vt-mini", mini);
    toggleBtn.textContent = mini ? "+" : "-";
    setWidgetSize(targetSize);
    if (!skipSnap) snapToEdgeHandler();
  };
  toggleBtn.addEventListener("click", () => {
    const nextMini = !container.classList.contains("vt-mini");
    applyMiniState(nextMini);
  });
  trackballArea.addEventListener("click", () => {
    if (container.classList.contains("vt-mini") && !container.classList.contains("vt-stick-mode")) {
      applyMiniState(false);
    }
  });
  const viewport = container.querySelector("#vt-viewport");
  const texture = container.querySelector("#vt-texture");
  const state = {
    texPosX: 0,
    texPosY: 0,
    velX: 0,
    velY: 0,
    friction: 0.92
  };
  let isTrackballDragging = false;
  let tbPrevMouseX = 0, tbPrevMouseY = 0;
  const updateTextureHandler = (x2, y2) => updateTexture(texture, x2, y2);
  viewport.addEventListener("pointerdown", (e) => {
    isTrackballDragging = true;
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    state.velX = 0;
    state.velY = 0;
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!isTrackballDragging) return;
    const dx = e.clientX - tbPrevMouseX;
    const dy = e.clientY - tbPrevMouseY;
    state.velX = dx;
    state.velY = dy;
    applyMovement(
      state,
      dx,
      dy,
      (dx2, dy2) => doScroll(
        dx2,
        dy2,
        tamaruConfig.scrollMode,
        container,
        tamaruConfig.scrollFallback,
        tamaruConfig.scrollFallbackContainer
      ),
      updateTextureHandler,
      tamaruConfig.sensitivity
    );
    tbPrevMouseX = e.clientX;
    tbPrevMouseY = e.clientY;
    const speed = Math.hypot(dx, dy);
    if (speed > 10) {
      const now = performance.now();
      if (now - lastPointerSpinFeedbackAt >= 85) {
        lastPointerSpinFeedbackAt = now;
        feedback("spin", tamaruConfig, { speed });
      }
    }
  });
  viewport.addEventListener("pointerup", (e) => {
    isTrackballDragging = false;
    viewport.releasePointerCapture(e.pointerId);
  });
  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      state.velX += -e.deltaX * 0.2;
      state.velY += -e.deltaY * 0.2;
      state.velX = Math.max(-60, Math.min(60, state.velX));
      state.velY = Math.max(-60, Math.min(60, state.velY));
    },
    { passive: false }
  );
  tamaruState = state;
  const physicsLoop = createPhysicsLoop(
    state,
    () => isTrackballDragging,
    () => tamaruPaused,
    applyMovement,
    updateTextureHandler,
    tamaruConfig,
    container,
    (event, speed) => feedback(event, tamaruConfig, { speed })
  );
  tamaruAnimationFrame = requestAnimationFrame(physicsLoop);
  let preStickLeft = 0;
  let preStickTop = 0;
  const stickBtn = container.querySelector("#vt-stick-btn");
  const isMobileOrCoarse = window.matchMedia("(pointer: coarse)").matches;
  if (!tamaruConfig.stickMode || isMobileOrCoarse) {
    stickBtn.style.display = "none";
  }
  const cleanupStickMode = setupStickMode(
    stickBtn,
    container,
    /* @__PURE__ */ (() => {
      let currentStickTarget = null;
      let lastCycleTime = 0;
      let wheelAccX = 0;
      let wheelAccY = 0;
      const CYCLE_THRESHOLD = 50;
      return {
        onEnter: () => {
          preStickLeft = currentLeft;
          preStickTop = currentTop;
          const size = tamaruConfig ? tamaruConfig.size : 120;
          const miniSize = Math.max(40, Math.round(size * 0.4));
          currentLeft = (window.innerWidth - miniSize) / 2;
          currentTop = (window.innerHeight - miniSize) / 2;
          container.style.left = currentLeft + "px";
          container.style.top = currentTop + "px";
          applyMiniState(true, true);
          container.classList.add("vt-stick-mode");
        },
        onExit: () => {
          currentLeft = preStickLeft;
          currentTop = preStickTop;
          container.style.left = currentLeft + "px";
          container.style.top = currentTop + "px";
          container.classList.remove("vt-stick-mode");
          applyMiniState(false, false);
          setStickScrollTarget(null);
          currentStickTarget = null;
        },
        onMove: (e) => {
          if (!tamaruConfig?.stickMode) return;
          const dx = e.movementX;
          const dy = e.movementY;
          state.velX += dx * 0.5;
          state.velY += dy * 0.5;
        },
        onWheel: (e) => {
          if (!tamaruConfig?.stickMode) return;
          const cycleKey = tamaruConfig.stickModeTargetCycleKey || "Shift";
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
              if (currentStickTarget && tamaruConfig.stickModeCycleSnap !== false) {
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
      };
    })()
  );
  const stopInertiaAndRolling = () => {
    if (!tamaruState || !tamaruConfig) return;
    const speed = Math.hypot(tamaruState.velX || 0, tamaruState.velY || 0);
    tamaruState.velX = 0;
    tamaruState.velY = 0;
    if (speed > 0.05) {
      feedback("stop", tamaruConfig, { speed });
    }
  };
  const onVisibilityChange = () => {
    if (document.hidden) stopInertiaAndRolling();
  };
  const onWindowBlur = () => {
    stopInertiaAndRolling();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("blur", onWindowBlur);
  cleanupVisibilityHandlers = () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("blur", onWindowBlur);
    cleanupStickMode();
    cleanupVisibilityHandlers = null;
  };
  const controls = container.querySelector("#vt-controls");
  let controlsHideTimeout = null;
  trackballArea.addEventListener("mouseenter", () => {
    controlsHideTimeout = showControls(
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  trackballArea.addEventListener("mouseleave", () => {
    controlsHideTimeout = hideControlsWithDelay(
      container,
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  controls.addEventListener("mouseenter", () => {
    controlsHideTimeout = showControls(
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  controls.addEventListener("mouseleave", () => {
    controlsHideTimeout = hideControlsWithDelay(
      container,
      controls,
      controlsHideTimeout,
      setControlsVisible
    );
  });
  setControlsVisible(controls, false);
}
function updateVirtualTrackballConfig(newConfig) {
  if (!tamaruContainer || !tamaruConfig) {
    mainLogger.warn("Failed to update config: Widget not initialized.");
    return;
  }
  mainLogger.debug("Updating config", { state: { newConfig } });
  Object.assign(tamaruConfig, newConfig);
  if (newConfig.theme || newConfig.customTheme) {
    const themeVars = {
      ...themes[tamaruConfig.theme] || themes["default"],
      ...tamaruConfig.customTheme
    };
    applyThemeVars(themeVars);
  }
  if (tamaruState) {
    if (typeof newConfig.friction === "number")
      tamaruState.friction = tamaruConfig.friction;
  }
  if (typeof newConfig.size === "number") {
    const size = tamaruConfig.size;
    tamaruContainer.style.width = size + "px";
    tamaruContainer.style.height = size + "px";
    const trackballArea = tamaruContainer.querySelector(
      "#vt-trackball-area"
    );
    if (trackballArea) {
      trackballArea.style.width = size + "px";
      trackballArea.style.height = size + "px";
    }
    const sphere = tamaruContainer.querySelector(
      "#vt-sphere"
    );
    if (sphere) {
      const inner = Math.max(0, size - 20);
      sphere.style.width = inner + "px";
      sphere.style.height = inner + "px";
    }
    if (tamaruContainer.classList.contains("vt-mini")) {
      const miniSize = Math.max(40, Math.round(size * 0.4));
      tamaruContainer.style.width = miniSize + "px";
      tamaruContainer.style.height = miniSize + "px";
      if (trackballArea) {
        trackballArea.style.width = miniSize + "px";
        trackballArea.style.height = miniSize + "px";
      }
    }
  }
}
function destroyVirtualTrackball() {
  if (!tamaruContainer) {
    mainLogger.warn("Destroy called but no widget is active");
    return;
  }
  mainLogger.info("Destroying widget");
  cleanupVisibilityHandlers?.();
  if (tamaruAnimationFrame !== null) {
    cancelAnimationFrame(tamaruAnimationFrame);
    tamaruAnimationFrame = null;
  }
  tamaruContainer.remove();
  tamaruContainer = null;
  const styleTag = document.getElementById("vt-styles");
  if (styleTag) styleTag.remove();
}
function hideVirtualTrackball() {
  if (tamaruContainer) tamaruContainer.style.display = "none";
}
function showVirtualTrackball() {
  if (tamaruContainer) tamaruContainer.style.display = "";
}
function pauseVirtualTrackball() {
  tamaruPaused = true;
}
function resumeVirtualTrackball() {
  tamaruPaused = false;
}
export {
  destroyVirtualTrackball,
  hideVirtualTrackball,
  initVirtualTrackball,
  pauseVirtualTrackball,
  resumeVirtualTrackball,
  showVirtualTrackball,
  updateVirtualTrackballConfig
};
//# sourceMappingURL=main.mjs.map