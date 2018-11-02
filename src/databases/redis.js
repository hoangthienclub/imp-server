import { createClient } from 'redis';
import connectRedis from 'connect-redis';

module.exports = (Session) => {
  const redisClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    prefix: process.env.REDIS_PREFIX,
    disableTTL: true,
  });
  const RedisStore = connectRedis(Session);
  return new RedisStore({ client: redisClient });
};
