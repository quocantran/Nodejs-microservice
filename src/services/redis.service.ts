"use strict";

import redis from "redis";

import { promisify } from "util";
import { reservationInventory } from "../models/repositories/inventory.repo";

const redisClient = redis.createClient();

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
