"use strict";

import amqp, { Channel } from "amqplib";

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) {
      throw new Error("Cannot connect to RabbitMQ");
    }
    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (err) {}
};

export const connectToRabbitMqForTest = async () => {
  try {
    const { connection, channel } = await connectRabbitMQ();
    const queue = "test_queue";
    const message = "Hello World!";
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent ${message}`);
    await connection.close();
  } catch (err) {}
};

export const consumerQueue = async (channel: Channel, queueName: string) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(` [*] Waiting for messages in ${queueName}`);
    channel.consume(
      queueName,
      (msg: any) => {
        if (msg) {
          console.log(` [x] Received ${msg.content.toString()}`);
        }
      },
      {
        // khi message đã được xử lý xong thì sẽ không gửi lại cho consumer khác
        noAck: true,
      }
    );
  } catch (err) {
    throw err;
  }
};
