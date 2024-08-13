const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect(); // Connect to the Redis server

module.exports = redisClient;