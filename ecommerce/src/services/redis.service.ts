"use strict";

import { promisify } from "util";
import { reservationInventory } from "../models/repositories/inventory.repo";
import { getRedis, initRedis } from "../dbs/init.redis";

initRedis();

const redisClient = getRedis().instanceConnect;

const pExpire = promisify(redisClient.pExpire).bind(redisClient);

const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

export const acquireLock = async (
  productId: string,
  quantity: number,
  cartId: string
) => {
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      const isReservation = await reservationInventory(
        productId,
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

export const cachedRedisData = async (key: string) => {
  const cachedData = await redisClient.get(key);
  return JSON.parse(cachedData);
};

export const setData = async (key: string, data: any) => {
  return await redisClient.set(key, JSON.stringify(data), {
    NX: true,
    EX: 86400,
  });
};

export const deleteAllKey = async ({ prefix }: { prefix: string }) => {
  const keys = await redisClient.keys(`${prefix}_*`);
  if (keys.length > 0) {
    Promise.all(keys.map((key) => redisClient.del(key)));
  }
};

export const deleteCartRedis = async (userId: string) => {
  const key = `cart_${userId}`;

  if (redisClient.exists(key)) {
    return await redisClient.del(key);
  }
};
