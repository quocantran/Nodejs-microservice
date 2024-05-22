"use strict";

import * as redis from "redis";
import configMongodb from "../configs/config.mongodb";

class RedisPubSubService {
  private subcriber: redis.RedisClientType;
  private publisher: redis.RedisClientType;
  constructor() {
    this.subcriber = redis.createClient({
      password: configMongodb.redis.password,
      socket: {
        host: configMongodb.redis.host,
        port: configMongodb.redis.port as number,
      },
    });

    this.publisher = redis.createClient({
      password: configMongodb.redis.password,
      socket: {
        host: configMongodb.redis.host,
        port: configMongodb.redis.port as number,
      },
    });
  }

  public publish(channel: string, message: string) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message);
    });
  }

  public subscribe(channel: string) {
    this.subcriber.subscribe(channel, (message, channel) => {
      console.log(`Subscribed to channel : ${channel}`);
    });
    this.subcriber.on("message", (channel, message) => {
      console.log(`Received data : ${message}`);
    });
  }
}
