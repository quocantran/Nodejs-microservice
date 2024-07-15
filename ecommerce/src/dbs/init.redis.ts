"use strict";

import * as redis from "redis";
import { RedisClientType } from "@redis/client";

interface RedisClientInstance {
  instanceConnect: RedisClientType;
}

let client: RedisClientInstance = {
  instanceConnect: {} as RedisClientType,
};

const handleEventConnect = async (connectionRedis: RedisClientType) => {
  await connectionRedis.connect();
  console.log("Redis connected");
};

const initRedis = () => {
  const instance = redis.createClient();
  client.instanceConnect = instance as unknown as RedisClientType;
  handleEventConnect(instance as unknown as RedisClientType);
};

const getRedis = () => {
  return client;
};

export { initRedis, getRedis };
