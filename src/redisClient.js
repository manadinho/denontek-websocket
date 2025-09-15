// redisClient.js
const { createClient } = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let client; // singleton per process

async function getRedis() {
  if (!client) {
    client = createClient({ url: REDIS_URL });
    client.on('error', (err) => console.error('Redis error:', err));

    await client.connect();
    console.log('✅ Redis connected:', REDIS_URL);

    // graceful shutdown (once)
    const shutdown = async () => {
      try { await client.quit(); } catch {}
      process.exit(0);
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  }
  return client;
}

module.exports = { getRedis };
