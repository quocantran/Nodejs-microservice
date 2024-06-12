"use strict";

import { consumerQueue, connectRabbitMQ } from "../dbs/init.rabbit";

export default class MessageService {
  static consumerToQueue = async (queueName: string) => {
    try {
      const { connection, channel } = await connectRabbitMQ();

      await consumerQueue(channel, queueName);
    } catch (err) {
      throw err;
    }
  };

  static consumerToQueueSuccess = async (queueName: string) => {
    try {
      const { connection, channel } = await connectRabbitMQ();

      const notiQueue = "notiQueue";

      // setTimeout(() => {
      //   channel.consume(notiQueue, (msg) => {
      //     console.log("Message success received: ", msg.content.toString());
      //   });
      // }, 6000);

      channel.consume(notiQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log("numberTest::", numberTest);

          if (numberTest < 0.9) {
            throw new Error("send noti failed::Hotfix");
          }
          console.log("Message success received: ", msg.content.toString());

          channel.ack(msg);
        } catch (err) {
          // console.error(err);
          channel.nack(msg, false, false);
        }
      });
    } catch (err) {
      throw err;
    }
  };

  static consumerToQueueError = async (queueName: string) => {
    try {
      const { connection, channel } = await connectRabbitMQ();

      const notiDLX = "notiDLX";
      const notiRoutingKey = "notiRoutingKey";

      const notiQueueHandler = "notiQueueHotFix";

      await channel.assertExchange(notiDLX, "direct", { durable: true });

      const result = await channel.assertQueue(notiQueueHandler, {
        durable: true,
        exclusive: false,
      });

      await channel.bindQueue(result.queue, notiDLX, notiRoutingKey);

      await channel.consume(
        result.queue,
        (msg) => {
          console.log("Message error received: ", msg.content.toString());
        },
        {
          noAck: true,
        }
      );
    } catch (err) {
      throw err;
    }
  };
}
