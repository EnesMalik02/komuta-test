import Redis from "ioredis";

declare global {
  var valkeyClient: Redis | undefined;
}

const valkeyUrl = process.env.VALKEY_URL ?? "rediss://localhost:6379";

export const cache =
  global.valkeyClient ??
  new Redis(valkeyUrl, {
    lazyConnect: true,
    tls: {
      servername: new URL(valkeyUrl).hostname,
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.valkeyClient = cache;
}

export const NOTES_CACHE_KEY = "notes:all";
