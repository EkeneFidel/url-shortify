require("dotenv").config();
const redis = require("redis");
const redisClient = redis.createClient();
(async () => {
    await redisClient.connect();
})();
redisClient.on("connect", function () {
    console.log("Redis Connected!");
});

redisClient.on("error", (err) => {
    console.log("Error in the Redis Connection", err);
});

module.exports = redisClient;
