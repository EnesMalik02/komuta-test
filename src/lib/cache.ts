import Redis from "ioredis";

declare global {
  var valkeyClient: Redis | undefined;
}

export const cache =
  global.valkeyClient ??
  new Redis(process.env.VALKEY_URL as string, {
    tls: {
      servername: new URL(process.env.VALKEY_URL as string).hostname,
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.valkeyClient = cache;
}

export const NOTES_CACHE_KEY = "notes:all";
