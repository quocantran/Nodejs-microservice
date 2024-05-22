"use strict";

import * as redis from "redis";

import { promisify } from "util";
import { reservationInventory } from "../models/repositories/inventory.repo";
import config from "../configs/config.mongodb";
import { IProduct } from "../interfaces";

const redisClient = redis.createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port as number,
  },
});

redisClient.connect().then(() => {
  console.log("Redis connected");
});

const pExpire = promisify(redisClient.pExpire).bind(redisClient);

const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

export const acquireLock = async (
  producId: string,
  quantity: number,
  cartId: string
) => {
  const key = `lock_v2024_${producId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      const isReservation = await reservationInventory(
        producId,
        quantity,
        cartId
      );
      if (isReservation.modifiedCount) {
        await pExpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

export const releaseLock = async (key: string) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(key);
};

export const cachedProductData = async (key: string) => {
  const cachedData = await redisClient.get(key);
  return JSON.parse(cachedData);
};

export const setProductData = async (key: string, data: any) => {
  return await redisClient.setNX(key, JSON.stringify(data));
};

export const deleteAllKeyProduct = async () => {
  const keys = await redisClient.keys("product_*");
  if (keys.length > 0) {
    keys.forEach(async (key) => {
      await redisClient.del(key);
    });
  }
};
