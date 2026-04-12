import { createSatori } from "@nisoku/satori";

// Initialize Satori
export const satori = createSatori({
  logLevel: "info",
  rateLimiting: { enabled: true, maxEventsPerSecond: 100 },
});

// Export isolated loggers for various parts of the engine
export const mainLogger = satori.createLogger("tamaru:main");
export const physicsLogger = satori.createLogger("tamaru:physics");
export const scrollLogger = satori.createLogger("tamaru:scroll");
export const interactionLogger = satori.createLogger("tamaru:interaction");
export const stickLogger = satori.createLogger("tamaru:stick");

satori.bus.subscribe((event) => {
  const meta = event.state ? `\n> State: ${JSON.stringify(event.state)}` : "";
  if (event.level === "error") {
    console.error(
      `[${event.level.toUpperCase()}] ${event.scope}: ${event.message}${meta}`,
    );
  } else if (event.level === "warn") {
    console.warn(
      `[${event.level.toUpperCase()}] ${event.scope}: ${event.message}${meta}`,
    );
  } else {
    // Only log info and debug explicitly
    console.log(
      `[${event.level.toUpperCase()}] ${event.scope}: ${event.message}${meta}`,
    );
  }
});
