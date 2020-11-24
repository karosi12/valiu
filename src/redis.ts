const { promisify } = require("util");
import redis from "redis";
const client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});

client.on("connect", function () {
  console.log("Redis client connected");
});

export const screenshotRedis = client;
